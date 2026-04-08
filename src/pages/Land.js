import React from 'react';
import './land.css';

import heroImage from '../assets/hero-image.jpg';

import { useNavigate } from 'react-router-dom';

const Land = () => {
  const navigate = useNavigate();

  return (
    <div className="body">
    <img src={heroImage} alt="Background" className="background-image" />
    <div className="background-transition"></div>
      <div className="overlay">
        
        <header className="header-homepage">
          
          <nav className="nav-homepage">
            <a href="/Land">HOME</a>
            <a href="/Contact">CONTACT US</a>
            <a href="/About">ABOUT US</a>
          </nav>
         
        </header>

        {/* Main Section */}
        {<main className="main-homepage">     
          <div className="text-section-homepage">
            <h1>
              Lose Youself In A Story<br />
              <span className="highlight">Find Yourself In A Book</span>
            </h1>
            <p>
              Your BookStore<br />
              <strong>ONLINE</strong>
            </p>
            <button
  className="quote-btn-homepage"
  onClick={() => navigate('/LoginPage')}
>
  DISCOVER BOOKS →
</button>

          </div>
        </main>}
      </div>
    </div>
  );
};

export default Land;
