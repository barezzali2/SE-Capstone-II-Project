import styles from "./Loading.module.css";
import Logo from "./Logo";

const Loading = () => {
  return (
    <div className={styles.container}>
      <Logo />
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default Loading;
