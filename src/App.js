import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import About from './pages/About';
import Contact from './pages/Contact';
import Land from './pages/Land';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import MyAccount from './pages/MyAccount';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Search from './pages/Search';
import FavoritePage from './pages/FavoritePage';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logoutUser();
      } else {
        const timeout = (decoded.exp - currentTime) * 1000;
        setTimeout(() => {
          logoutUser();
        }, timeout);
      }
    }

    function logoutUser() {
      localStorage.removeItem('token');
      // Optional: show alert
      alert("Session expired. Please login again.");
      window.location.href = '/LoginPage';
    }
  }, []);
  return (
    <Router>
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Land />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/BookList" element={<BookList />}/>
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/CheckoutPage" element={<CheckoutPage />} />
          <Route path="/PaymentPage" element={<PaymentPage />} />
          <Route path="/MyAccount" element={<MyAccount/>} />
          <Route path="/LoginPage" element={<LoginPage/>} />
          <Route path="/ProfilePage" element={<ProfilePage/>} />
        
          <Route path="/Search" element={<Search/>} />
          <Route path="/FavoritePage" element={<FavoritePage/>} />
        
       
          </Routes>
      </div>
    </Router>
  );
}

export default App;
