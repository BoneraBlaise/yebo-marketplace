import React, { useState } from "react";
import Loader from "../components/Layout/Loader";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";
import { DashboardLayout } from "../components/Dashboard";
import { PageMeta } from "../components/ui";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(0);

  return (
    <div>
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
