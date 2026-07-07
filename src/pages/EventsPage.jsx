import React, { useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import { Helmet } from "react-helmet";
import { IoCalendarOutline } from "react-icons/io5";
import { Container, Button } from "../components/ui";
import {
  MarketplacePageHero,
  MarketplaceListingSkeleton,
  MarketplaceEmptyState,
} from "../components/Marketplace";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const eventsPerPage = 6;

  const determineCategory = (title, description) => {
    const combinedText = (title + " " + description).toLowerCase();
    if (
      combinedText.includes("team vs team") ||
      combinedText.includes("game") ||
      combinedText.includes("match")
    ) {
      return "Sports";
    }
    if (
      combinedText.includes("concert") ||
      combinedText.includes("music") ||
      combinedText.includes("dancing") ||
      combinedText.includes("worship") ||
      combinedText.includes("vinbing")
    ) {
      return "Music";
    }
    if (
      combinedText.includes("theatre") ||
      combinedText.includes("play") ||
      combinedText.includes("drama")
    ) {
      return "Theatre";
    }
    return "Other";
  };

  const filteredEvents = (allEvents || []).filter((event) => {
    const eventCategory = determineCategory(event.title, event.description);
    const categoryMatch = filters.category ? eventCategory === filters.category : true;
    const dateMatch = filters.date ? event.date === filters.date : true;
    return categoryMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage) || 1;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const shouldShowPagination = totalPages > 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (isLoading) {
    return (
      <div className="marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray">
        <Container className="py-8 lg:py-10">
          <MarketplaceListingSkeleton count={6} />
        </Container>
      </div>
    );
  }

  return (
    <div className="marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray">
      <Helmet>
        <title>All Events - Yebone</title>
        <meta
          name="description"
          content="Get access to the best events from Yebone. Top deals and fast shipping."
        />
        <meta property="og:title" content="Events - Yebone" />
        <meta
          property="og:description"
          content="Discover Events at Yebone. Best prices guaranteed!"
        />
      </Helmet>
      <Container className="pt-6 lg:pt-8 pb-16">
        <MarketplacePageHero
          title="Events"
          subtitle="Concerts, sports, theatre, and exclusive experiences — all on Yebone."
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Events" },
          ]}
          count={filteredEvents.length}
          badge="Live events"
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="w-full lg:w-[22%] marketplace-filter-panel yebone-surface shrink-0">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Filters</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm dark:text-gray-200">Category</label>
              <select
                name="category"
                className="w-full p-2.5 dark:bg-[#1f1f1f] dark:text-white"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Theatre">Theatre</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm dark:text-gray-200">Date</label>
              <input
                type="date"
                name="date"
                className="w-full p-2.5 dark:text-white dark:bg-[#1f1f1f]"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
          </aside>

          <div className="flex-1">
            {!allEvents?.length ? (
              <MarketplaceEmptyState
                icon={IoCalendarOutline}
                title="No events available"
                message="Check back soon for concerts, sports, and live experiences on Yebone."
                actionLabel="Browse products"
                actionTo="/products"
              />
            ) : filteredEvents.length === 0 ? (
              <MarketplaceEmptyState
                icon={IoCalendarOutline}
                title="No events match your filters"
                message="Try a different category or date to discover upcoming events."
                actionLabel="Clear filters"
                actionTo="/events"
              />
            ) : (
              <>
                <p className="marketplace-results-count mb-4">
                  Showing {currentEvents.length} of {filteredEvents.length} events
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {currentEvents.map((event) => (
                    <EventCard key={event._id} active={true} data={event} />
                  ))}
                </div>

                {shouldShowPagination && (
                  <div className="yebone-pagination mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="yebone-btn-lift"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="yebone-btn-lift"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

    </div>
  );
};

export default EventsPage;
