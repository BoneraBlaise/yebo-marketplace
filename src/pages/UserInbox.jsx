import React from "react";
import { Helmet } from "react-helmet";
import MessagingCenter from "../components/Communication/MessagingCenter";

const UserInbox = () => (
  <>
    <Helmet>
      <title>Messages | Yebone</title>
    </Helmet>
    <div className="mc-page mc-page--buyer">
      <MessagingCenter mode="buyer" title="Messages" />
    </div>
  </>
);

export default UserInbox;
