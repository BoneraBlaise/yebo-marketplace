import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import FlashSaleDetails from '../components/Route/FlashSales/FlashSaleDetails'
const FlashSaleDetailsPage = () => {
  return (
    <div>
    <Header />

    {/* Render BidDetails component */}
    <FlashSaleDetails />

    <Footer />
</div>
  )
}

export default FlashSaleDetailsPage