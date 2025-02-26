import styles from "./Search.module.css";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

function Search() {
  return (
    <div className={styles.search}>
      <Navbar />
      <SearchBar />
      <Footer />
    </div>
  );
}

export default Search;
