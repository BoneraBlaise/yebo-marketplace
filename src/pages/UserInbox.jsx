import React from "react";
import { Helmet } from "react-helmet";
import { Container } from "../components/ui";
import MessagingCenter from "../components/Communication/MessagingCenter";

const UserInbox = () => (
  <>
    <Helmet>
      <title>Messages | Yebone</title>
    </Helmet>
    <Container className="py-4 sm:py-6 lg:py-8">
      <MessagingCenter mode="buyer" title="Messages" />
    </Container>
  </>
);

export default UserInbox;
