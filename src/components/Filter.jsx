import styles from "./Filter.module.css";
import { useState, useEffect } from "react";
import { FaFilter, FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import { useProduct } from "../contexts/ProductContext";

function Filter({ onSort, onFilterChange }) {
  const { products } = useProduct();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });

  const categories = [
    "Footwear",
    "Accessories",
    "Outerwear",
    "Tops",
    "Bottoms",
  ];

  const handleSort = (value) => {
    setSortBy(value);
    onSort(value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    if (e.target.name === "min") {
      setPriceRange((prev) => ({ ...prev, min: value }));
    } else {
      setPriceRange((prev) => ({ ...prev, max: value }));
    }
  };

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

  const handleApplyFilters = () => {
    const filteredProducts = products.filter((product) => {
      const price = parseFloat(product.price.replace("$", ""));
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      return matchesPrice && matchesCategory;
    });

    onFilterChange({
      categories: selectedCategories,
      priceRange,
      products: filteredProducts,
    });
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSortBy("featured");
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 200 });
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 200 },
      products,
    });
    onSort("featured");
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest(`.${styles.filterSection}`)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  return (
    <div className={styles.filterSection}>
      <button
        className={`${styles.filterButton} ${
          isFilterOpen ? styles.active : ""
        }`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FaFilter /> Filter & Sort
      </button>

      {isFilterOpen && (
        <div className={`${styles.filterMenu} ${styles.open}`}>
          <div className={styles.filterGroup}>
            <h4>Sort By</h4>
            <div className={styles.sortOptions}>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "featured" ? styles.active : ""
                }`}
                onClick={() => handleSort("featured")}
              >
                Featured
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "price-asc" ? styles.active : ""
                }`}
                onClick={() => handleSort("price-asc")}
              >
                Price: Low to High
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "price-desc" ? styles.active : ""
                }`}
                onClick={() => handleSort("price-desc")}
              >
                Price: High to Low
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "name-asc" ? styles.active : ""
                }`}
                onClick={() => handleSort("name-asc")}
              >
                Name: A to Z
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Categories</h4>
            <div className={styles.categoryOptions}>
              {categories.map((category) => (
                <label key={category} className={styles.categoryLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span className={styles.checkmark}>
                    {selectedCategories.includes(category) && <FaCheck />}
                  </span>
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Price Range</h4>
            <div className={styles.priceRange}>
              <div className={styles.priceInput}>
                <span>$</span>
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  min="0"
                  max={priceRange.max}
                  placeholder="Min"
                />
              </div>
              <div className={styles.priceSeparator}>-</div>
              <div className={styles.priceInput}>
                <span>$</span>
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  min={priceRange.min}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.applyButton} onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className={styles.clearButton} onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Filter.propTypes = {
  onSort: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;
