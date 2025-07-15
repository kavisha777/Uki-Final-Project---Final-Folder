// // SellerDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import axios from '../utils/axios';
// import { User, PackageCheck, Boxes, ClipboardList, History, ShoppingCart, LogOut } from 'lucide-react';
// import { toast } from 'react-toastify';
// import Navbar from '../components/Navbar';

// const SellerDashboard = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [profile, setProfile] = useState({});
//   const [form, setForm] = useState({});
//   const [profilePic, setProfilePic] = useState(null);
//   const [idProof, setIdProof] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [items, setItems] = useState([]);
//   const [itemForm, setItemForm] = useState({});
//   const [itemImages, setItemImages] = useState([]);
//   const [editingItemId, setEditingItemId] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const [rentStatus, setRentStatus] = useState([]);
//   const [rentHistory, setRentHistory] = useState([]);
//   const [myRentals, setMyRentals] = useState([]);
//   const [myRentStatus, setMyRentStatus] = useState([]);

// //   const confirmAction = async (rentId, action) => {
// //     try {
// //       if (action === 'confirm-pickup') {
// //         await axios.patch(`/rent/${rentId}/pickup`);
// //         toast.success('Pickup confirmed');
// //       } else if (action === 'complete') {
// //         await axios.patch(`/rent/${rentId}/complete`);
// //         toast.success('Rent marked complete');
// //       } else if (action === 'return') {
// //         await axios.patch(`/rent/${rentId}/return`);
// //         toast.success('Item returned');
// //       }
// //       fetchRentStatus();
// //       fetchMyRentStatus();
// //     } catch (err) {
// //       toast.error('Action failed');
// //     }
// //   };
  

//   const fetchProfile = async () => {
//     const res = await axios.get('/user/profile');
//     setProfile(res.data);
//     setForm({
//       name: res.data.name,
//       contact: res.data.contactNumber,
//       address: res.data.address
//     });
//   };

//   const updateProfile = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('contact', form.contact);
//     formData.append('address', form.address);
//     if (profilePic) formData.append('profilePic', profilePic);
//     if (idProof) formData.append('idProof', idProof);

//     try {
//       await axios.put('/user/profile', formData);
//       toast.success('Profile updated successfully');
//       fetchProfile();
//       setEditMode(false);
//     } catch (err) {
//       toast.error('Failed to update profile');
//     }
//   };

//   const fetchItems = async () => {
//     const res = await axios.get('/items/my-items');
//     setItems(res.data);
//   };

//   const handleItemSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(itemForm).forEach(([key, val]) => formData.append(key, val));
//     itemImages.forEach(img => formData.append('images', img));

//     try {
//       if (editingItemId) {
//         await axios.put(`/items/${editingItemId}`, formData);
//         toast.success('Item updated');
//       } else {
//         await axios.post('/items', formData);
//         toast.success('Item created');
//       }
//       fetchItems();
//       setItemForm({});
//       setItemImages([]);
//       setEditingItemId(null);
//     } catch (err) {
//       toast.error('Error submitting item');
//     }
//   };

//   const deleteItem = async (id) => {
//     if (!window.confirm('Delete this item?')) return;
//     await axios.delete(`/items/${id}`);
//     toast.success('Item deleted');
//     fetchItems();
//   };

//   const fetchRequests = async () => {
//     const res = await axios.get('/rent/requests');
//     setRequests(res.data.requests);
//   };

//   const respondRequest = async (id, action) => {
//     await axios.patch(`/rent/${rentId}/respond`, { action });
//     toast.success(`Request ${action}ed`);
//     fetchRequests();
//   };

//   const fetchRentStatus = async () => {
//     const res = await axios.get('/rent/my-rentals');
//     setRentStatus(res.data);
//   };

//   const confirmPickup = async (rentId) => {
//     try {
//       const res = await axios.patch(`/rent/${rentId}/pickup`);
//       console.log('confirmed', res.data);
//       toast.success('Pickup confirmed');
//       await fetchRentStatus();
//     } catch (err) {
//       console.error(err.response);
//       toast.error(err.response?.data?.message || 'Pickup confirmation failed');
//     }
//   };
  
  
//   const completeRent = async (id) => {
//     await axios.patch(`/rent/${rentId}/complete`);
//     fetchRentStatus();
//     toast.success('Rent completed');
//   };

//   const fetchRentHistory = async () => {
//     try {
//       const res = await axios.get('/rent/seller/history');
//       setRentHistory(res.data.rentHistory);
//     } catch (err) {
//       console.error('Fetch rent history failed:', err.response?.data || err.message);
//       toast.error(err.response?.data?.message || 'Could not load rent history');
//     }
//   };
  

//   const fetchMyRentals = async () => {
//     const res = await axios.get('/rent/my-rentals');
//     setMyRentals(res.data);
//   };

// //   const fetchMyRentStatus = async () => {
// //     const res = await axios.get('/rent/my-rentals');
// //     setMyRentStatus(res.data);
// //   };

//   useEffect(() => {
//     fetchProfile();
//     fetchItems();
//     fetchRequests();
//     fetchRentStatus();
//     fetchRentHistory();
//     fetchMyRentals();
//     // fetchMyRentStatus();
//   }, []);

//   const tabs = [
//     { key: 'profile', label: 'My Profile', icon: <User size={18} /> },
//     { key: 'items', label: 'My Items', icon: <Boxes size={18} /> },
//     { key: 'requests', label: 'Rent Requests', icon: <ClipboardList size={18} /> },
//     { key: 'myitemstatus', label: 'My Item Rent Status', icon: <PackageCheck size={18} /> },
//     { key: 'history', label: 'Rent History', icon: <History size={18} /> },
//     { key: 'myrentals', label: 'My Rentals (User)', icon: <ShoppingCart size={18} /> },
//     { key: 'rentstatus', label: 'My Rent Status (User)', icon: <ShoppingCart size={18} /> }
//   ];

//   return (
   
//     <div className="flex min-h-screen pt-16">

//          <Navbar/>
//       <aside className="w-64 bg-pink-100 p-4 space-y-4">
//         {tabs.map(t => (
//           <button
//             key={t.key}
//             onClick={() => setActiveTab(t.key)}
//             className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded ${activeTab === t.key ? 'bg-pink-600 text-white' : 'hover:bg-pink-200'}`}
//           >
//             {t.icon} {t.label}
//           </button>
//         ))}
//         <button className="flex items-center gap-2 w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-100">
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>
//       <main className="flex-1 p-6 overflow-y-auto">
//         {activeTab === 'profile' && (
//           <div className="max-w-2xl mx-auto">
//             <h2 className="text-xl font-bold mb-4">My Profile</h2>
//             {!editMode ? (
//               <div className="space-y-3">
//                 <img src={profile.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
//                 <p><strong>Name:</strong> {profile.name}</p>
//                 <p><strong>Contact:</strong> {profile.contactNumber}</p>
//                 <p><strong>Address:</strong> {profile.address}</p>
//                 <p><strong>ID Proof:</strong> <a href={profile.idProof} target="_blank" className="text-blue-500 underline">View</a></p>
//                 <button onClick={() => setEditMode(true)} className="mt-2 px-4 py-2 bg-pink-600 text-white rounded">Edit</button>
//               </div>
//             ) : (
//               <form onSubmit={updateProfile} className="space-y-4">
//                 <div>
//                   <label className="block font-semibold">Name</label>
//                   <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                   <label className="block font-semibold">Contact</label>
//                   <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                   <label className="block font-semibold">Address</label>
//                   <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full p-2 border rounded" />
//                 </div>
//                 <div>
//                   <label className="block font-semibold">Profile Picture</label>
//                   <input type="file" onChange={e => setProfilePic(e.target.files[0])} className="w-full p-2" />
//                 </div>
//                 <div>
//                   <label className="block font-semibold">ID Proof</label>
//                   <input type="file" onChange={e => setIdProof(e.target.files[0])} className="w-full p-2" />
//                 </div>
//                 <div className="flex gap-3">
//                   <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
//                   <button onClick={() => setEditMode(false)} type="button" className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}





// {activeTab === 'items' && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">My Items</h2>
//             <form onSubmit={handleItemSubmit} className="space-y-4 max-w-2xl">
//               <input type="text" placeholder="Item Name" className="w-full p-2 border rounded" value={itemForm.name || ''} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required />
//               <textarea placeholder="Description" className="w-full p-2 border rounded" value={itemForm.description || ''} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} required />
//               <input type="text" placeholder="Category" className="w-full p-2 border rounded" value={itemForm.category || ''} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} required />
//               <input type="number" placeholder="Price per day" className="w-full p-2 border rounded" value={itemForm.price || ''} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} required />
//               <input type="number" placeholder="Quantity" className="w-full p-2 border rounded" value={itemForm.quantity || ''} onChange={e => setItemForm({ ...itemForm, quantity: e.target.value })} required />
//               <input type="file" multiple onChange={e => setItemImages([...e.target.files])} className="w-full" />
//               <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingItemId ? 'Update' : 'Add'} Item</button>
//             </form>

//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//               {items.map(item => (
//                 <div key={item._id} className="border p-4 rounded shadow">
//                   <h3 className="font-bold text-lg">{item.name}</h3>
//                   <p>{item.description}</p>
//                   <p className="text-sm text-gray-500">{item.category}</p>
//                   <p className="text-pink-600 font-semibold">₹{item.price}/day</p>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {item.images.map((url, idx) => (
//                       <img key={idx} src={url} alt="item" className="w-20 h-20 object-cover rounded" />
//                     ))}
//                   </div>
//                   <div className="mt-3 flex gap-2">
//                     <button onClick={() => { setItemForm(item); setEditingItemId(item._id); }} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
//                     <button onClick={() => deleteItem(item._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}






// {activeTab === 'requests' && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Rent Requests for My Items</h2>
//             <div className="space-y-4">
//               {requests.length === 0 && <p>No incoming requests.</p>}
//               {requests.map(req => (
//                 <div key={req._id} className="border p-4 rounded shadow space-y-1">
//                   <p><strong>Item:</strong> {req.item.name}</p>
//                   <p><strong>Renter:</strong> {req.renter.name}</p>
//                   <p><strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
//                   <p><strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
//                   <p><strong>Status:</strong> <span className="font-semibold text-pink-600">{req.status}</span></p>
//                   <div className="flex gap-3 mt-2">
//                     <button onClick={() => respondRequest(req._id, 'approve')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
//                     <button onClick={() => respondRequest(req._id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}






// {activeTab === 'myitemstatus' && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">My Item Rent Status</h2>
//             <div className="space-y-4">
//               {rentStatus.length === 0 && <p>No rents found for your items.</p>}
//               {rentStatus.map(rent => (
//                 <div key={rent._id} className="border p-4 rounded shadow">
//                   <p><strong>Item:</strong> {rent.item.name}</p>
//                   <p><strong>Renter:</strong> {rent.renter.name}</p>
//                   <p><strong>Status:</strong> <span className="text-pink-600 font-semibold">{rent.status}</span></p>
//                   <p><strong>Payment:</strong> {rent.paymentStatus}</p>
//                   <div className="flex gap-3 mt-2">
//                   {r.status === 'confirmed' && !r.confirmPickupBySeller && (
//   <button
//     onClick={() => confirmPickup(r._id)}
//     className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//   >
//     Confirm Pickup (Seller)
//   </button>
// )}


//                     {rent.status === 'in-use' && (
//                       <button onClick={() => confirmAction(rent._id, 'complete')} className="bg-blue-600 text-white px-3 py-1 rounded">Mark Complete</button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}




// {activeTab === 'history' && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Rent History</h2>
//             <div className="space-y-4">
//               {rentHistory.length === 0 && <p>No past rentals yet.</p>}
//               {rentHistory.map(rent => (
                
//                 <div key={rent._id} className="border p-4 rounded shadow">
//                   <p><strong>Item:</strong> {rent.item.name}</p>
//                   <p><strong>Renter:</strong> {rent.renter.name}</p>
//                   <p><strong>From:</strong> {new Date(rent.from).toLocaleDateString()}</p>
//                   <p><strong>To:</strong> {new Date(rent.to).toLocaleDateString()}</p>
//                   <p><strong>Status:</strong> <span className="text-gray-700 font-semibold">{rent.status}</span></p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

        
// {activeTab === 'rentstatus' && (
//   <div>
//     <h2 className="text-xl font-bold mb-4">My Rent Status (as User)</h2>
//     <div className="space-y-4">
//       {myRentStatus.length === 0 && <p>You haven’t rented any items.</p>}
//       {myRentStatus.map(rent => (
//         <div key={rent._id} className="border p-4 rounded shadow">
//           <p><strong>Item:</strong> {rent.item.name}</p>
//           <p><strong>Owner:</strong> {rent.owner.name}</p>
//           <p><strong>Status:</strong> <span className="text-pink-600 font-semibold">{rent.status}</span></p>
//           <p><strong>Payment:</strong> {rent.paymentStatus}</p>
//           <div className="flex gap-2 mt-2">
//             {rent.status === 'approved' && !rent.confirmPickupByUser && (
//               <button onClick={() => confirmAction(rent._id, 'confirm-pickup')} className="bg-green-600 text-white px-3 py-1 rounded">Confirm Pickup</button>
//             )}
//             {rent.status === 'in-use' && (
//               <button onClick={() => confirmAction(rent._id, 'return')} className="bg-blue-600 text-white px-3 py-1 rounded">Return Item</button>
//             )}
//             {rent.paymentStatus === 'pending' && (
//               <a href={`/payment/create-rent-session/${rent._id}`} className="bg-purple-600 text-white px-3 py-1 rounded">Pay Now</a>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//       </main>
//     </div>
//   );
// };

// export default SellerDashboard;





import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { User, History, Hourglass, LogOut ,Boxes} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // adjust path if needed



const SellerDashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const [rentals, setRentals] = useState([]);
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);


  const [myItems, setMyItems] = useState([]);
const [itemForm, setItemForm] = useState({});
const [itemImages, setItemImages] = useState([]);
const [editingItemId, setEditingItemId] = useState(null);




const [rentHistory, setRentHistory] = useState([]);
const [loadingRentStatus, setLoadingRentStatus] = useState(false);


  const [statusFilter, setStatusFilter] = useState('approved');
const filteredRentals = rentals.filter(r => r.status === statusFilter);


const fetchRentals = async () => {
  try {
    const res = await axios.get('/rent/my-rentals');
    console.log("✅ RENTALS:", JSON.stringify(res.data, null, 2)); // 🧪 Check 'paid'
    setRentals(res.data);
  } catch (err) {
    console.error("❌ Error fetching rentals:", err.response?.data || err.message);
  }
};

  const fetchProfile = async () => {
    const res = await axios.get('/user/profile');
    setProfile(res.data);
    setForm({
      name: res.data.name,
      contact: res.data.contactNumber,
      address: res.data.address
    });
  };



  const fetchMyItems = async () => {
    try {
      const res = await axios.get('/items/my-items');
      setMyItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch items.");
    }
  };
 
  // if (activeTab === 'items') fetchMyItems();

  const [requests, setRequests] = useState([]);
const [loadingRequests, setLoadingRequests] = useState(false);

const fetchRequests = async () => {
  setLoadingRequests(true);
  try {
    const { data } = await axios.get('/rent/requests');
    setRequests(data.requests);
  } catch (err) {
    toast.error("Failed to load requests");
  } finally {
    setLoadingRequests(false);
  }
};


useEffect(() => {
  if (activeTab === 'requests') {
    fetchRequests();
  }
}, [activeTab]);
useEffect(() => {
  if (activeTab === 'requests') {
    fetchRequests();
  }
}, [activeTab]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('contact', form.contact);
    formData.append('address', form.address);
    if (profilePic) formData.append('profilePic', profilePic);
    if (idProof) formData.append('idProof', idProof);

    try {
      await axios.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };



  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(itemForm).forEach(([key, value]) => formData.append(key, value));
    itemImages.forEach(img => formData.append('images', img));
  
    try {
      if (editingItemId) {
        await axios.put(`/items/${editingItemId}`, formData);
        toast.success("Item updated");
      } else {
        await axios.post('/items', formData);
        toast.success("Item created");
      }
      fetchMyItems();
      setItemForm({});
      setItemImages([]);
      setEditingItemId(null);
    } catch (err) {
      toast.error("Item submission failed");
    }
  };
  
  const handleEditItem = (item) => {
    setItemForm({
      name: item.name,
      description: item.description,
      pricePerDay: item.pricePerDay,
      advanceAmount: item.advanceAmount,
      depositeAmount: item.depositeAmount,
      category: item.category,
      available: item.available
    });
    setEditingItemId(item._id);
  };
  
  const handleDeleteItem = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/items/${id}`);
        toast.success("Item deleted");
        fetchMyItems();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };
  
  const handleConfirmPickupBySeller = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/pickup`);
      toast.success(res.data.message || "Pickup confirmed by seller.");
      fetchRentals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm pickup.");
    }
  };
  
  
  
  const handleConfirmPickup = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/pickup`);
      
      // ✅ Show success toast based on backend message
      toast.success(res.data.message || 'Pickup confirmed');
  
      // ✅ Refresh rentals after update
      fetchRentals();
    } catch (err) {
      console.error('Pickup error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Pickup failed');
    }
  };
  
  
  const handleMarkReturned = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/return`);
      alert(res.data.message);
      fetchRentals();
    } catch (err) {
      alert("Return failed: " + err.response?.data?.message);
    }
  };
  
  // const handleCompleteRent = async (rentId) => {
  //   try {
  //     const res = await axios.patch(`/rent/${rentId}/complete`);
  //     alert(res.data.message);
  //     fetchRentals();
  //   } catch (err) {
  //     alert("Complete failed: " + err.response?.data?.message);
  //   }
  // };

  const handleCompleteRent = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/complete`);
      toast.success(res.data.message || 'Rent marked completed');
      // re-fetch rent-history:
      if (activeTab === 'rent-status') {
        setLoadingRentStatus(true);
        const { data } = await axios.get('/rent/seller/history', { withCredentials: true });
        setRentHistory(data.rentHistory);
        setLoadingRentStatus(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete rent');
    }
  };
  

  const handleRespondRequest = async (rentId, action) => {
    try {
      const { data } = await axios.patch(`/rent/${rentId}/respond`, { action });
      toast.success(data.message);
      fetchRequests();       // refresh the list
      if (activeTab === 'rent-status') setRentHistory(); // if you track history
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    }
  };
  
  const handleStripePayment = async (rentId) => {
    try {
      const res = await axios.post('/payment/create-rent-session', { rentId });
      if (res.data?.url) {
        window.location.href = res.data.url;  // 🔁 Redirect to Stripe checkout
      } else {
        alert("Failed to create Stripe session.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed: " + (err.response?.data?.message || err.message));
    }
  };
  
  
// Existing useEffect watching activeTab
useEffect(() => {
  if (activeTab === 'profile') fetchProfile();
  if (activeTab === 'rentals' || activeTab === 'status') fetchRentals();
}, [activeTab]);






useEffect(() => {
  if (activeTab === 'rent-status') {
    setLoadingRentStatus(true);
    axios.get('/rent/seller/history', { withCredentials: true })
      .then(res => {
        setRentHistory(res.data.rentHistory);
      })
      .catch(err => {
        toast.error("Failed to load rent status");
      })
      .finally(() => setLoadingRentStatus(false));
  }
}, [activeTab]);


useEffect(() => {
  if (activeTab === 'items') {
    fetchMyItems();
  }
}, [activeTab]);

// Add this new useEffect here:
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("payment") === "success") {
    fetchRentals();         // ✅ Refresh rentals
    setActiveTab("status"); // ✅ Switch to status tab
    window.history.replaceState({}, '', '/dashboard'); // ✅ Clean URL
  }
}, []);



  
  

  return (
    
   <>
  <Navbar />
  <div className="flex pt-20 min-h-screen bg-[#FDFDFD] text-[#2E2E2E]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#FDE7F0] p-6 space-y-6 shadow-md flex flex-col">
        <div className="text-center">
          {profile?.profilePic ? (
            <img src={profile.profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto border-2 border-[#D30C7B]" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl mx-auto">
              <User size={40} />
            </div>
          )}
          <p className="mt-2 font-semibold text-lg">{profile.name || 'User'}</p>
        </div>

        {[
          { key: 'profile', label: 'My Profile', icon: <User size={18} /> },
          { key: 'items', label: 'My Items', icon: <Boxes size={18} /> },
          { key: 'requests', label: 'Incoming Requests', icon: <Hourglass size={18} /> },
          { key: 'rent-status', label: 'My Item Rent Status', icon: <Hourglass size={18} /> },

          { key: 'rentals', label: 'My Rentals', icon: <History size={18} /> },
          { key: 'status', label: 'My Borrowed Rent Status', icon: <Hourglass size={18} /> },

        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded transition ${
              activeTab === key ? 'bg-[#D30C7B] text-white' : 'text-[#2E2E2E] hover:bg-[#D30C7B]/10'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}

        <button className="mt-auto flex items-center gap-3 px-4 py-2 text-[#E53935] hover:bg-[#E53935]/10 rounded">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-[#D30C7B] font-medium text-sm hover:underline"
              >
                {editMode ? 'Cancel ✖️' : 'Edit ✏️'}
              </button>
            </div>

            {message && <p className="text-green-600 mb-4">{message}</p>}

            {!editMode ? (
              <div className="bg-white p-6 rounded-xl shadow space-y-4">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Contact:</strong> {profile.contactNumber || '-'}</p>
                <p><strong>Address:</strong> {profile.address || '-'}</p>
                <p>
                  <strong>ID Proof:</strong>{' '}
                  {profile.idProof ? (
                    <a href={profile.idProof} className="text-blue-600 underline" target="_blank">View</a>
                  ) : 'Not uploaded'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-xl shadow space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={form.contact || ''}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border p-3 rounded"
                />
                <div>
                  <label className="block mb-1 font-medium">Profile Picture</label>
                  <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">ID Proof</label>
                  <input type="file" onChange={(e) => setIdProof(e.target.files[0])} />
                </div>
                <button type="submit" className="bg-[#D30C7B] text-white px-6 py-2 rounded hover:bg-pink-700">
                  Save Changes
                </button>
              </form>
            )}
          </div>
        )}











{activeTab === 'items' && (
  <div>
    <h2 className="text-xl font-bold mb-4">{editingItemId ? 'Edit Item' : 'Add New Item'}</h2>
    <form onSubmit={handleItemSubmit} className="space-y-3 bg-white p-6 rounded shadow mb-6">
      <input type="text" placeholder="Name" value={itemForm.name || ''} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} className="w-full p-2 border rounded" />
      <textarea placeholder="Description" value={itemForm.description || ''} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} className="w-full p-2 border rounded" />
      <input type="number" placeholder="Price/Day" value={itemForm.pricePerDay || ''} onChange={e => setItemForm({ ...itemForm, pricePerDay: e.target.value })} className="w-full p-2 border rounded" />
      <input type="number" placeholder="Advance Amount" value={itemForm.advanceAmount || ''} onChange={e => setItemForm({ ...itemForm, advanceAmount: e.target.value })} className="w-full p-2 border rounded" />
      <input type="number" placeholder="Deposit Amount" value={itemForm.depositeAmount || ''} onChange={e => setItemForm({ ...itemForm, depositeAmount: e.target.value })} className="w-full p-2 border rounded" />
      <select value={itemForm.category || ''} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} className="w-full p-2 border rounded">
        <option value="">Select Category</option>
        {['shoes', 'furniture', 'jewels', 'clothing', 'cameras', 'audio', 'filming', 'photography', 'lighting', 'other'].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input type="file" multiple onChange={e => setItemImages([...e.target.files])} />
      <button type="submit" className="bg-[#D30C7B] text-white px-4 py-2 rounded">
        {editingItemId ? 'Update Item' : 'Create Item'}
      </button>
    </form>

    <h2 className="text-xl font-bold mb-4">My Items</h2>
    {myItems.length === 0 ? (
      <p className="text-gray-500">No items found.</p>
    ) : (
      myItems.map(item => (
        <div key={item._id} className="bg-white p-4 rounded shadow mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <div className="space-x-2">
              <button onClick={() => handleEditItem(item)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
          <p>{item.description}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Available:</strong> {item.available ? 'Yes' : 'No'}</p>
        </div>
      ))
    )}
  </div>
)}





{activeTab === 'requests' && (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">📝 Incoming Rent Requests</h2>

    {loadingRequests ? (
      <p>Loading requests…</p>
    ) : requests.length === 0 ? (
      <p>No pending requests.</p>
    ) : (
      requests.map(({ _id, item, renter, startDate, endDate }) => (
        <div key={_id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
          <div>
            <p><strong>Item:</strong> {item.name}</p>
            <p>
              <strong>Renter:</strong> {renter.name} ({renter.email})
            </p>
            <p>
              <strong>Dates:</strong> {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleRespondRequest(_id, 'approve')}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleRespondRequest(_id, 'reject')}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)}












{activeTab === 'rent-status' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">📦 My Items Rent Status</h2>
          {loadingRentStatus ? (
            <p>Loading rent status...</p>
          ) : rentHistory.length === 0 ? (
            <p>No rent history found for your items.</p>
          ) : (
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Renter</th>
                  <th className="px-4 py-2">Start</th>
                  <th className="px-4 py-2">End</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Paid</th>
                </tr>
              </thead>
              <tbody>
                {rentHistory.map(rent => (
                  <tr key={rent._id} className="border-t">
                    <td className="px-4 py-2">{rent.item?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{rent.renter?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(rent.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(rent.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 capitalize">{rent.status}</td>
                    <td className="px-4 py-2">{rent.paid ? '✅' : '❌'}</td>
                   <td>{rent.status === 'confirmed' && !rent.confirmPickupBySeller && (
  <button
    onClick={() => handleConfirmPickupBySeller(rent._id)}
    className="bg-indigo-600 text-white px-3 py-1 rounded mt-2 hover:bg-indigo-700"
  >
    I Confirm I Gave the Item
  </button>
)}
 {rent.status === 'returned' && (
          <button
            onClick={() => handleCompleteRent(rent._id)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 ml-2"
          >
            Complete Rent
          </button>
        )}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
            
          )}
         

        </div>
      )}











        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div>
            <h2 className="text-xl font-bold mb-4">My Rentals</h2>
            {rentals.length === 0 ? (
              <p className="text-gray-600">No rentals found.</p>
            ) : (
              rentals
                .filter(r => ['in-use', 'completed', 'returned'].includes(r.status))

                .map(r => (
                  <div key={r._id} className="bg-white p-4 rounded shadow mb-4">
                    {r.status === 'in-use' && (
  <button
    onClick={() => handleMarkReturned(r._id)}
    className="bg-yellow-500 text-white px-4 py-1 rounded mt-2 hover:bg-yellow-600"
  >
    Return Item
  </button>
)}

{r.status === 'returned' && (
  <button
    onClick={() => handleCompleteRent(r._id)}
    className="bg-green-600 text-white px-4 py-1 rounded mt-2 hover:bg-green-700"
  >
    Complete Rent
  </button>
)}

                    <p><strong>Item:</strong> {r.itemName}</p>
                    <p><strong>From:</strong> {r.sellerName}</p>
                    <p><strong>Dates:</strong> {r.startDate.slice(0,10)} to {r.endDate.slice(0,10)}</p>
                    <p><strong>Status:</strong> <span className="text-blue-600 font-medium">{r.status}</span></p>
                  </div>
                ))
            )}
          </div>
        )}
{activeTab === 'status' && (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Rent Request Status</h2>

      {/* Dropdown Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 text-sm"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    {/* Filtered Cards */}
    {(statusFilter === 'all' ? rentals : rentals.filter(r => r.status === statusFilter)).length > 0 ? (
      (statusFilter === 'all' ? rentals : rentals.filter(r => r.status === statusFilter)).map((r) => (
        <div
          key={r._id}
          className={`bg-white p-4 rounded-lg shadow mb-4 space-y-1 border-l-4 ${
            r.status === 'approved' ? 'border-green-500' :
            r.status === 'cancelled' ? 'border-red-500' :
            r.status === 'pending' ? 'border-yellow-500' :
            r.status === 'confirmed' ? 'border-blue-500' :
            'border-gray-300'
          }`}
        >
          <p><strong>Item:</strong> {r.itemName}</p>
          <p><strong>Requested:</strong> {r.startDate.slice(0, 10)} to {r.endDate.slice(0, 10)}</p>

          {/* Confirm Pickup (user side) */}
          {r.status === 'confirmed' && !r.confirmPickupByUser && (
            <button
              onClick={() => handleConfirmPickup(r._id)}
              className="bg-blue-600 text-white px-4 py-1 rounded mt-2 hover:bg-blue-700"
            >
              Confirm Pickup
            </button>
          )}

          <p>
            <strong>Request Status:</strong>{' '}
            <span className={`font-semibold ${
              r.status === 'approved'
                ? 'text-green-600'
                : r.status === 'cancelled'
                ? 'text-red-600'
                : r.status === 'pending'
                ? 'text-yellow-600'
                : r.status === 'confirmed'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}>
              {r.status}
            </span>
          </p>

          <p>
            <strong>Payment Status:</strong>{' '}
            <span className={`font-semibold ${
              r.paid ? 'text-green-700' : 'text-red-500'
            }`}>
              {r.paymentStatus === 'completed' ? 'Paid ✅' : 'Not Paid ❌'}
            </span>
          </p>

          {/* Pay Now Button */}
          {r.status === 'approved' && !r.paid && (
            <button
              onClick={() => handleStripePayment(r._id)}
              className="bg-green-600 text-white px-4 py-1 rounded mt-2 hover:bg-green-700"
            >
              Pay Now
            </button>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-600">No {statusFilter} requests found.</p>
    )}
  </div>
)}




        
      </main>
    </div>
    </>
  );
};

export default SellerDashboard;

