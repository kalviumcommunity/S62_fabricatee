import React, { useEffect, useState } from 'react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import axios from '@/api/axios';

const SingleProductPage = ({productUrl}) => {
  const [product, setProduct] = useState({
    name: "Modern Minimalist Chair",
    price: 299.99,
    description: "Ergonomically designed chair featuring clean lines and sustainable materials. Perfect for both home office and living spaces.",
    features: [
      "Sustainable bamboo frame",
      "Premium wool blend upholstery",
      "Ergonomic design",
      "Easy assembly"
    ],
    colors: ["Stone Gray", "Natural Oak", "Soft White"],
    images: [
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500"
    ]
  });

  useEffect(()=>{
    const fetchData = async ()=>{
        const res = await axios.get(productUrl);

        console.log(res.message);
    }
    fetchData();
  }, [])

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={product.images[selectedImage]}
                alt={`${product.name} - View ${selectedImage + 1}`}
                className="w-full rounded-lg shadow-lg"
              />
              <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-md overflow-hidden ${
                    selectedImage === index 
                      ? 'ring-2 ring-gray-900' 
                      : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-black/10" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-tight text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-gray-900">
                ${product.price}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Colors</h2>
              <div className="flex space-x-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="text-gray-600 text-sm">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleProductPage;