import React, { useEffect, useState } from "react";

const PackagesModal = ({ packages, onClose, openLogin, openBecomeSeller }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || null);
  }, []);

  // Handler for "Become a Seller" button click
  const handleBecomeSellerClick = () => {
    if (!role) {
      // Guest: open login first, then BecomeSellerModal
      openLogin(true);
      localStorage.setItem("triggerBecomeSeller", "true");
    } else if (role === "user") {
      // User: open BecomeSellerModal directly
      openBecomeSeller(true);
    }
    // Seller: no button shown, so no handler needed
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#D30C7B] text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-[#D30C7B]">
          Seller Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`border rounded-lg p-5 flex flex-col justify-between shadow-md ${
                pkg.isFeatured
                  ? "border-[#D30C7B] bg-[#fde7f0]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                <p className="text-[#D30C7B] font-bold text-2xl mb-4">
                  {pkg.price === 0 ? "Free" : `$${pkg.price}`}
                </p>
                <ul className="mb-4 text-gray-700 space-y-1">
                  <li>
                    <strong>Duration:</strong> {pkg.duration} days
                  </li>
                  <li>
                    <strong>Item Limit:</strong> {pkg.itemLimit}
                  </li>
                  <li>
                    <strong>Images per Item:</strong> {pkg.imageLimitPerItem}
                  </li>
                  <li>
                    <strong>Support:</strong> {pkg.support}
                  </li>
                </ul>
                <div>
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                    {pkg.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {pkg.isFeatured && (
                <div className="mt-4 text-center text-sm text-[#D30C7B] font-semibold">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Become Seller Button: only for guest or user */}
        {(role === null || role === "user") && (
          <div className="mt-8 text-center">
            <button
              onClick={handleBecomeSellerClick}
              className="bg-[#D30C7B] text-white px-6 py-3 rounded-full hover:bg-[#FF6F61] transition"
            >
              Become a Seller
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesModal;
