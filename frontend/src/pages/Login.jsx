import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {Validate} from '../../validation.js'
import SingleForm from '../components/SingleForm.jsx'
import axios from 'axios'

function Login() {

  const navigate = useNavigate();

  const formItems = [
    {
      fieldname: "email",
      label: "Email address",
      type: "text",
    },
    {
      fieldname: "password",
      label: "Password",
      type: "password",
    }
  ]

  const [error, setError] = useState('');

  const [data, setData] = useState({
    email:'',
    password:'',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const {email, password} = data;

    // const EmailV = Validate.validateEmail(email);
    // const PassV = Validate.validatePass(password);

    // if(typeof EmailV=='string' && EmailV.length>1){
    //   return setError(EmailV);
    // }
    // if(typeof PassV=='string' && PassV.length>1){
    //   return setError(PassV);
    // }

    const formDataBody = new FormData();
    formDataBody.append("email", email);
    formDataBody.append("password", password);

    axios.post('http://localhost:8000/api/user/login', formDataBody, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(()=>{
        navigate('/');
      })
      .catch((err)=>{
        console.log((err.response)?((err.response.data.message)?(err.response.data.message):err.response.data):"Error in Log In");
        setError((err.response)?((err.response.data.message)?(err.response.data.message):err.response.data):"Error in Log In");
      });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Log in to your account
        </h2>
      </div>


      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error&&<span className='text-red-600 font-normal'>{error}</span>}

        <SingleForm formItems={formItems} handleSubmit={handleSubmit} data={data} setData={setData} submitTxt="Log In" setError={setError}/>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don't have an account?{' '}
          <NavLink to="/signup">
            <span href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign Up Now
            </span>
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Login
