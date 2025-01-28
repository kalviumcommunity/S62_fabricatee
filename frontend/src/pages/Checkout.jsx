import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import DynamicForm from '@/components/DynamicForm';
import Modal from '@/components/Modal';
import axios from '@/api/axios';
import CartProductCard from '@/components/CartProductCard';

const Checkout = () => {
  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Hooks
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const orderItems = location.state?.products || [];

  // Valid coupon configurations
  const validCoupons = {
    'WELCOME10': { discount: 0.1, type: 'percentage' },
    'SAVE20': { discount: 0.2, type: 'percentage' },
    'FLAT50': { discount: 50, type: 'fixed' }
  };

  // Form fields configuration for address
  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Address name',
      default: `Address${addresses.length + 1}`
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter City Name'
    },
    {
      name: 'line1',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter Address',
      fullWidth: true
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter State Name'
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'number',
      placeholder: 'Enter PIN'
    }
  ];

  // Effects
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    setAddresses(auth?.address || []);
  }, [auth]);

  // Price calculation methods
  const calculateItemTotal = (item) => {
    return (item.design.stitching.mrp + item.fabric.meterprice.mrp) * item.quantity;
  };

  const calculateItemSp = (item) => {
    return (item.design.stitching.sp + item.fabric.meterprice.sp) * item.quantity;
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateSp = () => {
    return orderItems.reduce((sum, item) => sum + calculateItemSp(item), 0);
  };

  const calculateShipping = () => {
    return (calculateSubtotal() - calculateDiscount() > 1999) ? 0 : 99;
  };

  const calculateDiscount = () => {
    const sp = calculateSp();
    const subtotal = calculateSubtotal();
    let discount = subtotal - sp;

    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount += sp * appliedCoupon.discount;
      } else {
        discount += appliedCoupon.discount;
      }
    }
    return discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping();
  };

  // Handler methods
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    navigate('/payment', { 
      state: { 
        items: orderItems, 
        address: selectedAddress,
        coupon: appliedCoupon,
        total: calculateTotal()
      } 
    });
  };

  const handleAddressChange = (value) => {
    if (value === 'add_new') {
      setSelectedAddress(addresses[0]);
      setIsAddAddressModalOpen(true);
    } else {
      setSelectedAddress(value);
    }
  };

  const handleAddressSubmit = async (newAddress) => {
    if (!newAddress.name || !newAddress.line1 || !newAddress.city || !newAddress.state) {
      setAddressError('Please fill in all required fields');
      return;
    }

    for (let add of addresses) {
      if (add.name === newAddress.name) {
        setAddressError(`Address ${newAddress.name} already exists, enter a unique name`);
        return;
      }
    }

    const updatedAddresses = [...addresses, newAddress];
    
    try {
      await axios.put(`/api/user/${auth.userId}`, { address: updatedAddresses });
      setAddresses(updatedAddresses);
      setAuth((prev) => ({ ...prev, address: updatedAddresses }));
      setSelectedAddress(newAddress);
      setIsAddAddressModalOpen(false);
    } catch (err) {
      setAddressError("Error in updating Address");
      console.error("Error in updating address:", err.message);
    }
  };

  // Render methods
  const renderPaymentDetails = () => (
    <div className={`${isMobileView ? 'w-full' : 'w-1/4 !mt-4'} border shadow-md p-4 bg-white h-full rounded-lg`}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Coupon Code</label>
        {!appliedCoupon && (
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-grow"
            />
            <Button onClick={handleApplyCoupon}>Apply</Button>
          </div>
        )}
        
        {couponError && (
          <Alert variant="destructive">
            <AlertDescription>{couponError}</AlertDescription>
          </Alert>
        )}

        {appliedCoupon && (
          <Alert>
            <AlertDescription className="flex justify-between items-center">
              <span>
                Coupon applied: {appliedCoupon.type === 'percentage' 
                  ? `${appliedCoupon.discount * 100}% off`
                  : `₹${appliedCoupon.discount} off`}
              </span>
              <Button variant="outline" size="sm" onClick={removeCoupon}>
                Remove
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount</span>
          <span>-₹{calculateDiscount().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹{calculateShipping().toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total Payable</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <Button 
        className="w-full mt-4"
        onClick={handleProceedToPayment}
        disabled={!selectedAddress}
      >
        Proceed to Payment
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 flex flex-col-reverse lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 bg-neutral">
      <div className={`${isMobileView ? 'w-full' : 'w-3/4 p-6'} space-y-6`}>
        <h1 className="text-2xl sm:text-4xl font-bold">Checkout</h1>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Delivery Address</h2>
          <Select onValueChange={handleAddressChange} className='p-4'>
            <SelectTrigger className="w-full text-left p-6">
              <SelectValue placeholder="Choose an address" className="truncate text-left" />
            </SelectTrigger>
            <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-[400px]">
              {addresses.map((addr, index) => (
                <SelectItem key={index} value={addr} className="w-full">
                  <div className="w-full">
                    <div className="font-medium truncate">{addr.name}</div>
                    <div className="text-sm text-gray-500 break-words whitespace-normal">
                      {addr.line1}, {addr.city}, {addr.state}
                    </div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="add_new" className="text-blue-600 font-semibold">
                + Add New Address
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isAddAddressModalOpen && (
          <Modal setIsOpen={setIsAddAddressModalOpen}>
            <DynamicForm
              title="Add Address"
              fields={formFields}
              onSubmit={handleAddressSubmit}
              error={addressError}
              onClose={() => setIsAddAddressModalOpen(false)}
            />
          </Modal>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {orderItems.map((item, index) => (
            <CartProductCard 
              key={index}
              id={item._id}
              name={item?.design?.name}
              fabric={item?.fabric?.name}
              total={(item.price.fabric + item.price.stitching)}
              imgurl={item?.design?.images[0]?.url}
              quantity={item.quantity}
            />
          ))}
        </div>
      </div>

      {renderPaymentDetails()}
    </div>
  );
};

export default Checkout;