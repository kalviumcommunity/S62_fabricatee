import React from "react";

const InfoCard = ({ imageUrl, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg w-80 m-4 mx-auto">
      <img src={imageUrl} alt={title} className="w-full max-h-56 mx-auto mb-4" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
