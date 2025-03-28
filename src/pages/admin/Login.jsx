import LoginForm from "../../components/admin/LoginForm";
import styles from "./Login.module.css";

function AdminLogin() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBackground}></div>
      <LoginForm />
    </div>
  );
}
export default AdminLogin;
