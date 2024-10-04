import "../../styles/footer/index.css"
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF />
                </a>
                <a href="https://www.twitter.com" className="social-icon twitter" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
                <a href="https://www.instagram.com" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
            </div>
            <div className="footer-right">
                <button className="contact-button">Contact Us</button>
            </div>
        </footer>
    )
}; 
