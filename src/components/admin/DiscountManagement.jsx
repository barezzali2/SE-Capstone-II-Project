import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import Sidebar from "./Sidebar";
// No Modal import needed
import styles from "./DiscountManagement.module.css";

// Helper function for safe price formatting
// const formatPrice = (price) => {
//     const num = parseFloat(price); // Attempt to convert to number
//     if (!isNaN(num)) { // Check if conversion was successful
//         return num.toFixed(2); // Format if it's a valid number
//     }
//     return "N/A"; // Fallback for invalid/missing price
// };

const formatPrice = (price) => {
    const num = parseFloat(price); // Attempt to convert to number
    if (!isNaN(num)) {
        return `${num.toFixed(0)} IQD`; // Format with 2 decimal places and append "IQD"
    }
    return "N/A"; // Fallback for invalid/missing price
};


function DiscountManagement() {
    const { user, logout } = useAuth();
    const {
        products: allProducts,
        loading: productsLoading,
        error: productsError,
        baseUrl,
    } = useProduct();

    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // For API actions
    const [error, setError] = useState(null); // For API errors

    // State for the "Add Discount" form section
    const [productToAddDiscount, setProductToAddDiscount] = useState(null);
    const [addFormRate, setAddFormRate] = useState("");
    const [addFormPrice, setAddFormPrice] = useState("");
    const [addFormError, setAddFormError] = useState(null);

    // State for inline editing in the discounted table
    const [editingProductId, setEditingProductId] = useState(null); // ID of product being edited inline
    const [inlineEditRate, setInlineEditRate] = useState("");
    const [inlineEditPrice, setInlineEditPrice] = useState("");
    const [inlineEditError, setInlineEditError] = useState(null);


    // Filter products when allProducts change (no changes needed here)
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
          const discounted = allProducts.filter(
            (p) => p.isDiscounted && p.discountRate != null && p.newPrice != null // Check for null too
          );
           const available = allProducts.filter(
             (p) => !p.isDiscounted || p.discountRate == null || p.newPrice == null // Check for null too
           );
          setDiscountedProducts(discounted);
          setAvailableProducts(available);

          // If the product being added/edited is removed from the source list, cancel the edit/add
           if (productToAddDiscount && !available.some(p => p._id === productToAddDiscount._id)) {
               handleCancelAdd();
           }
           if (editingProductId && !discounted.some(p => p._id === editingProductId)) {
               handleCancelInlineEdit();
           }

        } else {
          setDiscountedProducts([]);
          setAvailableProducts([]);
          handleCancelAdd();
          handleCancelInlineEdit();
        }
    }, [allProducts, productToAddDiscount, editingProductId]);

    // Create authenticated Axios instance (no changes needed here)
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

    // --- Helper: Update product lists locally --- (no changes needed here)
    const updateLocalProductState = (updatedProduct) => {
        setDiscountedProducts(prev => {
            const existingIndex = prev.findIndex(p => p._id === updatedProduct._id);
            if (updatedProduct.isDiscounted && updatedProduct.discountRate != null && updatedProduct.newPrice != null) {
                if (existingIndex > -1) { const newArr = [...prev]; newArr[existingIndex] = updatedProduct; return newArr; }
                else { return [...prev, updatedProduct]; }
            } else {
                return prev.filter(p => p._id !== updatedProduct._id);
            }
        });
        setAvailableProducts(prev => {
            const existingIndex = prev.findIndex(p => p._id === updatedProduct._id);
             if (!updatedProduct.isDiscounted || updatedProduct.discountRate == null || updatedProduct.newPrice == null) {
                 if (existingIndex > -1) { const newArr = [...prev]; newArr[existingIndex] = updatedProduct; return newArr; }
                 else { return [...prev, updatedProduct]; }
             } else {
                 return prev.filter(p => p._id !== updatedProduct._id);
             }
        });

        console.log("Updated Discounted Products:", discountedProducts);
        console.log("Updated Available Products:", availableProducts);
      }

    // --- Add Discount Form Section Logic --- (no changes needed here)
    const handleSelectProductForAdd = (product) => {
        setProductToAddDiscount(product);
        setAddFormRate("");
        setAddFormPrice("");
        setAddFormError(null);
        setError(null);
        handleCancelInlineEdit();
    };
    const handleCancelAdd = () => {
        setProductToAddDiscount(null);
        setAddFormRate("");
        setAddFormPrice("");
        setAddFormError(null);
    };
    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        if (!productToAddDiscount || !addFormRate || !addFormPrice) { setAddFormError("Discount Rate and New Price are required."); return; }
        const rate = parseFloat(addFormRate);
        const price = parseFloat(addFormPrice);
        const originalPrice = parseFloat(productToAddDiscount.price); // Parse original price too

        if (isNaN(rate) || rate <= 0 || rate >= 100) { setAddFormError("Discount Rate must be a number between 0 and 100."); return; }
        if (isNaN(price) || price <= 0) { setAddFormError("New Price must be a positive number."); return; }
        // Check against parsed original price
        if (isNaN(originalPrice) || price >= originalPrice) { setAddFormError("New Price must be lower than the original price."); return; }

        setIsLoading(true); setAddFormError(null); setError(null);
        try {
          const response = await authAxios.post(`/admin/discounts/${productToAddDiscount._id}`, { discountRate: rate, newPrice: price });
        //   updateLocalProductState(response.data.product);
        const updatedProduct = response.data.product;
        updateLocalProductState(updatedProduct);
          handleCancelAdd();
        } catch (err) {
          console.error("Error adding discount:", err);
          setAddFormError(err.response?.data?.error || "Failed to add discount. Check console.");
        } finally { setIsLoading(false); }
    };

    // --- Inline Edit Logic --- (no changes needed here)
    const handleStartInlineEdit = (product) => {
        setEditingProductId(product._id);
        setInlineEditRate(product.discountRate || "");
        setInlineEditPrice(product.newPrice || "");
        setInlineEditError(null);
        setError(null);
        handleCancelAdd();
    };
    const handleCancelInlineEdit = () => {
        setEditingProductId(null);
        setInlineEditRate("");
        setInlineEditPrice("");
        setInlineEditError(null);
    };
    const handleInlineEditSubmit = async (e) => {
         e.preventDefault();
         if (!editingProductId || !inlineEditRate || !inlineEditPrice) { setInlineEditError("Discount Rate and New Price are required."); return; }
         const rate = parseFloat(inlineEditRate);
         const price = parseFloat(inlineEditPrice);
         const originalProduct = discountedProducts.find(p => p._id === editingProductId);

         if (!originalProduct) { setInlineEditError("Original product not found."); handleCancelInlineEdit(); return; }
         const originalPrice = parseFloat(originalProduct.price); // Parse original price

         if (isNaN(rate) || rate <= 0 || rate >= 100) { setInlineEditError("Discount Rate must be a number between 0 and 100."); return; }
         if (isNaN(price) || price <= 0) { setInlineEditError("New Price must be a positive number."); return; }
         // Check against parsed original price
         if (isNaN(originalPrice) || price >= originalPrice) { setInlineEditError("New Price must be lower than the original price."); return; }

         setIsLoading(true); setInlineEditError(null); setError(null);
         try {
           const response = await authAxios.post(`/admin/discounts/${editingProductId}`, { discountRate: rate, newPrice: price });
           updateLocalProductState(response.data.product);
           handleCancelInlineEdit();
         } catch (err) {
           console.error("Error updating discount:", err);
           setInlineEditError(err.response?.data?.error || "Failed to update discount. Check console.");
         } finally { setIsLoading(false); }
    };

    // --- Remove Discount Handler --- (no changes needed here)
    const handleRemoveDiscount = async (productId) => {
        if (editingProductId === productId) { handleCancelInlineEdit(); }
        if (!window.confirm("Are you sure you want to remove the discount from this product?")) { return; }
        setIsLoading(true); setError(null);
        try {
          const response = await authAxios.delete(`/admin/discounts/${productId}`);
          updateLocalProductState(response.data.product);
        } catch (err) {
          console.error("Error removing discount:", err);
          setError( err.response?.data?.error || "Failed to remove discount. Check console.");
        } finally { setIsLoading(false); }
    };


    return (
        <div className={styles.adminLayout}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.adminHeader}>
                    <h1>Discount Management</h1>
                    <div className={styles.userInfo}>
                        <span>Welcome, {user?.name || "Admin"}</span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>

                {productsLoading && <p>Loading products...</p>}
                {productsError && (
                    <p className={styles.errorText}>Error loading products: {productsError}</p>
                )}
                {error && <p className={styles.errorText}>{error}</p>} {/* General API Errors */}


                {/* --- Add Discount Form Section --- */}
                {productToAddDiscount && (
                    <div id="add-discount-form-section" className={`${styles.section} ${styles.addFormSection}`}>
                        <h2>Add Discount for: {productToAddDiscount.name}</h2>
                        <p className={styles.originalPriceInfo}>
                            {/* ***** FIXED PRICE FORMATTING ***** */}
                            Original Price: {productToAddDiscount.price}
                        </p>
                        <form onSubmit={handleAddFormSubmit} className={styles.inlineForm}>
                            {/* Form inputs remain the same */}
                            <div className={styles.formGroupInline}>
                                <label htmlFor="addRate">Rate (%):</label>
                                <input type="number" id="addRate" value={addFormRate} onChange={(e) => setAddFormRate(e.target.value)} placeholder="e.g., 15" min="1" max="99" step="0.01" required disabled={isLoading}/>
                            </div>
                            <div className={styles.formGroupInline}>
                                <label htmlFor="addPrice">New Price (IQD):</label>
                                <input type="number" id="addPrice" value={addFormPrice} onChange={(e) => setAddFormPrice(e.target.value)} placeholder="e.g., 19.99" min="0.01" step="0.01" required disabled={isLoading} />
                            </div>
                            <div className={styles.formActionsInline}>
                                <button type="submit" className={`${styles.actionButton} ${styles.saveButton}`} disabled={isLoading}> {isLoading ? "Saving..." : "Save Discount"} </button>
                                <button type="button" onClick={handleCancelAdd} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isLoading}> Cancel </button>
                            </div>
                            {addFormError && <p className={styles.errorTextInline}>{addFormError}</p>}
                        </form>
                    </div>
                )}

                {/* --- Discounted Products Section --- */}
                <div className={styles.section}>
                    <h2>Current Discounts</h2>
                    {discountedProducts.length === 0 && !productsLoading ? (
                        <p>No products currently have discounts.</p>
                    ) : (
                        <table className={styles.productTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Original Price</th>
                                    <th>Discount Rate (%)</th>
                                    <th>New Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discountedProducts.map((product) => (
                                    <tr key={product._id} className={editingProductId === product._id ? styles.editingRow : ''}>
                                        {editingProductId === product._id ? (
                                            // --- Inline Edit Mode ---
                                            <>
                                                <td>{product.name}</td>
                                                 {/* ***** FIXED PRICE FORMATTING ***** */}
                                                 <td>{formatPrice(product.price)}</td>
                                                <td>
                                                    <input type="number" value={inlineEditRate} onChange={(e) => setInlineEditRate(e.target.value)} className={styles.inlineInput} min="1" max="99" step="0.01" required disabled={isLoading}/>
                                                </td>
                                                <td>
                                                    <input type="number" value={inlineEditPrice} onChange={(e) => setInlineEditPrice(e.target.value)} className={styles.inlineInput} min="0.01" step="0.01" required disabled={isLoading}/>
                                                </td>
                                                <td>
                                                    <button onClick={handleInlineEditSubmit} className={`${styles.actionButton} ${styles.saveButton}`} disabled={isLoading}> {isLoading ? "Saving..." : "Save"} </button>
                                                    <button onClick={handleCancelInlineEdit} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isLoading}> Cancel </button>
                                                    {inlineEditError && <p className={styles.errorTextInline}>{inlineEditError}</p>}
                                                </td>
                                            </>
                                        ) : (
                                            // --- Display Mode ---
                                            <>
                                                <td>{product.name}</td>
                                                 {/* ***** FIXED PRICE FORMATTING ***** */}
                                                <td>{formatPrice(product.price)}</td>
                                                <td>{product.discountRate}%</td>
                                                 {/* Also format newPrice safely, assuming it might also be a string */}
                                                <td>{formatPrice(product.newPrice)}</td>
                                                <td>
                                                    <button onClick={() => handleStartInlineEdit(product)} className={`${styles.actionButton} ${styles.updateButton}`} disabled={isLoading || !!editingProductId || !!productToAddDiscount} > Update </button>
                                                    <button onClick={() => handleRemoveDiscount(product._id)} className={`${styles.actionButton} ${styles.removeButton}`} disabled={isLoading || editingProductId === product._id} > Remove </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- Available Products Section --- */}
                <div className={styles.section}>
                   <h2>Available Products (Add Discount)</h2>
                   {availableProducts.length === 0 && !productsLoading ? (
                     <p>All products currently have discounts or no products loaded.</p>
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
                              {/* ***** FIXED PRICE FORMATTING ***** */}
                             <td>{formatPrice(product.price)}</td>
                             <td>
                               <button onClick={() => handleSelectProductForAdd(product)} className={`${styles.actionButton} ${styles.addButton}`} disabled={isLoading || !!editingProductId || !!productToAddDiscount} > Add Discount </button>
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

export default DiscountManagement;




// import { useAuth } from "../../contexts/AuthContext";
// import { useProduct } from "../../contexts/ProductContext";
// import Sidebar from "./Sidebar";
// import styles from "./DiscountManagement.module.css";

// function DiscountManagement() {
//     const { user, logout } = useAuth();
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

// export default DiscountManagement