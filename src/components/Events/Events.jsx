import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MdArrowBack, MdArrowForward } from 'react-icons/md'; // Import icons from react-icons
import styles from '../../styles/styles';
import EventCard from './EventCard';

const Events = ({ isMobile }) => {
  const { allEvents = [], isLoading } = useSelector((state) => state.events);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const eventsPerPage = isMobile ? 2 : 4;

  const totalPages = Math.ceil(allEvents.length / eventsPerPage);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      
      // Smooth scroll to the beginning of the container when changing pages
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      
      // Smooth scroll to the beginning of the container when changing pages
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  };

  // Function to handle horizontal scroll with buttons
  const scrollHorizontally = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading...</p>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className='w-full dark:bg-[#1f1f1f] dark:text-gray-200'>
        <div className={`${styles.section} mb-2`}>
          <div className={`${styles.heading} text-sm mt-2 md:text-base lg:text-lg text-start`}>
            <h1 className="p-1 mt-2">Scheduled Events</h1>
          </div>
          <h4 className="text-center mt-4 text-md mb-4 dark:text-gray-400">No Scheduled Events!</h4>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full dark:bg-[#1f1f1f] dark:text-gray-200'>
      <div className={`${styles.section} mb-2 ${isMobile ? 'mt-4' : 'mt-8'}`}>
        <div className={`${styles.heading} text-sm mt-2 md:text-base lg:text-lg text-start flex justify-between items-center`}>
          <h1>Scheduled Events</h1>
          
          {isMobile && (
            <div className="flex gap-2">
              <button 
                onClick={() => scrollHorizontally('left')}
                className="p-1 bg-gray-100 dark:bg-[#2b2b2b] rounded-full"
              >
                <MdArrowBack className="text-[#29625D]" />
              </button>
              <button 
                onClick={() => scrollHorizontally('right')}
                className="p-1 bg-gray-100 dark:bg-[#2b2b2b] rounded-full"
              >
                <MdArrowForward className="text-[#29625D]" />
              </button>
            </div>
          )}
        </div>

        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto mb-6 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 py-2">
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <div key={event._id} className={`${isMobile ? 'min-w-[85%]' : 'min-w-[200px] md:min-w-[250px] lg:min-w-[300px]'} flex-shrink-0`}>
                  <EventCard data={event} />
                </div>
              ))
            ) : (
              <h4 className="text-center mt-4">No Events Available!</h4>
            )}
          </div>
        </div>

        {!isMobile && totalPages > 1 && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`btn btn-primary flex items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MdArrowBack className="mr-2 text-[#29625D]" />
              Previous
            </button>
            <span className='text-center text-[14px]'>{currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`btn btn-primary flex items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
              <MdArrowForward className="ml-2 text-[#29625D]" />
            </button>
          </div>
        )}
        
        {isMobile && totalPages > 1 && (
          <div className="flex justify-center items-center">
            <span className='text-center text-[14px]'>{currentPage} / {totalPages}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
