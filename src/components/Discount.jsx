import styles from "./Discount.module.css";
import { useProduct } from "../contexts/ProductContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Discount() {
  const { products } = useProduct();
  const specialProducts = products
    .filter((product) => product.isDiscounted)
    .slice(0, 4);

  const settings = {
    dots: true,
    infinite: true,
    speed: 440,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2300,
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

  return (
    <div className={styles.discount}>
      <h2>Special Offers & Discounts</h2>
      <Slider {...settings}>
        {specialProducts.map((product) => (
          <div key={product.id} className={styles.slide}>
            <img
              src={`http://localhost:3003${product.image}`}
              alt={product.name}
            />
            <div className={styles.discountBadge}>{product.price}</div>
            <h3>{product.name}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Discount;
