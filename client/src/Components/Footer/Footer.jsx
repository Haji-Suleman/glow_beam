import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">

            {/* 2-Layer Smooth Animated Waves */}
            <div className="wave-wrapper">
                {/* Layer 1 (Back / Light Pink) */}
                <svg className="wave-layer wave-back" viewBox="0 0 2880 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,20 C600,100 1800,0 2880,50 L2880,120 L0,120 Z" fill="#ebadd0"></path>
                </svg>

                {/* Layer 2 (Front / Main Pink) */}
                <svg className="wave-layer wave-front" viewBox="0 0 2880 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C600,120 1800,20 2880,70 L2880,120 L0,120 Z" fill="#d15d9e"></path>
                </svg>
            </div>

            <div className="footer-content">
                {/* Top 3 Columns - Applying the Layered Box Animation */}
                <div className="footer-top">

                    {/* Column 1: DMCA */}
                    <div className="layered-box footer-col-dmca">
                        <img
                            src="https://res.cloudinary.com/demo/image/upload/v1/dmca-badge-placeholder.png"
                            alt="DMCA Protected"
                            onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ETUNBPC90ZXh0Pjwvc3ZnPg=='; }}
                        />
                        <div className="heart"></div>
                    </div>

                    {/* Column 2: Help */}
                    <div className="layered-box footer-col-help">
                        <h3>We're Here to Help</h3>
                        <p>Questions before or after your order? A real person will answer you.</p>
                        <p>
                            <a href="mailto:contact@saybeam.com" className="email-link">contact@saybeam.com</a> — Mon to Sun, 9 AM–7 PM · reply within 24h.
                        </p>
                        <div className="heart"></div>
                    </div>

                    {/* Column 3: Links */}
                    <div className="layered-box footer-col-links">
                        <h3>Quick links</h3>
                        <ul>
                            <li><a href="#contact">Contact Information</a></li>
                            <li><a href="#legal">Legal Notice</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#refund">Refund Policy</a></li>
                            <li><a href="#shipping">Shipping Policy</a></li>
                            <li><a href="#terms-sale">Terms of Sale</a></li>
                            <li><a href="#terms-service">Terms of Service</a></li>
                        </ul>
                        <div className="heart"></div>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="footer-bottom">

                    {/* Country Selector */}
                    <div className="country-selector">
                        <label htmlFor="country">Country/region</label>
                        <select id="country" className="country-dropdown">
                            <option value="PK">Pakistan (PKR Rs)</option>
                            <option value="US">United States (USD $)</option>
                            <option value="UK">United Kingdom (GBP £)</option>
                        </select>
                    </div>

                    {/* Payment Icons */}
                    <div className="payment-icons">
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/alipay.png" alt="Alipay" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzE2N2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+YWxpcGF5PC90ZXh0Pjwvc3ZnPg=='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/amex.png" alt="Amex" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwN2JjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QU1FWDwvdGV4dD48L3N2Zz4='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/applepay.png" alt="Apple Pay" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGF5PC90ZXh0Pjwvc3ZnPg=='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/bank.png" alt="Bank" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YyZjJmMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjMzMzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QmFuazwvdGV4dD48L3N2Zz4='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/diners.png" alt="Diners Club" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwNzlhNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RElORVJTPC90ZXh0Pjwvc3ZnPg=='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/discover.png" alt="Discover" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmNjYwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RElTQzwvdGV4dD48L3N2Zz4='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/gpay.png" alt="Google Pay" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjMzMzIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R1BheTwvdGV4dD48L3N2Zz4='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/mastercard.png" alt="Mastercard" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMTQiIHI9IjgiIGZpbGw9IiNlYjAwMWIiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjE0IiByPSI4IiBmaWxsPSIjZjY5ZjFkIi8+PC9zdmc+'; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/maestro.png" alt="Maestro" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMTQiIHI9IjgiIGZpbGw9IiMwMDQ1N2UiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjE0IiByPSI4IiBmaWxsPSIjZWIwMDFiIi8+PC9zdmc+'; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/paypal.png" alt="PayPal" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwM2Y4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGF5UGFsPC90ZXh0Pjwvc3ZnPg=='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/shop.png" alt="Shop Pay" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzVhMzFmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2hvcDwvdGV4dD48L3N2Zz4='; }} />
                        <img src="https://res.cloudinary.com/demo/image/upload/v1/visa.png" alt="Visa" onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWY3MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WSVNIPC90ZXh0Pjwvc3ZnPg=='; }} />
                    </div>
                </div>

                {/* Copyright Text */}
                <div className="copyright">
                    © 2026, Saybeam AXELORN GROUP LLC – 33N Gould St – Sheridan – WY – 82801 – USA
                </div>
            </div>
        </footer>
    );
};

export default Footer;