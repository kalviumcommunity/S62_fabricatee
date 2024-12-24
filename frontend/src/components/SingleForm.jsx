import React, { useState } from 'react'

function SingleForm(props) {
    const handleChange = (e) =>{
        const {name, value} = e.target;
    
        props.setData((prev)=>({
          ...prev,
          [name]:value,
        }));
    }

  return (
    <form action="#" onSubmit={props.handleSubmit} className="space-y-6">
        {
        props.formItems.map((field, index)=>{              
            return(<div key={index}>
            <label htmlFor={field.fieldname} className="block text-sm/6 font-medium text-gray-900">
                {field.label}
            </label>
            <div className="mt-2">
                <input
                id={field.fieldname}
                name={field.fieldname}
                type="text"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={props.data[field.fieldname]}
                onChange={handleChange}
                />
            </div>
            </div>)
        })
        }

        <div>
        <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            {props.submitTxt}
        </button>
        </div>
    </form>
  )
}

export default SingleForm
