import React from "react";

const Contact = () => {
  return (
    <div className="px-6 py-10 bg-gray-200 dark:bg-[#1f1f1f]">
      {/* Boxed Layout Container */}
      <div className="w=[90%] md:w-[70%] mx-auto px-4">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black">Contact Yebone</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We’d love to hear from you! Feel free to reach out to us with any
            questions, inquiries, or feedback.
          </p>
        </header>

        {/* Contact Info Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Get in Touch
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Whether you need support or have a general inquiry, we're here to
              help.
            </p>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#29625d] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7 7 7-7"
                  />
                </svg>
                <span>support@yebone.com</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#29625d] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7 7 7-7"
                  />
                </svg>
                <span>+250 790 802 232</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#29625d] mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4.588a3.992 3.992 0 0 0-2 0V8a2 2 0 1 0-4 0v8a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V8a2 2 0 1 0-4 0v4.588a3.992 3.992 0 0 0-2 0V8"
                  />
                </svg>
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Send Us a Message
            </h2>
            <form className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg dark:bg-[#2b2b2b] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg dark:bg-[#2b2b2b] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  placeholder="Your email address"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg dark:bg-[#2b2b2b] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#29625d]"
                  rows="6"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#29625d] text-white rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#29625d]"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
