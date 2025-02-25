import styles from "./SearchBar.module.css";
import { useState } from "react";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles["search-container"]}>
      <div className={styles["search-wrapper"]}>
        <input
          type="search"
          placeholder="Search..."
          className={styles["search-input"]}
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className={styles["search-button"]}> 
          <svg className={styles["search-icon"]} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
