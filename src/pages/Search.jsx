import SearchBar from "../components/SearchBar";
import styles from "./Search.module.css";
import Navbar from "../components/Navbar";
function Search() {
  return (
    <div className={styles.search}>
      <Navbar />
      <SearchBar />
    </div>
  );
}

export default Search;
