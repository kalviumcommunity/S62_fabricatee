import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingCart as CartIcon } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from '@/assets/logo.png'

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [couponError, setCouponError] = useState('');
  
  // Sample addresses - in a real app, these would come from an API/database
  const addresses = [
    {
      id: '1',
      label: 'Home',
      address: '123 Main St, Apt 4B, New York, NY 10001'
    },
    {
      id: '2',
      label: 'Office',
      address: '456 Business Ave, Suite 200, New York, NY 10002'
    },
    {
      id: '3',
      label: 'Parent\'s House',
      address: '789 Family Rd, Brooklyn, NY 11201'
    }
  ];

  // Sample valid coupons - in a real app, these would be verified server-side
  const validCoupons = {
    'WELCOME10': { discount: 0.1, type: 'percentage' },
    'SAVE20': { discount: 0.2, type: 'percentage' },
    'FLAT50': { discount: 50, type: 'fixed' }
  };

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 199.99,
      quantity: 1,
      image: logo,
      color: "Black",
      size: "One Size"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 299.99,
      quantity: 1,
      image: logo,
      color: "Silver",
      size: "44mm"
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 299.99,
      quantity: 1,
      image: logo,
      color: "Silver",
      size: "44mm"
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 299.99,
      quantity: 1,
      image: logo,
      color: "Silver",
      size: "44mm"
    }
  ]);

  const updateQuantity = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'percentage') {
      return subtotal * appliedCoupon.discount;
    } else {
      return appliedCoupon.discount;
    }
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.1; // 10% tax after discount
  };

  const calculateShipping = () => {
    return items.length > 0 ? 15.99 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax() + calculateShipping();
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

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <CartIcon className="h-5 w-5" />
          {items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length} items)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto py-4">
            {items.map(item => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Color: {item.color} | Size: {item.size}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4">
            {/* Address Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Address</label>
              <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map(addr => (
                    <SelectItem key={addr.id} value={addr.id}>
                      <div className="text-sm">
                        <div className="font-medium">{addr.label}</div>
                        <div className="text-gray-500">{addr.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Coupon Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Coupon Code</label>
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
                        : `$${appliedCoupon.discount} off`}
                    </span>
                    <Button variant="outline" size="sm" onClick={removeCoupon}>
                      Remove
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (10%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full"
              disabled={items.length === 0 || !selectedAddress}
            >
              {!selectedAddress ? "Please Select Address" : "Checkout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;