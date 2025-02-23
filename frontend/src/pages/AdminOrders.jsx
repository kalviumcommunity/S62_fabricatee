import React, { useState, useEffect } from 'react'
import axios from 'axios'

function AdminOrders() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios('/api/user');
                console.log('User Database')
                setUsers(res.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUsers();
    })
  return (
    <div>
      <select name="userDropdown" id="userDropdown">
        {
        users.map((user, index) => ( 
            <option key={index} value={user.id}>{user.name}</option>
        ))
        }
      </select>
    </div>
  )
}

export default AdminOrders
