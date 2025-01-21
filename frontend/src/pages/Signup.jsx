import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {Validate} from '../../validation.js'
import SingleForm from '../components/SingleForm.jsx'
import axios from '@/api/axios.js'
import useAuth from '../hooks/useAuth.js'

function Signup() {

  const navigator = useNavigate();

  const {auth} = useAuth();

  useEffect(()=>{
    if(auth.loggedIn)
      navigator("/profile", {replace: true})
  }, [auth])


  const formItems = [
    {
      fieldname : "name",
      label: "Name",
      type: "text",
    },
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
    name: '',
    email:'',
    password:'',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const {name, email, password} = data;

    const NameV = Validate.validateName(name);
    const EmailV = Validate.validateEmail(email);
    const PassV = Validate.validatePass(password);


    if(typeof NameV=='string' && NameV.length>1){
      return setError(NameV);
    }
    if(typeof EmailV=='string' && EmailV.length>1){
      return setError(EmailV);
    }
    if(typeof PassV=='string' && PassV.length>1){
      return setError(PassV);
    }

    const formDataBody = new FormData();
    formDataBody.append("name", name);
    formDataBody.append("email", email);
    formDataBody.append("password", password);

    axios.post("/api/user", formDataBody, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(()=>{
        navigator("/login");
      })
      .catch(err=>{
        console.log((err.response)?err.response.data.message:"Error in User Creation");
        setError((err.response)?err.response.data.message:"Error in User Creation");
      });
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

        <SingleForm formItems={formItems} handleSubmit={handleSubmit} data={data} setData={setData} submitTxt="Sign Up" setError={setError}/>

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
