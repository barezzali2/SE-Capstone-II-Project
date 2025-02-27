import { useState } from "react";
import styles from "./List.module.css";
import Filter from "./Filter";
import Product from "./Product";
import { useProduct } from "../contexts/ProductContext";

function List() {

  const {products} = useProduct();
  const [filteredProducts, setFilteredProducts] = useState(products);


  const handleSort = (sortType) => {
    let sorted = [...filteredProducts];
    switch (sortType) {
      case "price-asc":
        sorted.sort(
          (a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))
        );
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted = [...products];
    }
    setFilteredProducts(sorted);
  };

  const handleFilterChange = ({ categories, priceRange }) => {
    let filtered = [...products];

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.category)
      );
    }

    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price.slice(1));
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredProducts(filtered);
  };


  return (
    <div className={styles.listContainer}>
      <Filter onSort={handleSort} onFilterChange={handleFilterChange} />

      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default List;
