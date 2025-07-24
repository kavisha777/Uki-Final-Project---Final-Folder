import React from 'react';

const RentalCard = ({
  item,
  isRentalView = false,
  showStatus = false,
  actions = null,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* Image */}
      {item.images?.[0] || item.itemImage ? (
        <img
          src={item.images?.[0] || item.itemImage}
          alt={item.name || item.itemName}
          className="w-full h-40 object-contain rounded-lg mb-2"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold truncate">{item.name || item.itemName}</h3>

      {/* Optional Description */}
      {item.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      )}

      {/* Category + Availability */}
      {item.category && (
        <p className="text-sm mt-1"><strong>Category:</strong> {item.category}</p>
      )}
      {item.available !== undefined && (
        <p className="text-sm"><strong>Available:</strong> {item.available ? 'Yes' : 'No'}</p>
      )}

      {/* Rental-Specific Info */}
      {isRentalView && (
        <div className="mt-1 text-sm text-gray-600 space-y-1">
          <p><strong>Owner:</strong> {item.sellerName}</p>
          <p><strong>Dates:</strong> {item.startDate?.slice(0,10)} to {item.endDate?.slice(0,10)}</p>
          {showStatus && (
            <>
              <p><strong>Status:</strong> <span className="capitalize text-blue-600 font-medium">{item.status}</span></p>
              <p><strong>Payment:</strong> 
                <span className={`ml-1 font-semibold ${item.paymentStatus === 'completed' ? 'text-green-700' : 'text-red-500'}`}>
                  {item.paymentStatus === 'completed' ? 'Paid ✅' : 'Not Paid ❌'}
                </span>
              </p>
            </>
          )}
        </div>
      )}

      {/* Optional Action Buttons */}
      {actions && (
        <div className="flex flex-col gap-2 mt-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default RentalCard;
