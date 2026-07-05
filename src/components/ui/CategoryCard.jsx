import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { typography } from "../../design-system/typography";

const CategoryCard = ({ title, image, to = "#", className }) => (
  <Link
    to={to}
    className={classNames(
      "block rounded-xl overflow-hidden bg-yebone-light-gray dark:bg-gray-800 hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5",
      className
    )}
  >
    {image && (
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    )}
    <div className="p-4 text-center">
      <h3 className={classNames(typography.subheading, "text-base")}>{title}</h3>
    </div>
  </Link>
);

export default CategoryCard;
