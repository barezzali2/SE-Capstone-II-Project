import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import Sidebar from './Sidebar';
import styles from "./FeaturedManagement.module.css"; // Ensure this CSS file exists

// Helper function for safe price formatting (same as in DiscountManagement)
const formatPrice = (price) => {
    const num = parseFloat(price); // Attempt to convert to number
    if (!isNaN(num)) { // Check if conversion was successful
        return num.toFixed(2); // Format if it's a valid number
    }
    return "N/A"; // Fallback for invalid/missing price
};

function FeaturedManagement() {
    const { user, logout } = useAuth();
    const {
        products: allProducts,
        loading: productsLoading,
        error: productsError,
        baseUrl,
    } = useProduct();

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For add/remove actions
    const [error, setError] = useState(null); // For add/remove errors

    // Filter products based on the 'isDiscounted' flag (used by backend for featured)
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            setFeaturedProducts(allProducts.filter(p => p.isDiscounted === true));
            setAvailableProducts(allProducts.filter(p => p.isDiscounted !== true));
        } else {
            setFeaturedProducts([]);
            setAvailableProducts([]);
        }
    }, [allProducts]);

    // Create authenticated Axios instance
    const authAxios = useMemo(() => {
        const token = localStorage.getItem("token");
        return axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [baseUrl]);

    const handleLogout = () => {
        logout();
    };

    // --- Helper Function to Update Local State ---
    // (Keep existing - correctly handles moving products based on isDiscounted flag)
    const updateLocalFeaturedState = (updatedProduct) => {
        if (updatedProduct.isDiscounted === true) { // Now featured
            setFeaturedProducts(prev => {
                const existingIndex = prev.findIndex(p => p._id === updatedProduct._id);
                if (existingIndex > -1) { const newArr = [...prev]; newArr[existingIndex] = updatedProduct; return newArr; }
                else { return [...prev, updatedProduct]; }
            });
            setAvailableProducts(prev => prev.filter(p => p._id !== updatedProduct._id));
        } else { // No longer featured
            setFeaturedProducts(prev => prev.filter(p => p._id !== updatedProduct._id));
            setAvailableProducts(prev => {
                 const existingIndex = prev.findIndex(p => p._id === updatedProduct._id);
                 if (existingIndex > -1) { const newArr = [...prev]; newArr[existingIndex] = updatedProduct; return newArr; }
                 else { return [...prev, updatedProduct]; }
            });
        }
    };


    // --- Add to Featured Handler --- (Keep existing)
    const handleAddFeatured = async (productId) => {
        setIsLoading(true); setError(null);
        try {
            const response = await authAxios.post(`/admin/featured/${productId}`);
            updateLocalFeaturedState(response.data.product);
        } catch (err) {
            console.error("Error adding featured product:", err);
            setError(err.response?.data?.error || "Failed to add product to featured items.");
        } finally { setIsLoading(false); }
    };

    // --- Remove from Featured Handler --- (Keep existing)
    const handleRemoveFeatured = async (productId) => {
        setIsLoading(true); setError(null);
        try {
             const response = await authAxios.delete(`/admin/featured/${productId}`);
            updateLocalFeaturedState(response.data.product);
        } catch (err) {
            console.error("Error removing featured product:", err);
            setError(err.response?.data?.error || "Failed to remove product from featured items.");
        } finally { setIsLoading(false); }
    };

    return (
        <div className={styles.adminLayout}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.adminHeader}>
                    <h1>Featured Product Management</h1>
                    <div className={styles.userInfo}>
                        <span>Welcome, {user?.name || "Admin"}</span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Display Loading/Error */}
                {productsLoading && <p>Loading products...</p>}
                {productsError && <p className={styles.errorText}>Error loading products: {productsError}</p>}
                {error && <p className={styles.errorText}>{error}</p>}

                {/* Currently Featured Products Section */}
                <div className={styles.section}>
                    <h2>Currently Featured Products</h2>
                    {!productsLoading && featuredProducts.length === 0 ? ( // Added !productsLoading check
                        <p>No products are currently marked as featured.</p>
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
                                        {/* ***** Use formatPrice ***** */}
                                        <td>${formatPrice(product.price)}</td>
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

                {/* Available Products Section */}
                <div className={styles.section}>
                    <h2>Available Products (Add to Featured)</h2>
                     {!productsLoading && availableProducts.length === 0 ? ( // Added !productsLoading check
                        <p>No available products found to feature.</p>
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
                                        {/* ***** Use formatPrice ***** */}
                                        <td>${formatPrice(product.price)}</td>
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
        </div>
    );
}

export default FeaturedManagement;






// import React from 'react'
// import { useAuth } from '../../contexts/AuthContext';
// import { useProduct } from '../../contexts/ProductContext';
// import Sidebar from './Sidebar';
// import styles from "./FeaturedManagement.module.css"

// function FeaturedManagement() {
//     const { user, logout } = useAuth();
//     const { products } = useProduct();
  
//     const handleLogout = () => {
//       logout();
//     };
  
//     return (
      
//       <div className={styles.adminLayout}>
//         <Sidebar />
//         <div className={styles.mainContent}>
//           <div className={styles.adminHeader}>
//             <h1>Dashboard</h1>
//             <div className={styles.userInfo}>
//               <span>Welcome, {user?.name || "Admin"}</span>
//               <button onClick={handleLogout} className={styles.logoutButton}>
//                 Logout
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>
//     )
// }

// export default FeaturedManagement