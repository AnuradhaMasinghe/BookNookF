import React, { useState } from 'react';
import './payment.css';
import Navbar from '../components/Navbar'; 
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const paymentMethods = [
  {
    name: 'Cash on Delivery',
    description: 'With Cash on Delivery, you can pay for your order in cash when it is delivered to your doorstep. Please ensure someone is available to make the payment at the time of delivery.'
  },
  {
    name: 'Bank Deposit',
    description: `
      <p>Please transfer the total amount to the following bank account:</p>
      <ul>
        <li><strong>Bank Name:</strong> People's Bank</li>
        <li><strong>Branch:</strong> Colombo Fort</li>
        <li><strong>Account Name:</strong> Online Bookshop Pvt Ltd</li>
        <li><strong>Account Number:</strong> 1234567890</li>
        <li><strong>Bank Code:</strong> 7135</li>
        <li><strong>SWIFT Code:</strong> PSBKLKLX</li>
      </ul>
      <p><strong>Payment Reference:</strong> Use your <strong>Order ID</strong> as the reference.</p>
      <p>📧 After making the deposit, please email the receipt to <strong>payments@onlinebookshop.com</strong> for verification.</p>
    `
  }
];

const PaymentPage = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!orderData || !orderData.shippingAddress) {
    return (
      <div>
        <Navbar />
        <div className="payment-container">
          <h2>Error</h2>
          <p>No order data found. Please go back to the checkout page.</p>
          <button onClick={() => navigate('/CheckoutPage')}>Go to Checkout</button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, {
        ...orderData,
        paymentMethod: selectedMethod,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const createdOrder = response.data.order;
      const orderId = createdOrder._id;

      const invoiceRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoice/generate/${orderId}`);
      const filePath = invoiceRes.data.file;

      const downloadLink = document.createElement('a');
      downloadLink.href = `${process.env.REACT_APP_API_URL}${filePath}`;
      downloadLink.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      alert('Order placed successfully! Invoice downloading...');
      navigate('/BookList');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className={`payment-container ${showModal ? 'modal-open-payment' : ''}`}>
        <h1>Complete Your Purchase</h1>

        {/* Payment Method Section */}
        <div className="payment-methods">
          <h2>Payment Method</h2>
          {paymentMethods.map((method) => (
            <label key={method.name} className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value={method.name}
                checked={selectedMethod === method.name}
                onChange={(e) => {
                  const methodName = e.target.value;
                  setSelectedMethod(methodName);

                  const selected = paymentMethods.find(m => m.name === methodName);
                  setModalContent(selected?.description || '');
                  setShowModal(true);
                }}
              />
              <strong>{method.name}</strong>
            </label>
          ))}
        </div>

        {/* Billing & Shipping Info */}
        <div className="address-box-payment">
          <h2>My Billing & Shipping Address</h2>
          <p><strong>Name:</strong> {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}</p>
          <p><strong>Address:</strong> {orderData.shippingAddress.street}</p>
          <p><strong>City:</strong> {orderData.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {orderData.shippingAddress.postalCode}</p>
          <p><strong>Mobile:</strong> {orderData.shippingAddress.phone}</p>
        </div>

        {/* Total Bill Section */}
        <div className="total-box-payment">
          <h2>Total Bill</h2>
          <p><strong>Books Total:</strong> Rs {orderData.totalPrice}</p>
          <p><strong>Shipping:</strong> Rs {orderData.shippingMethod.price}</p>
          <hr />
          <p className="total-amount-payment"><strong>Total:</strong> Rs {orderData.totalPrice + orderData.shippingMethod.price}</p>
        </div>

        {/* Buttons */}
        <div className="payment-buttons">
  <button
    onClick={handlePlaceOrder}
    disabled={isPlacingOrder}
    className={isPlacingOrder ? 'placing-order-payment' : ''}
  >
    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
  </button>

  <button
    onClick={() => navigate('/Cart')}
    className="back-to-cart-btn"
  >
    ← Back to Cart
  </button>
</div>

      </div>

      {/* Payment Method Detail Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedMethod}</h3>
            <div dangerouslySetInnerHTML={{ __html: modalContent }}></div>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
