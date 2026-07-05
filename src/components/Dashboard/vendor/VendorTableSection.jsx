import React from "react";

const VendorTableSection = ({ title, subtitle, children, id, className = "" }) => (
  <section
    id={id}
    className={`vendor-table-section dashboard-section yebone-surface yebone-fade-up ${className}`}
  >
    {(title || subtitle) && (
      <div className="mb-4">
        {title && (
          <h3 className="font-Poppins font-semibold text-lg dark:text-white">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    )}
    <div className="vendor-datagrid-wrap">{children}</div>
  </section>
);

export default VendorTableSection;
