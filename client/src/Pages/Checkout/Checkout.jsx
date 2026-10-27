// src/Pages/Checkout/Checkout.jsx
import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const Checkout = () => {
    return (
        <>
            <Navbar />
            <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Checkout Page</h2>
                <p>Your order has been saved! Integrate your payment gateway here.</p>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;