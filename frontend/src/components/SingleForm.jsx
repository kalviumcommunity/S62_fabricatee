import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

function SingleForm(props) {
  const [passwordVisible, setPasswordVisible] = useState(
    props.formItems.reduce((acc, field) => {
      if (field.type === "password") {
        acc[field.fieldname] = false; // Initialize visibility to false for password fields
      }
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    props.setError('');
    props.setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <form action="#" onSubmit={props.handleSubmit} className="space-y-6">
      {props.formItems.map((field, index) => {
        const isPasswordField = field.type === 'password';
        return (
          <div key={index}>
            <label
              htmlFor={field.fieldname}
              className="block text-sm/6 font-medium text-gray-900"
            >
              {field.label}
            </label>
            <div className="mt-2 flex items-center">
              <input
                id={field.fieldname}
                name={field.fieldname}
                type={
                  isPasswordField && passwordVisible[field.fieldname]
                    ? 'text'
                    : field.type
                }
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={props.data[field.fieldname]}
                onChange={handleChange}
              />
              {isPasswordField && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.fieldname)}
                  className="ml-2 bg-transparent p-1 text-gray-500 focus:outline-none hover:text-gray-700"
                >
                  {passwordVisible[field.fieldname] ? <FaEye /> : <FaEyeSlash />}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {props.submitTxt}
        </button>
      </div>
    </form>
  );
}

export default SingleForm;