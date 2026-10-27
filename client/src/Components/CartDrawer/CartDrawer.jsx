import React, { useEffect, useState } from 'react';
import './CartDrawer.css';
import { useStore } from '../../Store/StoreContext';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';
import { COLOR_HEX, UPSELL_OFF, upsellPrice, ADDONS } from '../../Store/cartConfig';

// Put your own avatar images here
const AVATARS = ['/images/avatar1.jpg', '/images/avatar2.jpg', '/images/avatar3.jpg', '/images/avatar4.jpg'];
const PAYMENTS = ['amazon', 'applepay', 'discover', 'mastercard', 'paypal', 'shoppay', 'visa'];
const PAGE_SIZE = 3;

const Icon = {
    close: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 5l14 14M19 5L5 19" />
        </svg>
    ),
    trash: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
        </svg>
    ),
    tag: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.6 12.6l-8-8A2 2 0 0011.2 4H5a1 1 0 00-1 1v6.2a2 2 0 00.6 1.4l8 8a2 2 0 002.8 0l5.2-5.2a2 2 0 000-2.8zM7.5 9A1.5 1.5 0 119 7.5 1.5 1.5 0 017.5 9z" />
        </svg>
    ),
    gift: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="4" /><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5" />
        </svg>
    ),
    flame: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />
        </svg>
    ),
    left: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>),
    right: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>),
    chevron: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>),
    cart: (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b8b8c0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5h3l2 11h10l2-8H7M9 20a1 1 0 100 .01M17 20a1 1 0 100 .01" />
        </svg>
    ),
    check: (
        <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1fb26b" /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
};

const useCountdown = (expiresAt, active, onExpire) => {
    const [left, setLeft] = useState(0);
    useEffect(() => {
        if (!expiresAt || !active) return undefined;
        const tick = () => {
            const s = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
            setLeft(s);
            if (s === 0) onExpire();
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [expiresAt, active]); // eslint-disable-line react-hooks/exhaustive-deps
    const mm = String(Math.floor(left / 60)).padStart(2, '0');
    const ss = String(left % 60).padStart(2, '0');
    return `${mm}:${ss}`;
};

const UpsellCard = ({ product, onAdd }) => {
    const [color, setColor] = useState(product.colors[0]);
    const [size, setSize] = useState(product.sizes[0]);
    const off = UPSELL_OFF[product.slug] || 0;
    const idx = product.colorImages?.[color];
    const img = (idx !== undefined ? product.gallery[idx] : product.image).replace(/width=\d+/, 'width=200');

    return (
        <li className="cd-up">
            <img className="cd-up__img" src={img} alt={product.name} />
            <div className="cd-up__body">
                <div className="cd-up__top">
                    <h4>{product.name}</h4>
                    <span className="cd-off cd-off--sm">{formatPrice(off)} OFF</span>
                </div>
                <p className="cd-up__price">
                    <s>{formatPrice(product.price)}</s> <strong>{formatPrice(upsellPrice(product))}</strong>
                </p>
                <div className="cd-up__swatches">
                    {product.colors.map((c) => (
                        <button
                            key={c}
                            type="button"
                            title={c}
                            aria-label={c}
                            className={`cd-swatch ${c === color ? 'is-active' : ''}`}
                            style={{ background: COLOR_HEX[c] || '#ccc' }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>
                <div className="cd-up__row">
                    <div className="cd-select">
                        <select value={size} onChange={(e) => setSize(e.target.value)} aria-label="Size">
                            {product.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {Icon.chevron}
                    </div>
                    <button type="button" className="cd-add" onClick={() => onAdd(product, color, size)}>ADD</button>
                </div>
            </div>
        </li>
    );
};

const CartDrawer = () => {
    const {
        lines, count, subtotal, savings, isOpen, closeCart,
        addToCart, setQty, removeLine, checkout, expiresAt, restartTimer,
    } = useStore();
    const [page, setPage] = useState(0);
    const timer = useCountdown(expiresAt, isOpen && lines.length > 0, restartTimer);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => e.key === 'Escape' && closeCart();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, closeCart]);

    const upsellProducts = PRODUCTS.filter((p) => UPSELL_OFF[p.slug] !== undefined);
    const pages = Math.max(1, Math.ceil(upsellProducts.length / PAGE_SIZE));
    const visible = upsellProducts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const handleUpsellAdd = (p, color, size) =>
        addToCart({ id: p.slug, color, size, deal: 'upsell' }, { open: false });

    return (
        <>
            <div className={`cd-overlay ${isOpen ? 'is-open' : ''}`} onClick={closeCart} />
            <aside className={`cd ${isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Your cart" aria-hidden={!isOpen}>
                <header className="cd-head">
                    <h3>Your Cart <span className="cd-count">{count}</span></h3>
                    <button type="button" className="cd-close" onClick={closeCart} aria-label="Close cart">{Icon.close}</button>
                </header>

                {lines.length === 0 ? (
                    <div className="cd-empty">
                        {Icon.cart}
                        <p>Empty cart</p>
                    </div>
                ) : (
                    <div className="cd-body">
                        <div className="cd-banner">Your cart expires in {timer}</div>

                        <div className="cd-rating">
                            <div className="cd-avatars">
                                {AVATARS.map((src, i) => <img key={src} src={src} alt="" style={{ zIndex: 4 - i }} />)}
                            </div>
                            <div className="cd-rating__text">
                                <span className="cd-stars">★★★★★ <b>4,8/5</b></span>
                                <span>Over <b>50,000</b> happy women</span>
                            </div>
                        </div>

                        <ul className="cd-items">
                            {lines.map((l) => (
                                <li className="cd-item" key={l.key}>
                                    <img className="cd-item__img" src={l.image} alt={l.name} />
                                    <div className="cd-item__main">
                                        <h4>{l.name}</h4>
                                        {l.variant && <p className="cd-item__variant">{l.variant}</p>}
                                        <div className="cd-item__actions">
                                            <div className="cd-qty">
                                                <button type="button" disabled={l.qty <= 1} onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease">−</button>
                                                <span>{l.qty}</span>
                                                <button type="button" disabled={l.qty >= l.maxQty} onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase">+</button>
                                            </div>
                                            <button type="button" className="cd-trash" onClick={() => removeLine(l.key)} aria-label="Remove">{Icon.trash}</button>
                                        </div>
                                        {l.tag && <p className="cd-item__tag">{Icon.tag} {l.tag}</p>}
                                    </div>
                                    <div className="cd-item__price">
                                        <strong>{formatPrice(l.paid)}</strong>
                                        {l.compare > l.paid && <s>{formatPrice(l.compare)}</s>}
                                        {!l.gift && l.compare > l.paid && (
                                            <span className="cd-off">{formatPrice(l.compare - l.paid)} OFF</span>
                                        )}
                                        {l.gift && <span className="cd-gift">{Icon.gift}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="cd-upsell-head">
                            <h4>{Icon.flame} You Might Also Like</h4>
                            <div className="cd-pager">
                                <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous">{Icon.left}</button>
                                <span>{page + 1}/{pages}</span>
                                <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next">{Icon.right}</button>
                            </div>
                        </div>
                        <ul className="cd-upsell">
                            {visible.map((p) => <UpsellCard key={p.id} product={p} onAdd={handleUpsellAdd} />)}
                        </ul>
                    </div>
                )}

                <footer className="cd-foot">
                    <div className="cd-subtotal">
                        <span className="cd-subtotal__label">Subtotal</span>
                        {savings > 0 && <span className="cd-save">Save {formatPrice(savings)}</span>}
                        <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <button type="button" className="cd-checkout" disabled={lines.length === 0} onClick={checkout}>CHECKOUT</button>
                    <div className="cd-pay">
                        {PAYMENTS.map((p) => <img key={p} src={`/payments/${p}.svg`} alt={p} />)}
                    </div>
                    <p className="cd-risk">{Icon.check} Try risk-free: 90 days, love it or your money back</p>
                </footer>
            </aside>
        </>
    );
};

export default CartDrawer;