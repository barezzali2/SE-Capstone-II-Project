import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Search from "./pages/Search";
import Scanner from "./pages/Scanner";
import ShoppingCart from "./pages/ShoppingCart";
import Map3D from "./pages/Map3D";
import Loading from "./components/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Check if it's the first load in this session
    const isFirstLoad = sessionStorage.getItem("isFirstLoad") === null;

    if (isFirstLoad) {
      // Simulate a 3-4 second loading delay
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("isFirstLoad", "false"); // Set flag after first load
      }, 3500); // 4 seconds delay

      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else {
      // If it's not the first load, skip the delay
      setIsLoading(false);
    }
  }, []);

  return (
    <ProductProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={isLoading ? <Loading /> : <Home />} />
          <Route path="home" element={<Home />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="search" element={<Search />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="shopping" element={<ShoppingCart />} />
          <Route path="map" element={<Map3D />} />
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;
