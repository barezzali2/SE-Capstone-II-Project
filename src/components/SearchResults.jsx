import styles from "./SearchResults.module.css";
import { useProduct } from "../contexts/ProductContext";
import Product from "./Product";
import { FaSearch, FaSearchMinus } from "react-icons/fa";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchResults() {
  const { searchResults, searchLoading, searchError } = useProduct();
  const navigate = useNavigate();
  useEffect(() => {
    if (!searchLoading && !searchError && searchResults.length === 0) {
      sessionStorage.removeItem("searchAttempted");
    }
  }, []);

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

  return (
    <div className={styles.searchResultsContainer}>
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
              <div key={product.id}>
                <Product product={product} />
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
    </div>
  );
}

export default SearchResults;
