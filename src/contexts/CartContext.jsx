import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useProduct } from "./ProductContext";

const CartContext = createContext({
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartProvider = ({ children }) => {
  const { products, baseUrl } = useProduct();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [cartId, setCartId] = useState(() => {
    return localStorage.getItem("cartId") || null;
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!cartId) {
          try {
            const response = await axios.post(`${baseUrl}/cart/create`);
            const newCartId = response.data.cart.cartId;
            setCartId(newCartId);
            localStorage.setItem("cartId", newCartId);
            setCart(response.data.cart);
          } catch (createErr) {
            console.error("Error creating cart:", createErr);
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
          }
        } else {
          try {
            const response = await axios.get(
              `${baseUrl}/cart?cartId=${cartId}`
            );
            setCart(response.data.cart);
          } catch (getErr) {
            console.error("Error fetching cart:", getErr);
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
          }
        }
      } catch (err) {
        console.error("Error in cart operations:", err);
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    };

    fetchCart();
  }, [cartId, baseUrl]);

  const addToCart = async (productId) => {
    try {
      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      const productToAdd = products.find((p) => p.id === productId);
      if (!productToAdd) {
        console.error("Product not found:", productId);
        return;
      }

      const mongoId = productToAdd._id;

      if (!mongoId) {
        console.error("Product has no MongoDB ID:", productId);
        return;
      }

      const updatedCart = {
        ...cart,
        items: [
          ...cart.items,
          {
            productId: mongoId,
            product: {
              id: productId,
              name: productToAdd.name,
              image: productToAdd.image,
              price: productToAdd.price,
              category: productToAdd.category,
            },
          },
        ],
        totalItems: cart.totalItems + 1,
        totalPrice:
          cart.totalPrice +
          parseFloat(productToAdd.price.replace(/[^0-9.]/g, "")),
      };

      setCart(updatedCart);

      try {
        const response = await axios.post(`${baseUrl}/cart/add`, {
          cartId,
          productId: mongoId,
        });

        setCart(response.data.cart);
      } catch (apiErr) {
        console.error("API error adding to cart:", apiErr);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      const itemToRemove = cart.items.find(
        (item) => item.product.id === productId
      );

      if (!itemToRemove) {
        console.error("Item not found in cart:", productId);
        return;
      }

      const mongoId = itemToRemove.productId;

      const updatedCart = {
        ...cart,
        items: cart.items.filter((item) => item.product.id !== productId),
        totalItems: cart.totalItems - 1,
        totalPrice:
          cart.totalPrice -
          parseFloat(itemToRemove.product.price.replace(/[^0-9.]/g, "")),
      };

      setCart(updatedCart);

      const response = await axios.post(`${baseUrl}/cart/remove`, {
        cartId,
        productId: mongoId,
      });

      setCart(response.data.cart);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      setCart({ items: [], totalItems: 0, totalPrice: 0 });

      const response = await axios.post(`${baseUrl}/cart/clear`, {
        cartId,
      });

      setCart(response.data.cart);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [cart]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CartProvider, useCart };
