import React from 'react';
import { AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const OrderFailed = () => {
  // Mock error details - in a real app, these would be passed as props
  const errorDetails = {
    orderNumber: "ORD-2024-1234",
    errorCode: "ERR_PAYMENT_DECLINED",
    errorMessage: "Your payment was declined. Please check your payment details and try again.",
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Message */}
        <div className="text-center mb-8">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Failed</h1>
          <p className="mt-2 text-lg text-gray-600">
            We weren't able to process your payment
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="bg-white shadow-lg mb-6">
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transaction Failed</AlertTitle>
              <AlertDescription>
                {errorDetails.errorMessage}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Error Details</h2>
                <p className="mt-2 text-gray-600">Order Number: {errorDetails.orderNumber}</p>
                <p className="text-gray-600">Error Code: {errorDetails.errorCode}</p>
                <p className="text-gray-600">Time: {errorDetails.timestamp}</p>
              </div>

              {/* Common Issues */}
              {/* <div className="py-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Common Reasons for Payment Failure</h3>
                <ul className="space-y-2">
                  {commonIssues.map((issue, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <span className="mr-2">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div> */}

              {/* Actions */}
              <div className="space-y-4">
                {/* <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Try Payment Again
                </button> */}
                
                <Link to='/'>
                  <button className="w-full bg-blue-600 border border-gray-300 text-white px-6 py-2 rounded-lg hover:bg-gray-50 hover:text-black transition-colors flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back to Home
                  </button>
                </Link>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <HelpCircle className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">Need Help?</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  If you continue to experience issues, our support team is here to help.
                </p>
                <div className="space-y-2">
                  <Link to='/help'>
                    <button className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Contact Support
                    </button>
                  </Link>
                  {/* <button className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    View FAQs
                  </button> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderFailed;