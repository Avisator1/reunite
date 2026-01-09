import React, { useState } from 'react';

const LostAndFoundHero = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="md:min-h-screen bg-base-100 gabarito relative overflow-hidden">
      {/* Background SVG with teal gradient */}
      <div className="hidden md:block absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-[0.13]"
          viewBox="0 0 800 800"
        >
          <defs>
            <radialGradient id="a" cx="400" cy="400" r="50%" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="#06ABAB"></stop> {/* Teal color */}
            </radialGradient>
            <radialGradient id="b" cx="400" cy="400" r="70%" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff"></stop>
              <stop offset="1" stopColor="#06ABAB"></stop> {/* Teal color */}
            </radialGradient>
          </defs>
          <rect fill="url(#a)" width="800" height="800"></rect>
          <g fillOpacity=".8" className="w-full">
            <path
              fill="url(#b)"
              d="M998.7 439.2c1.7-26.5 1.7-52.7 0.1-78.5L401 399.9c0 0 0-0.1 0-0.1l587.6-116.9c-5.1-25.9-11.9-51.2-20.3-75.8L400.9 399.7c0 0 0-0.1 0-0.1l537.3-265c-11.6-23.5-24.8-46.2-39.3-67.9L400.8 399.5c0 0 0-0.1-0.1-0.1l450.4-395c-17.3-19.7-35.8-38.2-55.5-55.5l-395 450.4c0 0-0.1 0-0.1-0.1L733.4-99c-21.7-14.5-44.4-27.6-68-39.3l-265 537.4c0 0-0.1 0-0.1 0l192.6-567.4c-24.6-8.3-49.9-15.1-75.8-20.2L400.2 399c0 0-0.1 0-0.1 0l39.2-597.7c-26.5-1.7-52.7-1.7-78.5-0.1L399.9 399c0 0-0.1 0-0.1 0L282.9-188.6c-25.9 5.1-51.2 11.9-75.8 20.3l192.6 567.4c0 0-0.1 0-0.1 0l-265-537.3c-23.5 11.6-46.2 24.8-67.9 39.3l332.8 498.1c0 0-0.1 0-0.1 0.1L4.4-51.1C-15.3-33.9-33.8-15.3-51.1 4.4l450.4 395c0 0 0 0.1-0.1 0.1L-99 66.6c-14.5 21.7-27.6 44.4-39.3 68l537.4 265c0 0 0 0.1 0 0.1l-567.4-192.6c-8.3 24.6-15.1 49.9-20.2 75.8L399 399.8c0 0 0 0.1 0 0.1l-597.7-39.2c-1.7 26.5-1.7 52.7-0.1 78.5L399 400.1c0 0 0 0.1 0 0.1l-587.6 116.9c5.1 25.9 11.9 51.2 20.3 75.8l567.4-192.6c0 0 0 0.1 0 0.1l-537.3 265c11.6 23.5 24.8 46.2 39.3 67.9l498.1-332.8c0 0 0 0.1 0.1 0.1l-450.4 395c17.3 19.7 35.8 38.2 55.5 55.5l395-450.4c0 0 0.1 0 0.1 0.1L66.6 899c21.7 14.5 44.4 27.6 68 39.3l265-537.4c0 0 0.1 0 0.1 0L207.1 968.3c24.6 8.3 49.9 15.1 75.8 20.2L399.8 401c0 0 0.1 0 0.1 0l-39.2 597.7c26.5 1.7 52.7 1.7 78.5 0.1L400.1 401c0 0 0.1 0 0.1 0l116.9 587.6c25.9-5.1 51.2-11.9 75.8-20.3L400.3 400.9c0 0 0.1 0 0.1 0l265 537.3c23.5-11.6 46.2-24.8 67.9-39.3L400.5 400.8c0 0 0.1 0 0.1-0.1l395 450.4c19.7-17.3 38.2-35.8 55.5-55.5l-450.4-395c0 0 0-0.1 0.1-0.1L899 733.4c14.5-21.7 27.6-44.4 39.3-68l-537.4-265c0 0 0-0.1 0-0.1l567.4 192.6c8.3-24.6 15.1-49.9 20.2-75.8L401 400.2c0 0 0-0.1 0-0.1L998.7 439.2z"
            ></path>
          </g>
        </svg>
      </div>

      <div className="relative z-[99999]">
        {/* Header */}
        <header className="z-10 relative bg-transparent">
          <nav
            className="container max-w-5xl flex items-center justify-between px-8 py-4 mx-auto"
            aria-label="Global"
          >
            {/* Logo */}
            <div className="flex lg:flex-1">
              <a className="flex items-center gap-2 shrink-0" title="Homepage" href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 md:w-7 text-primary"
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
              </a>
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
              <a className="link link-hover" title="Home" href="/">
                Home
              </a>
              <a className="link link-hover" title="About" href="/about">
                About
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:justify-end lg:flex-1">
              <a href='/signup' className="btn btn-primary btn-sm bg-white p-2 rounded-xl px-3 cursor-pointer">Sign Up</a>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className={`relative z-50 ${isMobileMenuOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between">
                <a className="flex items-center gap-2 shrink-0" title="Homepage" href="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 text-primary"
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
                  <span className="font-extrabold text-lg">FindIt</span>
                </a>
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
                    <a className="link link-hover" title="Home" href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </a>
                    <a className="link link-hover" title="About" href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      About
                    </a>
                  </div>
                </div>

                <div className="border-b my-4"></div>

                <div className="flex flex-col gap-4">
                  <a href="/login" className="btn btn-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
                  <a
                    className="btn btn-primary btn-block group !btn-block !btn-sm"
                    href="/signup"
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-12 lg:py-32">
        <div className="relative flex flex-col gap-10 lg:gap-12 items-center justify-center text-center">
          <div className="space-y-2">
            <div className="flex justify-center items-center text-xs text-base-content-secondary/60">
              School Lost & Found Platform
            </div>
            <h1 className="font-extrabold text-[#2f303c] text-4xl lg:text-6xl tracking-tight">
              Lost and Found,
              <br />
              <span className="font-black text-[#4278ff] italic">Simplified.</span>
            </h1>
          </div>

          <div className="text-lg lg:text-xl text-[#5C5B61] leading-relaxed max-w-md mx-auto md:-mt-6">
            Reuniting lost items with their owners has never been easier.&nbsp;
            <div className="relative inline-block">
              <span className="italic underline decoration-wavy underline-offset-2 decoration-primary hover:text-primary cursor-help">
                 Report found. Search lost.
              </span>
            </div>
          </div>

          {/* Features List */}
          <ul className="hidden md:block text-[#5C5B61] leading-relaxed space-y-1 md:-mt-3">
            <li className="flex text-[#5C5B61] items-center justify-center lg:justify-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] text-[#4278ff]"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Report found items in seconds
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] text-[#4278ff]"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Smart search with filters & photos
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] text-[#4278ff]"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Secure verification & notifications
            </li>
          </ul>

          {/* Primary CTA */}
 <div className="flex justify-center">
  <a
    href="/search"
    className="
      group
      inline-flex items-center gap-2
      rounded-xl
      px-12 py-4
      font-semibold
      text-white
      bg-[#4278ff]
      shadow-lg shadow-teal-500/20
      transition-all duration-200
      hover:shadow-xl hover:shadow-teal-500/30
      active:scale-[0.98]
    "
  >
    Try Reunite
    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"             // ensures no black fill
  stroke="currentColor"   // uses the Tailwind text color
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="w-[18px] h-[18px] text-white transition-transform duration-200 group-hover:translate-x-1"
>
  <path d="M5 12h14" />
  <path d="m13 5 7 7-7 7" />
</svg>

  </a>
</div>


        </div>
      </div>
    </section>
  );
};

export default LostAndFoundHero;