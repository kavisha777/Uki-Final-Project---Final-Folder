import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; 


const LoginPopup = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { user, token } = res.data;


      if (user.id && !user._id) {
      user._id = user.id;
    }

    
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Login successful! Redirecting...');
      onClose();
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Login failed');
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#2E2E2E80]">
  <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
    <div className="w-full max-w-md p-6 rounded-2xl bg-[#FDFDFD] shadow-lg relative">
        <h2 className="text-2xl font-bold text-center text-[#2E2E2E]">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <label className="block font-semibold text-[#2E2E2E]">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg border border-[#CBA3D8] focus:outline-none focus:border-[#D30C7B]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-3">
            <label className="block font-semibold text-[#2E2E2E]">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-[#CBA3D8] focus:outline-none focus:border-[#D30C7B]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

          <button
            type="submit"
            className="mt-4 w-full bg-[#D30C7B] text-white py-3 rounded-lg hover:bg-pink-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <button className="text-[#D30C7B] font-bold hover:underline" onClick={onSwitchToSignup}>
            Create one
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#2E2E2E] text-xl font-bold hover:text-[#D30C7B]"
        >
          ×
        </button>
      </div>
      </div>
    </div>
  );
};

export default LoginPopup;
