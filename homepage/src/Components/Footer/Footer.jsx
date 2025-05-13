import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerInfo">
          <p>Language Master</p>
          <p>123 Language Street</p>
          <p>City, Country</p>
        </div>
        <div className="footerLinks">
          <a href="#">News</a>
          <Link to="/">Home</Link>
          <a href="#">Legal Notice</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div className="footerContact">
          <p>Contact: support@languagemaster.com</p>
          <p>Phone: +123 456 789</p>
        </div>
      </div>

      <div className="footerSocialIcons">
        <FaFacebookF className="socialIcon" />
        <FaTwitter className="socialIcon" />
        <FaInstagram className="socialIcon" />
        <FaLinkedinIn className="socialIcon" />
      </div>
    </footer>
  );
};

export default Footer;
