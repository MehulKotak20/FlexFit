import { Link } from "react-router-dom";
import "./styles.css"; // Import the CSS file for styles

const BoxLinks = () => {
  return (
    <div className="container">
      <Link to="/video-streaming" className="box">
        <i className="fa-solid fa-upload"></i>
        <p className="box__description">Video Upload</p>
      </Link>
    </div>
  );
};

export default BoxLinks;
