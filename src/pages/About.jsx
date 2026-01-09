import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100 gabarito">
      {/* Navbar */}
      <header className="z-10 relative bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 border-b border-gray-100">
        <nav
          className="container max-w-5xl flex items-center justify-between px-8 py-4 mx-auto"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center gap-2 shrink-0" title="Homepage">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 md:w-7 text-[#4278ff]"
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
              <span className="font-extrabold text-lg">Reunite</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-base-content"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
            <Link to="/" className="link link-hover" title="Home">
              Home
            </Link>
            <Link to="/about" className="link link-hover font-semibold text-[#4278ff]" title="About">
              About
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:justify-end lg:flex-1">
            <Link to="/signup" className="btn btn-primary btn-sm bg-white p-2 rounded-xl px-3 cursor-pointer">Sign Up</Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`relative z-50 ${isMobileMenuOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 shrink-0" title="Homepage" onClick={() => setIsMobileMenuOpen(false)}>
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
                <span className="font-extrabold text-lg">Reunite</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile menu content */}
            <div className="flow-root mt-6">
              <div className="py-4">
                <div className="flex flex-col gap-y-4 items-start">
                  <Link to="/" className="link link-hover" onClick={() => setIsMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/about" className="link link-hover font-semibold text-[#4278ff]" onClick={() => setIsMobileMenuOpen(false)}>
                    About
                  </Link>
                </div>
              </div>

              <div className="border-b my-4"></div>

              <div className="flex flex-col gap-4">
                <Link to="/login" className="btn btn-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-block group !btn-block !btn-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-[18px] h-[18px] fill-white/10 group-hover:translate-x-0.5 group-hover:fill-white/20 transition-transform duration-200"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 py-20 md:py-32 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 text-[#4278ff]"
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
            </div>
            <h1 className="font-extrabold text-[#2f303c] text-4xl md:text-6xl tracking-tight mb-6">
              About Reunite
            </h1>
            <p className="text-xl text-[#5C5B61] max-w-3xl mx-auto leading-relaxed">
              An intelligent lost-and-found platform revolutionizing how schools manage lost items through AI-powered matching, secure verification, and modern web technologies.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-16 md:py-24 space-y-16 md:space-y-24">
        {/* FBLA Competition Section */}
        <section id="about" className="space-y-8">
          <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-xl p-8 md:p-12 border border-[#4278ff]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#4278ff] rounded-lg p-3">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] mb-2">
                  2026 FBLA Website Coding and Development
                </h2>
                <p className="text-[#5C5B61] text-lg">Competition Entry</p>
              </div>
            </div>
            <div className="space-y-4 text-[#5C5B61] leading-relaxed">
              <p>
                <strong>Reunite</strong> is a comprehensive lost-and-found platform built specifically for the <strong>2026 FBLA Website Coding and Development</strong> competition. 
                This project demonstrates advanced web development skills, AI integration, and innovative solutions to real-world problems.
              </p>
              <p>
                The platform addresses a common challenge faced by schools and institutions: efficiently managing lost items and reuniting them with their owners. 
                Through the use of cutting-edge AI technology, secure verification systems, and modern web architecture, Reunite streamlines the entire lost-and-found process.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="space-y-8">
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] text-center mb-12">
            Our Mission & Vision
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-2xl text-[#2f303c] mb-4">Mission</h3>
              <p className="text-[#5C5B61] leading-relaxed">
                To revolutionize lost-and-found management through innovative technology, making it easier, faster, and more secure for students to recover their lost belongings while reducing administrative burden on school staff.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="font-bold text-2xl text-[#2f303c] mb-4">Vision</h3>
              <p className="text-[#5C5B61] leading-relaxed">
                To become the leading lost-and-found platform for educational institutions, using AI and machine learning to achieve near-perfect match accuracy and create a seamless experience for both finders and owners.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Features Overview */}
        <section className="space-y-8">
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] text-center mb-12">
            Platform Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Matching",
                description: "Ollama/Llama2 analyzes descriptions and photos to automatically match lost and found items."
              },
              {
                icon: "📸",
                title: "Photo Analysis",
                description: "Computer vision extracts category, color, brand, and unique features from item photos."
              },
              {
                icon: "📱",
                title: "QR Code Smart Tags",
                description: "Generate QR codes for items - finders can scan and contact owners directly."
              },
              {
                icon: "💬",
                title: "Anonymous Messaging",
                description: "Secure messaging system for finders and owners to coordinate safely."
              },
              {
                icon: "🔒",
                title: "Secure Claims",
                description: "Multi-step verification with questions and proof photos ensures correct ownership."
              },
              {
                icon: "🏆",
                title: "Reward System",
                description: "Gamified points system encourages community participation and item recovery."
              },
              {
                icon: "🤖",
                title: "AI Chat Assistant",
                description: "24/7 Llama2-powered chatbot helps users navigate and answer questions."
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description: "Comprehensive statistics for matches, claims, rewards, and item tracking."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-3">{feature.title}</h3>
                <p className="text-[#5C5B61] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-8">
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] text-center mb-12">
            Technology Stack
          </h2>
          <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-4 flex items-center gap-2">
                  <span className="text-[#4278ff]">⚛️</span> Frontend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["React 18", "Vite", "TailwindCSS", "React Router", "Axios/Fetch API"].map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#4278ff]/10 text-[#4278ff] rounded-lg text-sm font-semibold border border-[#4278ff]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-4 flex items-center gap-2">
                  <span className="text-[#06ABAB]">🐍</span> Backend
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Flask", "SQLAlchemy", "JWT Authentication", "RESTful API", "SQLite Database"].map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#06ABAB]/10 text-[#06ABAB] rounded-lg text-sm font-semibold border border-[#06ABAB]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-4 flex items-center gap-2">
                  <span className="text-purple-600">🤖</span> AI & Machine Learning
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Ollama", "Llama2", "Computer Vision", "Natural Language Processing", "Image Processing"].map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold border border-purple-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* How It Works */}
        <section className="space-y-8">
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] text-center mb-12">
            How Reunite Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Report Items",
                description: "Report lost or found items with photos and descriptions. AI automatically extracts key details.",
                icon: "📝"
              },
              {
                step: "2",
                title: "AI Matching",
                description: "AI analyzes and matches lost items with found items, providing confidence scores.",
                icon: "🤖"
              },
              {
                step: "3",
                title: "Secure Claims",
                description: "Users make claims by answering verification questions and uploading proof photos.",
                icon: "🔒"
              },
              {
                step: "4",
                title: "Communication",
                description: "Anonymous messaging system allows finders and owners to coordinate returns.",
                icon: "💬"
              },
              {
                step: "5",
                title: "QR Code Prevention",
                description: "Generate QR codes for items - finders scan to contact owners directly.",
                icon: "📱"
              },
              {
                step: "6",
                title: "Rewards",
                description: "Earn points for reporting found items and successfully reuniting items.",
                icon: "🏆"
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-[#4278ff]/10 to-[#06ABAB]/10 rounded-xl p-4 w-20 h-20 flex items-center justify-center">
                    <div className="bg-[#4278ff] text-white rounded-full w-12 h-12 flex items-center justify-center font-extrabold text-lg">
                      {item.step}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="font-bold text-2xl text-[#2f303c]">{item.title}</h3>
                  </div>
                  <p className="text-[#5C5B61] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Competition Information */}
        <section className="space-y-8">
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#2f303c] text-center mb-12">
            Technical Implementation
          </h2>
          <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-3">Project Scope</h3>
                <p className="text-[#5C5B61] mb-4">
                  This full-stack application demonstrates proficiency in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#5C5B61] ml-4">
                  <li>Modern React frontend with responsive design</li>
                  <li>Flask RESTful API with SQLAlchemy database</li>
                  <li>AI/ML integration with Ollama and Llama2</li>
                  <li>JWT authentication and secure file uploads</li>
                  <li>Real-time updates and notifications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#2f303c] mb-3">Key Innovations</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="font-semibold text-[#2f303c] mb-2">🤖 AI Integration</p>
                    <p className="text-sm text-[#5C5B61]">Ollama/Llama2 for intelligent item matching and chatbot assistance</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="font-semibold text-[#2f303c] mb-2">🔒 Security</p>
                    <p className="text-sm text-[#5C5B61]">Multi-layer verification with proof photos and secure messaging</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="font-semibold text-[#2f303c] mb-2">📱 Mobile Ready</p>
                    <p className="text-sm text-[#5C5B61]">Responsive design with QR code scanning capabilities</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="font-semibold text-[#2f303c] mb-2">⚡ Performance</p>
                    <p className="text-sm text-[#5C5B61]">Optimized algorithms and efficient database architecture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-[#4278ff] to-[#06ABAB] rounded-xl p-12 md:p-16 text-center text-white">
          <h2 className="font-extrabold text-3xl md:text-4xl mb-4">
            Ready to Experience Reunite?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join our platform and see how AI-powered technology can transform lost-and-found management at your school.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-[#4278ff] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
