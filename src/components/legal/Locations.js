import React from 'react';
import post1 from '../images/12.jpg'
import post2 from '../images/13.jpeg'
import post3 from '../images/14.jpg'
import post4 from '../images/15.jpg'
// Dummy location data
const locations = [
  { 
    id: 1, 
    name: 'Kigali,Rwanda', 
    description: 'ICT Innovation center, Kicukiro.',
    image: post1,
  },
  { 
    id: 2, 
    name: 'Musanze', 
    description: 'At Muhoza Sector (Musanze Innovation Hub)',
    image: post2,
  },
  { 
    id: 3, 
    name: 'Nyamata', 
    description: '4kms away from La Parisse Hotel',
    image: post3,
  },
  { 
    id: 4, 
    name: 'Gisenyi', 
    description: 'The city of waters.. ',
    image: post4,
  },
];

const Locations = () => {
  return (
    <div className="p-6 w-[90%] md:w-[70%] mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#29625d] mb-10">Our Locations</h1>

      {/* Locations Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white dark:bg-[#2b2b2b] shadow-lg rounded-lg overflow-hidden">
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{location.name}</h2>
              <p className="text-gray-700 text-sm mb-4 dark:text-gray-200">{location.description}</p>
              <button className="px-4 py-2 bg-[#29625d] text-white rounded hover:bg-black transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
