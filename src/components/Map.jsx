import styles from "./Map.module.css";

function Map() {
  return (
    <div className={styles.map}>
        <div> 
            <img src="/images/dummymap.png" alt="map" className={styles.map3D}/>
            <img src="/images/touch.png" alt="touch" className={styles.touch}/>
        </div>
    </div>
  )
}

export default Map;