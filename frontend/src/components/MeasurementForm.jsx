import React, { useState, useEffect } from 'react';
import { Ruler, Info } from 'lucide-react';

const MeasurementForm = ({ onSave, onCancel, initialMeasurements = null }) => {
  const [measurements, setMeasurements] = useState({
    chest: initialMeasurements?.chest || '',
    waist: initialMeasurements?.waist || '',
    hips: initialMeasurements?.hips || '',
    length: initialMeasurements?.length || '',
    shoulders: initialMeasurements?.shoulders || '',
    sleeves: initialMeasurements?.sleeves || '',
  });

  const [errors, setErrors] = useState({});
  const [calculatedMeters, setCalculatedMeters] = useState(0);

  const measurementFields = [
    { id: 'chest', label: 'Chest', tip: 'Measure around the fullest part of your chest' },
    { id: 'waist', label: 'Waist', tip: 'Measure around your natural waistline' },
    { id: 'hips', label: 'Hips', tip: 'Measure around the fullest part of your hips' },
    { id: 'length', label: 'Dress Length', tip: 'Measure from shoulder to desired hem length' },
    { id: 'shoulders', label: 'Shoulder Width', tip: 'Measure across shoulders from edge to edge' },
    { id: 'sleeves', label: 'Sleeve Length', tip: 'Measure from shoulder to desired sleeve end' }
  ];

  // Validate and calculate fabric requirements
  useEffect(() => {
    const calculateFabricRequirement = () => {
      // This is a simplified calculation - adjust based on your actual requirements
      const maxWidth = Math.max(
        Number(measurements.chest) || 0,
        Number(measurements.waist) || 0,
        Number(measurements.hips) || 0
      );
      const totalLength = Number(measurements.length) || 0;
      
      // Basic calculation: larger measurements need more fabric
      let fabricMeters = 0;
      if (maxWidth && totalLength) {
        // Example calculation - adjust this formula based on your needs
        fabricMeters = (maxWidth * totalLength) / 10000 + 0.5; // Converting to meters with some allowance
        fabricMeters = Math.round(fabricMeters * 10) / 10; // Round to 1 decimal place
      }
      
      setCalculatedMeters(fabricMeters);
    };

    calculateFabricRequirement();
  }, [measurements]);

  const validateMeasurements = () => {
    const newErrors = {};
    measurementFields.forEach(({ id, label }) => {
      if (!measurements[id]) {
        newErrors[id] = `${label} is required`;
      } else if (isNaN(measurements[id]) || measurements[id] <= 0) {
        newErrors[id] = `Please enter a valid ${label.toLowerCase()} measurement`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateMeasurements()) {
      onSave({ ...measurements, calculatedMeters });
    }
  };

  const handleInputChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Ruler className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Custom Measurements</h2>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            Please provide measurements in centimeters (cm). For accurate measurements, we recommend having someone assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {measurementFields.map(({ id, label, tip }) => (
            <div key={id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  {label} (cm)
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="hidden group-hover:block absolute right-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                    {tip}
                  </div>
                </div>
              </div>
              <input
                type="number"
                value={measurements[id]}
                onChange={(e) => handleInputChange(id, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
        </div>

        {calculatedMeters > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Estimated Fabric Required</h3>
            <p className="text-gray-600">{calculatedMeters} meters</p>
          </div>
        )}

        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Measurements
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;