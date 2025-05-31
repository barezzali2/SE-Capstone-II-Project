import styles from "./Map3D.module.css";
import MapView from "../components/map/MapView";
import Footer from "../components/Footer";
import { useMarker } from "../contexts/MarkerContext";

function Spinner() {
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
      <div
        style={{
          border: "8px solid #f3f3f3",
          borderTop: "8px solid #1976d2",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}

export default function Map3D() {
  const { loading } = useMarker();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.map}>
      <MapView />
      <Footer />
    </div>
  );
}
