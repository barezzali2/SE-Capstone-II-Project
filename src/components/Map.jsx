import { Link } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  return (
    <div className={styles.map}>
        <Link to="/map"> 
            <img src="/images/dummymap.png" alt="map" className={styles.map3D}/>
            <img src="/images/touch.png" alt="touch" className={styles.touch}/>
        </Link>
    </div>
  )
}

export default Map;