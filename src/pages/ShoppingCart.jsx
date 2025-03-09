import styles from "./ShoppingCart.module.css";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import CartWishlist from "../components/CartWishlist";
import { ProductProvider } from "../contexts/ProductContext";

function ShoppingCart() {
  return (
    <div className={styles.shopping}>
        <Navbar />
        <ProductProvider>
            <CartWishlist />
        </ProductProvider>
        <Footer />
    </div>
  )
}

export default ShoppingCart;