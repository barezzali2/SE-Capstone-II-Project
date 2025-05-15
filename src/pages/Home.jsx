import styles from "./Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import FeaturesBar from "../components/home/FeaturesBar";
import MapSection from "../components/home/MapSection";
import DiscountSection from "../components/home/DiscountSection";
import FeaturedSection from "../components/home/FeaturedSection";
import ChatbotAssistant from "../components/ChatbotAssistant";

function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <HeroSection />
      <FeaturesBar />
      <FeaturedSection />
      <MapSection />
      <DiscountSection />
      <Footer />
      <ChatbotAssistant />
    </div>
  );
}

export default Home;
