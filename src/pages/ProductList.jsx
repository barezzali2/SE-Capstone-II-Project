import Navbar from "../components/Navbar";
import styles from "./ProductList.module.css";

function ProductList() {
  return (
    <div className={styles.productList}>
        <Navbar />
    </div>
  )
}

export default ProductList;