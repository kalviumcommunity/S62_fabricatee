import React, { useEffect, useState } from 'react';

const DynamicForm = ({ 
  title, 
  fields, 
  onSubmit, 
  error 
}) => {

  useEffect(()=>{
    console.log(fields);
  }, [])
  // Initialize form data with default values from fields configuration
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.type === 'checkbox-group' 
        ? (field.default || []) 
        : (field.default !== undefined ? field.default : '')
    }), {})
  );


  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files }));
    } else if (type === 'checkbox') {
      setFormData(prev => {
        const currentValues = prev[name] || [];
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] };
        } else {
          return { ...prev, [name]: currentValues.filter(v => v !== value) };
        }
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="" disabled>
              {field.placeholder || 'Select an option'}
            </option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox-group':
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name]?.includes(option.value)}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            id={field.name}
            name={field.name}
            type="file"
            onChange={handleChange}
            accept={field.accept}
            multiple={field.multiple}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        );

      case 'number':
        return (
          <input
            id={field.name}
            name={field.name}
            type="number"
            value={formData[field.name]}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        );

      default:
        return (
          <input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        );
    }
  };

  return (
    <div className="min-h-[60vh] bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {title}
        </h2>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;