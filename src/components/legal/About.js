import React from 'react';
import img from '../images/7.jpg'
import img2 from '../images/8.jpg'
const About = () => {
  return (
    <div className="bg-gray-50 dark:bg-[#1f1f1f] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-[#29625d]">About Guriraline</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-200 text-start">
          Guriraline is a leading eCommerce platform based in Rwanda, designed to offer a seamless online shopping experience to customers across the country. At Guriraline, we aim to bring quality products directly to your doorstep with the convenience of modern technology and innovative solutions.
        </p>
        <p className="mt-4 text-gray-600 dark:text-gray-200 text-start">Our platform combines a vast product selection, easy-to-use interface, and advanced features, all underpinned by our commitment to customer satisfaction. Whether you're looking for electronics, fashion, groceries, home appliances, or beauty products, Guriraline has everything you need, and more.
          In addition to our core eCommerce services, we are committed to promoting sustainable practices. We recognize the importance of protecting the environment, and as such, we are actively exploring ways to reduce the environmental impact of our operations. From eco-friendly packaging to partnering with local businesses for sustainable sourcing, we’re doing our part to ensure that Guriraline is not just a platform for shopping but also a platform for positive change.</p>
        {/* Mission Section */}
        <div className="mt-12 space-y-12 sm:space-y-16 lg:space-y-24 mb-2">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="relative lg:col-span-1">
              <img
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                src={img}
                alt="Guriraline eCommerce"
              />
            </div>
            <div className="mt-6 lg:mt-0 lg:col-span-1">
              <h3 className="text-3xl font-bold text-[#29625d]">Our Mission</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-200">
                At Guriraline, we aim to provide the best online shopping experience in Rwanda. Our platform offers a wide variety of products,
                from electronics to home goods, ensuring quality and customer satisfaction with every order.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 mb-2">
            <div className="mt-6 lg:mt-0 lg:col-span-1">
              <h3 className="text-3xl font-bold text-[#29625d]">Our Values</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-200">
                We value integrity, trust, and exceptional customer service. Our goal is to create lasting relationships with our customers by
                offering reliable and efficient delivery service, all while maintaining the highest standards of quality.
              </p>
            </div>
            <div className="relative lg:col-span-1">
              <img
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                src={img2}
                alt="Customer Satisfaction"
              />
            </div>

          </div>

          {/* Call-to-Action */}
          <div className="mt-12 text-center">
            <p className="text-gray-700 dark:text-gray-200">
              Ready to start shopping? Explore our diverse range of products now and experience the best of eCommerce in Rwanda.
            </p>
            <button className="mt-6 px-6 py-2 bg-[#29625d] text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
