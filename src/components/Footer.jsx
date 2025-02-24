import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
        <h3>Contact Us!</h3>

        <div className={styles.info}>
          <a href="tel:+9647739737842">
            <img src="/images/telephone.png" alt="tel" /><h4>Call: +964 123 4567</h4>
          </a>

          <a href="mailto:barezz.ali22@gmail.com">
            <img src="/images/email.png" alt="" /><h4>MyMall@gmail.com</h4>
          </a>
        </div>

        <div className={styles.socials}>
            <a href="#" target="_blank"><img src="/images/instagram.png" alt="instagram" /><h5>MyMall</h5></a>
            <a href="#" target="_blank"><img src="/images/facebook.png" alt="facebook" /><h5>MyMall</h5></a>
            <a href="#" target="_blank"><img src="/images/tiktok.png" alt="tiktok" /><h5>MyMall</h5></a>
        </div>
        <p>© 2025 RetailXplore. All rights reserved.</p>
    </footer>
  )
}

export default Footer