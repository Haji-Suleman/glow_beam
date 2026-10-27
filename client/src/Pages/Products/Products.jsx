import React, { useState, useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './Products.css';
import Navbar from '../../Components/Navbar/Navbar';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import { getProductBySlug, formatPrice } from '../../Store/Products/Products';
const Product = () => {
    const { slug } = useParams();
    const product = getProductBySlug(slug);

    const [activeIndex, setActiveIndex] = useState(0);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
    const thumbsRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    // Reset everything when navigating to a different product
    useEffect(() => {
        if (!product) return;
        window.scrollTo(0, 0);
        setActiveIndex(0);
        setColor(product.colors[0]);
        setSize(product.sizes[1] || product.sizes[0]);
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateArrows = () => {
        const el = thumbsRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 2);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };

    useEffect(() => {
        updateArrows();
    }, [product]);

    if (!product) return <Navigate to="/collections/best-sellers" replace />;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoom({
            active: true,
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const scrollThumbs = (dir) => {
        thumbsRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
    };

    const handleAddToCart = () => {
        // Replace with your cart logic / API call
        console.log('Add to cart:', { id: product.id, name: product.name, color, size });
    };

    return (
        <>
            <Navbar />
            <div className="product-page">
                <div className="product-layout">

                    {/* Gallery */}
                    <div className="product-gallery">
                        <div
                            className="product-gallery__main"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                        >
                            <img
                                src={product.gallery[activeIndex]}
                                alt={product.name}
                                className="product-gallery__img"
                                style={{
                                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                                    transform: zoom.active ? 'scale(2.2)' : 'scale(1)',
                                }}
                                draggable="false"
                            />
                            <span className="product-gallery__zoom-icon" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
                                </svg>
                            </span>
                        </div>

                        <div className="product-thumbs">
                            <button
                                type="button"
                                className="product-thumbs__arrow"
                                onClick={() => scrollThumbs(-1)}
                                disabled={atStart}
                                aria-label="Previous images"
                            >‹</button>

                            <ul className="product-thumbs__list" ref={thumbsRef} onScroll={updateArrows}>
                                {product.gallery.map((src, i) => (
                                    <li key={src}>
                                        <button
                                            type="button"
                                            className={`product-thumbs__item ${i === activeIndex ? 'active' : ''}`}
                                            onClick={() => setActiveIndex(i)}
                                        >
                                            <img src={src} alt={`${product.name} ${i + 1}`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="product-thumbs__arrow"
                                onClick={() => scrollThumbs(1)}
                                disabled={atEnd}
                                aria-label="Next images"
                            >›</button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="product-info">
                        <h1 className="product-info__title">{product.name}</h1>
                        <p className="product-info__price">{formatPrice(product.price)}</p>

                        <fieldset className="product-option">
                            <legend>Color - <strong>{color}</strong></legend>
                            <div className="product-pills">
                                {product.colors.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`product-pill ${c === color ? 'selected' : ''}`}
                                        onClick={() => setColor(c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <div className="product-option">
                            <label htmlFor="size-select" className="product-option__label">
                                Size - <strong>{size}</strong>
                            </label>
                            <select
                                id="size-select"
                                className="product-select"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                {product.sizes.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <button type="button" className="product-add-btn" onClick={handleAddToCart}>
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default Product;