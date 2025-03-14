import axios from '@/api/axios'
import OrderCard from '@/components/OrderCard';
import React, { useEffect, useState } from 'react'

function AllUserOrders() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        const fetchUsers = async () =>{
            setError("")
            try {
                const res = await axios.get('/api/user')
                setUsers(res.data.message);
                console.log(res.data.message);
            } catch (error) {
                setError(error.message);
                console.log(error.message);
            }
        }
        fetchUsers()
    }, [])

    const handleUserChange = async (e) =>{
        const userId = e.target.value;
        console.log(userId)
        try {
            const res = await axios.get(`/api/order/user/${userId}`);
            console.log(res.data?.orders)
            setOrders(res.data?.orders)
        } catch (error) {
            console.log(error.message);
            setError(error.message)
        }
    }

  return (error&&!users)?(
    <div className='flex justify-center items-center'>
        {error}
        {!users&&"Users not found"}
    </div>
  ) : (
    <div>
      <select name="user_dropdown" className='min-w-24 p-2 border-md border-black border-[1px] rounded-md m-5' onChange={handleUserChange}>
        <option value="">Choose User</option>
        {users.map((usr, index)=>(
            <option key={index} value={usr._id}>{usr.name}</option>
        )
        )}
      </select>
      <br />
      <br />
      <div>
        {orders.map((ord, index)=>{
            return <OrderCard key={index} order={ord}/>
        })}
      </div>
    </div>
  )
}

export default AllUserOrders
