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

const initializeCart = () => {
  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => {
      const numericPrice = parseFloat(
        item.product.price.replace(/[^0-9.]/g, "")
      );
      const quantity = item.quantity || 1;

      if (item.product.isDiscounted && item.product.discountRate > 0) {
        const discountedPrice =
          numericPrice * (1 - item.product.discountRate / 100);
        return total + discountedPrice * quantity;
      }

      return total + numericPrice * quantity;
    }, 0);
  };

  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      // if cart is not valid, reset it
      if (!parsedCart.items || !Array.isArray(parsedCart.items)) {
        console.warn("Invalid cart structure in localStorage, resetting");
        localStorage.removeItem("cart");
        return { items: [], totalItems: 0, totalPrice: 0 };
      }

      // if items are not valid, remove them
      const validItems = parsedCart.items.filter(
        (item) => item && item.product && item.productId && item.quantity
      );

      if (validItems.length !== parsedCart.items.length) {
        console.warn("Some cart items were invalid and have been removed");
      }

      return {
        ...parsedCart,
        items: validItems,
        totalItems: validItems.length,
        totalPrice: calculateCartTotal(validItems),
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
            const cartWithDiscounts = {
              ...response.data.cart,
              items: response.data.cart.items.map((item) => ({
                ...item,
                product: {
                  ...item.product,
                  isDiscounted: item.product.isDiscounted || false,
                  discountRate: item.product.discountRate || 0,
                  isFeatured: item.product.isFeatured || false,
                  price: item.product.price,
                },
              })),
            };

            // this is to ensure that the discount properties are preserved and calculate correct total
            cartWithDiscounts.totalPrice = calculateTotalPrice(
              cartWithDiscounts.items
            );

            setCart(cartWithDiscounts);
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

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const numericPrice = parseFloat(
        item.product.price.replace(/[^0-9.]/g, "")
      );
      const quantity = item.quantity || item.product.quantity || 1;

      if (item.product.isDiscounted && item.product.discountRate > 0) {
        const discountedPrice =
          numericPrice * (1 - item.product.discountRate / 100);
        return total + discountedPrice * quantity;
      }

      return total + numericPrice * quantity;
    }, 0);
  };

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
            const response = await axios.get(`${baseUrl}/product/${productId}`);
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
              isDiscounted: productToAdd.isDiscounted,
              discountRate: productToAdd.discountRate,
              isFeatured: productToAdd.isFeatured,
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
            // here i find the original item in the cart to preserve its discount properties
            const originalItem = cart.items.find(
              (cartItem) => cartItem.productId === item.productId
            );

            return {
              ...item,
              product: {
                ...item.product,
                // if the item is already in the cart, use the original item's properties
                // otherwise, use the productToAdd's properties
                isDiscounted: originalItem
                  ? originalItem.product.isDiscounted
                  : productToAdd.isDiscounted,
                discountRate: originalItem
                  ? originalItem.product.discountRate
                  : productToAdd.discountRate,
                isFeatured: originalItem
                  ? originalItem.product.isFeatured
                  : productToAdd.isFeatured,
                price: originalItem
                  ? originalItem.product.price
                  : productToAdd.price,
              },
            };
          }),
          totalPrice: calculateTotalPrice(response.data.cart.items),
        };

        setCart(cartWithDiscounts);
      } catch (apiErr) {
        console.error("API error adding to cart:", apiErr);
        setCart(cart);
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
