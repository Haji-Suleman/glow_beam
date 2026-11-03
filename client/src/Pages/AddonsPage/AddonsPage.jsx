import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './AddonsPage.css';
import { useStore } from '../../Store/StoreContext';
import { formatPrice } from '../../Store/Products/Products';
import { getAddonBySlug, MAIN_SLUGS, addonDisplayPrice } from '../../Store/cartConfig';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import CustomerService from '../../Components/CustomerService/Customerservice';

/* ---------- helpers ---------- */
const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const fmtDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return `${d.toLocaleString('en-US', { month: 'short' })} ${ordinal(d.getDate())}`;
};

const ZoomImage = ({ src, alt }) => {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 50, y: 50 });

    const handleMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
        });
    };

    return (
        <div
            className={`ap-zoom ${zoom ? 'is-zoomed' : ''}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMove}
        >
            <img
                className="ap-img"
                src={src}
                alt={alt}
                draggable="false"
                style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
            />
            <span className="ap-zoom-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                </svg>
            </span>
        </div>
    );
};

const Stars = ({ rating = 5 }) => {
    const full = Math.round(rating);
    return (
        <span className="ap-stars" aria-label={`${rating} out of 5`}>
            {'★'.repeat(full)}{'☆'.repeat(5 - full)}
        </span>
    );
};

const StepIcon = ({ name }) => {
    const p = {
        width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
        stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    };
    if (name === 'cart') return (<svg {...p}><path d="M3 5h3l2 11h10l2-8H7" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>);
    if (name === 'truck') return (<svg {...p}><path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg>);
    return (<svg {...p}><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M12 9v11M3 9h18M12 9c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3" /></svg>);
};

/* ---------- page ---------- */
export default function AddonsPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { lines, addToCart } = useStore();
    const [qty, setQty] = useState(1);

    const addon = getAddonBySlug(slug);

    // New product -> reset the bundle and scroll to top
    useEffect(() => {
        setQty(1);
        window.scrollTo(0, 0);
    }, [slug]);

    if (!addon) {
        return (
            <div className="ap ap--missing">
                <h1>Product not found</h1>
                <Link to="/">Back to shop</Link>
            </div>
        );
    }

    const hasMain = lines.some((l) => l.type === 'product' && MAIN_SLUGS.includes(l.id));
    const unit = addonDisplayPrice(addon, hasMain);
    const maxBundle = Math.min(4, addon.maxQty || 4);
    const bundles = Array.from({ length: maxBundle }, (_, i) => i + 1);

    const bundleTotal = (n) => +(unit * n).toFixed(2);
    const bundleCompare = (n) => +(addon.compare * n).toFixed(2);
    const discount = addon.compare > unit
        ? Math.round((1 - unit / addon.compare) * 100)
        : 0;

    const item = { type: 'addon', id: addon.id, qty };
    const handleAdd = () => addToCart(item);
    const handleBuyNow = () => {
        addToCart(item, { open: false });
        navigate('/checkout');
    };

    const steps = [
        { icon: 'cart', date: fmtDate(0), label: 'Ordered' },
        { icon: 'truck', date: `${fmtDate(1)} - ${fmtDate(2)}`, label: 'Order Ready' },
        { icon: 'gift', date: `${fmtDate(10)} - ${fmtDate(12)}`, label: 'Delivered' },
    ];

    return (
        <>
            <Navbar />
            <section className="ap">
                <div className="ap-grid">
                    {/* LEFT: image with hover zoom */}
                    <div className="ap-media">
                        <ZoomImage src={addon.image} alt={addon.name} />
                    </div>

                    {/* RIGHT: info */}
                    <div className="ap-info">
                        <h1 className="ap-title">{addon.name}</h1>

                        <div className="ap-rating">
                            <Stars rating={addon.rating || 4.5} />
                            {addon.reviewCount ? <span>({addon.reviewCount} Reviews)</span> : null}
                        </div>

                        <p className="ap-price">
                            <strong>{unit === 0 ? 'FREE' : formatPrice(unit)}</strong>
                            {addon.compare > unit && <s>{formatPrice(addon.compare)}</s>}
                            {discount > 0 && <span className="ap-badge">SAVE {discount}%</span>}
                        </p>

                        {maxBundle > 1 && (
                            <div className="ap-divider"><span>BUNDLE &amp; SAVE</span></div>
                        )}

                        <div className="ap-bundles">
                            {bundles.map((n) => (
                                <label key={n} className={`ap-bundle ${qty === n ? 'is-selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="bundle"
                                        checked={qty === n}
                                        onChange={() => setQty(n)}
                                    />
                                    <span className="ap-bundle-text">
                                        <strong>Buy {n}</strong>
                                        {addon.compare > unit && (
                                            <small>You save {formatPrice(bundleCompare(n) - bundleTotal(n))}</small>
                                        )}
                                    </span>
                                    <span className="ap-bundle-price">
                                        <strong>{unit === 0 ? 'FREE' : formatPrice(bundleTotal(n))}</strong>
                                        {addon.compare > unit && <s>{formatPrice(bundleCompare(n))}</s>}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button type="button" className="ap-cart" onClick={handleAdd}>ADD TO CART</button>
                        <button type="button" className="ap-buy" onClick={handleBuyNow}>BUY IT NOW</button>

                        <div className="ap-steps">
                            {steps.map((s) => (
                                <div className="ap-step" key={s.label}>
                                    <span className="ap-step-icon"><StepIcon name={s.icon} /></span>
                                    <b>{s.date}</b>
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {addon.description && <p className="ap-desc">{addon.description}</p>}

                        {addon.bullets?.length > 0 && (
                            <ul className="ap-bullets">
                                {addon.bullets.map((b) => <li key={b}>{b}</li>)}
                            </ul>
                        )}

                        <p className="ap-note">Try it risk-free: 90 days, love it or your money back.</p>
                    </div>
                </div>
            </section>
            <CustomerService />
            <Footer />
        </>
    );
}