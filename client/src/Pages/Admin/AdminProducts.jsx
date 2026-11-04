import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminProducts.css';
import AdminOrders from '../AdminOrders/AdminOrders';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';
import { ADDONS, COLOR_HEX, COLOR_IMAGES } from '../../Store/cartConfig';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const KEY_NAME = 'admin_key';

const asArray = (v) => (Array.isArray(v) ? v : []);
const strings = (v) => asArray(v).filter((x) => typeof x === 'string');
const firstImage = (p) => strings(p?.gallery)[0] || (typeof p?.image === 'string' ? p.image : '');

const fmtTime = (s) => {
    if (!s) return '';
    const d = new Date(/Z|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
    return d.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// Build the read-only catalog from hardcoded frontend files.
const CATALOG = (() => {
    const products = asArray(PRODUCTS).map((p) => ({
        id: String(p.slug || p.id || ''),
        slug: String(p.slug || p.id || ''),
        kind: 'product',
        name: String(p.name || p.title || ''),
        price: Number(p.price) || 0,
        compare_price: Number(p.compare || p.comparePrice) || 0,
        image: firstImage(p),
        colors: strings(p.colors),
        sizes: strings(p.sizes),
        gallery: strings(p.gallery),
    }));

    const addons = Object.values(ADDONS || {}).map((a) => ({
        id: String(a.slug || a.id || ''),
        slug: String(a.slug || a.id || ''),
        kind: 'addon',
        name: String(a.name || '').split(' — ')[0],
        price: Number(a.price) || 0,
        compare_price: Number(a.compare) || 0,
        image: typeof a.image === 'string' ? a.image : '',
        colors: [],
        sizes: [],
        gallery: typeof a.image === 'string' ? [a.image] : [],
    }));

    return [...products, ...addons].filter((it) => it.slug && it.name);
})();

const CODE_IMAGES = (() => {
    const m = {};
    CATALOG.forEach((p) => { if (p.image) m[p.slug.toLowerCase()] = p.image; });
    return m;
})();

const Thumb = ({ src, name, className = '' }) =>
    src ? (
        <img className={`adm-thumb ${className}`} src={src} alt={name || ''} loading="lazy" />
    ) : (
        <span className={`adm-thumb adm-thumb--empty ${className}`}>{(name || '?').charAt(0).toUpperCase()}</span>
    );

const Stat = ({ label, value, tone }) => (
    <div className={`adm-stat ${tone ? `adm-stat--${tone}` : ''}`}>
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
);

export default function AdminProducts() {
    const [key, setKey] = useState(() => sessionStorage.getItem(KEY_NAME) || '');
    const [input, setInput] = useState('');
    const [tab, setTab] = useState('products');
    const [carts, setCarts] = useState([]);
    const [kind, setKind] = useState('all');
    const [search, setSearch] = useState('');
    const [cartFilter, setCartFilter] = useState('');
    const [openCart, setOpenCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ordersTick, setOrdersTick] = useState(0);

    const signOut = useCallback(() => {
        sessionStorage.removeItem(KEY_NAME);
        setKey('');
    }, []);

    const get = useCallback(async (path) => {
        const res = await fetch(`${API}${path}`, {
            headers: { 'X-Admin-Key': key },
        });
        if (res.status === 401) {
            signOut();
            throw new Error('Wrong admin key');
        }
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
    }, [key, signOut]);

    // Only carts are loaded from the server now.
    const load = useCallback(async () => {
        if (!key) return;
        setLoading(true);
        setError('');
        try {
            const c = await get('/api/admin/carts');
            setCarts(asArray(c));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [key, get]);

    useEffect(() => { load(); }, [load]);

    const refresh = () => {
        load();
        setOrdersTick((t) => t + 1);
    };

    const login = (e) => {
        e.preventDefault();
        sessionStorage.setItem(KEY_NAME, input.trim());
        setKey(input.trim());
        setInput('');
    };

    const catalogImages = useMemo(() => {
        const m = {};
        CATALOG.forEach((p) => {
            if (p.image) m[p.slug.toLowerCase()] = p.image;
        });
        return m;
    }, []);

    const itemImage = (it) => {
        const slug = String(it.slug || '').toLowerCase();
        if (slug === 'glowbeam-sculpt-brief' && COLOR_IMAGES[it.color]) return COLOR_IMAGES[it.color];
        return catalogImages[slug] || CODE_IMAGES[slug] || '';
    };

    if (!key) {
        return (
            <div className="adm-auth">
                <form className="adm-auth__card" onSubmit={login}>
                    <span className="adm-logo">GB</span>
                    <h1>Admin</h1>
                    <p>Enter your admin key to continue.</p>
                    <input
                        type="password"
                        placeholder="Admin key"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Sign in</button>
                    {error && <p className="adm-msg adm-msg--err">{error}</p>}
                </form>
            </div>
        );
    }

    const shownProducts = CATALOG.filter((p) => {
        if (kind !== 'all' && p.kind !== kind) return false;
        return `${p.name} ${p.slug}`.toLowerCase().includes(search.toLowerCase());
    });

    const shownCarts = carts.filter((c) => c.item_count > 0 && (!cartFilter || c.status === cartFilter));
    const withItems = carts.filter((c) => c.item_count > 0);
    const checkoutCount = carts.filter((c) => c.status === 'checkout').length;
    const openValue = withItems.reduce((s, c) => s + (c.subtotal || 0), 0);

    return (
        <div className="adm">
            <header className="adm-top">
                <div className="adm-brand">
                    <span className="adm-logo">GB</span>
                    <div>
                        <strong>Glow Beam</strong>
                        <small>Admin</small>
                    </div>
                </div>

                <nav className="adm-tabs">
                    <button type="button" className={tab === 'products' ? 'is-on' : ''} onClick={() => setTab('products')}>
                        Products <em>{CATALOG.length}</em>
                    </button>
                    <button type="button" className={tab === 'carts' ? 'is-on' : ''} onClick={() => setTab('carts')}>
                        Carts <em>{withItems.length}</em>
                    </button>
                    <button type="button" className={tab === 'orders' ? 'is-on' : ''} onClick={() => setTab('orders')}>
                        Orders
                    </button>
                </nav>

                <div className="adm-actions">
                    <button type="button" className="adm-btn adm-btn--ghost" onClick={refresh}>Refresh</button>
                    <button type="button" className="adm-btn adm-btn--ghost" onClick={signOut}>Sign out</button>
                </div>
            </header>

            <main className="adm-main">
                {error && <p className="adm-msg adm-msg--err">{error}</p>}

                {tab === 'orders' && (
                    <AdminOrders adminKey={key} onAuthError={signOut} refresh={ordersTick} />
                )}

                {tab === 'products' && (
                    <>
                        <div className="adm-stats">
                            <Stat label="Products" value={CATALOG.filter((p) => p.kind === 'product').length} />
                            <Stat label="Add-ons" value={CATALOG.filter((p) => p.kind === 'addon').length} />
                            <Stat label="Total items" value={CATALOG.length} />
                        </div>

                        <div className="adm-toolbar">
                            <input
                                className="adm-search"
                                placeholder="Search products…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="adm-chips">
                                {['all', 'product', 'addon'].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        className={kind === k ? 'is-on' : ''}
                                        onClick={() => setKind(k)}
                                    >
                                        {k === 'all' ? 'All' : k === 'product' ? 'Products' : 'Add-ons'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="adm-grid">
                            {shownProducts.map((p) => {
                                const off = p.compare_price > p.price
                                    ? Math.round((1 - p.price / p.compare_price) * 100)
                                    : 0;
                                return (
                                    <article className="adm-card" key={p.slug}>
                                        <div className="adm-card__media">
                                            <Thumb src={p.image} name={p.name} className="adm-card__img" />
                                            <span className={`adm-badge adm-badge--${p.kind}`}>
                                                {p.kind === 'addon' ? 'Add-on' : 'Product'}
                                            </span>
                                            {off > 0 && <span className="adm-off">−{off}%</span>}
                                        </div>

                                        <div className="adm-card__body">
                                            <h3>{p.name}</h3>
                                            <code>/{p.slug}</code>

                                            <p className="adm-price">
                                                <strong>{formatPrice(p.price)}</strong>
                                                {p.compare_price > p.price && <s>{formatPrice(p.compare_price)}</s>}
                                            </p>

                                            {p.colors.length > 0 && (
                                                <div className="adm-swatches">
                                                    {p.colors.slice(0, 8).map((c) => (
                                                        <i key={c} style={{ background: COLOR_HEX[c] || '#d8d8de' }} title={c} />
                                                    ))}
                                                </div>
                                            )}

                                            {p.sizes.length > 0 && (
                                                <div className="adm-sizes">
                                                    {p.sizes.map((s) => <span key={s}>{s}</span>)}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}

                {tab === 'carts' && (
                    <>
                        <div className="adm-stats">
                            <Stat label="Carts with items" value={withItems.length} />
                            <Stat label="Checkout started" value={checkoutCount} tone="good" />
                            <Stat label="Value in carts" value={formatPrice(openValue)} />
                        </div>

                        <div className="adm-toolbar">
                            <div className="adm-chips">
                                {[['', 'All'], ['open', 'Open'], ['checkout', 'Checkout started']].map(([v, label]) => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={cartFilter === v ? 'is-on' : ''}
                                        onClick={() => setCartFilter(v)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!loading && shownCarts.length === 0 && !error && (
                            <p className="adm-empty">No carts yet.</p>
                        )}

                        <div className="adm-carts">
                            {shownCarts.map((c) => {
                                const isOpen = openCart === c.session_id;
                                const items = asArray(c.items);
                                return (
                                    <article className={`adm-cart ${isOpen ? 'is-open' : ''}`} key={c.session_id}>
                                        <button
                                            type="button"
                                            className="adm-cart__head"
                                            onClick={() => setOpenCart(isOpen ? null : c.session_id)}
                                        >
                                            <span className="adm-stack">
                                                {items.slice(0, 4).map((it, i) => (
                                                    <Thumb key={i} src={itemImage(it)} name={it.name} />
                                                ))}
                                                {items.length > 4 && <span className="adm-more">+{items.length - 4}</span>}
                                            </span>

                                            <span className="adm-cart__meta">
                                                <strong>{c.item_count} items</strong>
                                                <small>{fmtTime(c.updated_at)}</small>
                                            </span>

                                            <span className={`adm-pill adm-pill--${c.status}`}>
                                                {c.status === 'checkout' ? 'Checkout' : 'Open'}
                                            </span>

                                            <span className="adm-cart__total">
                                                <strong>{formatPrice(c.subtotal)}</strong>
                                            </span>

                                            <span className="adm-caret">{isOpen ? '▴' : '▾'}</span>
                                        </button>

                                        {isOpen && (
                                            <ul className="adm-lines">
                                                {items.map((it, i) => (
                                                    <li key={i}>
                                                        <Thumb src={itemImage(it)} name={it.name} />
                                                        <div className="adm-lines__name">
                                                            <strong>{String(it.name).split(' — ')[0]}</strong>
                                                            <small>{[it.color, it.size].filter(Boolean).join(' · ')}</small>
                                                        </div>
                                                        <span className="adm-lines__qty">×{it.qty}</span>
                                                        <span className="adm-lines__price">
                                                            {it.line_total === 0 ? 'Free' : formatPrice(it.line_total)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}