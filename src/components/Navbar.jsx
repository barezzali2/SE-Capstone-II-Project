import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Navbar.module.css";
import { memo, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FiMap } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";

// Memo
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const totalItems = cart?.totalItems || 0;

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <div className={styles.navbar}>
      <Logo />

      <ul className={styles.ulDefault}>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            HOME
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/productlist"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            PRODUCT LIST
          </NavLink>
        </li>

        <li className={styles.mapLinkContainer}>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `${styles.mapLink} ${isActive ? styles.activeMap : ""}`
            }
          >
            <FiMap className={styles.mapIcon} />
            <span> </span>
            <span>STORE MAP</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            SEARCH
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/scanner"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            SCANNER
          </NavLink>
        </li>
      </ul>

      <div className={styles.shoppingBtn}>
        <Link to="/shopping">
          <div className={styles.cartIconContainer}>
            <FaShoppingCart className={styles.shoppingCard} />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </div>
        </Link>
      </div>

      <div
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={handleMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`${styles.ulMob} ${menuOpen ? styles.open : ""}`}>
        <li>
          <NavLink to="/home" onClick={handleMenuOpen}>
            HOME
          </NavLink>
        </li>

        <li>
          <NavLink to="/productlist" onClick={handleMenuOpen}>
            PRODUCT LIST
          </NavLink>
        </li>

        <li className={styles.mapLinkContainerMobile}>
          <NavLink
            to="/map"
            className={styles.mapLinkMobile}
            onClick={handleMenuOpen}
          >
            <FiMap className={styles.mapIconMobile} />
            <span>STORE MAP</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/search" onClick={handleMenuOpen}>
            SEARCH
          </NavLink>
        </li>

        <li>
          <NavLink to="/scanner" onClick={handleMenuOpen}>
            SCANNER
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default memo(Navbar);
