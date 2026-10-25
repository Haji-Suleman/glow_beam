import React from 'react'
import ProductGuaranteeFaq from '../../Components/Faqs/ProductGuaranteeFaq'
import Navbar from '../../Components/Navbar/Navbar'
import CustomerService from '../../Components/CustomerService/Customerservice'
import Footer from '../../Components/Footer/Footer'
import ShopHero from '../../Components/ShopHero/ShopHero'
import Customersaying from '../../Components/Customersaying/Customersaying'

const Shop = () => {
    return (
        <>
            <Navbar />
            <ShopHero />
            <Customersaying />
            <ProductGuaranteeFaq />
            <CustomerService />
            <Footer />
        </>
    )
}

export default Shop
