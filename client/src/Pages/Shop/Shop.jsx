import React from 'react'
import ProductGuaranteeFaq from '../../Components/Faqs/ProductGuaranteeFaq'
import Navbar from '../../Components/Navbar/Nabar'
import CustomerService from '../../Components/CustomerService/Customerservice'
import Footer from '../../Components/Footer/Footer'

const Shop = () => {
    return (
        <>
            <Navbar />
            <ProductGuaranteeFaq />
            <CustomerService />
            <Footer />
        </>
    )
}

export default Shop
