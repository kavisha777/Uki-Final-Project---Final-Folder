import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { User, History, Hourglass, LogOut } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // adjust path if needed


const UserDashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [rentalViewFilter, setRentalViewFilter] = useState('all');
  const initialStatus = searchParams.get('filter');

  const [rentals, setRentals] = useState([]);
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);


  const [statusFilter, setStatusFilter] = useState('pending');
const filteredRentals = rentals.filter(r => r.status === statusFilter);



const fetchRentals = async () => {
  try {
    const res = await axios.get('/rent/my-rentals');
    console.log("✅ Raw rentals from backend:", res.data);

    const rentalsWithPaid = res.data.map(r => {
      console.log(`Rent ${r._id} paymentStatus:`, r.paymentStatus);
      return {
        ...r,
        paid: r.paymentStatus === 'completed',
      };
    });

    setRentals(rentalsWithPaid);
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



  

  
  
  const handleConfirmPickup = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/pickup`);
      
      // ✅ Show success toast based on backend message
      toast.success('Pickup confirmed. Please wait for seller confirmation.');
  
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
      toast.success(res.data.message);
      fetchRentals();
    } catch (err) {
      toast.error("Return failed: " + err.response?.data?.message);
    }
  };
  
  const handleCompleteRent = async (rentId) => {
    try {
      const res = await axios.patch(`/rent/${rentId}/complete`);
      alert(res.data.message);
      fetchRentals();
    } catch (err) {
      alert("Complete failed: " + err.response?.data?.message);
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
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    window.location.href = '/'; // or use `navigate('/')` from react-router-dom
  };
// Existing useEffect watching activeTab
useEffect(() => {
  if (activeTab === 'profile') fetchProfile();
  if (activeTab === 'rentals' || activeTab === 'status') fetchRentals();
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
          { key: 'rentals', label: 'History', icon: <History size={18} /> },
          { key: 'status', label: 'Rent Status', icon: <Hourglass size={18} /> },
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

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-2 text-[#E53935] hover:bg-[#E53935]/10 rounded"
        >
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

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">My Rentals</h2>
      <div className="flex flex-wrap gap-2">
        {['all', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setRentalViewFilter(status)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              rentalViewFilter === status
                ? 'bg-[#D30C7B] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-[#D30C7B]/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {rentals.filter(r =>
      rentalViewFilter === 'all' ? ['completed', 'cancelled'].includes(r.status)
        : r.status === rentalViewFilter
    ).length === 0 ? (
      <p className="text-gray-600">No rentals found.</p>
    ) : (
      rentals
        .filter(r =>
          rentalViewFilter === 'all' ? ['completed', 'cancelled'].includes(r.status)
            : r.status === rentalViewFilter
        )
        .map(r => (
          <div
            key={r._id}
            className={`p-4 rounded-lg shadow-md mb-4 border-l-4 ${
              r.status === 'completed'
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-4">
              {r.itemImage ? (
                <img
                  src={r.itemImage}
                  alt={r.itemName}
                  className="w-20 h-20 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{r.itemName}</h3>
                <p className="text-sm text-gray-700"><strong>From:</strong> {r.sellerName}</p>
                <p className="text-sm text-gray-700"><strong>Dates:</strong> {r.startDate.slice(0,10)} to {r.endDate.slice(0,10)}</p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  r.status === 'completed' ? 'text-green-700' : 'text-red-600'
                }`}>
                  {r.status === 'completed' ? 'Completed ✅' : 'Cancelled ❌'}
                </p>
              </div>
            </div>
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
      <div className="flex flex-wrap gap-2">
  {['all', 'pending', 'approved', 'confirmed','in-use'].map((status) => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-1 rounded-full text-sm font-medium transition ${
        statusFilter === status
          ? 'bg-[#D30C7B] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-[#D30C7B]/10'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}
</div>

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
          
          <div className="flex items-center gap-4">
  {r.itemImage ? (
    <img
      src={r.itemImage}
      alt={r.itemName}
      className="w-20 h-20 rounded-lg object-cover border"
    />
  ) : (
    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
      No Image
    </div>
  )}
  <div>
    <p><strong>Item:</strong> {r.itemName}</p>
    <p><strong>Requested:</strong> {r.startDate.slice(0, 10)} to {r.endDate.slice(0, 10)}</p>
    <p><strong>Owner:</strong>{r.sellerName}</p>
    {/* <p><strong>Owner Town:</strong>{profile.address}</p> */}
  </div>
</div>

         
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
    r.paymentStatus === 'completed' ? 'text-green-700' : 'text-red-500'
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
           {/* Confirm Pickup (user side) */}
           {r.status === 'confirmed' && !r.confirmPickupByUser && (
            <button
              onClick={() => handleConfirmPickup(r._id)}
              className="bg-blue-600 text-white px-4 py-1 rounded mt-2 hover:bg-blue-700"
            >
              Item Received
            </button>
          )}
       
       {r.status === 'in-use' && (
  <button
    onClick={() => handleMarkReturned(r._id)}
    className="bg-yellow-500 text-white px-4 py-1 rounded mt-2 hover:bg-yellow-600"
  >
    Return Item
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

export default UserDashboard;

