import { useState } from "react";
import styles from "./List.module.css";
import Filter from "./Filter";
import Product from "./Product";

function List() {
  // dummmy products to test
  const [products] = useState([
    {
      id: 1,
      name: "Classic White Sneakers",
      image: "https://picsum.photos/400/400?random=1",
      price: "$99.99",
      category: "Footwear",
    },
    {
      id: 2,
      name: "Leather Backpack",
      image: "https://picsum.photos/400/400?random=2",
      price: "$129.99",
      category: "Accessories",
    },
    {
      id: 3,
      name: "Denim Jacket",
      image: "https://picsum.photos/400/400?random=3",
      price: "$89.99",
      category: "Outerwear",
    },
    {
      id: 4,
      name: "Cotton T-Shirt",
      image: "https://picsum.photos/400/400?random=4",
      price: "$29.99",
      category: "Tops",
    },
    {
      id: 5,
      name: "Slim Fit Jeans",
      image: "https://picsum.photos/400/400?random=5",
      price: "$79.99",
      category: "Bottoms",
    },
    {
      id: 6,
      name: "Sports Watch",
      image: "https://picsum.photos/400/400?random=6",
      price: "$199.99",
      category: "Accessories",
    },
    {
      id: 7,
      name: "Running Shoes",
      image: "https://picsum.photos/400/400?random=7",
      price: "$119.99",
      category: "Footwear",
    },
    {
      id: 8,
      name: "Wool Sweater",
      image: "https://picsum.photos/400/400?random=8",
      price: "$69.99",
      category: "Tops",
    },
  ]);
  
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
