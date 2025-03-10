import { Link } from "react-router-dom";
import styles from "./Map.module.css";
import { useProduct } from "../contexts/ProductContext";

function Map() {
  const { baseUrl } = useProduct();

  return (
    <div className={styles.map}>
      <Link to="/map">
        <img
          src={`${baseUrl}/images/mapdump.png`}
          alt="map"
          className={styles.map3D}
        />
        <img
          src={`${baseUrl}/images/touch.png`}
          alt="touch"
          className={styles.touch}
        />
      </Link>
    </div>
  );
}

export default Map;
