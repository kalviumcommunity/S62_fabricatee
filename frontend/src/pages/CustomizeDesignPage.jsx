import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Ruler, ArrowLeft, Edit2 } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import Loader from './Loader';
import Modal from '@/components/Modal';
import CustomMeasurement from '@/components/CustomMeasurement';
import useAuth from '@/hooks/useAuth';

const sizeConfigs = {
  'S':  { meters: 1.0, label: 'Small' },
  'M':  { meters: 1.2, label: 'Medium' },
  'L':  { meters: 1.4, label: 'Large' },
  'XL': { meters: 1.6, label: 'Extra Large' },
  '2XL': { meters: 1.8, label: '2X Large' },
  'Custom': { meters: 0, label: 'Add Your Own' }
};

const ProductCard = ({ fabric, isSelected, onSelect }) => (
  <div 
    onClick={() => onSelect(fabric)}
    className={`bg-white rounded-lg shadow p-4 transition-all cursor-pointer
      ${isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : 'hover:shadow-lg'}`}
  >
    <img
      src={fabric.images[0].url}
      alt={fabric.name}
      className="w-full h-48 object-cover rounded-md mb-3"
    />
    <h3 className="font-medium text-gray-900">{fabric.name}</h3>
    <p className="text-gray-600 text-sm mt-1">{fabric.description}</p>
    <p className="text-gray-900 font-bold mt-2">Rs. {fabric?.meterprice?.sp}</p>
  </div>
);

const ActionButton = ({ icon, children, variant = 'primary', onClick }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
};

const PriceRow = ({ label, price=0, isTotal = false }) => (
  <div className={`flex justify-between items-center ${isTotal ? 'font-bold text-lg' : 'text-gray-600'}`}>
    <span>{label}</span>
    <span>Rs. {price.toFixed(2)}</span>
  </div>
);

const CustomizeDesignPage = () => {
  const {id} = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [fabrics, setFabrics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const {auth, setAuth} = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    //fetch current design
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/design/${id}`);
        setSelectedDesign(res.data.message);
      } catch(err) {
        console.log(err);
      }
    }
    //fetch fabrics
    const fetchFabrics = async () => {
      try {
        const res = await axios.get("/api/fabric")
        setFabrics(res.data.message);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    fetchFabrics();
  }, [id])

  useEffect(()=>{
    console.log(measurements?.measurements);
  }, [measurements]);

  const handleFabricSelect = (fabric) => {
    setIsSidebarOpen(true);
    setSelectedFabric(fabric);
  };

  const handleMeasurementSave = (data) => {
    setMeasurements(data);
    setIsOpen(false);
  };

  const calculateFabricPrice = () => {
    if (!selectedFabric || !measurements) return 0;
    // Assume we calculate meters based on measurements
    const meters = measurements?.measurements?.calculatedMeters || 1.5;
    return selectedFabric?.meterprice?.sp * meters; // Example calculation
  };

  const handleAddToCart = async () =>{
    if (!auth.loggedIn){
      return navigator('/login');
    }
    const data = {};
    data.design = id;
    data.fabric = selectedFabric._id;
    data.measurementProfile = measurements.measurements||undefined;
    data.price = {};
    data.price.fabric = calculateFabricPrice();
    data.price.stitching = selectedDesign?.stitching?.sp;
    const updated = auth?.cart;
    updated.items.push(data);
    updated.price.totalmrp += (selectedDesign?.stitching?.mrp+selectedFabric?.meterprice?.mrp);
    updated.price.discount += (selectedDesign?.stitching?.mrp+selectedFabric?.meterprice?.mrp)-totalPrice;
    updated.price.total += totalPrice;
    updated.price.delivery = (updated.price.total>1499)?0:99;
    try {
      const res = await axios.put(`/api/user/${auth._id}`, {cart: updated});
      console.log('user details updated',res);
      setAuth((prev) => ({ ...prev, cart: updated }));
      navigator('/home');
    } catch (error) {
      console.log(error.message)
    }
  }
  
  const handleAddToWishlist = async () =>{
    if (!auth.loggedIn){
      return navigator('/login');
    }
    const data = {};
    data.design = id;
    data.fabric = selectedFabric._id;
    data.measurementProfile = measurements.measurements||undefined;
    data.price = {};
    data.price.fabric = calculateFabricPrice();
    data.price.stitching = selectedDesign?.stitching?.sp;
    const updated = auth?.wishlist;
    updated.push(data);
    console.log(updated);
    try {
      const res = await axios.put(`/api/user/${auth._id}`, {wishlist: updated});
      console.log('wishlist updated', res);
      data.design = selectedDesign;
      data.fabric = selectedFabric;
      updated.pop();
      updated.push(data);
      console.log('authdata', updated);
      setAuth((prev) => ({ ...prev, wishlist: updated }));
      navigator('/wishlist');
    } catch (error) {
      console.log(error.message)
    }
  }

  const totalPrice = selectedFabric && selectedDesign ? selectedDesign?.stitching?.sp + calculateFabricPrice() : selectedDesign?.stitching?.sp;
  
  const isReadyToPurchase = selectedFabric && measurements;

  if(loading) {
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header remains the same... */}
      <div className="bg-text shadow-sm bg-white p-4 sticky top-0 z-20 drop-shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/shop/designs" className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Customize Your Design</h1>
        </div>
      </div>

      <div className="flex min-h-100vh h-screen lg:min-h-[calc(100vh-65px)] bg-white">
        <div className={`fixed lg:sticky lg:top-[65px] right-0 h-[calc(100vh-65px)] bg-white shadow-lg transition-all z-10
          ${isSidebarOpen ? 'w-full lg:w-80' : 'w-0'} overflow-y-auto`}
        >
          <div className="p-4 h-full flex flex-col">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="mb-4">
              <img
                src={selectedDesign?.images[0]?.url}
                alt={selectedDesign?.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Measurement Selection */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">Measurements</h3>
                {measurements && (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
              
              {measurements ? (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">Measurements Added</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="mt-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setIsOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Add Measurements</span>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Fabric */}
            <div className="space-y-3 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Selected Fabric</h3>
              </div>
              {selectedFabric ? (
                <div className="mt-4 py-3 bg-green-50 border border-green-200 flex justify-between rounded-lg px-3">
                  <span className="text-green-700">{selectedFabric?.name}</span>
                </div>
              ) : (
                <div className="mt-4 py-3 bg-gray-100 rounded-lg px-3" onClick={()=>{(window.innerWidth <= 768)?setIsSidebarOpen(prev=>!prev):undefined}}>
                  <span className="text-gray-600">No fabric selected</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Details</h3>
                <PriceRow label="Stitching Price" price={selectedDesign?.stitching?.sp} />
                {selectedFabric && measurements && (
                  <PriceRow 
                    label="Fabric Price" 
                    price={calculateFabricPrice()}
                  />
                )}
                <div className="my-2 border-t border-gray-200"></div>
                <PriceRow label="Total Price" price={totalPrice} isTotal={true} />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              {!isReadyToPurchase && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-700 text-sm">
                    Please select both fabric and measurements to proceed
                  </p>
                </div>
              )}
              {isReadyToPurchase&&
                <div className="space-y-3">
                  <ActionButton 
                    variant="secondary"
                    icon={<ShoppingCart className="w-5 h-5" />}
                    onClick={handleAddToCart}
                    disabled={!isReadyToPurchase}
                  >
                    Add to Cart
                  </ActionButton>
                  <ActionButton 
                    variant="primary"
                    icon={<ShoppingCart className="w-5 h-5" />}
                    onClick={() => {}}
                    disabled={!isReadyToPurchase}
                  >
                    Buy Now
                  </ActionButton>
                  <ActionButton 
                    variant="outline"
                    icon={<Heart className="w-5 h-5" />}
                    onClick={handleAddToWishlist}
                  >
                    Add to Wishlist
                  </ActionButton>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow lg:ml-0 p-4 lg:p-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed flex flex-row bottom-4 right-4 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg"
            > 
            {isSidebarOpen ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            {isSidebarOpen ? "Fabrics" : "Order Summary"}
          </button>

          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select Your Fabric
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fabrics.map((fabric) => (
                <ProductCard 
                  key={fabric?._id} 
                  fabric={fabric} 
                  isSelected={selectedFabric?._id === fabric._id}
                  onSelect={handleFabricSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {
        isOpen &&
      <Modal setIsOpen={setIsOpen}>
        <CustomMeasurement
          onSave={handleMeasurementSave}
          onCancel={() => setIsOpen(false)}
          initialData={measurements}
        />
      </Modal>
      }
    </div>
  );
};

export default CustomizeDesignPage;