import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import '../assets/custom-datepicker.css'; 
import { useNavigate } from 'react-router-dom';

const ItemRentModal = ({ item, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const navigate = useNavigate();

  


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
  
      const role = localStorage.getItem('role'); // 👈 Get user role
  
      setTimeout(() => {
        if (role === 'seller') {
          navigate('/seller-dashboard?tab=status&filter=pending'); // 👈 Seller goes here
        } else {
          navigate('/user-dashboard?tab=status&filter=pending');   // 👈 Normal user goes here
        }
      }, 1000);
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
