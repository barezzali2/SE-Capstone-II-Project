import { memo, useMemo } from "react";
import { useProduct } from "../contexts/ProductContext";
import styles from "./FeaturedList.module.css";
import Product from "./Product";

function FeaturedList() {
  const { products } = useProduct();
  // const recentProducts = products.slice(0, 4);
  const recentProducts = useMemo(() =>  products.sort(() => Math.random() - 0.5).slice(0, 4), [products]);

  return (
    <div className={styles.recent}>
        <h3>Featured Products</h3>
        <div className={styles.productsGrid}>
          {recentProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
    </div>
  )
}

export default memo(FeaturedList);