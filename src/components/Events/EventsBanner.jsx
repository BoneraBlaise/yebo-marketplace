import React from 'react';
import { Link } from 'react-router-dom';
import EventImage from './2.jpg';

const EventsBanner = () => {
  return (
    <div className='dark:bg-[#1f1f1f] max-w-screen'>
      <div className="relative h-[600px] w-[92%] m-6 mx-auto">
        <img 
          src={EventImage}
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            We have events for ya!
          </h1>
          <p className="text-white text-lg md:text-xl mb-6 text-center">
            Don't miss out on the ultimate experience. Get your tickets now!
          </p>
          <Link to='/events'>
            <span className="bg-yellow-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-yellow-400 transition duration-300">
              Get Tickets
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventsBanner;
