import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Navbar.module.css";
import { memo, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

// Memo
const Navbar = memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <div className={styles.navbar}>
        <Logo />


        <ul className={styles.ulDefault}>
          <li>
            <NavLink to="/home" className={({isActive}) => (isActive ? styles.active : "")}>
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink to="/productlist" className={({isActive}) => (isActive ? styles.active : "")}>
              PRODUCT LIST
            </NavLink>
          </li>

          <li>
            <NavLink to="/search" className={({isActive}) => (isActive ? styles.active : "")}>
              SEARCH
            </NavLink>
          </li>

          <li>
            <NavLink to="/scanner" className={({isActive}) => (isActive ? styles.active : "")}> 
              SCANNER
            </NavLink>
          </li>
      </ul>

        
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
});

export default Navbar;