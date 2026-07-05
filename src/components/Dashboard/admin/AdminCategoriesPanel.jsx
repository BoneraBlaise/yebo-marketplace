import React from "react";
import { categoriesData } from "../../../static/data";
import { Button } from "../../ui";

const AdminCategoriesPanel = () => {
  const categories = categoriesData?.flatMap((c) => c.subcategories || []) || [];

  return (
    <section id="admin-categories" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-Poppins text-xl font-semibold dark:text-white">Category management</h2>
          <p className="text-sm text-gray-500 mt-1">Browse and manage marketplace categories</p>
        </div>
        <Button size="sm" className="yebone-btn-lift">Create category</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.slice(0, 12).map((cat) => (
          <div key={cat.id || cat.title} className="admin-feature-card dashboard-section yebone-surface yebone-card-lift">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-Poppins font-semibold dark:text-white">{cat.title}</h3>
              <span className="vendor-status-pill">Active</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{cat.description || "Marketplace category"}</p>
            <div className="flex gap-2 mt-4">
              <button type="button" className="text-xs font-medium text-yebone-primary hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminCategoriesPanel;
