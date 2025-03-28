import styles from "./Home.module.css";
import MapIndicator from "../components/MapIndicator";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedList from "../components/FeaturedList";
import Discount from "../components/Discount";

function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.greetingBanner}>
        <h2>
          Hello! This is Retail<span>Xplore</span>🛍️
        </h2>
        <h4>Explore and make your shopping easier with us!</h4>
      </div>
      <MapIndicator />
      <Discount />
      <FeaturedList />  
      <Footer />
    </div>
  );
}

export default Home;
