import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminProducts.css';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';
import { ADDONS, COLOR_HEX, COLOR_IMAGES } from '../../Store/cartConfig';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const KEY_NAME = 'admin_key';

/* ---------- helpers ---------- */
const asArray = (v) => (Array.isArray(v) ? v : []);
const strings = (v) => asArray(v).filter((x) => typeof x === 'string');

// First usable image of a product: first gallery picture, else its image field
const firstImage = (p) => strings(p?.gallery)[0] || (typeof p?.image === 'string' ? p.image : '');

// The server sends UTC times without a "Z", so add it before parsing
const fmtTime = (s) => {
    if (!s) return '';
    const d = new Date(/Z|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
    return d.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// Pictures that exist in the code, used when the database row has no image
const CODE_IMAGES = (() => {
    const m = {};
    asArray(PRODUCTS).forEach((p) => {
        const img = firstImage(p);
        if (img) m[String(p.slug || p.id).toLowerCase()] = img;
    });
    Object.values(ADDONS || {}).forEach((a) => {
        if (!a.image) return;
        m[String(a.id).toLowerCase()] = a.image;
        if (a.slug) m[String(a.slug).toLowerCase()] = a.image;
    });
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

/* ---------- page ---------- */
export default function AdminProducts() {
    const [key, setKey] = useState(() => sessionStorage.getItem(KEY_NAME) || '');
    const [input, setInput] = useState('');
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [kind, setKind] = useState('all');
    const [search, setSearch] = useState('');
    const [cartFilter, setCartFilter] = useState('');
    const [openCart, setOpenCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const signOut = useCallback(() => {
        sessionStorage.removeItem(KEY_NAME);
        setKey('');
    }, []);

    const get = useCallback(async (path) => {
        const res = await fetch(`${API}${path}`, { headers: { 'X-Admin-Key': key } });
        if (res.status === 401) {
            signOut();
            throw new Error('Wrong admin key');
        }
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
    }, [key, signOut]);

    const load = useCallback(async () => {
        if (!key) return;
        setLoading(true);
        setError('');
        try {
            const [p, c] = await Promise.all([get('/api/admin/products'), get('/api/admin/carts')]);
            setProducts(p);
            setCarts(c);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [key, get]);

    useEffect(() => { load(); }, [load]);

    const login = (e) => {
        e.preventDefault();
        sessionStorage.setItem(KEY_NAME, input.trim());
        setKey(input.trim());
        setInput('');
    };

    const importFromCode = async () => {
        setError('');
        setNotice('');
        try {
            const list = asArray(PRODUCTS);
            const addons = Object.values(ADDONS || {});

            const items = [
                ...list.map((p) => ({
                    slug: String(p.slug || p.id || ''),
                    kind: 'product',
                    name: String(p.name || p.title || ''),
                    price: Number(p.price) || 0,
                    compare_price: Number(p.compare || p.comparePrice) || 0,
                    image: firstImage(p),
                    colors: strings(p.colors),
                    sizes: strings(p.sizes),
                    gallery: strings(p.gallery),
                })),
                ...addons.map((a) => ({
                    slug: String(a.slug || a.id),
                    kind: 'addon',
                    name: String(a.name || '').split(' — ')[0],
                    price: Number(a.price) || 0,
                    compare_price: Number(a.compare) || 0,
                    image: typeof a.image === 'string' ? a.image : '',
                    gallery: typeof a.image === 'string' ? [a.image] : [],
                })),
            ].filter((it) => it.slug && it.name);

            if (items.length === 0) throw new Error('Nothing to import. Check the console for the raw first product.');
            console.log('Import payload (first item):', items[0], 'Raw first product:', list[0]);

            const res = await fetch(`${API}/api/admin/products/import`, {
                method: 'POST',
                headers: { 'X-Admin-Key': key, 'Content-Type': 'application/json' },
                body: JSON.stringify(items),
            });
            const text = await res.text();
            if (!res.ok) throw new Error(`Server said ${res.status}: ${text}`);

            const r = JSON.parse(text);
            setNotice(`Imported ${r.created} new and updated ${r.updated}.`);
            await load();
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    /* image lookup: database first, then code */
    const dbImages = useMemo(() => {
        const m = {};
        products.forEach((p) => {
            const img = firstImage(p);
            if (img) m[String(p.slug).toLowerCase()] = img;
        });
        return m;
    }, [products]);

    const itemImage = (it) => {
        const slug = String(it.slug || '').toLowerCase();
        if (slug === 'glowbeam-sculpt-brief' && COLOR_IMAGES[it.color]) return COLOR_IMAGES[it.color];
        return dbImages[slug] || CODE_IMAGES[slug] || '';
    };

    /* ---------- login ---------- */
    if (!key) {
        return (
            <div className="adm-auth">
                <form className="adm-auth__card" onSubmit={login}>
                    <span className="adm-logo">GB</span>
                    <h1>Admin</h1>
                    <p>Enter your admin key to continue.</p>
                    <input
                        type="text"
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

    /* ---------- derived data ---------- */
    const shownProducts = products.filter((p) => {
        if (kind !== 'all' && p.kind !== kind) return false;
        return `${p.name} ${p.slug}`.toLowerCase().includes(search.toLowerCase());
    });
    const shownCarts = carts.filter((c) => !cartFilter || c.status === cartFilter);
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
                        Products <em>{products.length}</em>
                    </button>
                    <button type="button" className={tab === 'carts' ? 'is-on' : ''} onClick={() => setTab('carts')}>
                        Carts <em>{withItems.length}</em>
                    </button>
                </nav>

                <div className="adm-actions">
                    <button type="button" className="adm-btn adm-btn--ghost" onClick={load}>Refresh</button>
                    <button type="button" className="adm-btn adm-btn--ghost" onClick={signOut}>Sign out</button>
                </div>
            </header>

            <main className="adm-main">
                {error && <p className="adm-msg adm-msg--err">{error}</p>}
                {notice && <p className="adm-msg adm-msg--ok">{notice}</p>}

                {/* ================= PRODUCTS ================= */}
                {tab === 'products' && (
                    <>
                        <div className="adm-stats">
                            <Stat label="Products" value={products.filter((p) => p.kind === 'product').length} />
                            <Stat label="Add-ons" value={products.filter((p) => p.kind === 'addon').length} />
                            <Stat label="Total items" value={products.length} />
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
                            <button type="button" className="adm-btn" onClick={importFromCode}>Import from code</button>
                        </div>

                        {loading && products.length === 0 && <p className="adm-empty">Loading…</p>}
                        {!loading && products.length === 0 && !error && (
                            <p className="adm-empty">No products yet. Click “Import from code” to add them.</p>
                        )}
                        {products.length > 0 && shownProducts.length === 0 && (
                            <p className="adm-empty">Nothing matches your search.</p>
                        )}

                        <div className="adm-grid">
                            {shownProducts.map((p) => {
                                const img = firstImage(p) || CODE_IMAGES[String(p.slug).toLowerCase()] || '';
                                const colors = strings(p.colors);
                                const sizes = strings(p.sizes);
                                const off = p.compare_price > p.price
                                    ? Math.round((1 - p.price / p.compare_price) * 100)
                                    : 0;
                                return (
                                    <article className="adm-card" key={p.id}>
                                        <div className="adm-card__media">
                                            <Thumb src={img} name={p.name} className="adm-card__img" />
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

                                            {colors.length > 0 && (
                                                <div className="adm-swatches" title={colors.join(', ')}>
                                                    {colors.slice(0, 8).map((c) => (
                                                        <i key={c} style={{ background: COLOR_HEX[c] || '#d8d8de' }} title={c} />
                                                    ))}
                                                    {colors.length > 8 && <small>+{colors.length - 8}</small>}
                                                </div>
                                            )}

                                            {sizes.length > 0 && (
                                                <div className="adm-sizes">
                                                    {sizes.map((s) => <span key={s}>{s}</span>)}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ================= CARTS ================= */}
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
                            <p className="adm-empty">No carts yet. Add something to a cart on the shop.</p>
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
                                                {items.length === 0 && <span className="adm-thumb adm-thumb--empty">–</span>}
                                            </span>

                                            <span className="adm-cart__meta">
                                                <strong>{c.item_count} {c.item_count === 1 ? 'item' : 'items'}</strong>
                                                <small>{fmtTime(c.updated_at)} · <code>{c.session_id.slice(0, 8)}</code></small>
                                            </span>

                                            <span className={`adm-pill adm-pill--${c.status}`}>
                                                {c.status === 'checkout' ? 'Checkout started' : 'Open'}
                                            </span>

                                            <span className="adm-cart__total">
                                                <strong>{formatPrice(c.subtotal)}</strong>
                                                {c.savings > 0 && <small>saved {formatPrice(c.savings)}</small>}
                                            </span>

                                            <span className="adm-caret" aria-hidden="true">{isOpen ? '▴' : '▾'}</span>
                                        </button>

                                        {isOpen && (
                                            <ul className="adm-lines">
                                                {items.map((it, i) => (
                                                    <li key={i}>
                                                        <Thumb src={itemImage(it)} name={it.name} />
                                                        <div className="adm-lines__name">
                                                            <strong>{String(it.name).split(' — ')[0]}</strong>
                                                            <small>
                                                                {[it.color, it.size].filter(Boolean).join(' · ') || it.kind}
                                                                {it.deal ? ` · ${it.deal}` : ''}
                                                            </small>
                                                        </div>
                                                        <span className="adm-lines__qty">×{it.qty}</span>
                                                        <span className="adm-lines__price">
                                                            {it.line_total === 0 ? 'Free' : formatPrice(it.line_total)}
                                                        </span>
                                                    </li>
                                                ))}
                                                {items.length === 0 && <li className="adm-lines__empty">This cart is empty.</li>}
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