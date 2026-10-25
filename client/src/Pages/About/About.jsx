import React from 'react';
import './About.css';
import Footer from '../../Components/Footer/Footer';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Navbar from '../../Components/Navbar/Navbar';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="about-page">
                <div className="about-container">

                    {/* Header Section */}
                    <header className="about-header">
                        <h1>About Us</h1>
                        <p className="subtitle">
                            The belly that won't go down isn't a flaw. It's a structure that needs support.
                        </p>
                    </header>

                    {/* Our Story Section */}
                    <section className="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Saybeam was born from a frustration shared by millions of women: months, sometimes
                            years after giving birth, the belly is still there. Round, soft, pushing forward, no matter
                            how much you train or how clean you eat. And everywhere you turn, you hear the same
                            two things. That it's just fat, or that you simply need to try harder. We never believed
                            either. So we went looking for the real reason.
                        </p>
                        <p>
                            What we found changed everything. For most women, that belly is not extra fat. During
                            pregnancy the abdominal wall stretches open and the organs shift, and after birth the
                            wall does not simply close on its own. It needs support to come back together. Women
                            across cultures have known this for centuries, wrapping the belly after birth for
                            mechanical reasons, not cosmetic ones. We took that principle, the bengkung, and built
                            it into something you can actually live in.
                        </p>
                    </section>

                    {/* Mission Statement Highlight */}
                    <div className="mission-box">
                        <p>
                            <strong>Our mission:</strong> give every woman the one thing no diet, gym plan, or front-only
                            shaper ever could: continuous 360-degree support that helps the body close what
                            pregnancy opened. Worn daily, invisible under anything. No surgery, no struggle.
                        </p>
                    </div>

                    {/* Why Different Section */}
                    <section className="about-section">
                        <h2>Why Saybeam is Different</h2>
                        <p>
                            We don't do marketing fluff. We build what works. The Saybeam Sculpt Brief combines
                            true 360-degree circular compression, a high-waist seamless design, and crossed
                            support panels engineered for the postpartum body, not just a tighter version of
                            ordinary shapewear. Every detail, from the breathable mesh to the gentle pressure
                            across a C-section scar, was designed with women's-health input and tested on real
                            postpartum bodies.
                        </p>
                        <p>
                            No wrapping. No belt that slides down by noon. No overpromising. Just a brief you pull
                            on in seconds and forget you're wearing.
                        </p>
                    </section>

                    {/* Our Values Section */}
                    <section className="about-section">
                        <h2>Our Values</h2>
                        <ul className="values-list">

                            <li className="value-item">
                                <div className="value-icon icon-purple">
                                    {/* Simple SVG icon for 'Science' */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
                                </div>
                                <div className="value-content">
                                    <span className="value-title">Science, not marketing:</span>
                                    Every design choice is grounded in how the postpartum body actually heals, with
                                    women's-health and OB-GYN input. We follow the mechanics, not the trends.
                                </div>
                            </li>

                            <li className="value-item">
                                <div className="value-icon icon-blue">
                                    {/* Simple SVG icon for 'Transparency' */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                                <div className="value-content">
                                    <span className="value-title">Total transparency:</span>
                                    We'll tell you exactly what the Sculpt Brief is made of, how the compression works, and
                                    what it can and cannot do. We're women too. We want the truth.
                                </div>
                            </li>

                            <li className="value-item">
                                <div className="value-icon icon-orange">
                                    {/* Simple SVG icon for 'Results' */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                </div>
                                <div className="value-content">
                                    <span className="value-title">Real results, not empty promises:</span>
                                    We don't promise miracles overnight. We promise support that, worn daily, helps the
                                    work happen. Most women notice a real change around the third week, not weight
                                    loss, a belly that lifts and sits back where it belongs.
                                </div>
                            </li>

                            <li className="value-item">
                                <div className="value-icon icon-pink">
                                    {/* Simple SVG icon for 'Women' */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                                </div>
                                <div className="value-content">
                                    <span className="value-title">Built by women, for women:</span>
                                    Our team is made of moms, women's-health experts, and designers who lived the
                                    postpartum belly struggle firsthand. We're not a faceless brand. We're you, on the
                                    other side of it.
                                </div>
                            </li>

                        </ul>
                    </section>

                    {/* Guarantee Section */}
                    <section className="about-section">
                        <h2>Our Guarantee</h2>
                        <p>
                            We believe in the Sculpt Brief so strongly that we take all the risk. Wear it for 90 days. If
                            you don't feel the difference, or it's simply not right for you, we'll refund every penny.
                            No questions, no fine print, no hassle. And right now, every order also includes a free
                            bonus e-book, The Flat Belly Method, your simple guide to a flatter, firmer lower belly.
                        </p>
                    </section>

                    {/* Footer */}
                    <footer className="about-footer">
                        <hr className="footer-divider" />
                        <p className="footer-text">
                            Real recovery starts with one simple choice.<br />
                            We're here to make that choice easy.
                        </p>
                        <p className="signature">
                            — The Saybeam Team 💖
                        </p>
                    </footer>

                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default About;