import styles from "./SearchBar.module.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";
import { FiSearch, FiX } from "react-icons/fi";
import QuickView from "./QuickView";

function SearchBar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownResults, setDropdownResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { searchProducts, getAllProducts, products, baseUrl } = useProduct();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load all products when component mounts
  useEffect(() => {
    if (!products || products.length === 0) {
      getAllProducts();
    }
  }, [getAllProducts, products]);

  // Clear search when navigating away from search page
  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchQuery("");
    }
  }, [location.pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter products locally based on search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Filter products locally instead of making API calls
      if (products && products.length > 0) {
        const filteredProducts = products
          .filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.category &&
                product.category
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()))
          )
          .slice(0, 5);

        setDropdownResults(filteredProducts);
        setShowDropdown(true);
      } else {
        // If products array is empty, show a temporary loading state
        setDropdownResults([]);
        setShowDropdown(true);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Only trigger the actual search when form is submitted
      searchProducts(searchQuery);
      setShowDropdown(false);
      sessionStorage.setItem("searchAttempted", "true");

      // Navigate to search page
      navigate("/search");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
    inputRef.current.focus();
  };

  const handleResultClick = (product) => {
    setSelectedProduct(product);
    setShowDropdown(false);
  };

  const handleViewAllResults = () => {
    searchProducts(searchQuery);
    sessionStorage.setItem("searchAttempted", "true");
    navigate("/search");
    setShowDropdown(false);
  };

  const calculateDiscountedPrice = (price, discountRate) => {
    if (!discountRate) return price;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchWrapper} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for products..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearch}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearSearch}
          >
            <FiX className={styles.clearIcon} />
          </button>
        )}
        <button type="submit" className={styles.searchButton}>
          <FiSearch className={styles.searchIcon} />
        </button>
      </form>

      {showDropdown && (
        <div className={styles.searchDropdown} ref={dropdownRef}>
          {dropdownResults.length > 0 ? (
            <>
              <div className={styles.dropdownResults}>
                {dropdownResults.map((product) => (
                  <div
                    key={product._id || product.id}
                    className={styles.dropdownItem}
                    onClick={() => handleResultClick(product)}
                  >
                    <div className={styles.dropdownImageContainer}>
                      <img
                        src={`${baseUrl}${product.image}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                          e.target.onerror = null;
                        }}
                      />
                      {product.isDiscounted && product.discountRate > 0 && (
                        <div className={styles.dropdownDiscountBadge}>
                          {product.discountRate}%
                        </div>
                      )}
                    </div>
                    <div className={styles.dropdownItemInfo}>
                      <h4>{product.name}</h4>
                      <div className={styles.dropdownItemCategory}>
                        {product.category}
                      </div>
                      <div className={styles.dropdownItemPrice}>
                        {product.isDiscounted && product.discountRate > 0 ? (
                          <>
                            <span className={styles.dropdownOriginalPrice}>
                              {product.price}
                            </span>
                            <span className={styles.dropdownDiscountedPrice}>
                              {calculateDiscountedPrice(
                                product.price,
                                product.discountRate
                              )}
                            </span>
                          </>
                        ) : (
                          <span>{product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.viewAllContainer}>
                <button
                  className={styles.viewAllButton}
                  onClick={handleViewAllResults}
                >
                  View all results
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              {products && products.length > 0
                ? `No products found for "${searchQuery}"`
                : "Loading suggestions..."}
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default SearchBar;
