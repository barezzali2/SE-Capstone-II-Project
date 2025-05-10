import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./ContactForm.module.css";
import axios from "axios";
import { useProduct } from "../contexts/ProductContext";

function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post(`${baseUrl}/contact`, {
        ...formData,
        to: "retailxplore@gmail.com",
      });

      setStatus("Message sent successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          {status && (
            <p
              className={`${styles.status} ${
                status.includes("Failed") ? styles.error : styles.success
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

ContactForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ContactForm;
