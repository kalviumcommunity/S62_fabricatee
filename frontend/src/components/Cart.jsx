import React, { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { FaCartShopping } from "react-icons/fa6";
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
import { Checkbox } from "@/components/ui/checkbox";
import useAuth from '@/hooks/useAuth';
import axios from '@/api/axios';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {auth} = useAuth();
  
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigator = useNavigate();
 
  useEffect(() => {
    if(auth.loggedIn && auth.cart) {
      setCart(auth.cart);
      setSelectedItems(new Set(auth.cart.map(item => item._id)));
      console.log(auth.cart);
    } else {
      setCart([]);
      setSelectedItems(new Set());
    }
  }, [auth]);

  const updateQuantity = (id, change) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item._id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = async (id) => {
    const updated = cart.filter(item => item._id !== id);
    try {
      console.log(updated);
      await axios.put(`/api/user/${auth._id}`,{cart: updated});
      setCart(updated);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.log('cart updated');
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item._id)));
    }
  };

  const calculateItemTotal = (item) => {
    return (item.design.stitching.mrp + item.fabric.meterprice.mrp) * item.quantity;
  };

  const calculateItemSp = (item) => {
    return (item.design.stitching.sp + item.fabric.meterprice.sp) * item.quantity;
  };

  const calculateSubtotal = () => {
    return cart
      .filter(item => selectedItems.has(item._id))
      .reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };
    
  const calculateSp = () => {
    // Default discount calculation or logic can be added here
    return cart
      .filter(item => selectedItems.has(item._id))
      .reduce((sum, item) => sum + calculateItemSp(item), 0);
  };

  const calculateDiscount = () =>{
    return calculateSubtotal()-calculateSp();
  }

  const calculateShipping = () => {
    // Default shipping calculation or logic can be added here
    return ((calculateSubtotal() - calculateDiscount())>1999)?0:99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping();
  };

  const handleCheckout = () =>{
    setIsOpen(false);
    const items = cart.filter(item => selectedItems.has(item._id));
    navigator('/checkout', {state:{products:items}});
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative p-2 mt-2">
          <div>
            <FaCartShopping size="35" className='!w-5 !h-5' />
            <div className="text-xs mt-1 text-gray-600">Cart</div>
          </div>
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex bg-blue-400 items-center justify-center p-0">
              {cart.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cart.length} items)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.length > 0 && (
            <div className="py-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={selectedItems.size === cart.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm">Select All</span>
              </div>
            </div>
          )}

          <div className="flex-grow overflow-y-auto py-4">
            {cart.map(item => (
              <Card key={item._id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex items-start">
                      <Checkbox 
                        checked={selectedItems.has(item._id)}
                        onCheckedChange={() => toggleItemSelection(item._id)}
                      />
                    </div>
                    <img
                      src={item?.design?.images[0]?.url}
                      alt={item?.design?.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item?.design?.name}</h3>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Fabric: {item?.fabric?.name}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        ₹{(item.price.fabric + item.price.stitching).toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
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
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Discount</span>
                <span>-₹{calculateDiscount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>₹{calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={handleCheckout}
              disabled={cart.length === 0 || selectedItems.size === 0}
            >
              {selectedItems.size === 0 ? "Select Items to Checkout" : "Checkout"}
            </Button>
            <br />
            <br />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;