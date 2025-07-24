
import React from 'react';
import { toast } from 'react-toastify';

const ItemCard = ({ item, onRentClick, openLoginPopup }) => {
  const handleClick = () => {
    const isLoggedIn = !!localStorage.getItem("auth_token");
    if (!isLoggedIn) {
      toast("Login required to rent ", {
        icon: "🔒",
        style: {
          background: "#FDE7F0",
          color: "#2E2E2E",
          fontWeight: "500",
        },
      });
      setTimeout(() => {
        openLoginPopup(); // Call your modal trigger here
      }, 2500);
      return;
    }
  
    onRentClick();
  };
  

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition h-[380px] flex flex-col">
      <img
        src={item.images && item.images.length > 0 ? item.images[0] : null}
        alt={item.name}
        className="h-48 w-full object-contain bg-white rounded mb-2 flex-shrink-0"
      />
      <h3 className="text-lg font-semibold truncate">{item.name}</h3>
      <p className="text-gray-600 truncate">{item.category}</p>
      <p className="font-bold text-[#D30C7B]">Rs {item.pricePerDay}/day</p>
      <button
        className="mt-auto bg-[#D30C7B] text-white px-4 py-2 rounded w-full"
        onClick={handleClick}
      >
        Rent Now
      </button>
    </div>
  );
};

export default ItemCard;
