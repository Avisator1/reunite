import React, { useState } from 'react';

const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqs = [
    {
      question: "How does AI-powered matching work?",
      answer: (
        <ul className="list-inside list-disc space-y-1">
          <li className="list-item">When you report a lost or found item, our AI analyzes the description, photos, and item characteristics using advanced computer vision technology.</li>
          <li className="list-item">The system automatically compares lost items with found items and provides confidence scores for potential matches.</li>
          <li className="list-item">You'll receive instant notifications when a match is detected, allowing you to review and claim items quickly.</li>
        </ul>
      )
    },
    {
      question: "Is my personal information secure?",
      answer: (
        <p>Yes! Reunite uses end-to-end encryption and secure verification processes. Your personal information is only shared when you explicitly approve a claim. Until then, all communication remains anonymous through our secure messaging system.</p>
      )
    },
    {
      question: "How do I verify ownership of a found item?",
      answer: (
        <ul className="list-inside list-disc space-y-1">
          <li className="list-item">When claiming an item, you'll answer verification questions that the original owner set when they reported it lost.</li>
          <li className="list-item">You'll also upload proof photos showing you with the item or matching details.</li>
          <li className="list-item">The item owner reviews your claim and can approve or deny it based on the verification evidence.</li>
        </ul>
      )
    },
    {
      question: "What are QR Code Smart Tags?",
      answer: (
        <p>QR Code Smart Tags allow you to generate a unique QR code for your items. If your item is lost and someone finds it, they can scan the QR code with their phone to contact you directly through our platform. This makes it much easier to recover your belongings without relying on traditional lost-and-found offices.</p>
      )
    },
    {
      question: "How does the reward system work?",
      answer: (
        <p>You earn reward points for reporting found items and successfully reuniting items with their owners. Points are displayed on a leaderboard, recognizing top contributors in your school community. This gamified approach encourages everyone to help reunite lost items with their owners!</p>
      )
    },
    {
      question: "Can I use Reunite if I'm not a student?",
      answer: (
        <p>Reunite is designed primarily for schools and educational institutions, but anyone with a valid account can use the platform. Whether you're a student, teacher, or staff member, you can report lost items, find items, and help reunite belongings with their owners.</p>
      )
    },
    {
      question: "What happens if someone makes a false claim?",
      answer: (
        <p>Reunite has a multi-step verification process to prevent false claims. Item owners must approve all claims and can verify proof photos before releasing items. Additionally, our AI matching system provides confidence scores to help identify legitimate matches. If you suspect fraudulent activity, you can report it to administrators.</p>
      )
    },
    {
      question: "Is there a mobile app?",
      answer: (
        <p>Reunite is fully responsive and works great on mobile browsers! You can scan QR codes, report items, make claims, and message other users directly from your phone. No app download required - just visit Reunite from any mobile browser.</p>
      )
    },
    {
      question: "How long are items kept in the system?",
      answer: (
        <p>Lost and found items remain active in the system for 90 days. After this period, items are automatically archived but can still be accessed through your dashboard. If you need an item to remain active longer, you can renew it before it expires.</p>
      )
    },
    {
      question: "Can I search for items by location?",
      answer: (
        <p>Yes! When reporting or searching for items, you can filter by location, date found, item category, and other characteristics. This makes it easy to find items that were lost or found in specific buildings or areas on campus.</p>
      )
    },
    {
      question: "What if I can't find a match using AI?",
      answer: (
        <p>Our AI matching system uses both advanced algorithms and rule-based matching. If no AI match is found, you can still browse all available items manually. Additionally, our AI chat assistant can help you refine your search criteria to find better matches.</p>
      )
    },
    {
      question: "Is there a limit to how many items I can report?",
      answer: (
        <p>There's no limit to the number of items you can report! Whether you've lost one item or multiple items, you can report them all. Each item gets its own listing with photos, descriptions, and verification questions to help ensure successful recovery.</p>
      )
    },
    {
      question: "How do I contact someone who found my item?",
      answer: (
        <p>Once you've made a claim on a found item or the finder has responded to your lost item report, you can use our secure anonymous messaging system. This allows you to coordinate item pickup, ask questions, and provide updates without revealing personal contact information until you're ready.</p>
      )
    },
    {
      question: "Can schools customize Reunite for their needs?",
      answer: (
        <p>Reunite is designed to be flexible and adaptable. Schools can customize categories, locations, verification questions, and other settings to match their specific needs. Contact us to learn more about customization options for your institution.</p>
      )
    }
  ];

  const handleAccordionClick = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section className="py-20 md:py-32 bg-base-100 gabarito">
      <div className="mx-auto max-w-xl max-md:px-4">
        <p className="text-left text-[#2f303c] mb-10 text-xl font-extrabold sm:text-3xl">FAQ</p>
        <ul className="space-y-2">
          {faqs.map((faq, index) => (
            <li key={index}>
              <button
                className="custom-card relative flex w-full items-center gap-2 p-4 text-left text-base font-medium md:text-base hover:bg-gray-100 rounded-lg transition-colors bg-gray-50"
                aria-expanded={activeAccordion === index}
                onClick={() => handleAccordionClick(index)}
              >
                <span className="flex-1">{faq.question}</span>
                <svg
                  className="ml-auto size-3 shrink-0 fill-current"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`origin-center transform transition duration-200 ease-out ${
                      activeAccordion === index ? "rotate-180" : ""
                    }`}
                  ></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                      activeAccordion === index ? "hidden" : ""
                    }`}
                  ></rect>
                </svg>
              </button>
              <div
                className={`overflow-hidden px-4 text-[#5C5B61] transition-all duration-300 ease-in-out ${
                  activeAccordion === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  maxHeight: activeAccordion === index ? "1000px" : "0px",
                }}
              >
                <div className="mr-4 space-y-1.5 pb-4 pt-3 leading-relaxed">
                  {typeof faq.answer === 'string' ? (
                    <p>{faq.answer}</p>
                  ) : (
                    faq.answer
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
