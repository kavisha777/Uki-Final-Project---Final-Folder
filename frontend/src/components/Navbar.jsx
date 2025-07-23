import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ onLogin, onSignup,profile }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();


  const [profileImage, setProfileImage] = useState(null);
const [showDropdown, setShowDropdown] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user?.role) {
      setIsLoggedIn(true);
      setRole(user.role);
      setProfileImage(user.profilePic || null);
      // assumes user.profileImage is a URL

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
    setProfileImage(null); // clear image
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


  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (profile?.profilePic) {
      setProfileImage(profile.profilePic);
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      setProfileImage(user?.profilePic || null);  // ✅ Corrected
    }
  }, [profile]);
  
  
  
  
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
<button
  onClick={() => navigate('/contact')}
  className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
>
  Contact
</button>

          {!isLoggedIn ? (
            <>
              <button onClick={onLogin} className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition">
                Sign in
              </button>
              
              <button className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
  onClick={() => {
    onLogin();
    localStorage.setItem('wantsToBecomeSeller', 'true');
  }}
>
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

<div className="relative">
<img
  src={profileImage || "/default-user.png"}
  alt="profile"
  onClick={(e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }}
  className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#D30C7B]"
/>

{showDropdown && (
  <div
    className="absolute right-0 mt-2 bg-white shadow-lg border rounded z-50"
    onClick={(e) => e.stopPropagation()}
  >

      <button
        onClick={() => {
          handleProfileClick();
          setShowDropdown(false);
        }}
        className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          handleLogout();
          setShowDropdown(false);
        }}
        className="border-[#D30C7B] text-[#D30C7B] px-6 py-3 rounded-full hover:bg-[#D30C7B] hover:text-white transition"
      >
        Logout
      </button>
    </div>
  )}
</div>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
