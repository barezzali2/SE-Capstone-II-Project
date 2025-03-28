import { useReducer, useCallback, useMemo } from "react";
import styles from "./List.module.css";
import Filter from "./Filter";
import Product from "./Product";
import { useProduct } from "../contexts/ProductContext";

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

  const { groupedProducts } = useMemo(() => {
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

    const sortedProducts = Object.values(orderedGroupedProducts).flat();

    return {
      filteredProducts: sortedProducts,
      groupedProducts: orderedGroupedProducts,
    };
  }, [products, filterState]);

  return (
    <div className={styles.listContainer}>
      <Filter
        filterState={filterState}
        toggleCategory={toggleCategory}
        setPriceRange={setPriceRange}
        setSortType={setSortType}
        toggleFilterMenu={toggleFilterMenu}
        closeFilterMenu={closeFilterMenu}
        resetFilters={resetFilters}
      />

      <div className={styles.productsContainer}>
        {Object.keys(groupedProducts).map((category) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.productsGrid}>
              {groupedProducts[category].map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
