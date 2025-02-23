import axios from '@/api/axios';
import OrderCard from '@/components/OrderCard';
import React, { useEffect, useState } from 'react';
import Loader from './Loader';

function UserOrders() {
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('/api/order', { withCredentials: true });
                console.log('user orders fetched', res.data);
                setOrders(res.data.orders);
                setError('');
            } catch (error) {
                console.log("Error in fetching order data", error.message);
                setError(`Error in fetching order data: ${error?.response?.data?.message || error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-neutral p-5 flex flex-col items-center justify-center min-h-[200px]">
                <Loader className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral p-5">
            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}
            
            {!error && orders?.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                    <p>No orders found. Place your first order to get started!</p>
                </div>
            )}

            {orders?.map((order) => (
                <div key={order._id} className="m-4">
                    <OrderCard order={order} />
                </div>
            ))}
        </div>
    );
}

export default UserOrders;