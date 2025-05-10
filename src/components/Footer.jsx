import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import ContactForm from "./ContactForm";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";

function Footer() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About RetailXplore</h3>
          <p>
            Experience shopping like never before with our innovative 3D map
            technology. Navigate stores effortlessly and find products with
            precision in an interactive virtual environment.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/scanner">Scanner</Link>
          <Link to="/productlist">Products</Link>
          <Link to="/map">Store Map</Link>
        </div>

        <div className={`${styles.footerSection} ${styles.contactSection}`}>
          <h3>Get in Touch</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FiMail /> retailxplore@gmail.com
            </div>
            <div className={styles.contactItem}>
              <FiPhone /> +964 750 000 0000
            </div>
            <div className={styles.contactItem}>
              <FiMapPin /> Iraq, Kurdistan
            </div>
            <div className={styles.socialLinks}>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FiInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FiFacebook />
              </a>
            </div>
          </div>
          <button
            onClick={() => setShowContactForm(true)}
            className={styles.contactButton}
          >
            Send us a Message
          </button>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2024 RetailXplore. All rights reserved.</p>
      </div>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </footer>
  );
}

export default Footer;
