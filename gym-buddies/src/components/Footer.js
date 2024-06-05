import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>© 2024 Gym Buddies</p>
        <ul>
          <li>
            <a href="/" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a href="/" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
