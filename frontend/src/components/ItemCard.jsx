import React from 'react';

const ItemCard = ({ item, onClick }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
   <img
  src={item.images && item.images.length > 0 ? item.images[0] : null}
  alt={item.name}
  className="h-40 w-full object-cover rounded mb-2"
/>

    <h3 className="text-lg font-semibold">{item.name}</h3>
    <p className="text-gray-600">{item.category}</p>
    <p className="font-bold text-[#D30C7B]"> Rs {item.pricePerDay}/day</p>
    <button
      className="mt-3 bg-[#D30C7B] text-white px-4 py-2 rounded w-full"
      onClick={onClick}
    >
      Rent Now
    </button>
  </div>
);

export default ItemCard;
