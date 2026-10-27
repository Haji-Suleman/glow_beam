import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BestSeller.css';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Navbar/Navbar';
import ProductPopup from '../../Components/ProductPopup/ProductPopup';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';

// Later this can come from your FastAPI backend instead

const sortProducts = (list, sortBy) => {
    const copy = [...list];
    switch (sortBy) {
        case 'title-ascending':
            return copy.sort((a, b) => a.name.localeCompare(b.name));
        case 'title-descending':
            return copy.sort((a, b) => b.name.localeCompare(a.name));
        case 'price-ascending':
            return copy.sort((a, b) => a.price - b.price);
        case 'price-descending':
            return copy.sort((a, b) => b.price - a.price);
        case 'created-ascending':
            return copy.sort((a, b) => a.created - b.created);
        case 'created-descending':
            return copy.sort((a, b) => b.created - a.created);
        default: // manual, most-relevant, best-selling
            return copy;
    }
};

const ProductCard = ({ product, onChooseOptions }) => (
    <li className="product-grid__item">
        <div className="product-card">
            <Link
                to={`/products/${product.slug}`}
                className="product-card__media"
                aria-label={product.name}
            >
                <img src={product.image} alt={product.name} className="product-card__img" />
                <img
                    src={product.hoverImage}
                    alt=""
                    className="product-card__img product-card__img--hover"
                    loading="lazy"
                />
            </Link>

            <div className="product-card__info">
                <h3 className="product-card__title">
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="product-card__price">{formatPrice(product.price)}</p>
                <button
                    className="product-card__btn"
                    type="button"
                    onClick={() => onChooseOptions(product)}
                >
                    Choose options
                </button>
            </div>
        </div>
    </li>
);

const BestSeller = () => {
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [sortBy, setSortBy] = useState('manual');
    const [popupProduct, setPopupProduct] = useState(null);
    const dropdownRef = useRef(null);

    const products = useMemo(() => sortProducts(PRODUCTS, sortBy), [sortBy]);

    // Close the availability menu on outside click or Escape (needed for touch screens)
    useEffect(() => {
        if (!isAvailabilityOpen) return;

        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsAvailabilityOpen(false);
            }
        };
        const onKey = (e) => e.key === 'Escape' && setIsAvailabilityOpen(false);

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, [isAvailabilityOpen]);

    return (
        <>
            <Navbar />
            <div className="bestseller-page">
                <div className="bestseller-container">

                    <header className="bestseller-header">
                        <h1>Best Sellers</h1>
                        <p className="bestseller-description">
                            Our most-loved pieces, chosen by over 50,000 Saybeam women. From the patented
                            Sculpt Brief to our seamless Sculpt Leggings, Shorts and Bra, each one is made to
                            smooth, lift and stay put all day, without rolling down or digging in. Every piece is
                            covered by our 90-day money-back guarantee.
                        </p>
                    </header>

                    <div className="bestseller-toolbar">
                        <div className="toolbar-left">
                            <span className="toolbar-label">Filter:</span>

                            <div
                                className="availability-dropdown"
                                ref={dropdownRef}
                                onMouseEnter={() => setIsAvailabilityOpen(true)}
                                onMouseLeave={() => setIsAvailabilityOpen(false)}
                            >
                                <button
                                    type="button"
                                    className={`availability-btn ${isAvailabilityOpen ? 'is-hovered' : ''}`}
                                    onClick={() => setIsAvailabilityOpen(true)}
                                    aria-expanded={isAvailabilityOpen}
                                    aria-haspopup="true"
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

                        <div className="toolbar-right">
                            <label htmlFor="SortBy" className="toolbar-label">Sort by:</label>

                            <select
                                name="sort_by"
                                className="facet-filters__sort select__select caption-large"
                                id="SortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="manual">Featured</option>
                                <option value="most-relevant">Most relevant</option>
                                <option value="best-selling">Best selling</option>
                                <option value="title-ascending">Alphabetically, A-Z</option>
                                <option value="title-descending">Alphabetically, Z-A</option>
                                <option value="price-ascending">Price, low to high</option>
                                <option value="price-descending">Price, high to low</option>
                                <option value="created-ascending">Date, old to new</option>
                                <option value="created-descending">Date, new to old</option>
                            </select>

                            <span className="product-count">
                                {products.length} {products.length === 1 ? 'product' : 'products'}
                            </span>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <ul className="product-grid">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} onChooseOptions={setPopupProduct} />
                        ))}
                    </ul>
                </div>
            </div>

            {popupProduct && (
                <ProductPopup product={popupProduct} onClose={() => setPopupProduct(null)} />
            )}

            <CustomerService />
            <Footer />
        </>
    );
};

export default BestSeller;