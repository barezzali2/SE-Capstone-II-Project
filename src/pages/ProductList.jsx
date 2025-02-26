import styles from "./ProductList.module.css";
import Navbar from "../components/Navbar";
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
