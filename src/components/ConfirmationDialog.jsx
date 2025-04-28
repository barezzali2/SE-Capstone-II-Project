import PropTypes from "prop-types";
import styles from "./ConfirmationDialog.module.css";

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationDialog;