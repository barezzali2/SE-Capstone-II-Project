import styles from "./Map3D.module.css";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Map3D() {
  return (
    <div className={styles.map}>
        <Navbar />
        <Footer />
    </div>
  )
}

export default Map3D