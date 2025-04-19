/* eslint-disable react/no-unknown-property */
import styles from "./MapView.module.css";
import { Canvas } from "@react-three/fiber";
import { useState, Suspense, useEffect } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { FiArrowLeft, FiInfo, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CameraController } from "./CameraController";
import { StoreLayout } from "./StoreLayout";
import QuickView from "../../components/QuickView";

function MapView() {
  const { products } = useProduct();
  const [activeCategory, setActiveCategory] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // hide the footer when the map is open
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) {
      const originalDisplay = footer.style.display;
      footer.style.display = "none";
      return () => {
        footer.style.display = originalDisplay;
      };
    }
  }, []);

  // click on the category to highlight it on the map
  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  // if there are no products then we use the default categories
  const categories =
    products && products.length
      ? [...new Set(products.map((product) => product.category))]
      : ["fruits", "dairy", "bakery", "drinks", "snacks", "grains"];

  const categoryIcons = {
    fruits: "🍎",
    dairy: "🥛",
    bakery: "🍞",
    drinks: "🥤",
    snacks: "🍿",
    grains: "🌾",
  };

  return (
    <div className={styles.mapViewWrapper}>
      <div className={styles.mapContainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link to="/" className={styles.backLink}>
              <FiArrowLeft /> <span>Back to Home</span>
            </Link>
            <h2>Store Map</h2>
          </div>

          <div className={styles.sidebarContent}>
            <div className={styles.aisleSection}>
              <h3>Store Aisles</h3>
              <div className={styles.aisleGrid}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.aisleCard} ${
                      activeCategory === category ? styles.activeCard : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div
                      className={styles.aisleIcon}
                      style={{ backgroundColor: getCategoryColor(category) }}
                    >
                      <span>
                        {categoryIcons[category] || <FiShoppingCart />}
                      </span>
                    </div>
                    <span className={styles.aisleName}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.helpSection}>
              <div className={styles.helpHeader}>
                <FiInfo />
                <h3>How to Use the Map</h3>
              </div>
              <ul className={styles.helpList}>
                <li>Click on an aisle card to highlight it on the map</li>
                <li>Click on colored circles to view available products</li>
                <li>Drag to move the camera around the store</li>
                <li>Scroll to zoom in and out for a better view</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <Canvas shadows camera={{ position: [15, 8, 15], fov: 60 }}>
            <Suspense fallback={null}>
              {/* this is the lighting for the indoor store */}
              <ambientLight intensity={0.8} />
              <directionalLight
                position={[5, 10, 5]}
                intensity={0.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <hemisphereLight intensity={0.3} groundColor="#000000" />

              <StoreLayout
                activeCategory={activeCategory}
                onQuickViewProduct={setQuickViewProduct}
              />

              <CameraController />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* this is the quick view for the product */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

function getCategoryColor(category) {
  switch (category) {
    case "fruits":
      return "#8bc34a";
    case "dairy":
      return "#64b5f6";
    case "bakery":
      return "#bcaaa4";
    case "drinks":
      return "#7986cb";
    case "snacks":
      return "#ffa726";
    case "grains":
      return "#d4a056";
    default:
      return "#9e9e9e";
  }
}

export default MapView;
