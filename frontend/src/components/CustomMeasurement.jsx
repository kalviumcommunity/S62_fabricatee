import React, { useState } from 'react';
import { Calendar, Clock, Ruler, Edit, User } from 'lucide-react';
import MeasurementForm from './MeasurementForm';

const standardSizes = {
  'S': { chest: 92, waist: 76, hips: 96, length: 100, shoulders: 40, sleeves: 60 },
  'M': { chest: 96, waist: 80, hips: 100, length: 102, shoulders: 42, sleeves: 61 },
  'L': { chest: 100, waist: 84, hips: 104, length: 104, shoulders: 44, sleeves: 62 },
  'XL': { chest: 106, waist: 90, hips: 110, length: 106, shoulders: 46, sleeves: 63 },
  '2XL': { chest: 112, waist: 96, hips: 116, length: 108, shoulders: 48, sleeves: 64 },
};

const CustomMeasurement = ({ onSave, onCancel }) => {
  const [step, setStep] = useState('initial');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedStandardSize, setSelectedStandardSize] = useState(null);
  
  // Get next 7 available dates (excluding today)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleAppointmentSubmit = () => {
    onSave({
      type: 'appointment',
      date: appointmentDate,
      timeSlot: timeSlot
    });
  };

  const handleStandardSizeSubmit = (measurements) => {
    onSave({
      type: 'measurements',
      measurements,
      baseSize: selectedStandardSize
    });
  };

  const renderInitialOptions = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-center mb-8">Choose Your Measurement Method</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setStep('appointment')}
          className="w-full p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-4"
        >
          <User className="w-6 h-6 text-blue-600" />
          <div className="text-left">
            <h3 className="font-medium text-blue-600">Book Expert Measurement</h3>
            <p className="text-sm text-gray-600">Get professionally measured by our experts (Free)</p>
          </div>
        </button>

        <button
          onClick={() => setStep('standardSize')}
          className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
        >
          <Ruler className="w-6 h-6 text-gray-600" />
          <div className="text-left">
            <h3 className="font-medium">Use Standard Size</h3>
            <p className="text-sm text-gray-600">Choose a standard size and customize if needed</p>
          </div>
        </button>

        <button
          onClick={() => setStep('custom')}
          className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
        >
          <Edit className="w-6 h-6 text-gray-600" />
          <div className="text-left">
            <h3 className="font-medium">Enter Custom Measurements</h3>
            <p className="text-sm text-gray-600">Input your measurements manually</p>
          </div>
        </button>
      </div>

      <button
        onClick={onCancel}
        className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
    </div>
  );

  const renderAppointmentBooking = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Book Measurement Appointment</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <select
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a date</option>
            {getAvailableDates().map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTimeSlot('first-half')}
              className={`p-3 border rounded-md flex items-center justify-center gap-2
                ${timeSlot === 'first-half' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
            >
              <Clock className="w-4 h-4" />
              <span>First Half (9AM - 1PM)</span>
            </button>
            <button
              onClick={() => setTimeSlot('second-half')}
              className={`p-3 border rounded-md flex items-center justify-center gap-2
                ${timeSlot === 'second-half' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
            >
              <Clock className="w-4 h-4" />
              <span>Second Half (2PM - 6PM)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep('initial')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleAppointmentSubmit}
          disabled={!appointmentDate || !timeSlot}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );

  const renderStandardSizeSelection = () => (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold mb-6">Choose Standard Size</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {Object.keys(standardSizes).map((size) => (
          <button
            key={size}
            onClick={() => setSelectedStandardSize(size)}
            className={`p-4 border rounded-lg text-center transition-colors
              ${selectedStandardSize === size 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <span className="text-lg font-medium">{size}</span>
          </button>
        ))}
      </div>

      {selectedStandardSize && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Standard Measurements (cm)</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(standardSizes[selectedStandardSize]).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep('initial')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => selectedStandardSize && setStep('custom')}
          disabled={!selectedStandardSize}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          Customize Measurements
        </button>
      </div>
    </div>
  );

  switch (step) {
    case 'appointment':
      return renderAppointmentBooking();
    case 'standardSize':
      return renderStandardSizeSelection();
    case 'custom':
      return (
        <MeasurementForm
          initialMeasurements={selectedStandardSize ? standardSizes[selectedStandardSize] : null}
          onSave={handleStandardSizeSubmit}
          onCancel={() => setStep('initial')}
        />
      );
    default:
      return renderInitialOptions();
  }
};

export default CustomMeasurement;