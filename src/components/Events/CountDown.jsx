import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        deleteEvent(data._id); // Call deleteEvent when the event is finished
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]); // Depend on 'data' to ensure useEffect runs when 'data' changes

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    return difference > 0 ? difference : 0; // Return the difference or 0 if it's finished
  }

  const deleteEvent = (eventId) => {
    axios.delete(`${server}/event/delete-shop-event/${eventId}`)
      .then(() => {
        console.log("Event deleted successfully");
        // Optionally, you can also update local state or trigger a refresh here
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  // Render time left
  const displayTimeLeft = () => {
    if (timeLeft <= 0) {
      return <span className="text-[red] font-bold text-[16px]">Event Timed out</span>;
    }

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="text-[16px] text-[#29625d] font-[500]">
      {displayTimeLeft()}
    </div>
  );
};

export default CountDown;
