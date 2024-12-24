import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {Validate} from '../../validation.js'
import SingleForm from '../components/SingleForm.jsx'

function Signup() {

  const formItems = [
    {
      fieldname : "name",
      label: "Name"
    },
    {
      fieldname: "email",
      label: "Email address"
    },
    {
      fieldname: "password",
      label: "Password"
    }
  ]

  const [error, setError] = useState('');

  const [data, setData] = useState({
    name: '',
    email:'',
    password:'',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const NameV = Validate.validateName(data.name);
    const EmailV = Validate.validateEmail(data.email);
    const PassV = Validate.validatePass(data.password);


    if(typeof NameV=='string' && NameV.length>1){
      return setError(NameV);
    }
    if(typeof EmailV=='string' && EmailV.length>1){
      return setError(EmailV);
    }
    if(typeof PassV=='string' && PassV.length>1){
      return setError(PassV);
    }

  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign Up Now
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error&&<span className='text-red-600 font-normal'>{error}</span>}

        <SingleForm formItems={formItems} handleSubmit={handleSubmit} data={data} setData={setData} submitTxt="Sign Up"/>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Have an account?{' '}
          <NavLink to="/login">
            <span href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Log In Now
            </span>
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Signup
