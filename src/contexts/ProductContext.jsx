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
  const [statsData, setStatsData] = useState(null);

  // this is the axios instance for the public routes
  const publicAxios = axios.create({
    baseURL: baseUrl,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await publicAxios.get("/productlist");
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
          setError(
            err.response?.status === 429
              ? "Too many requests. Please wait a moment."
              : "Failed to fetch products"
          );
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
      const response = await publicAxios.get(
        `/search?q=${encodeURIComponent(query)}`
      );

      // this is the search results with the complete details by merging the local products with the search results
      const searchProductsWithDetails = (response.data.products || []).map(
        (product) => {
          // first we find the product in the local products array to get the complete details then we merge the data 
          const localProduct = products.find(
            (p) => p._id === product._id || p.id === product.id
          );
          if (localProduct) {
            return {
              ...product,
              _id: product._id || product.id.toString(),
              isDiscounted: localProduct.isDiscounted,
              discountRate: localProduct.discountRate,
              isFeatured: localProduct.isFeatured,
            };
          }

          // if the product is not found in the local products array then we use the data from the API
          return {
            ...product,
            _id: product._id || product.id.toString(),
            isDiscounted: !!product.isDiscounted,
            discountRate: product.discountRate || 0,
            isFeatured: !!product.isFeatured,
          };
        }
      );

      setSearchResults(searchProductsWithDetails);
    } catch (err) {
      setSearchError(err.message || "Failed to search products");
    } finally {
      setSearchLoading(false);
    }
  };

  const getProductByBarcode = async (barcode) => {
    try {
      const response = await publicAxios.get(`/product/barcode/${barcode}`);
      return response.data.product;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch product by barcode"
      );
    }
  };

  // data for the admin dashboard
  const adminStatistics = async () => {
    try {
      const response = await axios.get(`${baseUrl}/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.statistics;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  };

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const response = await publicAxios.get("/productlist");
      if (response.data && response.data.products) {
        const productsWithIds = response.data.products.map((product) => ({
          ...product,
          _id: product._id || product.id,
        }));
        setProducts(productsWithIds);
        setError(null);
      }
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError(err.message || "Failed to refresh products");
    } finally {
      setLoading(false);
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
      getProductByBarcode,
      adminStatistics,
      refreshProducts,
    }),
    [
      products,
      loading,
      error,
      searchResults,
      searchLoading,
      searchError,
      adminStatistics,
      refreshProducts,
    ]
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
