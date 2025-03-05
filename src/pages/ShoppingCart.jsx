import styles from "./ShoppingCart.module.css";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import CardWishlist from "../components/CardWishlist";
import { ProductProvider } from "../contexts/ProductContext";

function ShoppingCart() {
  return (
    <div className={styles.shopping}>
        <Navbar />
        <ProductProvider>
            <CardWishlist />
        </ProductProvider>
        <Footer />
    </div>
  )
}

export default ShoppingCart;