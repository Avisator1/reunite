import React from 'react';
import oneGif from '../assets/images/features/one.gif';
import twoGif from '../assets/images/features/two.gif';
import thirdGif from '../assets/images/features/third.gif';
import fourGif from '../assets/images/features/four.gif';

const FeaturesSection = () => {
  const features = [
    {
      title: "School & Organization Management",
      description: "Admins can easily create and manage schools or organizations on the platform. Set up your institution, configure settings, and start managing lost items with a streamlined admin dashboard.",
      gif: oneGif
    },
    {
      title: "Lost Item Reporting",
      description: "Report lost items quickly and efficiently. Upload photos, add descriptions, and let our AI-powered system help match your lost items with found items in the database.",
      gif: twoGif
    },
    {
      title: "QR Code Generation",
      description: "Generate unique QR codes for your items. Print and attach them to belongings so finders can easily contact you when your items are found.",
      gif: thirdGif
    },
    {
      title: "AI Chatbot Assistant",
      description: "Get instant help with our AI-powered chatbot. Ask questions about the platform, learn how to use features, and get assistance with any issues you might encounter.",
      gif: fourGif
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 gabarito bg-base-100" id="features">
      <div className="text-center">
        <h2 className="relative mb-12 text-3xl font-extrabold tracking-tight md:mb-16 lg:text-5xl text-[#2f303c]">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[#4278ff]">FEATURES</p>
          <span className="relative">Platform features that bring results, not confusion</span>
        </h2>
      </div>
      
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
          <div 
            key={index}
            className="rounded-[1.3rem] border border-gray-200 bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 p-1.5"
          >
            <section className="custom-card card card-side h-full w-full animate-opacity flex-col bg-white rounded-[1.3rem]">
              <div className="p-8">
                <h3 className="card-title text-[#2f303c] font-bold text-xl mb-2">{feature.title}</h3>
                <div className="text-[#5C5B61] mt-2 text-sm leading-relaxed">
                  {feature.description}
                        </div>
                      </div>
              <figure className="mt-auto aspect-video w-full shrink-0 !rounded-t-none border-t border-gray-200 overflow-hidden">
                <div className="aspect-video w-full">
                  <img 
                    src={feature.gif} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </figure>
            </section>
                          </div>
                        ))}
                      </div>
      
      <div className="mt-16 flex justify-center px-4">
        <div className="w-full max-w-md overflow-hidden p-5 text-center bg-gradient-to-br from-[#4278ff]/5 to-[#06ABAB]/5 rounded-xl border border-gray-200">
          <div>
            <div className="mb-0.5 text-xs font-medium text-[#4278ff]">2026 • FBLA Competition</div>
            <h3 className="mb-1 text-lg font-semibold text-[#2f303c]">AI-Powered Lost & Found Platform 🎯</h3>
            <p className="text-[#5C5B61] mb-3 text-sm leading-relaxed">
              Experience the future of lost-and-found management with intelligent matching, secure verification, and seamless user experience.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4278ff] text-white rounded-lg font-semibold text-sm hover:bg-[#3a6ce0] transition-colors duration-200 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 duration-200 group-hover:scale-110" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                  clipRule="evenodd"
                />
              </svg>
              Get Started
            </a>
            <div className="mt-2 text-xs">
              <a 
                className="text-[#5C5B61] hover:text-[#4278ff] transition-colors duration-100 opacity-80 hover:opacity-100" 
                href="/about"
              >
                Learn more about Reunite
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
