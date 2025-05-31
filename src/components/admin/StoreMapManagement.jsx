import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import styles from "./StoreMapManagement.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://retailxplorebackend.onrender.com"
  : "http://localhost:3003";

const defaultColors = [
  "#8bc34a",
  "#7986cb",
  "#fff176",
  "#64b5f6",
  "#ffa726",
  "#bcaaa4",
  "#d4a056",
];

function StoreMapManagement() {
  const { user, logout } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMarkers();
    fetchCategories();
  }, []);

  const fetchMarkers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/markers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMarkers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching markers:", err);
      setError(
        "Failed to load markers: " + (err.response?.data?.error || err.message)
      );
      setMarkers([]);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/markers/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([
        "fruits",
        "drinks",
        "grains",
        "dairy",
        "snacks",
        "bakery",
      ]);
    }
  };

  const handleChange = (idx, field, value) => {
    setMarkers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async (idx) => {
    setMsg("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const marker = markers[idx];
      await axios.put(
        `${API_URL}/api/markers/${marker._id}`,
        {
          name: marker.name,
          color: marker.color,
          category: marker.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Marker updated");
    } catch {
      setError("Failed to update marker");
    }
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Store Map Management</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
          </div>
        </div>
        <div className={styles.markerList}>
          {loading ? (
            <div>Loading...</div>
          ) : markers.length === 0 ? (
            <div>No markers found</div>
          ) : (
            markers.map((marker, idx) => (
              <div className={styles.markerCard} key={marker._id}>
                <div className={styles.markerRow}>
                  <input
                    type="text"
                    value={marker.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    className={styles.markerInput}
                  />
                  <select
                    value={marker.category}
                    onChange={(e) =>
                      handleChange(idx, "category", e.target.value)
                    }
                    className={styles.markerSelect}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={marker.color}
                    onChange={(e) => handleChange(idx, "color", e.target.value)}
                    className={styles.markerColor}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave(idx)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))
          )}
          {msg && <div className={styles.successMsg}>{msg}</div>}
          {error && <div className={styles.errorMsg}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default StoreMapManagement;
