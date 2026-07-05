import React from 'react';
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const ShopPreviewPage = () => {
 

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center px-4 py-10 dark:bg-[#1f1f1f]">
        <div className="flex flex-col lg:flex-row lg:space-x-6 lg:w-full lg:max-w-6xl">
          <div className="w-full lg:w-1/4 bg-white dark:bg-[#1f1f1f] rounded-lg shadow-md lg:sticky lg:top-20 lg:h-[90vh] lg:overflow-y-auto mb-6 lg:mb-0">
            <ShopInfo isOwner={false} />
          </div>
          <div className="w-full lg:w-3/4 bg-gray-100 dark:bg-[#1f1f1f] mb-20 mr-auto ml-auto">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default ShopPreviewPage;
