

import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const BecomeSellerModal = ({ onClose }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [idProof, setIdProof] = useState(null);

  useEffect(() => {
    axios.get('/packages/')
      .then(res => setPackages(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedPackage) {
      alert('Please select a package.');
      return;
    }
  
    try {
      // Step 1: Create Stripe checkout session
      const res = await axios.post('/payment/create-checkout-session', {
        packageId: selectedPackage
      });
  
      // Step 2: Redirect to Stripe
      window.location.href = res.data.url;
  
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong during payment. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-[#00000080] z-[9999] flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-2xl rounded-lg shadow relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-2 right-4 text-xl" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Become a Seller</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
  <label className="font-semibold block mb-1">Select a Package</label>
  <select
    className="w-full border rounded p-2"
    value={selectedPackage}
    onChange={(e) => setSelectedPackage(e.target.value)}
    required
  >
    <option value="">-- Select a Package --</option>
    {packages.map(pkg => (
      <option key={pkg._id} value={pkg._id}>
        {pkg.name} — ₹{pkg.price} / {pkg.duration} days
      </option>
    ))}
  </select>
</div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Contact Number</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Address</label>
            <textarea
              className="w-full border rounded p-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-1">Upload ID Proof</label>
            <input
              type="file"
              onChange={(e) => setIdProof(e.target.files[0])}
              required
              accept="image/*,application/pdf"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#D30C7B] text-white py-2 rounded hover:bg-pink-700 transition"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSellerModal;
