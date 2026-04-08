import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './cart.css';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { showError } from '../utils/notification';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart items:', error.response?.data || error.message);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (index, amount) => {
    const updated = [...cartItems];
    const item = updated[index];
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/item/${item._id}`, 
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // If success, update state locally
      updated[index].quantity = newQuantity;
      setCartItems(updated);
    } catch (error) {
      console.error("Failed to update quantity:", error.response?.data || error.message);
      showError("Failed to update quantity");
    }
  };
  

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filter out the removed item
      const updated = cartItems.filter(item => item._id !== itemId);
      setCartItems(updated);
    } catch (error) {
      console.error("Failed to remove item from cart:", error.response?.data || error.message);
      showError("Failed to remove item from cart");
    }
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="body">
       
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="cart-table-shopping">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item._id}>
                    <td className="book-info-shopping">
                      <img src={item.image} alt={item.title} />
                      <span>{item.title}</span>
                    </td>
                    <td>${(item.price ?? 0).toFixed(2)}</td>
                    <td>
                      <button onClick={() => updateQuantity(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)}>+</button>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn-shopping" onClick={() => removeItem(item._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary-shopping">
              <h3>Total: ${getTotal()}</h3>
              <Link to="/CheckoutPage" className="continue-btn-shopping">
                Proceed to Checkout  →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
