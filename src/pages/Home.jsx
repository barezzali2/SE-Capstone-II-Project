import styles from "./Home.module.css";
import Map from "../components/Map";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedList from "../components/FeaturedList";
import { ProductProvider } from "../contexts/ProductContext";
import Discount from "../components/Discount";


function Home() {
  return (
    <div className={styles.home}>
        <Navbar />
        <div className={styles.greetingBanner}>
          <h2>Hello! This is Retail<span>Xplore</span>🛍️</h2>
          <h4>Explore and make your shopping easier with us!</h4>
        </div>
        <Map />
        <ProductProvider>
            <FeaturedList />
            <Discount />
        </ProductProvider>
        <Footer />
    </div>
  )
}

export default Home;