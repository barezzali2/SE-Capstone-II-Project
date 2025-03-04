import styles from "./ProductList.module.css";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Footer from "../components/Footer";
import { ProductProvider } from "../contexts/ProductContext";


function ProductList() {
  return (
    <div className={styles.productList}>
      <Navbar />
      <ProductProvider>
        <List />
      </ProductProvider>
      <Footer />
    </div>
  );
}

export default ProductList;
