import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaCreditCard, FaTruck, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch user profile and orders
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
        setOrders(response.data.orders || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Error fetching profile data');
          console.error(err);
        }
      }
    };

    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="profile-title">My Profile</h1>
        </div>

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        {user ? (
          <>
            {/* User Info Card */}
            <div className="user-card">
              <div className="user-avatar">
                <FaUser className="avatar-icon" />
              </div>
              <div className="user-details">
                <h2 className="user-name">{user.username}</h2>
                <div className="user-meta">
                  <div className="meta-item">
                    <FaEnvelope className="meta-icon" />
                    <span>{user.email}</span>
                  </div>
                  
                </div>
              </div>
            </div>

          

            {/* Orders Section */}
            <div className="orders-section">
              <div className="section-header">
                <FaShoppingBag className="section-icon" />
                <h2>Order History</h2>
              </div>

              {orders.length > 0 ? (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span className="label">Order ID:</span>
                          <span className="value">{order.orderId}</span>
                        </div>
                        <div className="order-total">
                          <span className="label">Total:</span>
                          <span className="value">Rs {order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="order-details">
                        <div className="detail-row">
                          <FaTruck className="detail-icon" />
                          <span>{order.shippingMethod?.name} - Rs {order.shippingMethod?.price}</span>
                        </div>
                        <div className="detail-row">
                          <FaCreditCard className="detail-icon" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="order-books">
                        <h4>Books in this order:</h4>
                        <div className="books-list">
                          {order.books.map((book, index) => (
                            <div key={index} className="book-item">
                              <div className="book-info">
                                <h5>{book.title}</h5>
                                <p className="book-author">{book.authors?.join(', ')}</p>
                                <div className="book-meta">
                                  <span>Qty: {book.quantity}</span>
                                  <span>Rs {book.price}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FaShoppingBag className="empty-icon" />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your order history here!</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
