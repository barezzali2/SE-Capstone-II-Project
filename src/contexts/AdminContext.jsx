import { createContext, useContext, useState, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.PROD
    ? "https://retailxplorebackend.onrender.com"
    : "http://localhost:3003";

  // we create an authenticated axios instance with interceptors, the interceptors are used to add the token to the request headers and to handle the response
  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: baseUrl,
    });

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // interceptor means that if the user is not authenticated, the user will be redirected to the login page
    // so here we are checking if the user is not authenticated, we will remove the token from the local storage
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setError("Authentication failed. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  const getStatistics = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get("/admin/statistics");
      return response.data.statistics;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch statistics");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await authAxios.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (error.response?.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        setError(error.response?.data?.message || "Failed to add product");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, formData) => {
    setLoading(true);
    try {
      const response = await authAxios.put(
        `/admin/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update product");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await authAxios.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete product");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (productId, isFeatured) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${baseUrl}/admin/featured/${productId}`;
      const response = isFeatured
        ? await axios.post(
            url,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update featured status"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDiscount = async (productId, discountData) => {
    setLoading(true);
    try {
      const response = await authAxios.post(
        `/admin/discounts/${productId}`,
        discountData
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update discount");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = async (productId) => {
    setLoading(true);
    try {
      const response = await authAxios.delete(`/admin/discounts/${productId}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove discount");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBarcode = async (productId, barcode) => {
    setLoading(true);
    try {
      const response = await authAxios.post(`/admin/barcode/${productId}`, {
        barcode,
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update barcode");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // this is to check if the user is authenticated by checking if the token is in the local storage
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const value = {
    loading,
    error,
    baseUrl,
    authAxios,
    getStatistics,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    updateDiscount,
    removeDiscount,
    updateBarcode,
    clearError: () => setError(null),
    isAuthenticated: isAuthenticated,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminContext;
