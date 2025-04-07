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
      <div className={styles.greetingBannerContainer}>
          <div className={styles.leftQuote}>
              {/* <h1>Save Time.<br />Shop Smart.<br />Stress Less.</h1> */}
              <h1>
                <span className={styles.line}><span className={styles.save}>Save</span> Time.</span>
                <span className={styles.line}>Shop <span className={styles.smart}>Smart</span>.</span>
                <span className={styles.line}><span className={styles.stress}>Stress</span> Less.</span>
              </h1>
          </div>

        <div className={styles.greetingBanner}>
          <h2>
            Hello! This is Retail<span>Xplore</span>🛍️
          </h2>
          <h4>Explore and make your shopping easier with us!</h4>
          
        </div>
      </div>
      
      
      <MapIndicator />
      <Discount />
      <FeaturedList />  
      <Footer />
    </div>
  );
}

export default Home;
