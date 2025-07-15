import React from 'react';
import { useNavigate } from 'react-router-dom';

const IncompleteProfileModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold text-[#D30C7B] mb-3">Complete Your Profile</h2>
        <p className="text-gray-700 mb-4">
          To rent items, please complete your profile with contact number, address, and town.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/user-dashboard');
            }}
            className="px-4 py-2 rounded bg-[#D30C7B] hover:bg-pink-700 text-white"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncompleteProfileModal;
