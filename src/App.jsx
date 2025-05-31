import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Loading from "./components/Loading";
import { AdminProvider } from "./contexts/AdminContext";
import FeaturedProducts from "./pages/FeaturedProducts";
import CategoryPage from "./pages/CategoryPage";
import { MarkerProvider } from "./contexts/MarkerContext";

// import Home from "./pages/Home";
// import ProductList from "./pages/ProductList";
// import Search from "./pages/Search";
// import Scanner from "./pages/Scanner";
// import ShoppingCart from "./pages/ShoppingCart";
// import Map3D from "./pages/Map3D";

const Home = lazy(() => import("./pages/Home"));
const ProductList = lazy(() => import("./pages/ProductList"));
const Search = lazy(() => import("./pages/Search"));
const Scanner = lazy(() => import("./pages/Scanner"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart"));
const Map3D = lazy(() => import("./pages/Map3D"));
const Review = lazy(() => import("./pages/Review"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));

// admin stuff
import AdminLogin from "./pages/admin/Login";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ProductManagement from "./components/admin/ProductManagement";
import DiscountManagement from "./components/admin/DiscountManagement";
import FeaturedManagement from "./components/admin/FeaturedManagement";
import StoreMapManagement from "./components/admin/StoreMapManagement";
import AccountSetting from "./components/admin/AccountSetting";
import ResetPassword from "./pages/admin/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <MarkerProvider>
          <CartProvider>
            <AdminProvider>
              <BrowserRouter>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="productlist" element={<ProductList />} />
                    <Route path="search" element={<Search />} />
                    <Route path="scanner" element={<Scanner />} />
                    <Route path="shopping" element={<ShoppingCart />} />
                    <Route path="map" element={<Map3D />} />
                    <Route path="review" element={<Review />} />
                    <Route
                      path="/products/featured"
                      element={<FeaturedProducts />}
                    />
                    <Route
                      path="/category/:categoryName"
                      element={<CategoryPage />}
                    />

                    {/* admin */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminHome />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <ProductManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/discounts"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <DiscountManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/featured"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <FeaturedManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/storeMap"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <StoreMapManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/accSetting"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AccountSetting />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/forget-password"
                      element={<ResetPassword />}
                    />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AdminProvider>
          </CartProvider>
        </MarkerProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
