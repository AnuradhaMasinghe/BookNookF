import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './bookdetail.css';

import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const APP_URL = process.env.REACT_APP_URL;

const BookDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  const generateBookMeta = (bookId) => {
    const seed = Array.from(bookId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const price = parseFloat((5 + (seed % 20)).toFixed(2));
    const stock = (seed % 10) + 1;
    return { price, stock };
  };

  const { price, stock } = location.state || generateBookMeta(id);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error('Error fetching book details:', err);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const info = book.volumeInfo;
  const thumbnail = info.imageLinks?.thumbnail;

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
        `${APP_URL}/api/cart/add`,
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
      
      <div className="body">
        <Link to="/BookList" className="back-link-bookdetail">← Back to Search</Link>
        <div className="book-detail-card">
        <img src={thumbnail || '/fallback.jpg'} alt={info.title} className="book-image-bookdetail" />

          <div className="details-bookdetail">
            <h2>{info.title}</h2>
            <table className="detail-table">
              <tbody>
                <tr>
                  <th>Author</th>
                  <td>{info.authors?.join(', ')}</td>
                </tr>
                <tr>
                  <th>Publisher</th>
                  <td>{info.publisher}</td>
                </tr>
                <tr>
                  <th>Pages</th>
                  <td>{info.pageCount}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>
                    Rs.{price}
  
                  </td>
                </tr>
                <tr>
                  <th>Available Stock</th>
                  <td>{stock}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>
                    <div className="description-bookdetail">
                      <p>
                        {info.description
                          ? info.description.length > 200
                            ? `${info.description.slice(0, 300)}...`
                            : info.description
                          : 'No description available.'}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', paddingTop: '10px' }}>
                    <FaShoppingCart
                      title="Add to cart"
                      className="cart-icon-bookdetail cart"
                       onClick={(e) => {
                       e.stopPropagation();
                      addToCart(book);
                      }}
                      />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
