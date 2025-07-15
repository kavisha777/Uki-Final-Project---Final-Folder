// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [rents, setRents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', pricePerDay: '', available: true, owner: '', images: [] });
  const [imagePreview, setImagePreview] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const res = await axios.get('/admin/users');
    setUsers(res.data);
    setSellers(res.data.filter((u) => u.role === 'seller'));
    setLoading(false);
  };

  const fetchItems = async () => {
    setLoading(true);
    const res = await axios.get('/items');
    setItems(res.data);
    setLoading(false);
  };

  const fetchRents = async () => {
    setLoading(true);
    const res = await axios.get('/rent/all'); // or '/api/rent/all'
    setRents(res.data);
    setLoading(false);
  };
  

  const fetchPayments = async () => {
    setLoading(true);
    const res = await axios.get('/admin/payments');
    setPayments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'items') fetchItems();
    else if (activeTab === 'rents') fetchRents();
    else if (activeTab === 'payments') fetchPayments();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    }
  };

  const handleRevokeSeller = async (id) => {
    await axios.put(`/admin/revoke-seller/${id}`);
    toast.success('Seller revoked');
    fetchUsers();
  };

  const handleDeleteItem = async (id) => {
    if (confirm('Delete this item?')) {
      await axios.delete(`/items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    }
  };

  const handleUserUpdate = async () => {
    const payload = {
      name: editUser.name,
      email: editUser.email,
      contact: editUser.contactNumber,
      address: editUser.address,
      town: editUser.town,
      role: editUser.role,
    };
  
    try {
      await axios.put(`/admin/users/${editUser._id}`, payload);
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
      toast.error('Failed to update user');
    }
  };
  

  const handleItemUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editItem.name);
      formData.append('description', editItem.description || '');
      formData.append('pricePerDay', Number(editItem.pricePerDay));
      formData.append('advanceAmount', Number(editItem.advanceAmount));
      formData.append('depositeAmount', Number(editItem.depositeAmount));
      formData.append('category', editItem.category);
      formData.append('available', editItem.available === true || editItem.available === 'true');
  
      if (editItem.owner) {
        formData.append('owner', editItem.owner);
      }
  
      if (
        editItem.images &&
        editItem.images.length > 0 &&
        editItem.images[0] instanceof File
      ) {
        formData.append('images', editItem.images[0]);
      }
      
      let res;
      if (editItem._id) {
        res = await axios.put(`/items/${editItem._id}`, formData);
        toast.success('Item updated');
      } else {
        res = await axios.post('/items', formData);
        toast.success('Item created');
      }
  
      setEditItem(null);
      fetchItems();
    } catch (err) {
      console.error('❌ Update failed:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error updating item');
    }
  };
  
  const renderStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-cyan-100 text-cyan-800',
      paid: 'bg-green-100 text-green-800',
      'in-use': 'bg-purple-100 text-purple-800',
      returned: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-200 text-green-900',
      cancelled: 'bg-gray-100 text-gray-600',
      rejected: 'bg-red-100 text-red-800'
    };
  
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-200 text-gray-700'}`}>
        {status}
      </span>
    );
  };
  
  const renderTableHeader = (headers) => (
    <thead className="bg-[#FDE7F0] text-left">
      <tr>
        {headers.map((header, i) => (
          <th key={i} className="px-4 py-2 text-sm font-semibold text-gray-700">{header}</th>
        ))}
      </tr>
    </thead>
  );

  const renderCell = (value) => (
    <td className="px-4 py-2 text-sm text-gray-800">{value || '-'}</td>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF7FA]">
      <aside className="w-64 bg-[#FDE7F0] p-6 text-[#2E2E2E]">
        <h2 className="text-xl font-bold mb-6 text-[#D30C7B]">Admin Panel</h2>
        <ul className="space-y-4">
          <li><button onClick={() => setActiveTab('users')} className={`block w-full text-left ${activeTab === 'users' ? 'font-bold' : ''}`}>User Management</button></li>
          <li><button onClick={() => setActiveTab('items')} className={`block w-full text-left ${activeTab === 'items' ? 'font-bold' : ''}`}>Item Management</button></li>
          <li><button onClick={() => setActiveTab('rents')} className={`block w-full text-left ${activeTab === 'rents' ? 'font-bold' : ''}`}>Rent Management</button></li>
          <li><button onClick={() => setActiveTab('payments')} className={`block w-full text-left ${activeTab === 'payments' ? 'font-bold' : ''}`}>Payment Management</button></li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {activeTab === 'users' && (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full divide-y divide-gray-200">
              {renderTableHeader(['Name', 'Email', 'Role', 'Phone', 'Address', 'Town', 'Actions'])}
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-pink-50">
                    {renderCell(u.name)}
                    {renderCell(u.email)}
                    {renderCell(u.role)}
                    {renderCell(u.contactNumber)}
                    {renderCell(u.address)}
                    {renderCell(u.town)}
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => setEditUser({ ...u })} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Edit</button>
                      {u.role === 'seller' && <button onClick={() => handleRevokeSeller(u._id)} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs">Revoke</button>}
                      <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
{editUser && (
  <div className="mt-4 p-4 bg-white rounded shadow">
    <h3 className="text-lg font-bold mb-2">Edit User</h3>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Name"
        value={editUser.name}
        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
      />
      <input
        type="email"
        className="border p-2 rounded"
        placeholder="Email"
        value={editUser.email}
        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
      />
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Phone"
        value={editUser.contactNumber || ''}
        onChange={(e) => setEditUser({ ...editUser, contactNumber: e.target.value })}
      />
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Address"
        value={editUser.address || ''}
        onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
      />
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Town"
        value={editUser.town || ''}
        onChange={(e) => setEditUser({ ...editUser, town: e.target.value })}
      />
      <select
        className="border p-2 rounded"
        value={editUser.role}
        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div className="mt-4 space-x-2">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleUserUpdate}
      >
        Update User
      </button>
      <button
        className="bg-gray-300 px-4 py-2 rounded"
        onClick={() => setEditUser(null)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

{activeTab === 'items' && (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">All Items</h2>
      <button
        onClick={() =>
          setEditItem({
            name: '',
            description: '',
            pricePerDay: '',
            advanceAmount: '',
            depositeAmount: '',
            category: '',
            available: true,
            owner: '', 
            images: [],
          })
        }
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add Item
      </button>
    </div>

    <table className="w-full bg-white shadow rounded">
      <thead>
        <tr className="bg-[#FDE7F0] text-left">
          <th>Name</th>
          <th>Owner</th>
          <th>Price/Day</th>
          <th>Advance</th>
          <th>Deposit</th>
          <th>Category</th>
          <th>Available</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-t">
            <td>{item.name}</td>
            <td>{item.owner?.name}</td>
            <td>₹{item.pricePerDay}</td>
            <td>₹{item.advanceAmount}</td>
            <td>₹{item.depositeAmount}</td>
            <td>{item.category}</td>
            <td>{item.available ? 'Yes' : 'No'}</td>
            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            <td>
              <button
                onClick={() => setEditItem({ ...item })}
                className="text-sm bg-blue-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{editItem && (
  <div className="mt-4 p-4 bg-white rounded shadow">
    <h3 className="text-lg font-bold mb-2">
  {editItem._id ? 'Edit Item' : 'Add New Item'}
</h3>

    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Item Name"
        value={editItem.name}
        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
      />
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Price/Day"
        value={editItem.pricePerDay}
        onChange={(e) => setEditItem({ ...editItem, pricePerDay: e.target.value })}
      />
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Advance Amount"
        value={editItem.advanceAmount || ''}
        onChange={(e) => setEditItem({ ...editItem, advanceAmount: e.target.value })}
      />
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Deposit Amount"
        value={editItem.depositeAmount || ''}
        onChange={(e) => setEditItem({ ...editItem, depositeAmount: e.target.value })}
      />
      <select
        className="border p-2 rounded"
        value={editItem.category}
        onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option value="shoes">Shoes</option>
        <option value="furniture">Furniture</option>
        <option value="accessories">Accessories</option>
        <option value="clothing">Clothing</option>
        <option value="cameras">Cameras</option>
        <option value="audio">Audio</option>
        <option value="filming">Filming</option>
        <option value="photography">Photography</option>
        <option value="lighting">Lighting</option>
        <option value="other">Other</option>
      </select>
      <select
  className="border p-2 rounded"
  value={editItem.owner || ''}
  onChange={(e) => setEditItem({ ...editItem, owner: e.target.value })}
>
  <option value="">Select Seller</option>
  {sellers.map((seller) => (
    <option key={seller._id} value={seller._id}>
      {seller.name} ({seller.email})
    </option>
  ))}
</select>

      <select
        className="border p-2 rounded"
        value={editItem.available}
        onChange={(e) =>
          setEditItem({ ...editItem, available: e.target.value === 'true' })
        }
      >
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </select>

      <input
        type="file"
        accept="image/*"
        className="border p-2 rounded col-span-2"
        onChange={(e) => setEditItem({ ...editItem, images: e.target.files })}
      />
    </div>

    <div className="mt-4 space-x-2">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleItemUpdate}
      >
        Update Item
      </button>
      <button
        className="bg-gray-300 px-4 py-2 rounded"
        onClick={() => setEditItem(null)}
      >
        Cancel
      </button>
    </div>
  </div>
)}


{activeTab === 'rents' && (
  <div>
    <h2 className="text-2xl font-bold mb-4">All Rent Records</h2>
    <table className="w-full bg-white shadow rounded">
    <thead>
  <tr className="bg-[#FDE7F0] text-left">
    <th>Item</th>
    <th>Renter</th>
    <th>Amount</th>
    <th>Status</th>
    <th>Start - End</th>
  </tr>
</thead>
<tbody>
  {rents.map((r) => (
    <tr key={r._id} className="border-t">
      <td>
        <div className="font-semibold">{r.item?.name}</div>
        <div className="text-xs text-gray-500">Owner: {r.item?.owner?.name || 'Unknown'}</div>
      </td>
      <td>
        <div className="font-semibold">{r.renter?.name}</div>
        <div className="text-xs text-gray-500">{r.renter?.email}</div>
      </td>
      <td>
        {r.paymentDetails?.amount ? `₹${r.paymentDetails.amount}` : '-'}
      </td>
      <td>{renderStatusBadge(r.status)}</td>
      <td>{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>
    </table>
  </div>
)}

{activeTab === 'payments' && (
  <div>
    <h2 className="text-2xl font-bold mb-4">All Payments</h2>
    <table className="w-full bg-white shadow rounded">
      <thead><tr className="bg-[#FDE7F0] text-left"><th>User</th><th>Amount</th><th>Item</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p._id} className="border-t">
            <td>{p.user?.name}</td>
            <td>₹{p.amount}</td>
            <td>{p.item?.name}</td>
            <td>{p.status}</td>
            <td>{new Date(p.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
 </main>
    </div>
  );
};

export default AdminDashboard;









