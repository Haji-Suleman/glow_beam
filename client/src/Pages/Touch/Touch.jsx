import React from 'react';
import './Touch.css';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Navbar/Nabar';

const Contact = () => {
    return (
        <>
            <Navbar />
            <div className="contact-section">
                <div className="contact-container">
                    <h1 className="contact-title">Get in touch</h1>

                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        {/* Top Row: Name and Email */}
                        <div className="form-row split-row">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Name"
                                aria-label="Name"
                            />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email"
                                aria-label="Email"
                            />
                        </div>

                        {/* Order Number */}
                        <div className="form-row">
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Order number (#1234)"
                                aria-label="Order number"
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Phone Number */}
                        <div className="form-row">
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="Phone number"
                                aria-label="Phone number"
                            />
                        </div>

                        {/* Comment */}
                        <div className="form-row">
                            <textarea
                                className="form-input form-textarea large-textarea"
                                placeholder="Comment"
                                aria-label="Comment"
                                rows="5"
                            ></textarea>
                        </div>

                        {/* Send Button */}
                        <div className="form-row">
                            <button type="submit" className="send-button">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <CustomerService />
            <Footer />
        </>

    );
};

export default Contact;