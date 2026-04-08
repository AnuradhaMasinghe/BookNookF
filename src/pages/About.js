import React from 'react';
import './about.css'; 

const About = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <h2>Welcome to Our Online Bookstore</h2>
        <p>
          We are a passionate team of book lovers bringing you a vast collection of books, ranging from the latest bestsellers to timeless classics. Our goal is to provide you with an easy and convenient way to browse and purchase your favorite books, all from the comfort of your home.
        </p>
        <h3>Our Mission</h3>
        <p>
          At our online bookstore, we believe in the power of reading to inspire, educate, and entertain. Our mission is to make books accessible to everyone and foster a community of readers who share the love of storytelling and knowledge.
        </p>
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Wide selection of books in various genres.</li>
          <li>Convenient online shopping experience with easy navigation.</li>
          <li>Secure payment options and fast delivery.</li>
          <li>Customer-focused support to help with your book recommendations or any queries.</li>
        </ul>
        <h3>Join Our Book Community</h3>
        <p>
          Whether you're a casual reader or an avid bookworm, we have something for you! Sign up today and be part of our growing community of book lovers. Get recommendations, participate in book discussions, and enjoy exclusive offers.
        </p>
      </div>
    </div>
  );
};

export default About;
