import React from 'react';

const ComparisonSection = () => {
  return (
    <section className="bg-base-100 text-base-content gabarito">
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
        <h2 className="text-center text-[#2F303C] font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
          Traditional vs. Reunite
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
          {/* Traditional Lost & Found Column */}
          <div className="bg-rose-100/75 text-rose-700 p-8 md:p-12 rounded-lg w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Traditional Lost & Found</h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path>
                </svg>
                Items pile up in office closets
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path>
                </svg>
                Manual logbooks or sticky notes
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path>
                </svg>
                Students search room by room
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path>
                </svg>
                No photo verification of items
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path>
                </svg>
                Limited to school hours only
              </li>
            </ul>
          </div>

          {/* FindIt Column */}
          <div className="bg-emerald-100/70 text-emerald-700 p-8 md:p-12 rounded-lg w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Reunite Platform</h3>
            <ul className="list-disc list-inside space-y-1.5">
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
                </svg>
                Digital catalog accessible 24/7
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
                </svg>
                Smart search with filters & photos
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
                </svg>
                Instant notifications for matches
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
                </svg>
                Photo verification & secure claims
              </li>
              <li className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0 opacity-75">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd"></path>
                </svg>
                Automated reminders & cleanups
              </li>
            </ul>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="space-y-4 md:space-y-6 max-w-md mx-auto mt-16 md:mt-24">
          <div className="rating !flex justify-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd"></path>
              </svg>
            ))}
          </div>
          
          <div className="text-base leading-relaxed space-y-2 max-w-md mx-auto text-center">
            <p>
              <span className="bg-yellow-100/80 px-1.5">I was tired of the lost-and-found room chaos.</span> Items would pile up, and students would spend days searching.
            </p>
            <p>
              FindIt transformed our school's lost-and-found. Now students find their belongings in minutes, not days. The platform is simple but incredibly effective.
            </p>
          </div>
          
         <div className="flex justify-center items-center gap-3 md:gap-4">
  <div className="avatar placeholder">
    <div className="bg-gray-200 text-primary-content rounded-full w-12 h-12 flex justify-center items-center">
      <span className="text-lg">JD</span>
    </div>
  </div>
  <div>
    <p className="font-semibold">Jane Doe</p>
    <p className="text-base-content-secondary text-sm">School Principal</p>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;