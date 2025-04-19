import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useProduct } from "./ProductContext";

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    const numericPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, ""));
    const quantity = item.quantity || item.product.quantity || 1;

    if (item.product.isDiscounted && item.product.discountRate > 0) {
      const discountedPrice =
        numericPrice * (1 - item.product.discountRate / 100);
      return total + discountedPrice * quantity;
    }

    return total + numericPrice * quantity;
  }, 0);
};

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

const initializeCart = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      if (!parsedCart.items || !Array.isArray(parsedCart.items)) {
        console.warn("Invalid cart structure in localStorage, resetting");
        localStorage.removeItem("cart");
        return { items: [], totalItems: 0, totalPrice: 0 };
      }

      const validItems = parsedCart.items.filter(
        (item) => item && item.product && item.productId
      );

      const itemsWithDiscounts = validItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          isDiscounted: item.product.isDiscounted || false,
          discountRate: item.product.discountRate || 0,
          isFeatured: item.product.isFeatured || false,
        },
      }));

      return {
        ...parsedCart,
        items: itemsWithDiscounts,
        totalItems: itemsWithDiscounts.length,
        totalPrice: calculateTotalPrice(itemsWithDiscounts),
      };
    }
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    localStorage.removeItem("cart");
  }

  return { items: [], totalItems: 0, totalPrice: 0 };
};

const CartProvider = ({ children }) => {
  const { products, baseUrl, searchResults } = useProduct();
  const [cart, setCart] = useState(initializeCart());
  const [cartId, setCartId] = useState(() => {
    // this will be used to fetch the cart from the server
    const existingCartId = localStorage.getItem("cartId");
    if (existingCartId) return existingCartId;

    // this will be used to generate a new cartId
    const newCartId = `cart_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("cartId", newCartId);
    return newCartId;
  });

  // we need to fetch the cart from the server and preserve the discount information so that we can display the correct price 
  useEffect(() => {
    const fetchCart = async (retries = 3, delay = 1000) => {
      try {
        if (!cartId) {
          console.log("No cart ID available");
          return;
        }

        try {
          const response = await axios.get(`${baseUrl}/cart`, {
            params: { cartId },
          });
          const cartWithDiscounts = {
            ...response.data.cart,
            items: response.data.cart.items.map((item) => {
              // this is to preserve the discount information so that we can display the correct price
              const existingItem = cart.items.find(
                (cartItem) => cartItem.productId === item.productId
              );
              return {
                ...item,
                product: {
                  ...item.product,
                  isDiscounted:
                    existingItem?.product.isDiscounted ||
                    item.product.isDiscounted ||
                    false,
                  discountRate:
                    existingItem?.product.discountRate ||
                    item.product.discountRate ||
                    0,
                  isFeatured:
                    existingItem?.product.isFeatured ||
                    item.product.isFeatured ||
                    false,
                  price: existingItem?.product.price || item.product.price,
                },
              };
            }),
          };

          setCart(cartWithDiscounts);
          localStorage.setItem("cart", JSON.stringify(cartWithDiscounts));
        } catch (error) {
          if (error.response?.status === 429 && retries > 0) {
            console.log(`Rate limited, retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchCart(retries - 1, delay * 2);
          }
          throw error;
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [cartId, baseUrl]);

  // save cart to localStorage
  useEffect(() => {
    if (cart && cart.items) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cart]);

  const addToCart = async (productId) => {
    try {
      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      let productToAdd = products.find(
        (p) => p._id === productId || p.id === productId
      );

      if (!productToAdd) {
        productToAdd = searchResults.find(
          (p) => p._id === productId || p.id === productId
        );

        if (!productToAdd) {
          try {
            console.log("Fetching product from API:", productId);
            const response = await axios.get(
              `${baseUrl}/products/${productId}`
            );
            productToAdd = response.data.product;
          } catch (err) {
            console.error("Failed to fetch product details:", err);
            return;
          }
        }
      }

      if (!productToAdd) {
        console.error("Product not found:", productId);
        return;
      }

      const updatedCart = {
        ...cart,
        items: [
          ...cart.items,
          {
            productId: productToAdd._id || productToAdd.id,
            product: {
              id: productToAdd._id || productToAdd.id,
              name: productToAdd.name,
              image: productToAdd.image,
              price: productToAdd.price,
              category: productToAdd.category,
              description: productToAdd.description || "",
              isDiscounted: productToAdd.isDiscounted || false,
              discountRate: productToAdd.discountRate || 0,
              isFeatured: productToAdd.isFeatured || false,
              quantity: 1,
            },
          },
        ],
        totalItems: cart.totalItems + 1,
        totalPrice: calculateTotalPrice([
          ...cart.items,
          { product: productToAdd },
        ]),
      };

      setCart(updatedCart);

      try {
        const response = await axios.post(`${baseUrl}/cart/add`, {
          cartId,
          productId: productId,
        });

        const cartWithDiscounts = {
          ...response.data.cart,
          items: response.data.cart.items.map((item) => {
            // this originalItem is the item that is already in the cart and is used to preserve the discount information by comparing the productId of the item in the cart with the productId of the item in the response
            const originalItem = updatedCart.items.find(
              (cartItem) => cartItem.productId === item.productId
            );

            return {
              ...item,
              product: {
                ...item.product,
                isDiscounted: originalItem?.product.isDiscounted || false,
                discountRate: originalItem?.product.discountRate || 0,
                isFeatured: originalItem?.product.isFeatured || false,
                price: originalItem?.product.price || item.product.price,
              },
            };
          }),
        };

        setCart(cartWithDiscounts);
        localStorage.setItem("cart", JSON.stringify(cartWithDiscounts));
      } catch (apiErr) {
        console.error("API error adding to cart:", apiErr);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
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
        (item) => item.productId === productId || item.product.id === productId
      );

      if (!itemToRemove) {
        console.error("Item not found in cart:", productId);
        return;
      }

      const updatedCart = {
        ...cart,
        items: cart.items.filter(
          (item) =>
            item.productId !== productId && item.product.id !== productId
        ),
        totalItems: cart.totalItems - 1,
        totalPrice: calculateTotalPrice(
          cart.items.filter(
            (item) =>
              item.productId !== productId && item.product.id !== productId
          )
        ),
      };

      setCart(updatedCart);

      try {
        const response = await axios.post(`${baseUrl}/cart/remove`, {
          cartId,
          productId: itemToRemove.productId,
        });

        const cartWithDiscounts = {
          ...response.data.cart,
          items: response.data.cart.items.map((item) => {
            const originalItem = updatedCart.items.find(
              (cartItem) => cartItem.productId === item.productId
            );

            return {
              ...item,
              product: {
                ...item.product,
                isDiscounted: originalItem?.product.isDiscounted || false,
                discountRate: originalItem?.product.discountRate || 0,
                isFeatured: originalItem?.product.isFeatured || false,
                price: originalItem?.product.price || item.product.price,
              },
            };
          }),
        };

        cartWithDiscounts.totalPrice = calculateTotalPrice(
          cartWithDiscounts.items
        );

        setCart(cartWithDiscounts);
      } catch (apiErr) {
        console.error("API error removing from cart:", apiErr);
        setCart(cart);
      }
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

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      if (!cartId) {
        console.error("No cart ID available");
        return;
      }

      const itemToUpdate = cart.items.find(
        (item) => item.productId === productId || item.product.id === productId
      );

      if (!itemToUpdate) {
        console.error("Item not found in cart:", productId);
        return;
      }

      // first update the cart locally because the server will take time to update
      const updatedItems = cart.items.map((item) => {
        if (item.productId === productId || item.product.id === productId) {
          return {
            ...item,
            quantity: quantity,
            product: {
              ...item.product,
              quantity: quantity,
            },
          };
        }
        return item;
      });

      const updatedCart = {
        ...cart,
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
      };

      setCart(updatedCart);

      // and then update the server by sending the productId and the new quantity
      try {
        const response = await axios.post(`${baseUrl}/cart/update`, {
          cartId,
          productId: itemToUpdate.productId,
          quantity: quantity,
        });

        // this is to ensure that the discount properties are preserved and calculate correct total
        const cartWithDiscounts = {
          ...response.data.cart,
          items: response.data.cart.items.map((item) => {
            // Find the original item to preserve discount properties
            const originalItem = updatedItems.find(
              (cartItem) =>
                cartItem.productId === item.productId ||
                cartItem.product.id === item.productId
            );

            return {
              ...item,
              product: {
                ...item.product,
                // if the item is already in the cart, use the original item's properties
                // otherwise, use the item.product.isDiscounted || false
                isDiscounted: originalItem
                  ? originalItem.product.isDiscounted
                  : item.product.isDiscounted || false,
                discountRate: originalItem
                  ? originalItem.product.discountRate
                  : item.product.discountRate || 0,
                isFeatured: originalItem
                  ? originalItem.product.isFeatured
                  : item.product.isFeatured || false,
                price: originalItem
                  ? originalItem.product.price
                  : item.product.price,
                quantity: item.quantity || quantity,
              },
            };
          }),
        };

        cartWithDiscounts.totalPrice = calculateTotalPrice(
          cartWithDiscounts.items
        );
        setCart(cartWithDiscounts);
      } catch (apiErr) {
        console.error("API error updating cart item quantity:", apiErr);
        setCart(cart);
      }
    } catch (err) {
      console.error("Error updating cart item quantity:", err);
    }
  };

  // ✅ Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateCartItemQuantity,
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
