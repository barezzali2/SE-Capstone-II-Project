import Navbar from "../components/Navbar";
import styles from "./ProductList.module.css";
import List from "../components/List";

function ProductList() {
  return (
    <div className={styles.productList}>
      <Navbar />
      <List />
    </div>
  );
}

export default ProductList;
