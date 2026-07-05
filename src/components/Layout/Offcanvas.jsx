import React from 'react';
import { Link } from 'react-router-dom';

const Offcanvas = ({ isOpen, onClose, categories }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-1/4 h-full bg-white shadow-lg transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ zIndex: 1000 }}
    >
      <button className="absolute top-4 right-4" onClick={onClose}>
        &times;
      </button>
      <h2 className="p-4 text-lg font-bold">Categories</h2>
      <ul className="p-4">
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <Link to={`/category/${category.id}`} className="text-blue-500">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Offcanvas;
