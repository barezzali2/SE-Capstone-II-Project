import Navbar from "../components/Navbar";
import styles from "./ProductList.module.css";
import List from "../components/List";
import Footer from "../components/Footer";

function ProductList() {
  return (
    <div className={styles.productList}>
      <Navbar />
      <List />
      <Footer />
    </div>
  );
}

export default ProductList;
