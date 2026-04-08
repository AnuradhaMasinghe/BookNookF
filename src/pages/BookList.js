import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './booklist.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaShoppingCart, FaHeart, FaEllipsisH } from 'react-icons/fa';


const BookList = () => {
  const [query, setQuery] = useState('programming');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteBookIds, setFavoriteBookIds] = useState(new Set());
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = [
    'Programming', 'Fiction', 'Science', 'Mathematics', 'History',
    'Biography', 'Technology', 'Art', 'Business', 'Travel','Music','Novel'
  ];

  const generateBookMeta = (bookId) => {
    const seed = Array.from(bookId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const price = parseFloat((5 + (seed % 20)).toFixed(2));
    const stock = (seed % 10) + 1;
    return { price, stock };
  };

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

  const addToFavorites = async (book) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to manage favorites!');
        return;
      }
  
      const cartItem = {
        bookId: book.id,
      };
  
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
        if (message === 'added') {
          updated.add(book.id);
        } else if (message === 'removed') {
          updated.delete(book.id);
        }
        return updated;
      });
  
      // Move alert here, outside setState
      if (message === 'added') {
        alert('Book added to favorites!');
      } else if (message === 'removed') {
        alert('Book removed from favorites!');
      }
  
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
  
  
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30`
        );
        setBooks(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchBooks, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

 
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
        <div className="search-form">
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
        </div>

        {/* Category Navigation Section */}
      
     <div className="category-bar auto-scroll">
      {[...categories, ...categories].map((cat, index) => (
      <button
        key={`${cat}-${index}`}
        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
        onClick={() => {
          setSelectedCategory(cat);
          setQuery(cat);
        }}
      >
        {cat}
      </button>
    ))}
  </div>
</div>


        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="book-grid-booklist">
            {books.map((book) => {
              const info = book.volumeInfo;
              const thumbnail = info.imageLinks?.thumbnail;
              const { price, stock } = generateBookMeta(book.id);

              return (
                <div className="book-card-booklist" key={book.id} style={{ cursor: 'pointer' }}>
                  <img src={thumbnail || '/fallback.jpg'} alt={info.title} />
                  <h3>{info.title}</h3>
                  <p className="author">{info.authors?.join(', ')}</p>
                  <p className="price">Price: ${price}</p>
                  <p className="stock">In Stock: {stock}</p>
                  <div className="icons">
                    <FaShoppingCart
                      title="Add to cart"
                      className="icon-btn-booklist cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book);
                      }}
                    />
                                  <FaHeart
                  title="Toggle favorite"
                  className="icon-btn-booklist"
                  style={{
                    color: favoriteBookIds.has(book.id) ? 'red' : 'gray',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToFavorites(book);
                  }}
                />

                    <FaEllipsisH
                      title="More details"
                      className="icon-btn more"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/book/${book.id}`, {
                          state: { price, stock },
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
   
  );
};

export default BookList;
