import styles from "./CartWishlist.module.css";
import { useProduct } from "../contexts/ProductContext";
import Cart from "./Cart";

function CartWishlist() {
  const { products } = useProduct();
  const addedProducts = products.slice(0, 2);

  return (
    <>
      <div className={styles.wishlist}>
        <h3>Shopping Cart Wishlist</h3>
        <p>X items in the Cart</p>

        <div className={styles.carts}>
          {addedProducts.map((product) => (
            <Cart key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className={styles.proceed}></div>
    </>
  );
}

export default CartWishlist;
