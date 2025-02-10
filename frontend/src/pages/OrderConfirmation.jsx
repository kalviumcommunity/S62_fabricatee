import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CartProductCard from '@/components/CartProductCard';

const OrderConfirmation = () => {
  // Mock order details - in a real app, these would be passed as props
  const navigator = useNavigate();

  const location = useLocation();
  const orderDetails = location.state;

  
  
  useEffect(()=>{
    console.log(location.state)
    console.log('orderdetails', orderDetails);
  }, [orderDetails]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Thank you for your order!</h1>
          <p className="mt-2 text-lg text-gray-600">
            You're custom tailored clothes will be at your doorstep.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
              <p className="mt-2 text-gray-600">Order Number: {orderDetails?.orderId}</p>
              <p className="mt-2 text-gray-600">Order Date: {orderDetails?.createdAt}</p>
            </div>

            {/* Items List */}
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Items Ordered</h3>
              {
              orderDetails?.items?.map((item, index) => (
                  <CartProductCard
                    key={index}
                    id={item._id}
                    name={item?.design?.name}
                    fabric={item?.fabric?.name}
                    total={(item.price.fabric + item.price.stitching)}
                    imgurl={item?.design?.images[0]?.url}
                    quantity={item.quantity}
                  />
              ))
              }
            </div>

            {/* Order Summary */}
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-lg font-semibold text-gray-800">
                  {orderDetails?.price?.totalmrp.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Offer Discount</p>
                <p className="text-lg font-semibold text-gray-800">
                  - {orderDetails?.price?.discount.toFixed(2)}
                </p>
              </div>
              {(orderDetails?.price?.coupondiscount?.amt>0)&&<div className="flex justify-between mb-2">
                <p className="text-gray-600">Coupon Discount</p>
                <p className="text-lg font-semibold text-gray-800">
                  - {orderDetails?.price?.coupondiscount?.amt.toFixed(2)}
                </p>
              </div>}
              {(orderDetails?.price?.delivery>0)&&<div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping</p>
                <p className="text-lg font-semibold text-gray-800">
                  - {orderDetails?.price?.delivery.toFixed(2)}
                </p>
              </div>}
              <div className="flex justify-between mb-2 border-b border-t py-2 border-gray-200">
                <p className="text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  Rs. {orderDetails?.price?.total.toFixed(2)}
                </p>
              </div>
              {/* <div className="mt-4">
                <p className="text-gray-600">
                  Estimated Delivery: {orderDetails.estimatedDelivery}
                </p>
              </div> */}
            </div>

            {/* Next Steps */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">What's Next?</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Track your order status in your account</li>
                <li>• In case of measurement and fabric feel sessions, our executive will get back to you shortly.</li>
                <li>• We'll notify you when your order ships</li>
              </ul>
            </div>

            {/* Continue Shopping Button */}
            <Link to="/">
              <div className="mt-6 text-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderConfirmation;