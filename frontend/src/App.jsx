import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import RentPaymentSuccess from './pages/RentPaymentSuccess.jsx';
import SellerPaymentSuccess from './pages/SellerPaymentSuccess.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactPage from './pages/ContactPage.jsx';




function App() {
  return (
    <>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
    <Routes>
  

      <Route path="/" element={<Home />} />
      
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/rent-success" element={<RentPaymentSuccess />} />
      <Route path="/seller-success" element={<SellerPaymentSuccess />} />
      <Route path="/contact" element={<ContactPage />} />
      
      

     
    </Routes>
    </>
  );
}

export default App;
