import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2 bg-red-600">Your Hotel Booking App</h2>
          <p className="text-sm">Find the perfect stay for your journey.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/privacy-policy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="text-gray-300 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-700 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p>&copy; 2024 Your Hotel Booking App. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
