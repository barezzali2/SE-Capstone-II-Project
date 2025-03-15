import { useCallback, useMemo, useState, useEffect } from "react";
import styles from "./List.module.css";
import Filter from "./Filter";
import Product from "./Product";
import { useProduct } from "../contexts/ProductContext";

function List() {
  const { products } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Memo
  // this will sort the products by category and then by price or name
  const handleSort = useCallback(
    (sortType) => {
      const categoryOrder = [
        "fruits",
        "dairy",
        "drinks",
        "bakery",
        "grains",
        "snacks",
      ];

      let newProducts = [...filteredProducts];
      newProducts.sort((a, b) => {
        const categoryA = categoryOrder.indexOf(a.category);
        const categoryB = categoryOrder.indexOf(b.category);
        if (categoryA !== categoryB) return categoryA - categoryB;
        switch (sortType) {
          case "price-asc":
            return (
              parseInt(a.price.match(/\d+/)[0]) -
              parseInt(b.price.match(/\d+/)[0])
            );
          case "price-desc":
            return (
              parseInt(b.price.match(/\d+/)[0]) -
              parseInt(a.price.match(/\d+/)[0])
            );
          case "name-asc":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      setFilteredProducts(newProducts);
    },
    [filteredProducts]
  );

  // Memo
  const handleFilterChange = useCallback(
    ({ categories, priceRange, sortType }) => {
      let filtered = [...products];
      if (categories.length > 0) {
        filtered = filtered.filter((product) =>
          categories.includes(product.category)
        );
      }
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ""));
        return price >= priceRange.min && price <= priceRange.max;
      });
      setFilteredProducts(filtered);
      if (sortType && sortType !== "featured") {
        handleSort(sortType);
      }
    },
    [products, handleSort]
  );

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return (
    <div className={styles.listContainer}>
      <Filter onSort={handleSort} onFilterChange={handleFilterChange} />

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
