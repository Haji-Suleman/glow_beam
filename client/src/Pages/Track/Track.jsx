import React from 'react';
import './Track.css';
import Navbar from '../../Components/Navbar/Navbar';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';

const Track = () => {
    return (
        <>
            <Navbar />
            <div className="track-page">
                <div className="track-container">

                    <h1 className="track-title">Track Your Order</h1>

                    <div className="track-box">
                        {/* Left Column: Order Tracking */}
                        <div className="track-column">
                            <div className="input-group">
                                <label htmlFor="order-number">Order Number</label>
                                <input type="text" id="order-number" className="track-input" />
                            </div>

                            <div className="input-group">
                                <label htmlFor="contact-info">Email or Phone Number</label>
                                <input type="text" id="contact-info" className="track-input" />
                            </div>

                            <button type="button" className="track-btn">
                                Track
                            </button>
                        </div>

                        {/* Middle Divider */}
                        <div className="track-divider">
                            <span className="divider-text">Or</span>
                        </div>

                        {/* Right Column: Tracking Number */}
                        <div className="track-column right-column">
                            <div className="input-group">
                                <label htmlFor="tracking-number">Tracking Number</label>
                                <input type="text" id="tracking-number" className="track-input" />
                            </div>

                            <button type="button" className="track-btn">
                                Track
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default Track;