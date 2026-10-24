import React, { useState } from 'react';
import './BestSeller.css';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Navbar/Nabar';

const BestSeller = () => {
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

    return (
        <>
            <Navbar />
            <div className="bestseller-page">
                <div className="bestseller-container">

                    {/* Header Section */}
                    <header className="bestseller-header">
                        <h1>Best Sellers</h1>
                        <p className="bestseller-description">
                            Our most-loved pieces, chosen by over 30,000 Saybeam women. From the patented
                            Sculpt Brief to our seamless Sculpt Leggings, Shorts and Bra, each one is made to
                            smooth, lift and stay put all day, without rolling down or digging in. Every piece is
                            covered by our 90-day money-back guarantee.
                        </p>
                    </header>

                    {/* Toolbar (Filter & Sort) */}
                    <div className="bestseller-toolbar">

                        {/* Left Side: Filter */}
                        <div className="toolbar-left">
                            <span className="toolbar-label">Filter:</span>

                            <div
                                className="availability-dropdown"
                                onMouseEnter={() => setIsAvailabilityOpen(true)}
                                onMouseLeave={() => setIsAvailabilityOpen(false)}
                            >
                                <button
                                    className={`availability-btn ${isAvailabilityOpen ? 'is-hovered' : ''}`}
                                    onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                                >
                                    Availability
                                    <svg
                                        className={`chevron ${isAvailabilityOpen ? 'open' : ''}`}
                                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isAvailabilityOpen && (
                                    <div className="availability-menu">
                                        <label className="checkbox-label">
                                            <input type="checkbox" className="custom-checkbox" />
                                            <span>In stock</span>
                                        </label>
                                        <label className="checkbox-label disabled">
                                            <input type="checkbox" className="custom-checkbox" disabled />
                                            <span>Out of stock</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Sort */}
                        <div className="toolbar-right">
                            <label htmlFor="SortBy" className="toolbar-label">Sort by:</label>

                            {/* Exact select element provided */}
                            <select
                                name="sort_by"
                                className="facet-filters__sort select__select caption-large"
                                id="SortBy"
                                aria-describedby="a11y-refresh-page-message"
                            >
                                <option value="manual" selected="selected">Featured</option>
                                <option value="most-relevant">Most relevant</option>
                                <option value="best-selling">Best selling</option>
                                <option value="title-ascending">Alphabetically, A-Z</option>
                                <option value="title-descending">Alphabetically, Z-A</option>
                                <option value="price-ascending">Price, low to high</option>
                                <option value="price-descending">Price, high to low</option>
                                <option value="created-ascending">Date, old to new</option>
                                <option value="created-descending">Date, new to old</option>
                            </select>

                            <span className="product-count">6 products</span>
                        </div>

                    </div>
                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default BestSeller;