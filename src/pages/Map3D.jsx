import styles from "./Map3D.module.css";
import MapView from "../components/map/MapView";
import Footer from "../components/Footer";
import CircularProgress from "@mui/material/CircularProgress";
import { useMarker } from "../contexts/MarkerContext";

function Map3D() {
  const { loading } = useMarker();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress size={60} thickness={5} />
      </div>
    );
  }

  return (
    <div className={styles.map}>
      <MapView />
      <Footer />
    </div>
  );
}

export default Map3D;
