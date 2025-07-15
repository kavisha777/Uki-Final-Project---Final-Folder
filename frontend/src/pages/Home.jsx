import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginPopup from '../components/LoginPopup';
import SignupPopup from '../components/SignupPopup';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import BecomeSellerModal from '../components/BecomesellerPopup';
import {
  Store, Send, Truck,
  UserPlus, Upload, Wallet,
  PackageCheck, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTab, setSelectedTab] = useState("renter");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showBecomeSeller, setShowBecomeSeller] = useState(false);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Check current role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role) setRole(user.role);
  }, []);

  // Listen for seller trigger events
  useEffect(() => {
    const handleBecomeSellerRequest = () => {
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user?.role === 'user') {
        setShowBecomeSeller(true);
      } else {
        localStorage.setItem('triggerBecomeSeller', 'true');
        setShowLogin(true);
      }
    };

    const handlePostAuth = () => {
      const pending = localStorage.getItem('triggerBecomeSeller');
      const user = JSON.parse(localStorage.getItem('user'));
      if (pending === 'true' && user?.role === 'user') {
        localStorage.removeItem('triggerBecomeSeller');
        setShowBecomeSeller(true);
      }
    };

    window.addEventListener('openBecomeSeller', handleBecomeSellerRequest);
    window.addEventListener('authChanged', handlePostAuth);

    return () => {
      window.removeEventListener('openBecomeSeller', handleBecomeSellerRequest);
      window.removeEventListener('authChanged', handlePostAuth);
    };
  }, []);

  useEffect(() => {
    axios.get('/items')
      .then(res => setFeaturedItems(res.data.slice(0, 3)))
      .catch(err => console.error("Error fetching featured items:", err));
  }, []);

  const howItWorks = {
    renter: [
      { title: "Browse Items", icon: Store },
      { title: "Send Rent Request", icon: Send },
      { title: "Pickup or Delivery", icon: Truck },
    ],
    seller: [
      { title: "Become a Seller", icon: UserPlus },
      { title: "List Your Items", icon: Upload },
      { title: "Earn Through Rentals", icon: Wallet },
    ],
  };

  const sellerSteps = [
    { title: "Choose a Package", icon: PackageCheck },
    { title: "Upload Your Items", icon: Upload },
    { title: "Start Earning", icon: DollarSign },
  ];

  return (
    <div className="bg-[#FDFDFD] text-[#2E2E2E] min-h-screen">
      <Navbar onLogin={() => setShowLogin(true)} onSignup={() => setShowSignup(true)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#fde7f0] to-white text-[#2E2E2E]">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Rent Anything, Anytime, <span className="text-[#D30C7B]">Effortlessly.</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              From gadgets to gear, find what you need or earn from what you own — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/items')}
                className="border border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
              >
                Explore Items
              </button>

              {/* Only show for guests or users */}
              {(role === 'user' || !role) && (
                <button
                  onClick={() => window.dispatchEvent(new Event('openBecomeSeller'))}
                  className="border border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
                >
                  Become a Seller
                </button>
              )}
            </div>
          </div>

          <div className="max-w-md md:max-w-lg drop-shadow-xl">
            <img src="/assets/images/heroimage.png" alt="Hero" className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6">How ROLO Works</h2>
        <div className="flex justify-center mb-8">
          {["renter", "seller"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 ${selectedTab === tab ? 'bg-[#D30C7B] text-white' : 'border border-[#D30C7B] text-[#D30C7B]'} ${tab === 'renter' ? 'rounded-l-full' : 'rounded-r-full'}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === "renter" ? "For Renters" : "For Sellers"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {howItWorks[selectedTab].map((step, idx) => (
            <div key={idx} className="bg-[#FFF4F8] p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
              <step.icon className="h-12 w-12 text-[#D30C7B] mb-4" />
              <h3 className="text-xl font-semibold">{step.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredItems.map(item => (
            <ItemCard key={item._id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/items')}
            className="text-[#D30C7B] underline font-medium"
          >
            View All Items →
          </button>
        </div>
      </section>

      {/* Become Seller Steps */}
      <section className="bg-[#FFF4F8] py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Become a ROLO Seller</h2>
        <p className="mb-8 text-[#2E2E2E]">Got items just lying around? Turn them into income in 3 simple steps!</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 mb-8">
          {sellerSteps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
              <step.icon className="h-10 w-10 text-[#D30C7B] mb-3" />
              <h4 className="text-lg font-semibold">{step.title}</h4>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/packages')}
          className="text-[#D30C7B] underline font-medium"
        >
          View Seller Packages →
        </button>
      </section>

      {/* Final CTA */}
      <section className="bg-[#D30C7B] text-[#FFF4F8] text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Start Renting or Earning with ROLO Now!</h2>
        <button onClick={() => setShowSignup(true)} className="bg-white text-[#D30C7B] px-6 py-2 rounded hover:bg-[#FDE7F0]">Create an Account</button>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E2E2E] text-white py-8 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">&copy; {new Date().getFullYear()} ROLO. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-300">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>

      {/* Popups */}
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}
      {showSignup && (
        <SignupPopup
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
      {showBecomeSeller && (
        <BecomeSellerModal onClose={() => setShowBecomeSeller(false)} />
      )}
    </div>
  );
};

export default Home;
