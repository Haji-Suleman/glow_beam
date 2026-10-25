import React from 'react'
import ProductGuaranteeFaq from '../../Components/Faqs/ProductGuaranteeFaq'
import Navbar from '../../Components/Navbar/Nabar'
import CustomerService from '../../Components/CustomerService/Customerservice'
import Footer from '../../Components/Footer/Footer'
import ShopHero from '../../Components/ShopHero/ShopHero'

const Shop = () => {
    return (
        <>
            <Navbar />
            <ShopHero />
            <ProductGuaranteeFaq />
            <CustomerService />
            <Footer />
        </>
    )
}

export default Shop
