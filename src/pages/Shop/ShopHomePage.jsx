import React from "react";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { Container } from "../../components/ui";

const ShopHomePage = () => (
  <div className="marketplace-page min-h-screen dark:bg-[#1f1f1f]">
    <Header />
    <Container className="py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start max-h-[90vh] overflow-y-auto">
          <ShopInfo isOwner={true} />
        </aside>
        <main className="w-full lg:w-3/4">
          <ShopProfileData isOwner={true} />
        </main>
      </div>
    </Container>
    <Footer />
  </div>
);

export default ShopHomePage;
