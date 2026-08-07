import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineCalendar } from "react-icons/hi";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import MarketplaceEmptyState from "../Marketplace/MarketplaceEmptyState";
import EventCard from "./EventCard";
import { isDemoCatalogItem } from "../../utils/catalogQuality";

const Events = ({ isMobile }) => {
  const { allEvents = [], isLoading } = useSelector((state) => state.events);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const eventsPerPage = isMobile ? 2 : 4;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const visibleEvents = allEvents.filter((event) => !isDemoCatalogItem(event));
  const currentEvents = visibleEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(visibleEvents.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  };

  const scrollHorizontally = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="home-events-rail__loading" aria-busy="true">
        <div className="yebone-skeleton h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (allEvents.filter((event) => !isDemoCatalogItem(event)).length === 0) {
    return (
      <MarketplaceEmptyState
        icon={HiOutlineCalendar}
        title="No upcoming events"
        message="Marketplace events, launches, and festivals will appear here. Explore the events page to see what's coming."
        actionLabel="Browse events"
        actionTo="/events"
        secondaryLabel="Shop marketplace"
        secondaryTo="/products"
        className="home-empty-state--inline"
      />
    );
  }

  return (
    <div className="w-full home-events-rail dark:text-gray-200">
      <div className={`w-full mb-2 ${isMobile ? "mt-0" : "mt-2"}`}>
        <div className="flex justify-between items-center mb-4 md:mb-5">
          <h2 className="yebone-section-title dark:text-white text-lg md:text-xl">Scheduled events</h2>

          {isMobile && totalPages > 1 ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollHorizontally("left")}
                className="home-events-rail__nav-btn"
                aria-label="Scroll events left"
              >
                <MdArrowBack size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally("right")}
                className="home-events-rail__nav-btn"
                aria-label="Scroll events right"
              >
                <MdArrowForward size={18} />
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto mb-6 hide-scrollbar scroll-smooth home-events-rail__scroll"
        >
          <div className="flex gap-3 md:gap-4 py-1">
            {currentEvents.map((event) => (
              <div
                key={event._id}
                className={`home-events-rail__item${isMobile ? " home-events-rail__item--mobile" : ""}`}
              >
                <EventCard data={event} />
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 ? (
          <div className={`flex items-center gap-4 ${isMobile ? "justify-center" : "justify-between"}`}>
            {!isMobile ? (
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="home-events-rail__page-btn"
              >
                <MdArrowBack size={18} />
                Previous
              </button>
            ) : null}
            <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
              {currentPage} / {totalPages}
            </span>
            {!isMobile ? (
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="home-events-rail__page-btn"
              >
                Next
                <MdArrowForward size={18} />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex justify-center">
          <Link
            to="/events"
            className="text-sm font-semibold text-yebone-primary hover:underline min-h-[44px] inline-flex items-center"
          >
            View all events →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Events;
