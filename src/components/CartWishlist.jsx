import styles from "./CartWishlist.module.css";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";

function CartWishlist() {
  const { cart, clearCart } = useCart();
  const cartItems = cart?.items || [];

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
        return total + (discountedPrice * quantity);
      }
      return total + (numericPrice * quantity);
    }, 0);
  };

  const originalTotal = calculateOriginalTotal();
  const discountedTotal = calculateDiscountedTotal();
  const hasDiscount = originalTotal > discountedTotal;
  const savings = originalTotal - discountedTotal;

  const formatPrice = (price) => {
    return `${Math.round(price)} IQD`;
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
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
                      quantity: item.quantity || item.product.quantity || 1
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
            {hasDiscount ? (
              <>
                <span className={styles.totalOriginalPrice}>
                  Original Total: {formatPrice(originalTotal)}
                </span>
                <span className={styles.totalDiscountedPrice}>
                  Total: {formatPrice(discountedTotal)}
                </span>
                <span className={styles.savings}>
                  You save: {formatPrice(savings)}
                </span>
              </>
            ) : (
              <span className={styles.totalDiscountedPrice}>
                Total: {formatPrice(originalTotal)}
              </span>
            )}
          </div>
          <button className={styles.clearCartButton} onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default CartWishlist;
