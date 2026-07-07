import React, { useState, useEffect } from "react";
import Loader from "../components/Layout/Loader";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "../components/Dashboard";
import { PageMeta } from "../components/ui";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const location = useLocation();
  const [active, setActive] = useState(location.state?.active ?? 0);

  useEffect(() => {
    if (location.state?.active != null) {
      setActive(location.state.active);
    }
  }, [location.state?.active]);

  return (
    <div className="yebone-premium-screen">
      <PageMeta title="My Account" description="Manage your Yebone account, orders, wishlist, and commissions." noIndex />
      {loading ? (
        <Loader />
      ) : (
        <DashboardLayout active={active} setActive={setActive}>
          <ProfileContent active={active} setActive={setActive} />
        </DashboardLayout>
      )}
    </div>
  );
};

export default ProfilePage;
