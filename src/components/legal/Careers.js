import React from 'react'
import img from '../images/10.jpg'
import img2 from '../images/11.jpg'
import img3 from '../images/8.jpg'
const Careers = () => {
  return (
    <div className="px-6 md:w-[70%] w-[90%] mx-auto py-10">
      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#29625d]">Join the Guriraline Team</h1>
        <p className="mt-4 text-lg  dark:text-gray-200">
          At Guriraline, we're revolutionizing e-commerce with AI. Be part of our innovative journey to shape the future of online shopping in Rwanda.
        </p>
      </header>

      {/* Opportunities Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-[#29625d]">Why Work With Us?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {/* Opportunity 1 */}
          <div className="w-full sm:w-1/3 lg:w-1/4 text-center">
            <img src={img} alt="People collaborating" className="w-full h-auto rounded-lg shadow-lg" />
            <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-white">Collaborative Culture</h3>
            <p className="mt-2  dark:text-gray-200">Work in a dynamic team environment where ideas come together to create groundbreaking solutions.</p>
          </div>
          {/* Opportunity 2 */}
          <div className="w-full sm:w-1/3 lg:w-1/4 text-center">
            <img src={img3} alt="Innovative technology" className="w-full h-auto rounded-lg shadow-lg" />
            <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-white">Innovative Technology</h3>
            <p className="mt-2  dark:text-gray-200">Be part of cutting-edge AI technology that powers our e-commerce platform, making shopping smarter.</p>
          </div>
          {/* Opportunity 3 */}
          <div className="w-full sm:w-1/3 lg:w-1/4 text-center">
            <img src={img2} alt="Growth opportunities" className="w-full h-auto rounded-lg shadow-lg" />
            <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-white">Career Growth</h3>
            <p className="mt-2  dark:text-gray-200">We believe in continuous learning and offer numerous opportunities for personal and professional growth.</p>
          </div>
        </div>
      </section>

      {/* Available Positions Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-[#29625d] text-center">Available Positions</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Position 1 */}
          <div className="bg-gray-100 dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI Developer</h3>
            <p className="mt-2  dark:text-gray-200">Help us build and improve our AI algorithms for personalized shopping experiences.</p>
          </div>
          {/* Position 2 */}
          <div className="bg-gray-100 dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Frontend Developer</h3>
            <p className="mt-2  dark:text-gray-200">Join our web development team to build a user-friendly interface for our e-commerce platform.</p>
          </div>
          {/* Position 3 */}
          <div className="bg-gray-100 dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Mobile App Developer</h3>
            <p className="mt-2  dark:text-gray-200">Work on the mobile app version of our platform, ensuring a seamless shopping experience on the go.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center mt-16">
        <p className="text-lg  dark:text-gray-200">Ready to join us? Send your application to <a href="mailto:careers@guriraline.com" className="text-blue-600 hover:underline">careers@guriraline.com</a></p>
      </footer>
    </div>
  )
}

export default Careers
