import React from "react";
import DashboardEmptyState from "../DashboardEmptyState";
import { HiOutlineSupport } from "react-icons/hi";

const TICKETS = [
  { id: "T-1042", subject: "Payment not received", priority: "High", status: "Open" },
  { id: "T-1041", subject: "Seller verification request", priority: "Medium", status: "In progress" },
  { id: "T-1040", subject: "Product listing issue", priority: "Low", status: "Resolved" },
];

const priorityClass = (p) =>
  p === "High" ? "bg-red-100 text-red-700" : p === "Medium" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600";

const AdminSupportCenter = () => (
  <section id="admin-support" className="space-y-6 scroll-mt-24 yebone-fade-up">
    <div>
      <h2 className="font-Poppins text-xl font-semibold dark:text-white">Support center</h2>
      <p className="text-sm text-gray-500 mt-1">Tickets and reports overview</p>
    </div>
    {TICKETS.length === 0 ? (
      <DashboardEmptyState icon={HiOutlineSupport} title="No tickets" message="Support tickets will appear here." />
    ) : (
      <div className="dashboard-section yebone-surface overflow-x-auto">
        <table className="vendor-table w-full text-sm">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((t) => (
              <tr key={t.id} className="vendor-table-row">
                <td className="font-medium dark:text-white">{t.id}</td>
                <td>{t.subject}</td>
                <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityClass(t.priority)}`}>{t.priority}</span></td>
                <td><span className="vendor-status-pill">{t.status}</span></td>
                <td className="text-gray-400">Unassigned</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default AdminSupportCenter;
