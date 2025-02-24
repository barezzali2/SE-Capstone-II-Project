import styles from "./Home.module.css";
import Map from "../components/Map";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className={styles.home}>
        <Navbar />
        <Map />
        <Footer />
    </div>
  )
}

export default Home;