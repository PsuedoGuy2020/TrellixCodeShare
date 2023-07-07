import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };

  const imageStyle = {
    width: "55px",
  };

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img style={imageStyle} src="/images/logo-img.png" alt="logo" />
        <h1 className={styles.animateCharcter}>
          <b>
            <i>TRELLIX</i>
          </b>
        </h1>
      </Link>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>
  );
};

export default Navigation;
