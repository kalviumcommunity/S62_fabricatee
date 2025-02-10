import React, { useState, useEffect, useMemo } from 'react';
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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const orderItems = location.state?.products || [];

  useEffect(() => {
    if (!orderItems.length) {
      navigate('/');
    }
  }, []);

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
      default: `Address${addresses.length + 1}`,
      required: true
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter City Name',
      required: true
    },
    {
      name: 'line1',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter Address',
      fullWidth: true,
      required: true
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter State Name',
      required: true
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'number',
      placeholder: 'Enter PIN',
      required: true,
      minLength: 6,
      maxLength: 6
    }
  ];

  // Helper functions
  const calculateItemTotal = (item) => {
    return item?.design?.stitching?.mrp && item?.fabric?.meterprice?.mrp
      ? (item.design.stitching.mrp + item.fabric.meterprice.mrp) * (item.quantity || 1)
      : 0;
  };

  const calculateItemSp = (item) => {
    return item?.design?.stitching?.sp && item?.fabric?.meterprice?.sp
      ? (item.design.stitching.sp + item.fabric.meterprice.sp) * (item.quantity || 1)
      : 0;
  };

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (auth?.address) {
      setAddresses(auth.address);
      // Set the first address as default if available
      if (auth.address.length > 0 && !selectedAddress) {
        setSelectedAddress(auth.address[0]);
      }
    }
  }, [auth]);

  // Memoized calculations
  const itemTotals = useMemo(() => {
    return orderItems.map(item => ({
      total: calculateItemTotal(item),
      sp: calculateItemSp(item)
    }));
  }, [orderItems]);

  const subtotal = useMemo(() => {
    return itemTotals.reduce((sum, item) => sum + item.total, 0);
  }, [itemTotals]);

  const spTotal = useMemo(() => {
    return itemTotals.reduce((sum, item) => sum + item.sp, 0);
  }, [itemTotals]);

  const discount = useMemo(() => {
    return subtotal - spTotal;
  }, [subtotal, spTotal]);

  const shipping = useMemo(() => {
    const effectiveTotal = subtotal - discount;
    return effectiveTotal > 1999 ? 0 : 99;
  }, [subtotal, discount]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    
    const discountAmount = appliedCoupon.type === 'percentage' 
      ? spTotal * appliedCoupon.discount
      : appliedCoupon.discount;
    
    // Ensure discount doesn't exceed the total
    return Math.min(discountAmount, spTotal);
  }, [appliedCoupon, spTotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount - couponDiscount + shipping);
  }, [subtotal, discount, couponDiscount, shipping]);


  // Handler methods
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) {
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

  const initPayment = async (data) => {
    try {
      // Check for Razorpay SDK
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }
  
      const options = {
        key: "rzp_test_FfU53usmrjk8i6",
        name: "Fabricatee",
        amount: data.amount,
        currency: data.currency,
        prefill: {
          contact: auth?.phoneNumber || undefined,
        },
        image: "https://res.cloudinary.com/dabeupfqq/image/upload/v1737023775/uploads/onf1pzup6aa4xrybtdag.png",
        description: "Your Style, Our Craft!",
        order_id: data.id,
        
        // Handle payment success
        handler: async (res) => {
          try {
            console.log('Payment handler called');
            
            // Filter out ordered items from cart
            const updatedCart = auth?.cart?.filter(
              (cartItem) => !orderItems.some((item) => item._id === cartItem._id.toString())
            );
  
            // Verify payment with backend
            const { data: verificationData } = await axios.post('/api/order/verify', {
              userId: auth?._id,
              updatedCart,
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature
            });
  
            console.log('Payment verified');
            
            // Update local state
            const currentDate = new Date().toLocaleDateString('en-GB');
            const updatedOrders = [...(auth?.orders || []), verificationData.id];
            
            setAuth(prev => ({
              ...prev,
              orders: updatedOrders,
              cart: updatedCart
            }));
  
            // Prepare receipt data
            const receiptBody = {
              userId: auth?._id,
              items: orderItems,
              price: {
                totalmrp: subtotal,
                discount,
                coupondiscount: {
                  amt: couponDiscount,
                  coupon: appliedCoupon ? couponCode : null
                },
                delivery: shipping,
                total,
              },
              createdAt: currentDate,
              orderId: res.razorpay_order_id
            };
  
            // Navigate based on verification result
            navigate(verificationData.success ? './confirmed' : './failed', { state: receiptBody });
  
          } catch (error) {
            console.error('Payment verification failed:', error);
            handlePaymentError('verification', error);
          }
        },
  
        // Handle modal closing
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            handlePaymentError('modal_close', data.id);
          }
        },
  
        // Handle payment failure
        on: {
          payment_failed: (response) => {
            console.error('Payment failed:', response);
            handlePaymentError('payment', response);
          }
        },
  
        theme: {
          color: "#3399cc"
        }
      };
  
      // Initialize and open Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  
    } catch (error) {
      console.error('Payment initialization failed:', error);
      handlePaymentError('initialization', error);
    }
  };
  
  // Centralized error handler
  const handlePaymentError = (type, orderId, error = null) => {
    let errorMessage = 'Payment failed. Please try again.';

    
    
    switch (type) {
      case 'initialization':
        errorMessage = 'Unable to initialize payment. Please refresh and try again.';
        break;
      case 'verification':
        errorMessage = 'Payment verification failed. Please contact support.';
        break;
      case 'payment':
        errorMessage = `Payment failed: ${error?.error?.description || 'Unknown error'}`;
        break;
      case 'modal_close':
        errorMessage = 'Payment cancelled by user.';
        break;
    }
  
    // You can add toast/notification here
    console.error(errorMessage);
    
    // Navigate to failure page with error details
    navigate('./failed', { 
      state: { 
        error: errorMessage,
        errorType: type,
        timestamp: new Date().toISOString()
      }
    });
  };

  
  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/order/create", {
        userId: auth?._id,
        items: orderItems,
        price: {
          totalmrp: subtotal,
          discount,
          coupondiscount: {
            amt: couponDiscount,
            coupon: appliedCoupon ? couponCode : null
          },
          delivery: shipping,
          total,
        }
      });

      if (!response.data?.success) {
        throw new Error('Order creation failed');
      }

      console.log('initializing payment');
      await initPayment(response.data.data);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      navigate('/error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (value) => {
    setAddressError('');
    if (value === 'add_new') {
      setIsAddAddressModalOpen(true);
    } else {
      setSelectedAddress(value);
    }
  };

  const handleAddressSubmit = async (newAddress) => {
    setAddressError('');
    
    // Validation
    const requiredFields = ['name', 'line1', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !newAddress[field]);
    
    if (missingFields.length) {
      setAddressError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    if (addresses.some(addr => addr.name === newAddress.name)) {
      setAddressError(`Address ${newAddress.name} already exists, enter a unique name`);
      return;
    }

    if (newAddress.pincode.length !== 6) {
      setAddressError('Pincode must be 6 digits');
      return;
    }

    const updatedAddresses = [...addresses, newAddress];
    
    try {
      await axios.put(`/api/user/${auth.userId}`, { address: updatedAddresses });
      setAddresses(updatedAddresses);
      setAuth(prev => ({ ...prev, address: updatedAddresses }));
      setSelectedAddress(newAddress);
      setIsAddAddressModalOpen(false);
    } catch (err) {
      console.error("Error updating address:", err);
      setAddressError("Failed to update address. Please try again.");
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
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Offer Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between mb-2">
            <span>Coupon Discount</span>
            <span>-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total Payable</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        className="w-full mt-4"
        onClick={handleProceedToPayment}
        disabled={!selectedAddress || isLoading}
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </div>
  );

  return (
    <div className="max-w-[100vw] min-h-[100vh] mx-0 p-6 flex flex-col-reverse lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 bg-neutral">
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