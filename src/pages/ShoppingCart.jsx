import styles from "./ShoppingCart.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartWishlist from "../components/cart/CartWishlist";

function ShoppingCart() {
  return (
    <div className={styles.shopping}>
      <Navbar />
      <CartWishlist />
      <Footer />
    </div>
  );
}

export default ShoppingCart;
