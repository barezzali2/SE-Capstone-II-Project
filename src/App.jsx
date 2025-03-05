import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Search from "./pages/Search";
import Scanner from "./pages/Scanner";
import ShoppingCart from "./pages/ShoppingCart";
import Map3D from "./pages/Map3D";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/home" replace />}/>
              <Route path="home" element={<Home />}/>
              <Route path="productlist" element={<ProductList />}/>
              <Route path="search" element={<Search />}/>
              <Route path="scanner" element={<Scanner />}/>
              <Route path="shopping" element={<ShoppingCart />}/>
              <Route path="map" element={<Map3D />}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App;
