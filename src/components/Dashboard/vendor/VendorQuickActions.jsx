import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui";
import { useCreateExperience } from "../../seller-experience/CreateExperienceContext";

const VendorQuickActions = () => {
  const { openCreate } = useCreateExperience();

  return (
    <div className="dashboard-section yebone-surface yebone-fade-up">
      <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Quick actions</h3>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="yebone-btn-lift" onClick={() => openCreate("product")}>
          Add product
        </Button>
        <Link to="/dashboard-orders">
          <Button size="sm" variant="outline" className="yebone-btn-lift">
            View orders
          </Button>
        </Link>
        <Link to="/dashboard-coupouns">
          <Button size="sm" variant="outline" className="yebone-btn-lift">
            Create coupon
          </Button>
        </Link>
        <Link to="/dashboard-withdraw-money">
          <Button size="sm" variant="outline" className="yebone-btn-lift">
            Withdraw funds
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VendorQuickActions;
