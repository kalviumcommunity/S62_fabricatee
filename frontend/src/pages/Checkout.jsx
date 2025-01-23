import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ orderData }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [couponError, setCouponError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Sample valid coupons - replace with API call
  const validCoupons = {
    'WELCOME10': { discount: 0.1, type: 'percentage' },
    'SAVE20': { discount: 0.2, type: 'percentage' },
    'FLAT50': { discount: 50, type: 'fixed' }
  };

  useEffect(() => {
    setAddresses(auth?.address || []);
    if(!orderData){
        orderData = auth?.cart;
    }
    console.log('orderData', orderData)
  }, [auth]);

  const calculateItemTotal = (item) => {
    return (item.price.fabric + item.price.stitching) * item.quantity;
  };

  const calculateSubtotal = () => {
    return orderData?.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)||0;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return orderData?.price.discount || 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'percentage') {
      return subtotal * appliedCoupon.discount;
    }
    return appliedCoupon.discount;
  };

  const calculateShipping = () => {
    return orderData?.price.delivery || 0;
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

  const handleAddAddress = () => {
    navigate('/profile/address');
  };

  const handleValueChange = (value) => {
    if (value === 'add-address') {
      handleAddAddress();
    } else {
      setSelectedAddress(value);
    }
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      return;
    }
    // Implement payment gateway integration here
    console.log('Proceeding to payment with:', {
      items: orderData?.items,
      address: selectedAddress,
      totalAmount: calculateTotal(),
      appliedCoupon
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderData&&orderData.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div className="flex gap-4">
                <img
                  src={item?.design?.images[0]?.url}
                  alt={item?.design?.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{item?.design?.name}</h3>
                  <p className="text-sm text-gray-500">Fabric: {item?.fabric?.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₹{calculateItemTotal(item).toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedAddress} onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr, index) => (
                <SelectItem key={index} value={addr}>
                  <div className="text-sm">
                    <div className="font-medium">{addr.name}</div>
                    <div className="text-gray-500">{addr.line1}, {addr.city}, {addr.state}</div>
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="add-address">
                <div className="text-sm">
                  <div className="font-medium">Add an Address</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Coupon */}
      <Card>
        <CardHeader>
          <CardTitle>Apply Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-grow"
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
              <AlertDescription className="flex justify-between items-center">
                <span>
                  Coupon applied: {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount * 100}% off`
                    : `₹${appliedCoupon.discount} off`}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAppliedCoupon(null)}
                >
                  Remove
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Price Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            {orderData&&(appliedCoupon || orderData.price.discount > 0) && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{calculateDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>₹{calculateShipping().toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proceed to Payment Button */}
      <Button 
        className="w-full"
        size="lg"
        disabled={!selectedAddress}
        onClick={handleCheckout}
      >
        {!selectedAddress 
          ? "Please Select Address" 
          : `Proceed to Pay ₹${calculateTotal().toFixed(2)}`}
      </Button>
    </div>
  );
};

export default Checkout;