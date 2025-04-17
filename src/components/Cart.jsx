import styles from "./Cart.module.css";
import PropTypes from "prop-types";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";

function Cart({ product }) {
  const { baseUrl } = useProduct();
  const { removeFromCart } = useCart();
  const imageUrl = `${baseUrl}${product.image}`;

  const calculateDiscountedPrice = (price) => {
    if (!product.isDiscounted || !product.discountRate) return price;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - product.discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure to delete this item in your cart?")) {
      removeFromCart(product.id);
    }
  };

  return (
    <div className={styles.cart}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} />
        {product.isDiscounted && product.discountRate > 0 && (
          <span className={styles.discountBadge}>-{product.discountRate}%</span>
        )}
      </div>

      <div className={styles.productInfo}>
        <h4>{product.name}</h4>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.priceContainer}>
          {product.isDiscounted && product.discountRate > 0 ? (
            <>
              <span className={styles.originalPrice}>{product.price}</span>
              <span className={styles.discountedPrice}>
                {calculateDiscountedPrice(product.price)}
              </span>
            </>
          ) : (
            <p className={styles.price}>{product.price}</p>
          )}
        </div>
        <p className={styles.desc}>{product.description}</p>
      </div>
      <button className={styles.removeCart} onClick={handleRemove}>
        ×
      </button>
    </div>
  );
}

Cart.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isDiscounted: PropTypes.bool,
    discountRate: PropTypes.number,
    isFeatured: PropTypes.bool,
  }).isRequired,
};

export default Cart;
