import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const MarkerContext = createContext();

export function useMarker() {
  return useContext(MarkerContext);
}

export function MarkerProvider({ children }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.PROD
          ? "https://retailxplorebackend.onrender.com"
          : "http://localhost:3003";
        const res = await axios.get(`${baseUrl}/api/markers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMarkers(res.data);
      } catch {
        setMarkers([]);
      }
      setLoading(false);
    };
    fetchMarkers();
  }, []);

  return (
    <MarkerContext.Provider value={{ markers, loading }}>
      {children}
    </MarkerContext.Provider>
  );
}

MarkerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
