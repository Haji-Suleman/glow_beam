import React from 'react'
import ProductGuaranteeFaq from '../../Components/Faqs/ProductGuaranteeFaq'
import Navbar from '../../Components/Navbar/Navbar'
import CustomerService from '../../Components/CustomerService/Customerservice'
import Footer from '../../Components/Footer/Footer'
import ShopHero from '../../Components/ShopHero/ShopHero'
import Customersaying from '../../Components/Customersaying/Customersaying'

import GlowbeamCompare from '../../Components/GlowbeamCompare/GlowbeamCompare'
import GlowbeamReviews from '../../Components/GlowbeamReviews/GlowbeamReviews'
import GlowbeamRealReviews from '../../Components/GlowbeamRealReviews/GlowbeamRealReviews'
const Shop = () => {
    return (
        <>
            <Navbar />
            <ShopHero />
            <GlowbeamReviews />
            <Customersaying />

            <GlowbeamCompare />
            <GlowbeamRealReviews />
            <ProductGuaranteeFaq />
            <CustomerService />
            <Footer />
        </>
    )
}

export default Shop
