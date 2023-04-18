import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

// displays a spinner or image and message depending on props passed
// used for when page is loading or resource not found on a search
const Asset = ({ spinner, src, message }) => (
  <div className={`${styles.Asset} p-4`}>
    {spinner && <Spinner animation="border" />}
    {src && <img src={src} alt={message} />}
    {message && <p className="mt-4">{message}</p>}
  </div>
);

export default Asset;