import styles from "./Filter.module.css";
import { useEffect, memo } from "react";
import { FaFilter, FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import { Range } from "react-range";

function Filter({
  filterState,
  toggleCategory,
  setPriceRange,
  setSortType,
  toggleFilterMenu,
  closeFilterMenu,
  resetFilters,
}) {
  const { categories, priceRange, sortType, isFilterOpen } = filterState;

  const categoryOptions = [
    "fruits",
    "dairy",
    "drinks",
    "bakery",
    "grains",
    "snacks",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest(`.${styles.filterSection}`)) {
        closeFilterMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, closeFilterMenu]);

  return (
    <div className={styles.filterSection}>
      <button
        className={`${styles.filterButton} ${
          isFilterOpen ? styles.active : ""
        }`}
        onClick={toggleFilterMenu}
      >
        <FaFilter /> Filter & Sort
      </button>

      {isFilterOpen && (
        <div className={`${styles.filterMenu} ${styles.open}`}>
          <div className={styles.filterGroup}>
            <h4>Sort By</h4>
            <div className={styles.sortOptions}>
              {[
                { id: "featured", label: "Featured" },
                { id: "price-asc", label: "Price: Low to High" },
                { id: "price-desc", label: "Price: High to Low" },
                { id: "name-asc", label: "Name: A to Z" },
              ].map((option) => (
                <button
                  key={option.id}
                  className={`${styles.sortButton} ${
                    sortType === option.id ? styles.active : ""
                  }`}
                  onClick={() => setSortType(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Categories</h4>
            <div className={styles.categoryOptions}>
              {categoryOptions.map((category) => (
                <label key={category} className={styles.categoryLabel}>
                  <input
                    type="checkbox"
                    checked={categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span className={styles.checkmark}>
                    {categories.includes(category) && <FaCheck />}
                  </span>
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Price Range</h4>
            <div className={styles.priceRange}>
              <Range
                step={100}
                min={0}
                max={10000}
                values={[priceRange.min, priceRange.max]}
                onChange={(values) =>
                  setPriceRange({ min: values[0], max: values[1] })
                }
                renderTrack={({ props, children }) => (
                  <div {...props} className={styles.rangeTrack}>
                    {children}
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    className={`${styles.rangeThumb} ${
                      isDragged ? styles.dragged : ""
                    }`}
                  >
                    <div className={styles.thumbValue}>
                      {props["aria-valuenow"]} IQD
                    </div>
                  </div>
                )}
              />
              <div className={styles.rangeValues}>
                <span>{priceRange.min} IQD</span>
                <span>{priceRange.max} IQD</span>
              </div>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.applyButton} onClick={closeFilterMenu}>
              Apply Filters
            </button>
            <button className={styles.clearButton} onClick={resetFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Filter.propTypes = {
  filterState: PropTypes.object.isRequired,
  toggleCategory: PropTypes.func.isRequired,
  setPriceRange: PropTypes.func.isRequired,
  setSortType: PropTypes.func.isRequired,
  toggleFilterMenu: PropTypes.func.isRequired,
  closeFilterMenu: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  "aria-valuenow": PropTypes.number,
};

export default memo(Filter);
