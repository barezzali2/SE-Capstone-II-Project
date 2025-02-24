import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }
  return (
    <div className={styles.navbar}>
        <Logo />
        
        <div className={styles.shoppingBtn}>
          <Link to="/shopping"><FaShoppingCart className={styles.shoppingCard}/></Link>
        </div>

        <div className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`} onClick={handleMenuOpen}>
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
  )
}

export default Navbar;