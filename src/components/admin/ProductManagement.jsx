import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext"; // Use context to get initial products
import Sidebar from "./Sidebar";
import styles from "./ProductManagement.module.css"; // Using the same CSS module name

function ProductManagement() {
  const { user, logout } = useAuth();
  // Get initial product list, loading, and error state from context
  const { products: initialProducts, loading, error } = useProduct();

  // Local state to hold and manage the product list for display/simulation
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const { baseUrl } = useProduct();
  


  // Effect to initialize local state from context
  useEffect(() => {
    setIsLoading(loading);
    setListError(error);
    if (!loading && !error && initialProducts) {
      // Make a copy to allow local modifications without affecting context
      setProductList([...initialProducts]);
    }
  }, [initialProducts, loading, error]);

  const handleLogout = () => {
    logout();
  };

  // --- Simulated Actions (Frontend Only) ---

  const handleAddProduct = () => {
    const name = window.prompt("Enter product name:");
    const category = window.prompt("Enter product category:");
    const price = window.prompt("Enter product price:");

    if (name && category && price && !isNaN(parseFloat(price))) {
      const newProduct = {
        // Use temporary ID for frontend-only simulation
        _id: `temp_${Date.now()}`,
        name: name,
        category: category,
        price: parseFloat(price),
        // Add other basic fields if needed, e.g., image: '/placeholder-image.png'
        image: "/placeholder-image.png"
      };
      setProductList(prevList => [...prevList, newProduct]);
    } else if (name || category || price) {
        alert("Invalid input. Please provide name, category, and a valid price.");
    }
  };

  const handleEditProduct = (productId) => {
    const product = productList.find(p => p._id === productId);
    if (!product) return;

    const newName = window.prompt(`Enter new name for ${product.name}:`, product.name);
    const newPrice = window.prompt(`Enter new price for ${product.name}:`, product.price);

    if (newName !== null && newPrice !== null && !isNaN(parseFloat(newPrice))) {
        setProductList(prevList =>
            prevList.map(p =>
                p._id === productId
                    ? { ...p, name: newName, price: parseFloat(newPrice) }
                    : p
            )
        );
    } else if (newName !== null || newPrice !== null){
        alert("Invalid input. Please provide a name and a valid price.");
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = productList.find(p => p._id === productId);
    if (!product) return;

    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProductList(prevList => prevList.filter(p => p._id !== productId));
    }
  };

  // --- Rendering ---

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.adminHeader}>
          <h1>Product Management</h1> {/* Updated Title */}
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        {/* Action Header */}
         <div className={styles.actionHeader}>
            <button onClick={handleAddProduct} className={styles.addButton}>
                + Add Product (Simulated)
            </button>
        </div>

        {/* Loading / Error Display */}
        {isLoading ? (
          <p className={styles.loadingText}>Loading products...</p>
        ) : listError ? (
          <p className={styles.errorText}>{`Error: ${listError}`}</p>
        ) : (
          // Product List Display (Similar structure to Dashboard cards)
          <div className={styles.productListGrid}> {/* Changed class */}
            {productList && productList.length > 0 ? (
              productList.map((product) => (
                <div key={product._id} className={styles.productCard}> {/* Changed class */}
                  <img
                 
                    src={`${baseUrl}${product.image}`}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                     <h3>{product.name}</h3>
                     <p>Category: {product.category}</p>
                     <p>Price: {product.price}</p>
                     {/* Add stock or description if available/needed */}
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
              ))
            ) : (
              <p>No products found.</p>
            )}
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