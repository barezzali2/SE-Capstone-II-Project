import styles from "./ProductList.module.css";
import Navbar from "../components/Navbar";
import List from "../components/List";
import Footer from "../components/Footer";
import ChatbotAssistant from "../components/ChatbotAssistant";
function ProductList() {
  return (
    <div className={styles.productList}>
      <Navbar />
      <List />
      <ChatbotAssistant />
      <Footer />
    </div>
  );
}

export default ProductList;
