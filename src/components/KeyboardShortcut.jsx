import React, { useEffect, useState } from 'react';

const KeyboardShortcutHelper = () => {
  const [keyPressed, setKeyPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'd') {
        setKeyPressed(true);
        setShowModal(true);
        
        setTimeout(() => {
          setKeyPressed(false);
        }, 300);
      }
      
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showModal]);

  const handleExploreClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Keyboard Helper Component */}
      <div 
        className="font-medium gabarito select-none group cursor-pointer max-lg:hidden z-50 fixed bottom-6 right-6 bg-base-200 hover:bg-base-300 px-4 py-3 rounded-lg shadow-lg border border-[#e5e7eb] duration-200 flex gap-2 items-center"
        onClick={handleExploreClick}
      >
        <span>
          Press{' '}
          <span 
            className={`font-bold gabarito bg-base-100 px-2 py-1 rounded border border-base-content/20 font-mono mx-0.5 capitalize transition-all duration-150 ${
              keyPressed ? 'scale-110 bg-[#4278ff] text-white border-[#4278ff]' : ''
            }`}
          >
            d
          </span>{' '}
          to explore the platform
        </span>
      </div>

      {/* Modal with black overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center gabarito justify-center p-4">
          {/* Black overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal container */}
          <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden border border-[#e5e7eb] z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#4278ff]"
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
                <h2 className="text-2xl font-extrabold text-[#2f303c]">
                  Platform Quick Guide
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm cursor-pointer btn-circle hover:bg-base-300"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[55vh] pb-8">
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-[#4278ff]/5 border border-[#4278ff]/20 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-[#4278ff] mb-2">
                    🎯 FBLA 2026 Competition Entry
                  </h3>
                  <p className="text-[#5C5B61]">
                    <strong>Reunite</strong> - An intelligent lost-and-found platform built for the <strong>2026 FBLA Website Coding and Development</strong> competition. 
                    Combining AI-powered matching, secure verification, and modern web technologies to revolutionize how schools manage lost items.
                  </p>
                </div>

                {/* Key Features Grid */}
                <div>
                  <h3 className="font-bold text-xl mb-4 text-[#2F303C]">
                    Core Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "🤖",
                        title: "AI-Powered Matching",
                        desc: "Advanced AI matching using Ollama/Llama2 to connect lost and found items with high accuracy"
                      },
                      {
                        icon: "📸",
                        title: "Photo-Based Verification",
                        desc: "Upload photos for visual AI analysis and secure claim verification with proof photos"
                      },
                      {
                        icon: "📱",
                        title: "QR Code Smart Tags",
                        desc: "Generate QR codes to attach to items - finders can scan and contact owners directly"
                      },
                      {
                        icon: "💬",
                        title: "Anonymous Messaging",
                        desc: "Secure messaging system for coordinators and finders to communicate safely"
                      },
                      {
                        icon: "📋",
                        title: "Claim Management",
                        desc: "Complete claim workflow with verification questions, status tracking, and approval system"
                      },
                      {
                        icon: "🏆",
                        title: "Reward System",
                        desc: "Gamified rewards with points for reporting found items and helping reunite items"
                      },
                      {
                        icon: "🤖",
                        title: "AI Chat Assistant",
                        desc: "24/7 AI chatbot powered by Llama2 to help users navigate the platform and answer questions"
                      },
                      {
                        icon: "📊",
                        title: "Dashboard Analytics",
                        desc: "Comprehensive dashboard with statistics, match tracking, and item management"
                      }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-base-200 p-4 rounded-lg border border-[#e5e7eb] hover:bg-base-300 transition-colors duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-[#4278ff]/10 p-2 rounded-lg">
                            <span className="text-[#4278ff] font-bold text-lg">{feature.icon}</span>
                          </div>
                          <h4 className="font-bold text-[#2F303C]">{feature.title}</h4>
                        </div>
                        <p className="text-sm text-[#5C5B61]">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h3 className="font-bold text-xl mb-4 text-[#2F303C]">
                    How It Works
                  </h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", title: "Report Lost/Found Items", desc: "Users can report lost or found items with photos, descriptions, and location details" },
                      { step: "2", title: "AI Matching", desc: "Our AI automatically analyzes and matches lost items with found items based on descriptions and photos" },
                      { step: "3", title: "Secure Claims", desc: "Users can claim found items by answering verification questions and uploading proof photos" },
                      { step: "4", title: "QR Code Prevention", desc: "Generate QR codes to attach to items - if lost, finders can scan and contact you directly" },
                      { step: "5", title: "Rewards & Tracking", desc: "Earn points for helping reunite items and track all your activities in your dashboard" }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-base-200 rounded-lg border border-[#e5e7eb]">
                        <div className="flex-shrink-0 bg-[#4278ff] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#2F303C] mb-1">{item.title}</h4>
                          <p className="text-sm text-[#5C5B61]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Stack */}
                <div className="bg-base-200 p-4 rounded-lg border border-[#e5e7eb]">
                  <h4 className="font-bold text-[#2F303C] mb-3">
                    🚀 Technology Stack
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-[#2F303C] mb-1">Frontend:</p>
                      <div className="flex flex-wrap gap-2">
                        {["React 18", "Vite", "TailwindCSS", "React Router"].map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#4278ff]/10 text-[#4278ff] rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2F303C] mb-1">Backend:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Flask", "SQLAlchemy", "JWT Authentication", "RESTful API"].map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#06ABAB]/10 text-[#06ABAB] rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2F303C] mb-1">AI/ML:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Ollama", "Llama2", "Computer Vision", "NLP"].map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e5e7eb] p-6 bg-base-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-[#5C5B61]">
                  <span className="font-medium">Quick Tip:</span> Press{' '}
                  <kbd className="px-2 py-1 bg-base-100 border border-[#e5e7eb] rounded text-sm font-mono text-[#2F303C]">
                    D
                  </kbd>{' '}
                  anytime to reopen this guide
                </div>
                <div className="flex gap-2">
                  <a
                    href="/login"
                    onClick={() => setShowModal(false)}
                    className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-[#4278ff] bg-white border-2 border-[#4278ff] hover:bg-[#4278ff]/5 transition-all duration-200"
                  >
                    Sign In
                  </a>
                  <button
                    onClick={() => setShowModal(false)}
                    className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#4278ff] shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                  >
                    Start Exploring
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutHelper;