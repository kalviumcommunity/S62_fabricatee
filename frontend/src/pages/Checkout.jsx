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

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const location = useLocation();
  const orderItems = location.state?.products || [];

  // Responsive check
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const validCoupons = {
    'WELCOME10': { discount: 0.1, type: 'percentage' },
    'SAVE20': { discount: 0.2, type: 'percentage' },
    'FLAT50': { discount: 50, type: 'fixed' }
  };
  
  useEffect(() => {
    setAddresses(auth?.address || []);
  }, [auth]);

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
    // Default discount calculation or logic can be added here
    return orderItems.reduce((sum, item) => sum + calculateItemSp(item), 0);
  };

  const calculateShipping = () => {
    // Default shipping calculation or logic can be added here
    return ((calculateSubtotal() - calculateDiscount())>1999)?0:99;
  };

  const calculateDiscount = () => {
    const sp = calculateSp();
    const subtotal = calculateSubtotal();
    let discount = subtotal-sp;
    if(appliedCoupon){
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

  // Rendering order items
  const renderOrderItems = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
      {orderItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex-grow mb-2 sm:mb-0">
              <h3 className="font-medium">{item.design.name}</h3>
              <div className="text-sm text-gray-500">
                Fabric: {item.fabric.name}
              </div>
              <div className="mt-2">
                <span>₹{(item.price.fabric + item.price.stitching).toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
            <div className="font-medium self-end sm:self-auto">
              ₹{calculateItemTotal(item).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Rendering payment details
  const renderPaymentDetails = () => (
    <div className={`${isMobileView ? 'w-full' : 'w-1/4'} border p-4 bg-white h-full rounded-lg`}>
      {/* Coupon Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Apply Coupon</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-grow mb-2 sm:mb-0"
          />
          <Button onClick={handleApplyCoupon}>Apply</Button>
        </div>
        {couponError && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{couponError}</AlertDescription>
          </Alert>
        )}
        {appliedCoupon && (
          <Alert className="mt-2">
            <AlertDescription>
              Coupon applied: {appliedCoupon.type === 'percentage' 
                ? `${appliedCoupon.discount * 100}% off`
                : `₹${appliedCoupon.discount} off`}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <br />

      {/* Price Breakdown */}
      <div className="border-t pt-4">
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
        {/* {appliedCoupon && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>-₹{calculateDiscount().toFixed(2)}</span>
          </div>
        )} */}
        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total Payable</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Proceed Button */}
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
      {/* Order Summary - Full width on mobile, 3/4 on desktop */}
      <div className={`${isMobileView ? 'w-full' : 'w-3/4'} space-y-6`}>
        <h1 className='text-2xl sm:text-4xl font-bold'>Checkout</h1>
        
        {/* Address Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Delivery Address</h2>
          <Select onValueChange={setSelectedAddress}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr, index) => (
                <SelectItem key={index} value={addr}>
                  <div>
                    <div className="font-medium">{addr.name}</div>
                    <div className="text-sm text-gray-500">
                      {addr.line1}, {addr.city}, {addr.state}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order Items */}
        {renderOrderItems()}
      </div>

      {/* Payment Section */}
      {renderPaymentDetails()}
    </div>
  );
};

export default Checkout;