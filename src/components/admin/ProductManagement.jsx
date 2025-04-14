import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import Sidebar from "./Sidebar";
import styles from "./ProductManagement.module.css";

function ProductManagement() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    error,
    baseUrl,
    addProduct,
    updateProduct,
    deleteProduct,
    isAuthenticated,
  } = useAdmin();

  const [productList, setProductList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/productlist`);
        const data = await response.json();
        setProductList(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [baseUrl]);

  const handleAddProduct = async (formData) => {
    setAddLoading(true);
    try {
      if (!isAuthenticated()) {
        throw new Error("Please login to continue");
      }

      const result = await addProduct(formData);
      setProductList((prev) => [...prev, result.product]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/admin/login");
      } else {
        alert(error.message || "Failed to add product");
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditProduct = async (productId, formData) => {
    try {
      const result = await updateProduct(productId, formData);
      setProductList((prev) =>
        prev.map((p) => (p._id === productId ? result.product : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProductList((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Product Management</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.actionHeader}>
          <button
            onClick={() => setShowAddModal(true)}
            className={styles.addButton}
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "+ Add Product"}
          </button>
        </div>

        {showAddModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Add New Product</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const price = formData.get("price");
                  formData.set("price", `${price} IQD`);
                  handleAddProduct(formData);
                }}
                className={styles.addProductForm}
              >
                <div className={styles.formGroup}>
                  <label htmlFor="name">Product Name</label>
                  <input
                    id="name"
                    name="name"
                    placeholder="e.g., Mountain Dew"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price">Price (IQD)</label>
                  <div className={styles.priceInput}>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="500"
                      required
                    />
                    <span className={styles.currency}>IQD</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" required>
                    <option value="">Select a category</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="drinks">Drinks</option>
                    <option value="bakery">Bakery</option>
                    <option value="grains">Grains</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Product description..."
                    rows="3"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="image">Product Image</label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="barcode">Barcode (Optional)</label>
                  <input
                    id="barcode"
                    name="barcode"
                    placeholder="e.g., 5901234123999"
                    pattern="[0-9]{13}"
                    title="13-digit barcode number"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={addLoading}
                  >
                    {addLoading ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className={styles.loadingText}>Loading products...</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : (
          <div className={styles.productListGrid}>
            {productList.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <img
                  src={`${baseUrl}${product.image}`}
                  alt={product.name}
                  className={styles.productImage}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.onerror = null;
                  }}
                />
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: {product.price} IQD</p>
                </div>
                <div className={styles.productActions}>
                  <button
                    onClick={() => handleEditProduct(product._id)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;




// import styles from "./ProductManagement.module.css";
// import { useAuth } from "../../contexts/AuthContext";
// import { useProduct } from "../../contexts/ProductContext";
// import Sidebar from "./Sidebar";

// function ProductManagement() {

//   const { user, logout } = useAuth();
//   const { products } = useProduct();

//   const handleLogout = () => {
//     logout();
//   };

//   return (
    
//     <div className={styles.adminLayout}>
//       <Sidebar />
//       <div className={styles.mainContent}>
//         <div className={styles.adminHeader}>
//           <h1>Dashboard</h1>
//           <div className={styles.userInfo}>
//             <span>Welcome, {user?.name || "Admin"}</span>
//             <button onClick={handleLogout} className={styles.logoutButton}>
//               Logout
//             </button>
//           </div>
//         </div>
//         </div>
//       </div>
//   )
// }

// export default ProductManagement;