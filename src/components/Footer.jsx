import styles from "./Footer.module.css";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BiLogoGmail } from "react-icons/bi";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className={styles.footer}>
        <h3>Contact Us!</h3>

        <div className={styles.info}>
          <a href="tel:+9647739737842">
          <BsFillTelephoneInboundFill className={styles.tel} /><h4>Call: +964 123 4567</h4>
          </a>

          <a href="mailto:barezz.ali22@gmail.com">
          <BiLogoGmail className={styles.email} /><h4>MyMall@gmail.com</h4>
          </a>
        </div>

        <div className={styles.socials}>
            <a href="#" target="_blank"><FaInstagram className={styles.social}/><h5>MyMall</h5></a>
            <a href="#" target="_blank"><FaFacebookF className={styles.social}/><h5>MyMall</h5></a>
            <a href="#" target="_blank"><FaTiktok className={styles.social}/><h5>MyMall</h5></a>
        </div>
        <p>© 2025 RetailXplore. All rights reserved.</p>
    </footer>
  )
}

export default Footer