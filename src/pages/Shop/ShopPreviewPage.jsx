import React from "react";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import { Container } from "../../components/ui";

const ShopPreviewPage = () => (
  <div className="marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950 bg-yebone-light-gray">
    <Container className="py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
          <ShopInfo isOwner={false} />
        </aside>
        <main className="w-full lg:w-3/4">
          <ShopProfileData isOwner={false} />
        </main>
      </div>
    </Container>
  </div>
);

export default ShopPreviewPage;
