import React from 'react'
import Navbar from '../Components/Navbar/Nabar'
import Hero from '../Components/Hero/Hero'
import Benefits from '../Components/Benefits/Benefits'
import CallToAction from '../Components/Calltoaction/Calltoaction'
import CustomerService from '../Components/CustomerService/Customerservice'
import Footer from '../Components/Footer/Footer'

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <Benefits />
            <CallToAction />
            <CustomerService />
            <Footer />
        </div>
    )
}

export default LandingPage
