import styles from "./Map3D.module.css";
import MapView from "../components/map/MapView";
import Footer from "../components/Footer";

function Map3D() {
  return (
    <div className={styles.map}>
      <MapView />
      <Footer />
    </div>
  );
}

export default Map3D;
