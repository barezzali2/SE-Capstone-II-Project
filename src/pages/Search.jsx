import styles from "./Search.module.css";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Search() {
  return (
    <div className={styles.search}>
      <Navbar />
      <SearchBar />
      <SearchResults />
      <Footer />
    </div>
  );
}

export default Search;
