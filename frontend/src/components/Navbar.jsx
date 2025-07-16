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
  className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
>
  Home
</button>

<button
  onClick={handleAboutUsClick}
  className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
>
  About Us
</button>

          {!isLoggedIn ? (
            <>
              <button onClick={onLogin} className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition">
                Sign in
              </button>
              <button onClick={onSignup} className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition">
                Sign up 
              </button>
              <button onClick={onLogin} className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition">
                Become a Seller
              </button>
            </>
          ) : (
            <>
              {/* Show Become Seller only for "user" role */}
              {role === 'user' && (
                <button
                  onClick={() => window.dispatchEvent(new Event('openBecomeSeller'))}
                  className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
                >
                  Become a Seller
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
                className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
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
