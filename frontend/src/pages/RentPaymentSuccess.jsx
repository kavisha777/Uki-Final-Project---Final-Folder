import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RentPaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
  
    if (!sessionId) return navigate('/');
  
    // ✅ You can show a toast or animation here
  
    setTimeout(() => {
      // 👇 This will force re-fetch of data in the dashboard (optional: add reload param)
      navigate('/user-dashboard?tab=status&refresh=true');
    }, 2000);
  }, []);
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful!</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default RentPaymentSuccess;
