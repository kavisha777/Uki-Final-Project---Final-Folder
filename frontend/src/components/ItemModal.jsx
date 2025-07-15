// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import IncompleteProfileModal from './IncompleteProfileModal';
// import axios from '../utils/axios';
// import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-toastify';

// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const ItemModal = ({ item, onClose }) => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [message, setMessage] = useState('');
//   const [showIncompleteModal, setShowIncompleteModal] = useState(false);
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     if (!user?.contactNumber || !user?.address || !user?.town) {
//       setShowIncompleteModal(true);
//     }
//   }, [user]);

//   const handleRent = async () => {
//     try {
//       const token = localStorage.getItem('auth_token');
//       if (!token) return alert('Please login first');

//       await axios.post('/rent', {
//         itemId: item._id,
//         startDate,
//         endDate,
//       });
//       toast.success('Rent request sent successfully!');
//       navigate('/user-dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to request rent');
//     }
//   };

//   if (!item) return null;

//   return (
//     <>
//       {showIncompleteModal && (
//         <IncompleteProfileModal onClose={() => {
//           setShowIncompleteModal(false);
//           onClose(); // optional: close item modal too
//         }} />
//       )}

//       <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//         <div className="bg-white rounded p-6 w-full max-w-md relative">
//           <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>✖</button>
//           <h2 className="text-xl font-bold mb-2">{item.name}</h2>
//           <img
//   src={item.images && item.images[0] ? item.images[0] : '/fallback.jpg'}
//   alt={item.name}
//   className="h-48 w-full object-cover rounded mb-3"
// />


//           <p>{item.description}</p>
//           <p className="font-semibold">{item.pricePerDay}/day</p>
//           <p className="text-sm text-gray-500">Advance: {item.advanceAmount}</p>

//           <div className="my-4 space-y-2">
//             <input
//               type="date"
//               className="border p-2 w-full rounded"
//               value={startDate}
//               onChange={e => setStartDate(e.target.value)}
//             />
//             <input
//               type="date"
//               className="border p-2 w-full rounded"
//               value={endDate}
//               onChange={e => setEndDate(e.target.value)}
//             />
//           </div>

//           {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

//           <button
//             onClick={handleRent}
//             className="bg-[#D30C7B] text-white px-4 py-2 rounded w-full"
//           >
//             Rent Now
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ItemModal;


import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../assets/custom-datepicker.css'; 

const ItemRentModal = ({ item, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableRanges, setUnavailableRanges] = useState([]);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const res = await axios.get(`/rent/${item._id}/unavailable`);
        const blocked = res.data.unavailableDates.map(range => ({
          start: new Date(range.start),
          end: new Date(range.end),
        }));
        setUnavailableRanges(blocked);
      } catch (err) {
        console.error("Failed to fetch unavailable dates", err);
      }
    };

    if (item?._id) fetchUnavailableDates();
  }, [item]);

  const handleRentSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range.");
      return;
    }

    try {
      const res = await axios.post('/rent/', {
        itemId: item._id,
        startDate,
        endDate,
      });

      toast.success("Rent request submitted!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rent request failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Rent: {item.name}</h2>

        <DatePicker
          selected={startDate}
          onChange={([start, end]) => {
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          minDate={new Date()}
          excludeDateIntervals={unavailableRanges}
          inline
        />

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#D30C7B] text-white px-4 py-2 rounded"
            onClick={handleRentSubmit}
          >
            Confirm Rent
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemRentModal;
