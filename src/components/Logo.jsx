import styles from "./Logo.module.css";

function Logo() {
  return (
    <div className={styles.logo}>
        <a href="/">
            <h2>
                Retail<span>Xplore</span>
            </h2>
        </a>
    </div>
  )
}

export default Logo;