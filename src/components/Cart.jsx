import styles from "./Cart.module.css";
import PropTypes from "prop-types";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";

function Cart({ product }) {
  const { baseUrl } = useProduct();
  const { removeFromCart } = useCart();
  const imageUrl = `${baseUrl}${product.image}`;

  const handleRemove = () => {
    if (window.confirm("Are you sure to delete this item in your cart?")) {
      removeFromCart(product.id);
    }
  };

  return (
    <div className={styles.cart}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} />
      </div>

      <div className={styles.productInfo}>
        <h4>{product.name}</h4>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>{product.price}</p>
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
    description: PropTypes.string.isRequired
  }).isRequired,
};

export default Cart;
