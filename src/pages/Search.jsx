import styles from "./Search.module.css";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatbotAssistant from "../components/ChatbotAssistant";
function Search() {
  return (
    <div className={styles.search}>
      <Navbar />
      <SearchBar />
      <SearchResults />
      <ChatbotAssistant />
      <Footer />
    </div>
  );
}

export default Search;
