import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import { useNavigate } from 'react-router-dom';

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
    <div className="body">
      {error && <p className="error">{error}</p>}

      {user ? (
        <div className="user-info">
          <h2>Welcome, {user.username} To The Book Nook</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}

      <div className="order-list">
        <h2>Your Orders</h2>
        {orders.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Books</th>
                <th>Total</th>
                <th>Shipping Method</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>
                    <ul className="book-list">
                      {order.books.map((book, index) => (
                        <li key={index}>
                          <strong>{book.title}</strong><br />
                          {book.authors?.join(', ')}<br />
                          Quantity: {book.quantity}<br />
                          Price: Rs {book.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>Rs {order.total}</td>
                  <td>{order.shippingMethod?.name} - Rs {order.shippingMethod?.price}</td>
                  <td>{order.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders placed yet.</p>
        )}
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
