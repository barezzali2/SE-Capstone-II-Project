import { useReducer, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./List.module.css";
import Filter from "./Filter";
import Product from "./Product";
import { useProduct } from "../contexts/ProductContext";
import { FiArrowRight, FiShoppingBag, FiGrid, FiList } from "react-icons/fi";

const CATEGORY_ORDER = [
  "fruits",
  "dairy",
  "drinks",
  "bakery",
  "grains",
  "snacks",
];

const initialFilterState = {
  categories: [],
  priceRange: { min: 0, max: 10000 },
  sortType: "featured",
  isFilterOpen: false,
};

function filterReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_CATEGORY": {
      const category = action.payload;
      const updatedCategories = state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category];
      return { ...state, categories: updatedCategories };
    }
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    case "SET_SORT_TYPE":
      return { ...state, sortType: action.payload };
    case "TOGGLE_FILTER_MENU":
      return { ...state, isFilterOpen: !state.isFilterOpen };
    case "CLOSE_FILTER_MENU":
      return { ...state, isFilterOpen: false };
    case "RESET_FILTERS":
      return { ...initialFilterState, isFilterOpen: state.isFilterOpen };
    default:
      return state;
  }
}

function List() {
  const { products } = useProduct();
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const [viewMode, setViewMode] = useState("grid");

  // Number of products to show initially per category
  const PRODUCTS_PER_CATEGORY = 8;

  const toggleCategory = useCallback((category) => {
    dispatch({ type: "TOGGLE_CATEGORY", payload: category });
  }, []);

  const setPriceRange = useCallback((range) => {
    dispatch({ type: "SET_PRICE_RANGE", payload: range });
  }, []);

  const setSortType = useCallback((sortType) => {
    dispatch({ type: "SET_SORT_TYPE", payload: sortType });
  }, []);

  const toggleFilterMenu = useCallback(() => {
    dispatch({ type: "TOGGLE_FILTER_MENU" });
  }, []);

  const closeFilterMenu = useCallback(() => {
    dispatch({ type: "CLOSE_FILTER_MENU" });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const { groupedProducts, totalProducts } = useMemo(() => {
    const { categories, priceRange, sortType } = filterState;

    let filtered = [...products];

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories
          .map((c) => c.toLowerCase())
          .includes(product.category.toLowerCase())
      );
    }

    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price.replace(/[^0-9.]/g, ""));
      return price >= priceRange.min && price <= priceRange.max;
    });

    if (sortType === "featured") {
      filtered.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
    }

    const groupedProducts = filtered.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    if (sortType && sortType !== "featured") {
      Object.keys(groupedProducts).forEach((category) => {
        switch (sortType) {
          case "price-asc":
            groupedProducts[category].sort((a, b) => {
              const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
              const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
              return priceA - priceB;
            });
            break;
          case "price-desc":
            groupedProducts[category].sort((a, b) => {
              const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
              const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
              return priceB - priceA;
            });
            break;
          case "name-asc":
            groupedProducts[category].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            break;
          default:
            break;
        }
      });
    }

    const orderedGroupedProducts = {};

    CATEGORY_ORDER.forEach((category) => {
      if (groupedProducts[category]) {
        orderedGroupedProducts[category] = groupedProducts[category];
      }
    });

    Object.keys(groupedProducts).forEach((category) => {
      if (!orderedGroupedProducts[category]) {
        orderedGroupedProducts[category] = groupedProducts[category];
      }
    });

    // Calculate total products
    const totalProducts = Object.values(orderedGroupedProducts).reduce(
      (sum, products) => sum + products.length,
      0
    );

    return {
      groupedProducts: orderedGroupedProducts,
      totalProducts,
    };
  }, [products, filterState]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>Our Products</h1>
        <p className={styles.listSubtitle}>
          Discover our selection of high-quality products, carefully sourced for
          your satisfaction
        </p>
      </div>

      <div className={styles.controlsContainer}>
        <Filter
          filterState={filterState}
          toggleCategory={toggleCategory}
          setPriceRange={setPriceRange}
          setSortType={setSortType}
          toggleFilterMenu={toggleFilterMenu}
          closeFilterMenu={closeFilterMenu}
          resetFilters={resetFilters}
        />

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${
              viewMode === "grid" ? styles.active : ""
            }`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <FiGrid />
          </button>
          <button
            className={`${styles.viewButton} ${
              viewMode === "list" ? styles.active : ""
            }`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <FiList />
          </button>
        </div>
      </div>

      <div className={styles.productsContainer}>
        {totalProducts > 0 ? (
          <AnimatePresence>
            {Object.keys(groupedProducts).map((category) => (
              <motion.div
                key={category}
                className={styles.categorySection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category}</h2>
                  <span className={styles.productCount}>
                    {groupedProducts[category].length} products
                  </span>
                </div>

                <div
                  className={`${styles.productsGrid} ${
                    viewMode === "list" ? styles.listView : ""
                  }`}
                >
                  {groupedProducts[category]
                    .slice(0, PRODUCTS_PER_CATEGORY)
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.4 }}
                      >
                        <Product
                          key={product.id}
                          product={product}
                          listView={viewMode === "list"}
                        />
                      </motion.div>
                    ))}
                </div>

                {groupedProducts[category].length > PRODUCTS_PER_CATEGORY && (
                  <div className={styles.categoryFooter}>
                    <Link
                      to={`/category/${category}`}
                      className={styles.categoryLink}
                    >
                      Browse All {category} <FiArrowRight />
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className={styles.noResults}>
            <FiShoppingBag className={styles.noResultsIcon} />
            <h2>No products found</h2>
            <p>
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
            <button onClick={resetFilters} className={styles.resetButton}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
