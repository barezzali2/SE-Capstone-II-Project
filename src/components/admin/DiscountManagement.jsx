import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import { useAdmin } from "../../contexts/AdminContext";
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
    return num.toFixed(0);
  }
  return "N/A"; // Fallback for invalid/missing price
};

function DiscountManagement() {
  const { user } = useAuth();
  const {
    products: allProducts,
    loading: productsLoading,
    error: productsError,
    refreshProducts,
  } = useProduct();
  const { updateDiscount, removeDiscount } = useAdmin();

  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For API actions
  const [error, setError] = useState(null); // For API errors

  // State for the "Add Discount" form section
  const [productToAddDiscount, setProductToAddDiscount] = useState(null);
  const [addFormRate, setAddFormRate] = useState("");
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
        (p) =>
          p.isDiscounted === true && p.discountRate > 0 && p.newPrice !== null
      );
      const available = allProducts.filter(
        (p) => !p.isDiscounted || p.discountRate <= 0 || p.newPrice === null
      );

      console.log("Discounted Products:", discounted);
      console.log("Available Products:", available);

      setDiscountedProducts(discounted);
      setAvailableProducts(available);

      // If the product being added/edited is removed from the source list, cancel the edit/add
      if (
        productToAddDiscount &&
        !available.some((p) => p._id === productToAddDiscount._id)
      ) {
        handleCancelAdd();
      }
      if (
        editingProductId &&
        !discounted.some((p) => p._id === editingProductId)
      ) {
        handleCancelInlineEdit();
      }
    } else {
      setDiscountedProducts([]);
      setAvailableProducts([]);
      handleCancelAdd();
      handleCancelInlineEdit();
    }
  }, [allProducts, productToAddDiscount, editingProductId]);

  const updateLocalProductState = (updatedProduct) => {
    if (updatedProduct.isDiscounted && updatedProduct.discountRate != null) {
      setDiscountedProducts((prev) => {
        const existingIndex = prev.findIndex(
          (p) => p._id === updatedProduct._id
        );
        if (existingIndex > -1) {
          const newArr = [...prev];
          newArr[existingIndex] = updatedProduct;
          return newArr;
        }
        return [...prev, updatedProduct];
      });
      setAvailableProducts((prev) =>
        prev.filter((p) => p._id !== updatedProduct._id)
      );
    } else {
      setDiscountedProducts((prev) =>
        prev.filter((p) => p._id !== updatedProduct._id)
      );
      setAvailableProducts((prev) => {
        const existingIndex = prev.findIndex(
          (p) => p._id === updatedProduct._id
        );
        if (existingIndex > -1) {
          const newArr = [...prev];
          newArr[existingIndex] = updatedProduct;
          return newArr;
        }
        return [...prev, updatedProduct];
      });
    }
  };

  // --- Add Discount Form Section Logic --- (no changes needed here)
  const handleSelectProductForAdd = (product) => {
    setProductToAddDiscount(product);
    setAddFormRate("");
    setAddFormError(null);
    setError(null);
    handleCancelInlineEdit();
  };
  const handleCancelAdd = () => {
    setProductToAddDiscount(null);
    setAddFormRate("");
    setAddFormError(null);
  };
  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    if (!productToAddDiscount || !addFormRate) {
      setAddFormError("Discount Rate is required.");
      return;
    }

    const rate = parseFloat(addFormRate);
    const originalPrice = parseFloat(productToAddDiscount.price);

    if (isNaN(rate) || rate <= 0 || rate >= 100) {
      setAddFormError("Discount Rate must be a number between 0 and 100.");
      return;
    }

    // this is the new price that will be set after the discount is applied
    const discountAmount = (originalPrice * rate) / 100;
    const newPrice = originalPrice - discountAmount;

    setIsLoading(true);
    try {
      const result = await updateDiscount(productToAddDiscount._id, {
        discountRate: rate,
        newPrice: newPrice.toFixed(0), // Round to whole number for IQD
      });
      updateLocalProductState(result.product);
      handleCancelAdd();
      await refreshProducts();
    } catch (err) {
      setAddFormError(err.message || "Failed to add discount");
    } finally {
      setIsLoading(false);
    }
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
    if (!editingProductId || !inlineEditRate) {
      setInlineEditError("Discount Rate is required.");
      return;
    }

    const rate = parseFloat(inlineEditRate);
    const originalProduct = discountedProducts.find(
      (p) => p._id === editingProductId
    );

    if (!originalProduct) {
      setInlineEditError("Original product not found.");
      handleCancelInlineEdit();
      return;
    }

    const originalPrice = parseFloat(originalProduct.price);

    if (isNaN(rate) || rate <= 0 || rate >= 100) {
      setInlineEditError("Discount Rate must be a number between 0 and 100.");
      return;
    }

    // this is the new price that will be set after the discount is applied
    const discountAmount = (originalPrice * rate) / 100;
    const newPrice = originalPrice - discountAmount;

    setIsLoading(true);
    setInlineEditError(null);
    setError(null);
    try {
      const response = await updateDiscount(editingProductId, {
        discountRate: rate,
        newPrice: newPrice.toFixed(0),
      });
      updateLocalProductState(response.product);
      handleCancelInlineEdit();
      await refreshProducts();
    } catch (err) {
      console.error("Error updating discount:", err);
      setInlineEditError(
        err.response?.data?.error || "Failed to update discount"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Remove Discount Handler --- (no changes needed here)
  const handleRemoveDiscount = async (productId) => {
    if (editingProductId === productId) {
      handleCancelInlineEdit();
    }
    if (
      !window.confirm(
        "Are you sure you want to remove the discount from this product?"
      )
    ) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await removeDiscount(productId);
      updateLocalProductState(response.product);
      await refreshProducts();
    } catch (err) {
      console.error("Error removing discount:", err);
      setError(
        err.response?.data?.error || "Failed to remove discount. Check console."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Discount Management</h1>
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
        {error && <p className={styles.errorText}>{error}</p>}{" "}
        {/* General API Errors */}
        {/* --- Add Discount Form Section --- */}
        {productToAddDiscount && (
          <div
            id="add-discount-form-section"
            className={`${styles.section} ${styles.addFormSection}`}
          >
            <h2>Add Discount for: {productToAddDiscount.name}</h2>
            <p className={styles.originalPriceInfo}>
              {/* ***** FIXED PRICE FORMATTING ***** */}
              Original Price: {productToAddDiscount.price}
            </p>
            {addFormRate && (
                <div className={styles.previewPrice}>
                  New Price will be:{" "}
                  {formatPrice(
                    parseFloat(productToAddDiscount.price) *
                      (1 - parseFloat(addFormRate) / 100)
                  )}{" "}
                  IQD
                </div>
              )}
            <form onSubmit={handleAddFormSubmit} className={styles.inlineForm}>
              <div className={styles.formGroupInline}>
                <label htmlFor="addRate">Discount Rate (%):</label>
                <input
                  type="number"
                  id="addRate"
                  value={addFormRate}
                  onChange={(e) => setAddFormRate(e.target.value)}
                  placeholder="e.g., 15"
                  min="1"
                  max="99"
                  step="0.01"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Discount"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
              {addFormError && (
                <p className={styles.errorTextInline}>{addFormError}</p>
              )}
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
                  <tr
                    key={product._id}
                    className={
                      editingProductId === product._id ? styles.editingRow : ""
                    }
                  >
                    {editingProductId === product._id ? (
                      // --- Inline Edit Mode ---
                      <>
                        <td>{product.name}</td>
                        {/* ***** FIXED PRICE FORMATTING ***** */}
                        <td>{formatPrice(product.price)}</td>
                        <td>
                          <form
                            onSubmit={handleInlineEditSubmit}
                            className={styles.inlineForm}
                          >
                            <div className={styles.formGroupInline}>
                              <label htmlFor="editRate">Rate (%):</label>
                              <input
                                type="number"
                                id="editRate"
                                value={inlineEditRate}
                                onChange={(e) =>
                                  setInlineEditRate(e.target.value)
                                }
                                placeholder="e.g., 15"
                                min="1"
                                max="99"
                                required
                                disabled={isLoading}
                              />
                            </div>
                            {inlineEditRate && (
                              <div className={styles.previewPrice}>
                                New Price will be:{" "}
                                {formatPrice(
                                  parseFloat(product.price) *
                                    (1 - parseFloat(inlineEditRate) / 100)
                                )}{" "}
                                IQD
                              </div>
                            )}
                            <div className={styles.formActionsInline}>
                              <button
                                type="submit"
                                className={`${styles.actionButton} ${styles.saveButton}`}
                                disabled={isLoading}
                              >
                                {isLoading ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelInlineEdit}
                                className={`${styles.actionButton} ${styles.cancelButton}`}
                                disabled={isLoading}
                              >
                                Cancel
                              </button>
                            </div>
                            {inlineEditError && (
                              <div className={styles.errorTextInline}>
                                {inlineEditError}
                              </div>
                            )}
                          </form>
                        </td>
                        <td>{formatPrice(product.newPrice)}</td>
                        <td>
                          <button
                            onClick={() => handleRemoveDiscount(product._id)}
                            className={`${styles.actionButton} ${styles.removeButton}`}
                            disabled={
                              isLoading || editingProductId === product._id
                            }
                          >
                            {" "}
                            Remove{" "}
                          </button>
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
                          <button
                            onClick={() => handleStartInlineEdit(product)}
                            className={`${styles.actionButton} ${styles.updateButton}`}
                            disabled={
                              isLoading ||
                              !!editingProductId ||
                              !!productToAddDiscount
                            }
                          >
                            {" "}
                            Update{" "}
                          </button>
                          <button
                            onClick={() => handleRemoveDiscount(product._id)}
                            className={`${styles.actionButton} ${styles.removeButton}`}
                            disabled={
                              isLoading || editingProductId === product._id
                            }
                          >
                            {" "}
                            Remove{" "}
                          </button>
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
                    <td>{formatPrice(product.price)} IQD</td>
                    <td>
                      <button
                        onClick={() => handleSelectProductForAdd(product)}
                        className={`${styles.actionButton} ${styles.addButton}`}
                        disabled={
                          isLoading ||
                          !!editingProductId ||
                          !!productToAddDiscount
                        }
                      >
                        Add Discount
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
