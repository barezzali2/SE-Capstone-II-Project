import styles from "./Cart.module.css";
import PropTypes from "prop-types";

function Cart({ product }) {
  const imageUrl = `http://localhost:3003${product.image}`;

  return (
    <div className={styles.cart}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} />
      </div>

      <div className={styles.productInfo}>
        <h4>{product.name}</h4>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.quantity}>Quantity: X</p>
        <p className={styles.price}>{product.price}</p>
      </div>
      <button className={styles.removeCart}>×</button>
    </div>
  );
}

Cart.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cart;
