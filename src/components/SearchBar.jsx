import styles from "./SearchBar.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../contexts/ProductContext";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchProducts } = useProduct();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);

      // if the user is not already on the search page, navigate to it
      if (window.location.pathname !== "/search") {
        navigate("/search");
      }
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchWrapper} onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearch}
        />
        <button type="submit" className={styles.searchButton}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
