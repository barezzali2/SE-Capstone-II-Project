import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import { useAdmin } from "../../contexts/AdminContext";
import Sidebar from "./Sidebar";
import styles from "./FeaturedManagement.module.css";
import ConfirmationDialog from "../ConfirmationDialog"; 

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (!isNaN(num)) {
    return `${num.toFixed(0)} IQD`;
  }
  return "N/A";
};

function FeaturedManagement() {
  const { user } = useAuth();
  const {
    products: allProducts,
    loading: productsLoading,
    error: productsError,
    refreshProducts,
  } = useProduct();
  const { toggleFeatured } = useAdmin();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false); // State for dialog visibility
  const [productToRemove, setProductToRemove] = useState(null); // Store product ID to remove

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setFeaturedProducts(allProducts.filter((p) => p.isFeatured === true));
      setAvailableProducts(allProducts.filter((p) => !p.isFeatured));
    } else {
      setFeaturedProducts([]);
      setAvailableProducts([]);
    }
  }, [allProducts]);

  const handleAddFeatured = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      await toggleFeatured(productId, true);
      await refreshProducts();
    } catch (err) {
      console.error("Error adding featured product:", err);
      setError(
        err.response?.data?.error || "Failed to add product to featured items."
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleRemoveFeatured = (productId) => {
    setProductToRemove(productId); // Set the product ID to remove
    setShowConfirmation(true); // Show the confirmation dialog
  };

  // const handleRemoveFeatured = async (productId) => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to remove this product from featured?"
  //     )
  //   ) {
  //     return;
  //   }
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     await toggleFeatured(productId, false);
  //     await refreshProducts();
  //   } catch (err) {
  //     console.error("Error removing featured product:", err);
  //     setError(
  //       err.response?.data?.error ||
  //         "Failed to remove product from featured items."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const confirmRemoveFeatured = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await toggleFeatured(productToRemove, false);
      await refreshProducts();
    } catch (err) {
      console.error("Error removing featured product:", err);
      setError(
        err.response?.data?.error ||
          "Failed to remove product from featured items."
      );
    } finally {
      setIsLoading(false);
      setShowConfirmation(false); // Hide the confirmation dialog
      setProductToRemove(null); // Clear the product ID
    }
  };


  const cancelRemoveFeatured = () => {
    setShowConfirmation(false); // Hide the confirmation dialog
    setProductToRemove(null); // Clear the product ID
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Featured Product Management</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
          </div>
        </div>

        {productsLoading && <p>Loading products...</p>}
        {productsError && (
          <p className={styles.errorText}>
            Error loading products: {productsError}
          </p>
        )}
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.section}>
          <h2>Currently Featured Products</h2>
          {!productsLoading && featuredProducts.length === 0 ? (
            <p>No products are currently featured.</p>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {featuredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveFeatured(product._id)}
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Removing..." : "Remove from Featured"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.section}>
          <h2>Available Products</h2>
          {!productsLoading && availableProducts.length === 0 ? (
            <p>No available products to feature.</p>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <button
                        onClick={() => handleAddFeatured(product._id)}
                        className={`${styles.actionButton} ${styles.addButton}`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add to Featured"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to remove this product from featured?"
          onConfirm={confirmRemoveFeatured}
          onCancel={cancelRemoveFeatured}
        />
      )}


    </div>
  );
}

export default FeaturedManagement;
