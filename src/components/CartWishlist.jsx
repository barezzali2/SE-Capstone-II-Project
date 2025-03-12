import styles from "./CartWishlist.module.css";
import { useCart } from "../contexts/CartContext";
import Cart from "./Cart";

function CartWishlist() {
  const { cart, clearCart } = useCart();
  const cartItems = cart?.items || [];

  const formatTotalPrice = () => {
    if (!cart.totalPrice) return "0 IQD";
    if (
      typeof cart.totalPrice === "string" &&
      cart.totalPrice.includes("IQD")
    ) {
      // the regex is used to extract all the numbers from the string
      const numbers = cart.totalPrice.match(/\d+/g) || [];
      const total = numbers.reduce((sum, num) => sum + parseInt(num, 10), 0);
      return `${total} IQD`;
    }
    return `${cart.totalPrice} IQD`;
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
                      id: item.productId,
                      ...item.product,
                    }
                  : null
              }
            />
          ))
        ) : (
          <p className={styles.emptyCart}>Your cart is empty</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.cartActions}>
          <div className={styles.total}>
            <span>Total: {formatTotalPrice()}</span>
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
