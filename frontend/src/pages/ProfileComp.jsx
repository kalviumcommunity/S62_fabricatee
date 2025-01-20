  import React, { useEffect, useState, useRef } from 'react';
import { 
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiLogOut,
  FiChevronRight,
  FiEdit,
  FiCamera
} from 'react-icons/fi';
import { CgProfile } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import Modal from '../components/Modal';
import useAuth from '../hooks/useAuth';
import DynamicForm from '../components/DynamicForm';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import axios from '../api/axios.js'
import WishlistComp from '../components/WishlistComp.jsx';

const ProfileComp = (props) => {
  const [activeTab, setActiveTab] = useState(props.activeTab||'profile');
  const navigator = useNavigate();
  const logout = useLogout();
  const fileInputRef = useRef(null);

  const {auth, setAuth} = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: "NA",
    email: "NA",
    phoneNumber: "NA",
    profilePic: null
  });
  const [profileFormData, setProfileFormData] = useState({
    name: "NA",
    email: "NA",
    phoneNumber: "NA",
    profilePic: null,
    editing: false
  });
  
  const [newAddress, setNewAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const getAddressFormData = (address = null) => {
    return [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Address name',
        default: address ? address.name : "Home"
      },
      {
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'Enter City Name',
        default: address ? address.city : ""
      },
      {
        name: 'line1',
        label: 'Address',
        type: 'text',
        placeholder: 'Enter Address',
        fullWidth: true,
        default: address ? address.line1 : ""
      },
      {
        name: 'state',
        label: 'State',
        type: 'text',
        placeholder: 'Enter State Name',
        default: address ? address.state : ""
      },
      {
        name: 'pincode',
        label: 'Pincode',
        type: 'number',
        placeholder: 'Enter PIN',
        default: address ? address.pincode : ""
      }
    ];
  };
  
  const [orders, setOrders] = useState([]);

  const [addresses, setAddress] = useState([]);
  const [addressError, setAddressError] = useState();

  const [wishlist, setWishlist] = useState([]);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  ];

  useEffect(()=>{
    if(auth.loggedIn){
      setUserProfile(auth);
      setProfileFormData(prev=> ({...prev, ...auth}));
      setOrders(auth.orders||[]);
      setAddress(auth.address||[]);
      setWishlist(auth.wishlist||[]);
      console.log(auth.wishlist)
      console.log("user authenticated - ProfileComp")
    }else{
      navigator('/login')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = {
          url: reader.result,
          alt: file.name
        };
        setProfileFormData(prev => ({
          ...prev,
          profilePic: imageData,
          file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressSubmit = async (addressData) =>{
    if(!addressData.line1 || !addressData.state || !addressData.city || !addressData.pincode || !addressData.name){
      setAddressError("Enter all the required details");
      return;
    }
    let updatedAddresses = [];
    if(editingAddress==null){
      for(let add of addresses){
        if(add.name == addressData.name) {
          setAddressError(`Address ${addressData.name} already exists, enter a unique name`);
          return;
        }
      }
      updatedAddresses = [...addresses, addressData]
      setAddress(updatedAddresses);
    }else{
      updatedAddresses = addresses.map((add)=>
        add.name === editingAddress.name ? addressData : add
      );
      setAddress(updatedAddresses);
    }
    try {
      await axios.put(`/api/user/${auth.userId}`, { address: updatedAddresses });
      setAuth((prev) => ({ ...prev, address: updatedAddresses })); // Update auth context with new addresses
      setNewAddress(prev=>!prev);
    } catch (err) {
      setAddressError("Error in updating Address")
      console.error("Error in updating address:", err.message);
    }
  }
  
  const handleAddressDelete = async (addressName) => {
    const updated = addresses.filter((add)=>{
      return addressName!=add.name;
    })
    try {
      await axios.put(`/api/user/${auth.userId}`, { address: updated });
      setAuth((prev) => ({ ...prev, address: updated })); // Update auth context with new addresses
      setAddress(updated);
    } catch (err) {
      setAddressError("Error in Deleting Address")
      console.error("Error in Deleting address:", err.message);
    }
  } 

  const handleWishlistDelete = async (wishlistid) =>{
    console.log('previous', wishlist);
    const updated = wishlist.filter((item)=>{
      return item._id!=wishlistid;
    })
    console.log('updated',updated);
    try {
      const res = await axios.put(`/api/user/${auth._id}`, {wishlist: updated});
      console.log('wishlist updated',res);
      setAuth((prev) => ({ ...prev, wishlist: updated }));
      setWishlist(updated);
    } catch (error) {
      console.log(error.message)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUserProfile(profileFormData);
    setProfileFormData(prev => ({ ...prev, editing: false }));

    try {
      const formDataBody = new FormData();
      formDataBody.append("name", profileFormData.name);
      formDataBody.append("email", profileFormData.email);
      formDataBody.append("phoneNumber", profileFormData.phoneNumber);
      formDataBody.append("profile", profileFormData.file);

      console.log(formDataBody);

      await axios.put(`/api/user/${auth.userId}`, formDataBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(()=>{
          setAuth(prev=>({...prev, name:profileFormData.name, email: profileFormData.email, phoneNumber: profileFormData.phoneNumber, profilePic: profileFormData.profilePic}))
        })
    } catch (error) {
      console.log(`Error in User Updation: `, error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Profile Summary */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {profileFormData.profilePic?.url ? 
                    <img
                      src={profileFormData.profilePic.url}
                      alt={profileFormData.profilePic.alt}
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    /> :
                    <CgProfile className='w-24 h-24 text-gray-800 mb-4'/>
                  }
                </div>
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-gray-500 text-sm">{userProfile.email}</p>
                {userProfile.joinDate&&<p className="text-gray-400 text-xs mt-1">{userProfile.joinDate}</p>}
              </div>

              {/* Keep existing navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                        activeTab === item.id 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </div>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>

              {/* Keep existing logout button */}
              <div className="pt-4 border-t">
                <button className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg" onClick={()=>logout()}>
                  <FiLogOut className="w-5 h-5 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Profile Information</h3>
                    {!profileFormData.editing &&
                      <button 
                        className="flex items-center text-indigo-600 hover:text-indigo-700"
                        onClick={()=>{setProfileFormData(prev=>({...prev, editing: !prev.editing}))}}
                      >
                        <FiEdit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    }
                  </div>
                  <form onSubmit={handleProfileSubmit}>
                    {/* Profile Picture Section */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        {profileFormData.profilePic?.url ? 
                          <img
                            src={profileFormData.profilePic.url}
                            alt={profileFormData.profilePic.alt}
                            className="w-32 h-32 rounded-full object-cover"
                          /> :
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                            <CgProfile className='w-20 h-20 text-gray-400'/>
                          </div>
                        }
                        {profileFormData.editing && (
                          <>
                            <button
                              type="button"
                              onClick={triggerImageUpload}
                              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
                            >
                              <FiCamera className="w-4 h-4" />
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Existing form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input name="name" className={`mt-1 p-3 bg-gray-50 rounded-md ${profileFormData.editing&&"border-gray-500 bg-white border-solid border-[1px]"}`} value={profileFormData.name} onChange={handleChange} disabled={!profileFormData.editing} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" className={`mt-1 p-3 bg-gray-50 rounded-md ${profileFormData.editing&&"border-gray-500 border-solid border-[1px]"}`} value={profileFormData.email} onChange={handleChange} disabled={!profileFormData.editing}/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input name="phoneNumber" className={`mt-1 p-3 bg-gray-50 rounded-md ${profileFormData.editing&&"border-gray-500 border-solid border-[1px]"}`} value={profileFormData.phoneNumber} onChange={handleChange} disabled={!profileFormData.editing}/>
                      </div>
                    </div>

                    {/* Existing buttons */}
                    {profileFormData.editing &&
                      <div className='flex flex-row justify-around mt-6'>
                        <button className='std-btn w-full mx-4' type='submit'>
                          Save Changes
                        </button>
                        <button 
                          className='secondary-btn !border-secondary !text-secondary w-full hover:!bg-secondary hover:!text-white mx-4' 
                          onClick={()=> {
                            setProfileFormData(prev=>({
                              name: "NA",
                              email: "NA",
                              phoneNumber: "NA",
                              ...auth,
                              editing:!prev.editing
                            }));
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    }
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{order?.orderId}</h4>
                            <p className="text-sm text-gray-500">{order?.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{order?.price?.total}</p>
                            <p className="text-sm text-gray-500">{order?.items?.length} items</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : (order.status === 'In Transit' || order.status === 'Shipped' ||  order.status === 'Out for Delivery')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <WishlistComp wishlist={wishlist} handleDelete={handleWishlistDelete}/>
              )}

              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Saved Addresses</h3>
                    <button 
                      className="flex items-center text-indigo-600 hover:text-indigo-700" 
                      onClick={() => {
                        setEditingAddress(null);
                        setNewAddress(true);
                      }}
                    >
                      <FiEdit className="w-4 h-4 mr-1" />
                      Add New Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{address.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{address.line1}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                          <div>
                            <button 
                              className="text-gray-400 hover:text-gray-500 mx-1" 
                              onClick={() => {
                                setEditingAddress(address);
                                setNewAddress(true);
                              }}
                            >
                              <FiEdit className="w-5 h-5" />
                            </button>
                            <button 
                              className="text-gray-400 hover:text-gray-500 mx-1" 
                              onClick={() => {
                                setNewAddress(false);
                                handleAddressDelete(address.name);
                              }}
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {newAddress && (
                      <Modal setIsOpen={setNewAddress}>
                        <DynamicForm 
                          title={editingAddress ? "Edit Address" : "Add Address"}
                          fields={getAddressFormData(editingAddress)}
                          onSubmit={handleAddressSubmit}
                          error={addressError}
                        />
                      </Modal>
                    )}
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;