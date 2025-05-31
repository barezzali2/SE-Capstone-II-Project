import Navbar from "../components/Navbar";
import ScannerView from "../components/scanner/ScannerView";
import styles from "./Scanner.module.css";
import Footer from "../components/Footer";
import ChatbotAssistant from "../components/ChatbotAssistant";
function Scanner() {
  return (
    <div className={styles.scanner}>
      <Navbar />
      <ScannerView />
      <ChatbotAssistant />
      <Footer />
    </div>
  );
}

export default Scanner;
