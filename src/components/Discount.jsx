import styles from "./Discount.module.css";
import { useProduct } from "../contexts/ProductContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo, useState } from "react";
import QuickView from "./QuickView";
import { FiTag } from "react-icons/fi";

function Discount() {
  const { products, baseUrl } = useProduct();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // const specialProducts = products
  //   .filter((product) => product.isDiscounted)
  //   .slice(0, 4);

  // Using memo for memoization
  const specialProducts = useMemo(() => {
    return products
      .filter((product) => product.isDiscounted && product.discountRate > 0)
      .slice(0, 4);
  }, [products]);

  const calculateDiscountedPrice = (price, discountRate) => {
    if (!price) return "N/A";
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 440,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
  };

  return (
    <div className={styles.discount}>
      <h2>Special Offers & Discounts</h2>
      <Slider {...settings}>
        {specialProducts.map((product) => (
          <div key={product.id}>
            <div
              className={styles.slide}
              onClick={() => handleProductClick(product)}
            >
              <div className={styles.imageContainer}>
                <img src={`${baseUrl}${product.image}`} alt={product.name} />
                <div className={styles.discountBadge}>
                  <FiTag className={styles.tagIcon} />
                  <span>{product.discountRate}% OFF</span>
                </div>
              </div>
              <div className={styles.productContent}>
                <p className={styles.category}>{product.category}</p>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.oldPrice}>{product.price}</span>
                  <span className={styles.newPrice}>
                    {calculateDiscountedPrice(
                      product.price,
                      product.discountRate
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {selectedProduct && (
        <QuickView product={selectedProduct} onClose={handleCloseQuickView} />
      )}
    </div>
  );
}

export default Discount;
