import React from 'react'
import BidDetails from '../components/Bid/BidDetails'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const BidDetailsPage = () => {
    return (
        <div>
            <Header />

            {/* Render BidDetails component */}
            <BidDetails />

            <Footer />
        </div>
    )
}

export default BidDetailsPage;
