import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

const Ratings = ({ rating, size = 20, showEmpty = false }) => {
  if (!rating && showEmpty) {
    return <span className="text-sm text-gray-400 italic">No reviews yet</span>;
  }
  if (!rating) return null;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} size={size} color="#fed592" className="mr-0.5" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<BsStarHalf key={i} size={size} color="#fed592" className="mr-0.5" />);
    } else {
      stars.push(<AiOutlineStar key={i} size={size} color="#d1d5db" className="mr-0.5" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

export default Ratings;
