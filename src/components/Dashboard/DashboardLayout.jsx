import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineCash,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { FiMessageSquare } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { useSelector } from "react-redux";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { Container } from "../ui";
import DashboardSidebar, { DASHBOARD_TITLES } from "./DashboardSidebar";
import VendorSidebar, { VENDOR_TITLES } from "./VendorSidebar";
import AdminSidebar, { ADMIN_TITLES } from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import PageMeta from "../ui/PageMeta";

const CUSTOMER_MOBILE_NAV = [
  { id: 0, label: "Home", icon: HiOutlineViewGrid },
  { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
  { id: 10, label: "Wishlist", icon: HiOutlineHeart },
  { id: 1, label: "Profile", icon: RxPerson },
];

const VENDOR_MOBILE_NAV = [
  { id: 1, label: "Home", to: "/dashboard", icon: HiOutlineViewGrid },
  { id: 2, label: "Orders", to: "/dashboard-orders", icon: HiOutlineShoppingBag },
  { id: 3, label: "Products", to: "/dashboard-products", icon: HiOutlineCube },
  { id: 8, label: "Inbox", to: "/dashboard-messages", icon: FiMessageSquare },
  { id: 7, label: "Payouts", to: "/dashboard-withdraw-money", icon: HiOutlineCash },
];

const ADMIN_MOBILE_NAV = [
  { id: 1, label: "Home", to: "/admin/dashboard", icon: HiOutlineViewGrid },
  { id: 2, label: "Orders", to: "/admin-orders", icon: HiOutlineShoppingBag },
  { id: 3, label: "Vendors", to: "/admin-sellers", icon: GrWorkshop },
  { id: 4, label: "Users", to: "/admin-users", icon: HiOutlineUserGroup },
  { id: 7, label: "Payouts", to: "/admin-withdraw-request", icon: HiOutlineCash },
];

const DashboardLayout = ({
  active,
  setActive,
  children,
  mode = "customer",
  bare = false,
  fullWidth = false,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const isVendor = mode === "vendor";
  const isAdmin = mode === "admin";

  const title = isAdmin
    ? ADMIN_TITLES[active] || "Admin"
    : isVendor
      ? VENDOR_TITLES[active] || "Seller"
      : DASHBOARD_TITLES[active] || "Account";

  const mainClass = fullWidth || bare
    ? "flex-1 min-w-0"
    : "flex-1 min-w-0 dashboard-section yebone-surface yebone-fade-up";

  const sidebarWidth = sidebarCollapsed ? "w-[72px]" : "w-[280px]";

  return (
    <>
      {(isAdmin || isVendor) && <PageMeta title={title} noIndex />}
      <Header />
      <div className="dashboard-page dark:text-gray-200 pb-20 lg:pb-10">
        <Container className="py-6 lg:py-8">
          <div className="dashboard-header yebone-fade-up">
            <div className="flex-1 min-w-0">
              <nav className="dashboard-breadcrumb mb-2" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                {isAdmin ? (
                  <>
                    <Link to="/admin/dashboard">Admin</Link>
                    <span>/</span>
                  </>
                ) : isVendor ? (
                  <>
                    <Link to="/dashboard">Seller</Link>
                    <span>/</span>
                  </>
                ) : (
                  <>
                    <Link to="/profile">Account</Link>
                    <span>/</span>
                  </>
                )}
                <span className="is-current">{title}</span>
              </nav>
              <h1 className="font-Poppins text-2xl md:text-3xl font-semibold dark:text-white">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                type="button"
                className="lg:hidden p-2.5 rounded-xl yebone-surface"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <HiOutlineMenu size={22} />
              </button>
              {isAdmin ? (
                <AdminTopbar
                  collapsed={sidebarCollapsed}
                  onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
                />
              ) : isVendor ? (
                <>
                  <Link
                    to="/dashboard-messages"
                    className="p-2.5 rounded-xl yebone-surface hidden sm:flex"
                    aria-label="Messages"
                  >
                    <FiMessageSquare size={22} className="text-yebone-primary" />
                  </Link>
                  <Link
                    to={`/shop/${seller?._id}`}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl yebone-surface"
                  >
                    <img
                      src={seller?.avatar?.url}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-yebone-primary/20"
                    />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl yebone-surface relative"
                    onClick={() => setActive(12)}
                    aria-label="Notifications"
                  >
                    <HiOutlineBell size={22} className="text-yebone-primary" />
                  </button>
                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl yebone-surface"
                    onClick={() => setActive(1)}
                  >
                    <img
                      src={user?.avatar?.url}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-yebone-primary/20"
                    />
                    <RxPerson size={18} className="text-yebone-primary lg:hidden" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-6 lg:gap-8">
            <aside
              className={`hidden lg:block ${sidebarWidth} shrink-0 sticky top-24 self-start transition-all duration-300`}
            >
              {isAdmin ? (
                <AdminSidebar active={active} collapsed={sidebarCollapsed} />
              ) : isVendor ? (
                <VendorSidebar active={active} />
              ) : (
                <DashboardSidebar active={active} setActive={setActive} />
              )}
            </aside>

            <main id="main-content" className={mainClass}>{children}</main>
          </div>
        </Container>
      </div>
      <Footer />

      {mobileOpen && (
        <>
          <div
            className="dashboard-sidebar-overlay lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 left-0 bottom-0 w-[min(100%,320px)] z-50 p-4 lg:hidden overflow-y-auto">
            {isAdmin ? (
              <AdminSidebar
                active={active}
                onNavigate={() => setMobileOpen(false)}
                className="h-full shadow-2xl"
              />
            ) : isVendor ? (
              <VendorSidebar
                active={active}
                onNavigate={() => setMobileOpen(false)}
                className="h-full shadow-2xl"
              />
            ) : (
              <DashboardSidebar
                active={active}
                setActive={setActive}
                onNavigate={() => setMobileOpen(false)}
                className="h-full shadow-2xl"
              />
            )}
          </div>
        </>
      )}

      <div className="dashboard-mobile-nav lg:hidden flex justify-around">
        {isAdmin
          ? ADMIN_MOBILE_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
                    active === item.id ? "text-yebone-primary" : "text-gray-500"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })
          : isVendor
            ? VENDOR_MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
                      active === item.id ? "text-yebone-primary" : "text-gray-500"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })
            : CUSTOMER_MOBILE_NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
                    active === item.id ? "text-yebone-primary" : "text-gray-500"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
      </div>
    </>
  );
};

export default DashboardLayout;
