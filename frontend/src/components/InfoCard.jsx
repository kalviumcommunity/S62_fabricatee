import React from "react";

const InfoCard = ({ imageUrl, title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-80 mx-auto">
      <img src={imageUrl} alt={title} className="w-32 h-32 mx-auto rounded-full mb-4" />
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default InfoCard;
