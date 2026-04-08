import React, { useState } from 'react';
import './booklist.css'; // Reuse same style as BookList
import { FaShoppingCart, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Search = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [books, setBooks] = useState([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const getUserId = () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return null;
  //   try {
  //     const decoded = jwtDecode(token);
  //     return decoded.userId || decoded.id || decoded._id;
  //   } catch {
  //     return null;
  //   }
  // };

  const generateBookMeta = (bookId) => {
    const seed = Array.from(bookId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const price = parseFloat((5 + (seed % 20)).toFixed(2));
    const stock = (seed % 10) + 1;
    return { price, stock };
  };

  const fetchBooks = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=30`;
      if (language) searchUrl += `&langRestrict=${language}`;

      const response = await axios.get(searchUrl);
      const enrichedBooks = (response.data.items || []).map((book) => {
        const volumeInfo = book.volumeInfo || {};
        const saleInfo = book.saleInfo || {};
        const rating = volumeInfo.averageRating || (Math.random() * 4 + 1).toFixed(1);
        const price = saleInfo?.listPrice?.amount ?? parseFloat((Math.random() * 40 + 5).toFixed(2));

        return {
          ...book,
          volumeInfo: {
            ...volumeInfo,
            averageRating: parseFloat(rating),
          },
          saleInfo: {
            ...saleInfo,
            listPrice: {
              amount: parseFloat(price),
            },
          },
        };
      });

      const filtered = enrichedBooks.filter((book) => {
        const rating = book.volumeInfo.averageRating;
        const price = book.saleInfo.listPrice.amount;
        return (
          (!minRating || rating >= parseFloat(minRating)) &&
          (!minPrice || price >= parseFloat(minPrice)) &&
          (!maxPrice || price <= parseFloat(maxPrice))
        );
      });

      setBooks(filtered);
    } catch (error) {
      console.error('Failed to fetch books', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (book) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to manage favorites!');
        return;
      }

      const cartItem = { bookId: book.id };

      const response = await axios.post(
       `${process.env.REACT_APP_API_URL}/api/favorites/toggle`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message } = response.data;

      setFavoriteBookIds((prev) => {
        const updated = new Set(prev);
        message === 'added' ? updated.add(book.id) : updated.delete(book.id);
        return updated;
      });

      alert(message === 'added' ? 'Book added to favorites!' : 'Book removed from favorites!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to update favorites', error);
        alert('Failed to update favorites');
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
        <div className="sidebar">
          <form onSubmit={fetchBooks} className="search-form">
            <h2>Search Filters</h2>
            <input
              type="text"
              placeholder="Title, Author, Keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <label>
              Language:
              <input
                type="text"
                placeholder="e.g. en, fr"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </label>
            <label>
              Minimum Rating:
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
            </label>
            <label>
              Price Range:
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </label>
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="main-content">
          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="book-grid-booklist">
              {books.map((book) => {
                const info = book.volumeInfo;
                const thumbnail = info.imageLinks?.thumbnail;
                const { price, stock } = generateBookMeta(book.id);

                return (
                  <div className="book-card-booklist" key={book.id}>
                    <img src={thumbnail || '/fallback.jpg'} alt={info.title} />
                    <h3>{info.title}</h3>
                    <p className="author">{info.authors?.join(', ')}</p>
                    <p className="price">Price: ${price}</p>
                    <p className="stock">In Stock: {stock}</p>
                    <div className="icons">
                      <FaShoppingCart
                        title="Add to cart"
                        className="icon-btn-booklist cart"
                        onClick={() => addToCart(book)}
                      />
                      <FaHeart
                        title="Toggle favorite"
                        className="icon-btn-booklist"
                        style={{
                          color: favoriteBookIds.has(book.id) ? 'red' : 'gray',
                          cursor: 'pointer',
                          marginLeft: '10px',
                        }}
                        onClick={() => addToFavorites(book)}
                      />
                      <FaEllipsisH
                        title="More details"
                        className="icon-btn more"
                        onClick={() =>
                          navigate(`/book/${book.id}`, {
                            state: { price, stock },
                          })
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
