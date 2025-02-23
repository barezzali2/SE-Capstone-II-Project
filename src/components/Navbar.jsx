import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Navbar.module.css";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }
  return (
    <div className={styles.navbar}>
        <Logo />

        <div className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`} onClick={handleMenuOpen}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`${styles.ulMob} ${menuOpen ? styles.open : ""}`}>
          <li>
            <NavLink to="/home">
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink to="/productlist">
              PRODUCT LIST
            </NavLink>
          </li>

          <li>
            <NavLink to="/search">
              SEARCH
            </NavLink>
          </li>

          <li>
            <NavLink to="/scanner">
              SCANNER
            </NavLink>
          </li>

      </ul>

    </div>
  )
}

export default Navbar;