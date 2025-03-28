import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ProductContext = createContext({
  products: [],
  loading: true,
  error: null,
  baseUrl: "http://localhost:3003",
  searchProducts: () => {},
  searchResults: [],
  searchLoading: false,
  searchError: null,
});

const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

const ProductProvider = ({ children }) => {
  const baseUrl = "http://localhost:3003";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/productlist`);
        if (isMounted) {
          const productsWithIds = (response.data.products || []).map(
            (product) => ({
              ...product,
              _id: product._id || product.id.toString(),
            })
          );
          setProducts(productsWithIds);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch products");
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const searchProducts = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      sessionStorage.removeItem("searchAttempted");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    sessionStorage.setItem("searchAttempted", "true");

    try {
      const response = await axios.get(
        `${baseUrl}/search?q=${encodeURIComponent(query)}`
      );
      const searchProductsWithIds = (response.data.products || []).map(
        (product) => ({
          ...product,
          _id: product._id || product.id.toString(),
        })
      );
      setSearchResults(searchProductsWithIds);
      setSearchLoading(false);
    } catch (err) {
      setSearchError(err.message || "Failed to search products");
      setSearchLoading(false);
    }
  };

  // ✅ Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      products,
      loading,
      error,
      baseUrl,
      searchProducts,
      searchResults,
      searchLoading,
      searchError,
    }),
    [products, loading, error, searchResults, searchLoading, searchError]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ProductProvider, useProduct };
