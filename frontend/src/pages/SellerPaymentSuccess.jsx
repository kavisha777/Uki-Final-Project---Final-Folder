// src/pages/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const SellerPaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        alert('Invalid session. Redirecting...');
        navigate('/');
        return;
      }

      try {
    
        setTimeout(() => {
          navigate('/seller-dashboard');
        }, 2000);

      } catch (err) {
        console.error('Payment verification failed:', err);
        alert('Payment failed or invalid.');
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful! 🎉</h1>
        <p>Redirecting to your seller dashboard...</p>
      </div>
    </div>
  );
};

export default SellerPaymentSuccess;
