import React, { useState } from 'react';
import axios from '../utils/axios';
import Toast from './common/Toast';

const SignupPopup = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/signup', { name, email, password });
      setToast({ show: true, message: res.data.message || 'Registered!', type: 'success' });
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
        onClose();            // Close the SignupPopup
        onSwitchToLogin();    // Open the LoginPopup
      }, 2000);
      
    } catch (err) {
      setToast({
        show: true,
        message: err?.response?.data?.message || 'Signup failed',
        type: 'error',
      });
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'error' });
      }, 3000);
    }
  };

  // Password validation function
 
  // Updated password validation: more than 8 chars, must include a letter and a number
  const validatePassword = (pwd) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/.test(pwd);
  };
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      );
    } else {
      setPasswordError('');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Signup Modal */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#2E2E2E80]">
        <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#FDFDFD] shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-[#2E2E2E]">Create Account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validatePassword(password)) {
                  setPasswordError(
                    'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
                  );
                  return;
                }
                setPasswordError('');
                handleSignup(e);
              }}
            >
              <div className="mt-4">
                <label className="block font-semibold text-[#2E2E2E]">Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-[#CBA3D8] focus:outline-none focus:border-[#D30C7B]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3">
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
                  className={`w-full p-3 rounded-lg border ${passwordError ? 'border-red-500' : 'border-[#CBA3D8]'} focus:outline-none focus:border-[#D30C7B]`}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-[#D30C7B] text-white py-3 rounded-lg hover:bg-pink-700"
                disabled={!!passwordError}
              >
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                className="text-[#D30C7B] font-bold hover:underline"
                onClick={onSwitchToLogin}
              >
                Sign in
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
    </>
  );
};

export default SignupPopup;
