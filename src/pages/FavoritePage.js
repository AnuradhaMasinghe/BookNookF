import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './cart.css'; // reuse for grid styles
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const generateBookMeta = (bookId) => {
  const seed = Array.from(bookId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const price = parseFloat((5 + (seed % 20)).toFixed(2));
  const stock = (seed % 10) + 1;
  return { price, stock };
};

const Cart = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const favoriteIds = response.data.map(book => book.bookId);

        const detailedBooks = await Promise.all(
          favoriteIds.map(id =>
            axios
              .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
              .then(res => res.data)
              .catch(() => null)
          )
        );

        const filteredBooks = detailedBooks.filter(book => book !== null);
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Failed to fetch favorite books:', error.message);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorites = async (book) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a book to the cart!');
        return;
      }
      const cartItem = { bookId: book.id };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/favorites/toggle`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from UI
      setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      alert('Book removed from favorites!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to remove book from favorites', error);
        alert('Failed to remove book from favorites');
      }
    }
  };

  const addToCart = async (book) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a book to the cart!');
        return;
      }

      const { price } = generateBookMeta(book.id);
      const cartItem = {
        title: book.volumeInfo.title,
        price,
        quantity: 1,
        image: book.volumeInfo.imageLinks?.thumbnail || '/fallback.jpg',
        bookId: book.id,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Book added to cart!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to add book to cart', error);
        alert('Failed to add book to cart');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="body">
        {books.length === 0 ? (
          <p>Your favorites list is empty.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => {
              const { price, stock } = generateBookMeta(book.id);

              return (
                <div key={book.id} className="book-card">
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      'https://via.placeholder.com/128x195?text=No+Cover'
                    }
                    alt={book.volumeInfo.title}
                  />
                  <h3>{book.volumeInfo.title}</h3>
                  <p>{book.volumeInfo.authors?.join(', ')}</p>
                  <p>Price: ${price}</p>
                  <p>Stock: {stock}</p>

                  <div className="icons">
                    <FaShoppingCart
                      title="Add to cart"
                      className="icon-btn-booklist cart"
                      onClick={() => addToCart(book)}
                    />
                    <FaHeart
                      title="Remove from favorites"
                      className="icon-btn-booklist cart"
                      style={{ color: 'red' }} // Red icon specifically for the favorites page
                      onClick={() => removeFavorites(book)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
