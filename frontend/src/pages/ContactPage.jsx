import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [feedback, setFeedback] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return toast.error('Please write your message.');
    
    try {
      await axios.post('/feedback', { userId,message: feedback });
      toast.success('Thanks for your feedback!');
      setFeedback('');
    } catch (err) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#FDFDFD] px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-[#FDE7F0]">
          <h2 className="text-4xl font-bold text-center text-[#D30C7B] mb-6">Contact Us</h2>
          
          <div className="text-gray-800 space-y-4 text-center text-lg">
            <p><strong>App Name:</strong> ROLO – Rent Anything, Anytime</p>
            <p><strong>Email:</strong> <a href="mailto:support@rolo.com" className="text-[#D30C7B] hover:underline">support@rolo.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+94771234567" className="text-[#D30C7B] hover:underline">+94 77 123 4567</a></p>
            <p><strong>Address:</strong> No. 42, Nelliady, Jaffna, Sri Lanka</p>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Follow Us</h3>
            <div className="flex justify-center space-x-6 text-[#D30C7B] text-2xl">
              <a href="https://instagram.com/your_rolo" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6F61] transition">
                <FaInstagram />
              </a>
              <a href="https://facebook.com/your_rolo" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6F61] transition">
                <FaFacebook />
              </a>
              {/* <a href="https://linkedin.com/company/rolo" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6F61] transition">
                <FaLinkedin />
              </a> */}
            </div>
          </div>

          {/* 🔥 Feedback Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-[#D30C7B] mb-4">
              Want to tell us something?
            </h3>
            <p className="text-center text-gray-600 mb-4">
              We’re always listening — share your thoughts or suggestions!
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your message here..."
                rows="5"
                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30C7B]"
                required
              ></textarea>
              <button
                type="submit"
                className="block mx-auto bg-[#D30C7B] text-white px-6 py-3 rounded-full hover:bg-[#b20a6a] transition"
              >
                Send Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
