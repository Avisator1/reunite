import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 border-t border-gray-100 gabarito">
      <div className="max-w-5xl mx-auto px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 text-[#4278ff]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-extrabold text-lg text-[#2f303c]">Reunite</span>
            </Link>
            <p className="text-sm text-[#5C5B61] leading-relaxed">
              An intelligent lost-and-found platform revolutionizing how schools manage lost items through AI-powered matching and secure verification.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2f303c] text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2f303c] text-sm uppercase tracking-wider">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#faq" className="text-sm text-[#5C5B61] hover:text-[#4278ff] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <p className="text-sm text-[#5C5B61]">
                  2026 FBLA Website Coding and Development
                </p>
              </li>
              <li>
                <p className="text-sm text-[#5C5B61]">
                  AI-Powered Lost & Found Platform
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#5C5B61]">
            © {currentYear} Reunite. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#5C5B61]">
            <span>Built for</span>
            <span className="font-bold text-[#4278ff]">FBLA 2026</span>
            <span>Competition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
