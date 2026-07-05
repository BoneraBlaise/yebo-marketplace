import React, { useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Footer from '../components/Layout/Footer';
import Loader from "../components/Layout/Loader";
import { Helmet } from 'react-helmet';
const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const eventsPerPage = 6;

  if (isLoading) {
    return <Loader />;
  }

  if (!allEvents || allEvents.length === 0) {
    return (
      <div>
        <Header activeHeading={4} />
        <div className="w-full max-w-screen-xl mx-auto mt-10 py-10 px-4">
          <h4 className="text-center dark:text-gray-200">No Events Available!</h4>
        </div>
      </div>
    );
  }

  const determineCategory = (title, description) => {
    const combinedText = (title + " " + description).toLowerCase();
    if (combinedText.includes("team vs team") || combinedText.includes("game") || combinedText.includes("match")) {
      return "Sports";
    }
    if (combinedText.includes("concert") || combinedText.includes("music") || combinedText.includes("dancing") || combinedText.includes("worship") || combinedText.includes("vinbing")) {
      return "Music";
    }
    if (combinedText.includes("theatre") || combinedText.includes("play") || combinedText.includes("drama")) {
      return "Theatre";
    }
    return "Other";
  };

  const filteredEvents = allEvents.filter((event) => {
    const eventCategory = determineCategory(event.title, event.description);
    const categoryMatch = filters.category ? eventCategory === filters.category : true;
    const dateMatch = filters.date ? event.date === filters.date : true;
    return categoryMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const shouldShowPagination = totalPages > 1;

  return (
    <div>
      <Helmet>
        <title>All Events - Guriraline</title>
        <meta name="description" content="Get access to the best events from Guriraline. Top deals and fast shipping." />
        <meta property="og:title" content="Product Name - Guriraline" />
        <meta property="og:description" content="Discover Events at Guriraline. Best prices guaranteed!" />
        <meta property="og:image" content="https://example.com/product-image.jpg" />
      </Helmet>
      <Header activeHeading={4} />
      <div className="flex justify-center flex-wrap w-full max-w-screen-xl mx-auto mt-10 mb-20">
        {/* Sidebar for filters */}
        <div className="md:w-[20%] w-full bg-white dark:bg-[#2b2b2b] p-4 rounded-lg shadow-lg mb-4 md:mb-0 p-4">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Filters</h3>
          <div className="mb-4">
            <label className="block mb-2 dark:text-gray-200">Category</label>
            <select
              name="category"
              className="w-full p-2 border border-gray-300 rounded dark:bg-[#1f1f1f] dark:text-white"
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>
              <option value="">All</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Theatre">Theatre</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 dark:text-gray-200">Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-2 border border-gray-300 rounded dark:text-white dark:bg-[#2b2b2b]"
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))} />
          </div>
        </div>

        {/* Event cards */}
        <div className="flex-1 flex flex-col md:pl-4">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {currentEvents.map((event) => (
              <EventCard
                key={event._id}
                active={true}
                data={event}
                className="w-full sm:w-1/2 lg:w-1/3"  // Ensure 3 cards per row on large screens
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {shouldShowPagination && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
