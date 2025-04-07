import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import Sidebar from './Sidebar';
import styles from "./FeaturedManagement.module.css"

function FeaturedManagement() {
    const { user, logout } = useAuth();
    const { products } = useProduct();
  
    const handleLogout = () => {
      logout();
    };
  
    return (
      
      <div className={styles.adminLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.adminHeader}>
            <h1>Dashboard</h1>
            <div className={styles.userInfo}>
              <span>Welcome, {user?.name || "Admin"}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
          </div>
        </div>
    )
}

export default FeaturedManagement