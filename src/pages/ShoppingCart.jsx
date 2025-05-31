import styles from "./ShoppingCart.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartWishlist from "../components/cart/CartWishlist";
import ChatbotAssistant from "../components/ChatbotAssistant";
function ShoppingCart() {
  return (
    <div className={styles.shopping}>
      <Navbar />
      <CartWishlist />
      <ChatbotAssistant />
      <Footer />
    </div>
  );
}

export default ShoppingCart;
