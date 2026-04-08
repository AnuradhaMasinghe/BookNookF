import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './checkout.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaTruckMoving, FaGift, FaMailBulk } from 'react-icons/fa';

const provinces = [
  'Central', 'Eastern', 'Northern', 'Southern',
  'Western', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
];

const shippingMethods = [
  { name: 'Courier Service', description: 'Fast delivery within 1-2 days.', price: 500, icon: <FaTruckMoving size={20} /> },
  { name: 'Gift', description: 'Nicely wrapped and ready to gift someone.', price: 700, icon: <FaGift size={20} /> },
  { name: 'Post', description: 'Standard postal service in 4-5 days.', price: 300, icon: <FaMailBulk size={20} /> }
];

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('');
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '',
    street: '', city: '', province: '', postalCode: '', phone: ''
  });
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [sriLankanCities, setSriLankanCities] = useState([]); // state to store cities

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Sri Lanka" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSriLankanCities(data.data); // Update state with cities
      })
      .catch((err) => console.error("City fetch failed", err));
  }, []);

  const handlePostalCodeChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setFormData(prevState => ({ ...prevState, postalCode: value }));
      setPostalCodeError('');
    } else {
      setPostalCodeError('Please enter a valid postal code (only digits allowed)');
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(res.data);
      } catch (err) {
        console.error('Error loading cart:', err);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate(); // Correctly defined navigate

  const handleEmailBlur = (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(e.target.value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneBlur = (e) => {
    const phonePattern = /^[0-9]{10}$/; // Regex for 10 digits
    if (!phonePattern.test(e.target.value)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleNext = () => {
    console.log('handleNext called');
  
    if (cartItems.length === 0 || totalPrice === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }
  
    // Check if any required form field is empty
    const emptyFields = Object.entries(formData).filter(([key, value]) => value.trim() === '');
    if (emptyFields.length > 0) {
      const missingFieldNames = emptyFields.map(([key]) =>
        key.charAt(0).toUpperCase() + key.slice(1)
      ).join(', ');
      alert(`Please fill in all required fields: ${missingFieldNames}`);
      return;
    }
  
    if (emailError) {
      alert(emailError);
      return;
    }
  
    if (phoneError) {
      alert(phoneError);
      return;
    }
  
    if (postalCodeError) {
      alert(postalCodeError);
      return;
    }
  
    if (!shippingMethod) {
      alert('Please select a shipping method.');
      return;
    }
  
    const shippingDetails = shippingMethods.find((m) => m.name === shippingMethod);
    const { icon, ...shippingDetailsWithoutIcon } = shippingDetails;
  
    const orderData = {
      cartItems,
      shippingAddress: formData,
      shippingMethod: shippingDetailsWithoutIcon,
      totalPrice
    };
  
    navigate('/PaymentPage', { state: orderData });
  };
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//  const isFormValid = !emailError && !phoneError && !postalCodeError && Object.values(formData).every(field => field.trim() !== '') && shippingMethod;

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <h1>Secure Checkout – Review & Confirm Your Order</h1>

        <div className="order-summary-checkout">
          <h2>Order Summary</h2>
          <table className="summary-table-checkout">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Quantity</th>
                <th>Price ($)</th>
                <th>Subtotal ($)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label-checkout">Total</td>
                <td className="total-value-checkout">{totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <form className="shipping-form">
          <h2>Shipping Address</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              onBlur={handleEmailBlur}
            />
            {emailError && <p style={{ color: 'red', fontSize: '0.9em' }}>{emailError}</p>}
          </div>

          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
          </div>

          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
          </div>

          <div>
            <label>Street Address:</label>
            <input type="text" name="street" placeholder="Street Address" required onChange={handleChange} />
          </div>

          <div>
            <label>Province:</label>
            <select name="province" required onChange={handleChange}>
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label>City:</label>
            <select name="city" required onChange={handleChange}>
              <option value="">Select City</option>
              {sriLankanCities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Postal Code:</label>
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handlePostalCodeChange}
            />
            {postalCodeError && <div style={{ color: 'red', fontSize: '0.9em' }}>{postalCodeError}</div>}
          </div>

          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              onBlur={handlePhoneBlur}
            />
            {phoneError && <p style={{ color: 'red', fontSize: '0.9em' }}>{phoneError}</p>}
          </div>
        </form>

        <div className="shipping-methods">
          <h2>Shipping Method</h2>
          <table className="shipping-table-checkout">
            <thead>
              <tr>
                <th>Select</th>
                <th>Method</th>
                <th>Description</th>
                <th>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {shippingMethods.map((method) => (
                <tr key={method.name}>
                  <td>
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.name}
                      checked={shippingMethod === method.name}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                  </td>
                  <td className="icon-label">
                    <span className="icon">{method.icon}</span>
                    <strong>{method.name}</strong>
                  </td>
                  <td>{method.description}</td>
                  <td>{method.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
  className="next-button-checkout"
  onClick={handleNext}
>
  Next
</button>
       
      </div>
    </div>
  );
};

export default CheckoutPage;
