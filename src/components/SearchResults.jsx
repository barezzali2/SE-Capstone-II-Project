import styles from "./SearchResults.module.css";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { FaSearch, FaSearchMinus, FaTag, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuickView from "./QuickView";
import ConfirmationDialog from "./ConfirmationDialog";

function SearchResults() {
  const { searchResults, searchLoading, searchError, baseUrl } = useProduct();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false); // State for dialog visibility
  const [showNotification, setShowNotification] = useState(false); // State for notification visibility
  const [productToAdd, setProductToAdd] = useState(null); // Track the product to add to the cart

  // Debug log to see what's in the search results
  useEffect(() => {
    console.log("Search Results:", searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (!searchLoading && !searchError && searchResults.length === 0) {
      sessionStorage.removeItem("searchAttempted");
    }
  }, [searchLoading, searchError, searchResults]);

  const isInitialState =
    !searchLoading &&
    !searchError &&
    searchResults.length === 0 &&
    !sessionStorage.getItem("searchAttempted");

  const isNoResultsState =
    !searchLoading &&
    !searchError &&
    searchResults.length === 0 &&
    sessionStorage.getItem("searchAttempted");

  const handleBrowseProducts = () => {
    navigate("/productlist");
  };

  // const handleAddToCart = (e, product) => {
  //   e.stopPropagation();
  //   addToCart(product._id || product.id);
  // };

    const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setProductToAdd(product); // Store the product to add
    setShowConfirmation(true); // Show the confirmation dialog
  };

  const handleConfirmAddToCart = () => {
    if (productToAdd) {
      addToCart(productToAdd._id || productToAdd.id); // Add the product to the cart
      setShowNotification(true); // Show the notification
      setTimeout(() => setShowNotification(false), 3000); // Hide the notification after 3 seconds
    }
    setShowConfirmation(false); // Hide the confirmation dialog
  };

  const handleCancelAddToCart = () => {
    setShowConfirmation(false); // Hide the confirmation dialog
  };


  const handleQuickView = (product) => {
    // Debug log to see what product is being passed to QuickView
    console.log("Opening QuickView with product:", product);
    setSelectedProduct(product);
  };

  const calculateDiscountedPrice = (price, discountRate) => {
    if (!discountRate) return price;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  return (
    <div className={styles.searchResultsContainer}>
      {showNotification && (
        <div className={styles.notification}>
          Product added to cart successfully!
        </div>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to add this item to your cart?"
          onConfirm={handleConfirmAddToCart}
          onCancel={handleCancelAddToCart}
        />
      )}

      {searchLoading ? (
        <div className={styles.searchStatus}>
          <div className={styles.loadingSpinner}></div>
          <p>Searching for products...</p>
        </div>
      ) : searchError ? (
        <div className={styles.searchStatus}>
          <p className={styles.error}>Error: {searchError}</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h2 className={styles.resultsHeading}>
            <span className={styles.resultsCount}>{searchResults.length}</span>{" "}
            products found
          </h2>
          <div className={styles.resultsGrid}>
            {searchResults.map((product) => (
              <div
                key={product._id || product.id}
                className={styles.productCard}
                onClick={() => handleQuickView(product)}
              >
                <div className={styles.productImageContainer}>
                  <img
                    src={`${baseUrl}${product.image}`}
                    alt={product.name}
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    }}
                  />

                  {product.isDiscounted && product.discountRate > 0 && (
                    <div className={styles.discountBadge}>
                      <FaTag className={styles.badgeIcon} />
                      <span>{product.discountRate}%</span>
                    </div>
                  )}

                  {product.isFeatured && (
                    <div className={styles.featuredBadge}>
                      <FaStar className={styles.badgeIcon} />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.categoryBadge}>{product.category}</p>

                  <div className={styles.priceContainer}>
                    {product.isDiscounted && product.discountRate > 0 ? (
                      <>
                        <span className={styles.originalPrice}>
                          {product.price}
                        </span>
                        <span className={styles.discountedPrice}>
                          {calculateDiscountedPrice(
                            product.price,
                            product.discountRate
                          )}
                        </span>
                      </>
                    ) : (
                      <span className={styles.price}>{product.price}</span>
                    )}
                  </div>

                  <div className={styles.productActions}>
                    <button
                      className={styles.addToCartButton}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <FiShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isInitialState ? (
        <div className={styles.initialSearchState}>
          <div className={styles.searchIcon}>
            <FaSearch />
          </div>
          <h2>Discover Amazing Products</h2>
          <p>
            Enter keywords in the search box above to explore our collection
          </p>
        </div>
      ) : isNoResultsState ? (
        <div className={styles.noResultsState}>
          <div className={styles.noResultsIcon}>
            <FaSearchMinus />
          </div>
          <h2>No matches found</h2>
          <p>Try different keywords or check for typos</p>
          <button
            className={styles.suggestionsButton}
            onClick={handleBrowseProducts}
          >
            Browse popular products
          </button>
        </div>
      ) : null}

      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onFindInStore={(product) => {
            setSelectedProduct(false);
            navigate("/map", { state: { highlightProduct: product } });
          }}
        />
      )}
    </div>
  );
}

export default SearchResults;
