/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, useMemo } from "react";
import { useProduct } from "../../contexts/ProductContext";
import {
  StoreFloor,
  SectionMarker,
  StoreModel,
  YouAreHereMarker,
  KioskMachine,
} from "./StoreElements";
import { useNavigate } from "react-router-dom";
import styles from "./StoreLayout.module.css";
import PropTypes from "prop-types";
import { useMarker } from "../../contexts/MarkerContext";

const markerPositions = [
  { position: [0, 7, -28], defaultCategory: "fruits" },
  { position: [-15, 5, 0], defaultCategory: "drinks" },
  { position: [-3.5, 5, 0], defaultCategory: "grains" },
  { position: [8, 5, 0], defaultCategory: "dairy" },
  { position: [20, 5, 0], defaultCategory: "snacks" },
  { position: [30, 5, 0], defaultCategory: "bakery" },
];

export function StoreLayout({
  activeCategory,
  onQuickViewProduct,
  onCategoryChange,
  onFindInStore,
}) {
  const storeRef = useRef();
  const sidePanelRef = useRef();
  const { products, baseUrl } = useProduct();
  const [localActiveCategory, setLocalActiveCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [showProductDisplay, setShowProductDisplay] = useState(false);
  const navigate = useNavigate();
  const { markers } = useMarker();

  const sections = markerPositions.map((markerPos) => {
    const backendMarker =
      markers.find((m) => m.category === markerPos.defaultCategory) || {};
    return {
      position: markerPos.position,
      label:
        backendMarker.name ||
        markerPos.defaultCategory.charAt(0).toUpperCase() +
          markerPos.defaultCategory.slice(1),
      color: backendMarker.color || "#cccccc",
      category: markerPos.defaultCategory,
      rotation: [0, 0, 0],
      shelves: [
        { offset: [0, 0, -8] },
        { offset: [0, 0, -4] },
        { offset: [0, 0, 0] },
        { offset: [0, 0, 4] },
        { offset: [0, 0, 8] },
        { offset: [3, 0, -8], rotation: [0, Math.PI, 0] },
        { offset: [3, 0, -4], rotation: [0, Math.PI, 0] },
        { offset: [3, 0, 0], rotation: [0, Math.PI, 0] },
        { offset: [3, 0, 4], rotation: [0, Math.PI, 0] },
        { offset: [3, 0, 8], rotation: [0, Math.PI, 0] },
      ],
    };
  });

  useEffect(() => {
    if (activeCategory) {
      setHighlightedSection(activeCategory);

      // If we have an active category from the parent, show products only if not already displayed
      if (activeCategory !== localActiveCategory) {
        const section = sections.find((s) => s.category === activeCategory);
        if (section) {
          setLocalActiveCategory(activeCategory);

          // Filter products for the selected category
          let filtered = [];
          if (products && products.length > 0) {
            filtered = products.filter(
              (product) =>
                product.category === activeCategory ||
                product.category_id === activeCategory
            );
          }

          // Use fallback products if no products are found
          if (!filtered || filtered.length === 0) {
            filtered = [
              {
                id: `demo1-${activeCategory}`,
                name: `${activeCategory} Product 1`,
                price: "2500 IQD",
                description: "Sample product description",
                image: "/images/placeholder.jpg",
                category: activeCategory,
              },
              {
                id: `demo2-${activeCategory}`,
                name: `${activeCategory} Product 2`,
                price: "3500 IQD",
                description: "Sample product description",
                image: "/images/placeholder.jpg",
                category: activeCategory,
              },
              {
                id: `demo3-${activeCategory}`,
                name: `${activeCategory} Product 3`,
                price: "4500 IQD",
                description: "Sample product description",
                image: "/images/placeholder.jpg",
                category: activeCategory,
              },
            ];
          }

          setCategoryProducts(filtered);
          setShowProductDisplay(true);
        }
      }
    } else {
      setHighlightedSection(null);
      setShowProductDisplay(false);
    }
  }, [activeCategory, localActiveCategory, products, sections]);

  // this is the side panel for the product display and it is only once on component mount meaning it only runs once because it is a side panel so it doesn't need to run on every render
  useEffect(() => {
    let sidePanel = document.getElementById("product-side-panel");
    if (!sidePanel) {
      sidePanel = document.createElement("div");
      sidePanel.id = "product-side-panel";
      sidePanel.className = styles.sidePanel;
      document.body.appendChild(sidePanel);
    }

    sidePanelRef.current = sidePanel;

    // this is the cleanup function to remove the panels on component unmount, unmount means when the component is removed from the DOM
    return () => {
      if (sidePanel && sidePanel.parentNode) {
        sidePanel.parentNode.removeChild(sidePanel);
      }
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const sidePanel = sidePanelRef.current;
      if (sidePanel && !sidePanel.contains(event.target)) {
        setShowProductDisplay(false); // Close the side panel
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // this is to update the side panel content when products or visibility changes
  useEffect(() => {
    const sidePanel = sidePanelRef.current;
    if (!sidePanel) return;
    // this transform the side panel to the left when the aisle is selected
    if (showProductDisplay && localActiveCategory) {
      sidePanel.style.transform = "translateX(0)";
      const section = sections.find((s) => s.category === localActiveCategory);

      // this is the content of the side panel that shows the products in the selected aisle
      sidePanel.innerHTML = `
        <div class="${styles.panelContent}">
          <div class="${styles.panelHeader}">
            <h2>${section ? section.label : ""} Products</h2>
            <button id="close-panel-btn" class="${
              styles.closeButton
            }">×</button>
          </div>
          
          <div class="${styles.productList}">
            ${categoryProducts
              .map(
                (product) => `
              <div class="${styles.productItem}" data-product-id="${
                  product.id || product._id
                }">
                <div class="${styles.productImage}">
                  <img 
                    src="${
                      baseUrl ? `${baseUrl}${product.image}` : product.image
                    }" 
                    alt="${product.name}" 
                    onerror="this.onerror=null; this.src='/images/placeholder.jpg';"
                  >
                </div>
                <div class="${styles.productInfo}">
                  <h3>${product.name}</h3>
                  <p>${
                    product.description
                      ? product.description.substring(0, 60) + "..."
                      : "No description available"
                  }</p>
                  <p class="${styles.productPrice}">${product.price}</p>
                </div>
                <button 
                  class="${styles.quickViewBtn}" 
                  data-product-id="${product.id || product._id}"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            `
              )
              .join("")}
          </div>
          
          <button id="view-all-btn" class="${styles.viewAllButton}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            View all ${section ? section.label.toLowerCase() : ""} products
          </button>
        </div>
      `;

      // this is the close button for the side panel
      const closeBtn = document.getElementById("close-panel-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          setShowProductDisplay(false);
        });
      }

      const viewAllBtn = document.getElementById("view-all-btn");
      if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
          navigate(`/category/${localActiveCategory}`);
        });
      }

      // this is the quickview button for the side panel
      const quickViewBtns = document.querySelectorAll(
        `.${styles.quickViewBtn}`
      );
      quickViewBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const productId = btn.getAttribute("data-product-id");
          const product = categoryProducts.find(
            (p) => (p.id || p._id) === productId
          );
          if (product) {
            handleProductClick(product);
          }
        });
      });

      // this is the product items for the side panel
      const productItems = document.querySelectorAll(`.${styles.productItem}`);
      productItems.forEach((item) => {
        item.addEventListener("click", () => {
          const productId = item.getAttribute("data-product-id");
          const product = categoryProducts.find(
            (p) => (p.id || p._id) === productId
          );
          if (product) {
            handleProductClick(product);
          }
        });

        // this is the hover effect for the product items
        item.addEventListener("mouseenter", () => {
          item.classList.add(styles.productItemHover);
        });

        item.addEventListener("mouseleave", () => {
          item.classList.remove(styles.productItemHover);
        });
      });
    } else {
      sidePanel.style.transform = "translateX(100%)";
    }
  }, [
    showProductDisplay,
    localActiveCategory,
    categoryProducts,
    navigate,
    sections,
    baseUrl,
  ]);

  // this is when the aisle is clicked
  const handleSectionActivate = (category) => {
    console.log("Section clicked:", category);

    // Notify parent about the active category
    onCategoryChange(category);

    // if the same aisle is clicked again, close the side panel
    if (category === localActiveCategory && showProductDisplay) {
      setShowProductDisplay(false);
      setLocalActiveCategory(null);
      setCategoryProducts([]);
      return;
    }

    // setting the active aisle
    setLocalActiveCategory(category);
    setHighlightedSection(category);

    let filtered = [];
    if (products && products.length > 0) {
      filtered = products.filter((product) => {
        // Check both category and category_id for compatibility
        return (
          product.category === category || product.category_id === category
        );
      });
      console.log("Filtered products:", filtered);
    }

    // If no products found, use fallback
    if (!filtered || filtered.length === 0) {
      filtered = [
        {
          id: `demo1-${category}`,
          name: `${category} Product 1`,
          price: "2500 IQD",
          description: "Sample product description",
          image: "/images/placeholder.jpg",
          category: category,
        },
        {
          id: `demo2-${category}`,
          name: `${category} Product 2`,
          price: "3500 IQD",
          description: "Sample product description",
          image: "/images/placeholder.jpg",
          category: category,
        },
        {
          id: `demo3-${category}`,
          name: `${category} Product 3`,
          price: "4500 IQD",
          description: "Sample product description",
          image: "/images/placeholder.jpg",
          category: category,
        },
      ];
      console.log("Using fallback products:", filtered);
    }

    setCategoryProducts(filtered);
    setShowProductDisplay(true);
  };

  const handleProductClick = (product) => {
    onQuickViewProduct(product); // Pass the product up to parent
    setShowProductDisplay(false); // Close the side panel
    onFindInStore(product);
  };

  return (
    <group ref={storeRef}>
      <StoreModel />
      <YouAreHereMarker position={[0, 0, 35]} />
      <KioskMachine position={[0, 0, 32]} />
      {sections.map((section, index) => (
        <SectionMarker
          key={`section-${index}`}
          position={section.position}
          label={section.label}
          color={section.color}
          category={section.category}
          onActivate={handleSectionActivate}
          isHighlighted={section.category === highlightedSection}
        />
      ))}
    </group>
  );
}

StoreLayout.propTypes = {
  activeCategory: PropTypes.string,
  onQuickViewProduct: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onFindInStore: PropTypes.func.isRequired,
};

StoreLayout.defaultProps = {
  activeCategory: null,
};
