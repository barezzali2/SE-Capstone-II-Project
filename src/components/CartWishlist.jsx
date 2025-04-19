import styles from "./CartWishlist.module.css";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";
import { motion } from "framer-motion";
import { FiPrinter, FiX } from "react-icons/fi";
import { useState } from "react";

function CartWishlist() {
  const { cart, clearCart } = useCart();
  const cartItems = cart?.items || [];

  const [showPreview, setShowPreview] = useState(false);
  const [receiptContent, setReceiptContent] = useState("");

  const calculateOriginalTotal = () => {
    if (!cartItems.length) return 0;

    return cartItems.reduce((total, item) => {
      const numericPrice = parseFloat(
        item.product.price.replace(/[^0-9.]/g, "")
      );
      const quantity = item.quantity || item.product.quantity || 1;
      return total + (isNaN(numericPrice) ? 0 : numericPrice * quantity);
    }, 0);
  };

  const calculateDiscountedTotal = () => {
    if (!cartItems.length) return 0;

    return cartItems.reduce((total, item) => {
      const numericPrice = parseFloat(
        item.product.price.replace(/[^0-9.]/g, "")
      );
      if (isNaN(numericPrice)) return total;

      const quantity = item.quantity || item.product.quantity || 1;

      if (item.product.isDiscounted && item.product.discountRate > 0) {
        const discountedPrice =
          numericPrice * (1 - item.product.discountRate / 100);
        return total + discountedPrice * quantity;
      }
      return total + numericPrice * quantity;
    }, 0);
  };

  const originalTotal = calculateOriginalTotal();
  const discountedTotal = calculateDiscountedTotal();
  const hasDiscount = originalTotal > discountedTotal;
  const savings = originalTotal - discountedTotal;

  const formatPrice = (price) => {
    return `${Math.round(price)} IQD`;
  };

  const calculateItemTotal = (item) => {
    const numericPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    const quantity = item.quantity || item.product.quantity || 1;

    if (item.product.isDiscounted && item.product.discountRate > 0) {
      const discountedPrice =
        numericPrice * (1 - item.product.discountRate / 100);
      return `${Math.round(discountedPrice * quantity)} IQD`;
    }

    return `${Math.round(numericPrice * quantity)} IQD`;
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handlePrintReceipt = () => {
    const content = `
      ====== SHOPPING RECEIPT ======
      Date: ${new Date().toLocaleString()}
      
      ITEMS:
      ${cartItems
        .map(
          (item) => `
      ${item.product.name}
      Quantity: ${item.quantity}
      Price: ${item.product.price}
      ${
        item.product.isDiscounted
          ? `Discount: ${item.product.discountRate}%`
          : ""
      }
      Subtotal: ${calculateItemTotal(item)}
      `
        )
        .join("\n")}
      
      ========================
      Original Total: ${formatPrice(originalTotal)}
      ${
        hasDiscount
          ? `Discounted Total: ${formatPrice(discountedTotal)}
      You Saved: ${formatPrice(savings)}`
          : ""
      }
      ========================
    `;

    setReceiptContent(content);
    setShowPreview(true);
  };

  const handleConfirmPrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Shopping Receipt</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${receiptContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setShowPreview(false);
  };

  return (
    <div className={styles.wishlist}>
      <h3>Shopping Cart</h3>
      <p>{cart?.totalItems || 0} items in the Cart</p>

      <div className={styles.carts}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Cart
              key={item.productId}
              product={
                item.product
                  ? {
                      id: item.product.id,
                      ...item.product,
                      quantity: item.quantity || item.product.quantity || 1,
                    }
                  : null
              }
            />
          ))
        ) : (
          <p className={styles.emptyCart}>
            Your cart is empty! Add items to your cart😊
          </p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.cartActions}>
          <div className={styles.total}>
            {hasDiscount && (
              <span className={styles.totalOriginalPrice}>
                {formatPrice(originalTotal)}
              </span>
            )}
            <span className={styles.totalDiscountedPrice}>
              {formatPrice(hasDiscount ? discountedTotal : originalTotal)}
            </span>
            {hasDiscount && (
              <span className={styles.savings}>
                You saved: {formatPrice(savings)}
              </span>
            )}
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.clearCartButton}
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            <div className={styles.buttonGroup}>
              <motion.button
                className={styles.printReceiptButton}
                onClick={handlePrintReceipt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPrinter className={styles.printerIcon} />
                Print Receipt
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.receiptPreview}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPreview(false)}
            >
              <FiX />
            </button>
            <h4>Receipt Preview</h4>
            <pre>{receiptContent}</pre>
            <div className={styles.previewActions}>
              <button onClick={handleConfirmPrint}>Confirm & Print</button>
              <button onClick={() => setShowPreview(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartWishlist;
