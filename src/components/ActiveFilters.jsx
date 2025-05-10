import { FiX } from "react-icons/fi";
import PropTypes from "prop-types";
import styles from "./ActiveFilters.module.css";

function ActiveFilters({ categories, priceRange, sortType, onRemoveFilter }) {
  return (
    <div className={styles.activeFilters}>
      {categories.map((category) => (
        <span key={category} className={styles.filterTag}>
          {category}
          <button
            onClick={() => onRemoveFilter("category", category)}
            className={styles.removeFilter}
          >
            <FiX />
          </button>
        </span>
      ))}

      {(priceRange.min > 0 || priceRange.max < 10000) && (
        <span className={styles.filterTag}>
          Price: {priceRange.min} - {priceRange.max} IQD
          <button
            onClick={() => onRemoveFilter("price")}
            className={styles.removeFilter}
          >
            <FiX />
          </button>
        </span>
      )}

      {sortType !== "featured" && (
        <span className={styles.filterTag}>
          Sort: {sortType.replace("-", " ").toUpperCase()}
          <button
            onClick={() => onRemoveFilter("sort")}
            className={styles.removeFilter}
          >
            <FiX />
          </button>
        </span>
      )}
    </div>
  );
}

ActiveFilters.propTypes = {
  categories: PropTypes.array.isRequired,
  priceRange: PropTypes.object.isRequired,
  sortType: PropTypes.string.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
};

export default ActiveFilters;
