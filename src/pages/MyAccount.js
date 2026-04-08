import React, { useState } from 'react';
import './MyAccount.css';  // Add necessary styles
import Navbar from '../components/Navbar'; 
const MyAccount = () => {
  const [activeSection, setActiveSection] = useState('editProfile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setProfileData({ ...profileData, password });
    checkPasswordStrength(password);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('Weak');
    } else if (password.length < 10) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
    <Navbar/>
    <div className="my-account-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-info">
          <h3>{profileData.name}</h3>
          <p>{profileData.email}</p>
        </div>
        <ul>
          <li onClick={() => handleSectionChange('editProfile')}>Edit Profile</li>
          <li onClick={() => handleSectionChange('myOrders')}>My Orders</li>
          <li onClick={() => handleSectionChange('myFavourites')}>My Favourites</li>
          <li onClick={() => handleSectionChange('logout')}>Logout</li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeSection === 'editProfile' && (
          <div className="edit-profile-section">
            <h2>Edit Profile</h2>
            <div className="profile-input">
              <label>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="profile-input">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div className="profile-input">
              <label>New Password</label>
              <input
                type="password"
                value={profileData.password}
                onChange={handlePasswordChange}
              />
              <p>Password Strength: {passwordStrength}</p>
            </div>
            <div className="profile-input">
              <label>Confirm Password</label>
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
              />
            </div>
            <button>Save Changes</button>
          </div>
        )}

        {activeSection === 'myOrders' && (
          <div className="my-orders-section">
            <h2>My Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Book Title 1</td>
                  <td>$15</td>
                  <td>Shipped</td>
                  <td>Credit Card</td>
                </tr>
                <tr>
                  <td>Book Title 2</td>
                  <td>$20</td>
                  <td>Processing</td>
                  <td>PayPal</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'myFavourites' && (
          <div className="my-favourites-section">
            <h2>My Favourites</h2>
            <div className="favourites-grid">
              <div className="favourite-card">
                <img src="/book-thumbnail.jpg" alt="Book Title" />
                <h3>Book Title 1</h3>
              </div>
              <div className="favourite-card">
                <img src="/book-thumbnail.jpg" alt="Book Title" />
                <h3>Book Title 2</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyAccount;
