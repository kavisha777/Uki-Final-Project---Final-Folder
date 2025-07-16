import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ onLogin, onSignup }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user?.role) {
      setIsLoggedIn(true);
      setRole(user.role);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/');
    window.dispatchEvent(new Event('authChanged'));
  };

  const handleProfileClick = () => {
    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'seller') navigate('/seller-dashboard');
    else navigate('/user-dashboard');
  };


  const handleAboutUsClick = () => {
    if (window.location.pathname !== '/') {
      // Navigate home first, then scroll after load
      localStorage.setItem('scrollToAbout', 'true');
      navigate('/');
    } else {
      const section = document.getElementById('how-it-works');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-[#FDE7F0] shadow">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
          <span className="text-2xl font-bold text-[#D30C7B]">ROLO</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
        <button
  onClick={() => navigate('/')}
  className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition"
>
  Home
</button>

<button
  onClick={handleAboutUsClick}
  className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition"
>
  About Us
</button>

          {!isLoggedIn ? (
            <>
              <button onClick={onLogin} className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition">
                Sign in
              </button>
              <button onClick={onSignup} className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition">
                Sign up as a Customer
              </button>
              <button onClick={onLogin} className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition">
                Signup as a Seller
              </button>
            </>
          ) : (
            <>
              {/* Show Become Seller only for "user" role */}
              {role === 'user' && (
                <button
                  onClick={() => window.dispatchEvent(new Event('openBecomeSeller'))}
                  className="text-[#D30C7B] font-medium hover:text-white hover:bg-[#D30C7B] px-4 py-1 rounded transition"
                >
                  Signup as a Seller
                </button>
              )}

              <button
                onClick={handleProfileClick}
                className="text-xl hover:text-[#FF6F61]"
              >
                👤
              </button>
              <button
                onClick={handleLogout}
                className="text-[#FF6F61] border border-[#FF6F61] px-4 py-1 rounded-full hover:bg-[#FF6F61] hover:text-white transition flex items-center gap-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
