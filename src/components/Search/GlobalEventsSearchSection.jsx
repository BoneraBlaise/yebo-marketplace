import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import EventCard from "../Events/EventCard";
import { MarketplaceListingSkeleton, MarketplaceEmptyState } from "../Marketplace";
import { IoCalendarOutline } from "react-icons/io5";
import "./global-marketplace-search.css";

const GlobalEventsSearchSection = ({ searchTerm }) => {
  const { allEvents, isLoading: eventsLoading } = useSelector((state) => state.events);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const term = searchTerm?.trim()?.toLowerCase();
    if (!term) {
      setFiltered([]);
      return;
    }

    const matches = (allEvents || []).filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const description = event.description?.toLowerCase() || "";
      const location = event.location?.toLowerCase() || "";
      return title.includes(term) || description.includes(term) || location.includes(term);
    });

    setFiltered(matches);
  }, [searchTerm, allEvents]);

  const term = searchTerm?.trim();
  if (!term) return null;

  const loading = eventsLoading && !(allEvents || []).length;

  return (
    <section className="gms-section" aria-label="Event results">
      <h2 className="gms-section__title">Events</h2>

      {loading ? <MarketplaceListingSkeleton count={3} /> : null}

      {!loading && filtered.length === 0 ? (
        <MarketplaceEmptyState
          icon={IoCalendarOutline}
          title="No events found"
          message={`No events match "${term}". Try different keywords.`}
          actionLabel="Browse all events"
          actionTo="/events"
          compact
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 6).map((event) => (
            <EventCard key={event._id} data={event} active={1} />
          ))}
        </div>
      ) : null}

      {!loading && filtered.length > 6 ? (
        <Link to={`/events`} className="gms-section__link">
          View all event results →
        </Link>
      ) : null}
    </section>
  );
};

export default GlobalEventsSearchSection;
