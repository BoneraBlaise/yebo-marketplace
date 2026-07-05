import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui";

const AdminQuickActions = () => (
  <div className="dashboard-section yebone-surface yebone-fade-up">
    <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Quick actions</h3>
    <div className="flex flex-wrap gap-2">
      <Link to="/admin-orders">
        <Button size="sm" className="yebone-btn-lift">Review orders</Button>
      </Link>
      <Link to="/admin-sellers">
        <Button size="sm" variant="outline" className="yebone-btn-lift">Manage vendors</Button>
      </Link>
      <Link to="/admin-withdraw-request">
        <Button size="sm" variant="outline" className="yebone-btn-lift">Withdrawals</Button>
      </Link>
      <Link to="/admin-users">
        <Button size="sm" variant="outline" className="yebone-btn-lift">Customers</Button>
      </Link>
    </div>
  </div>
);

export default AdminQuickActions;
