import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';
import { ADDONS, COLOR_IMAGES } from '../../Store/cartConfig';
import './AdminOrders.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENTS = ['unpaid', 'paid', 'refunded', 'failed'];

const asArray = (v) => (Array.isArray(v) ? v : []);
const strings = (v) => asArray(v).filter((x) => typeof x === 'string');
const firstImage = (p) => strings(p?.gallery)[0] || (typeof p?.image === 'string' ? p.image : '');

const fmtTime = (s) => {
    if (!s) return '';
    const d = new Date(/Z|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
    return d.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

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

const Thumb = ({ src, name }) =>
    src ? (
        <img className="adm-thumb" src={src} alt={name || ''} loading="lazy" />
    ) : (
        <span className="adm-thumb adm-thumb--empty">{(name || '?').charAt(0).toUpperCase()}</span>
    );

export default function AdminOrders({ adminKey, onAuthError, refresh }) {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(null);
    const [edits, setEdits] = useState({});
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(null);
    const [loading, setLoading] = useState(!!adminKey);

    const load = useCallback(async () => {
        if (!adminKey) return;
        setError('');
        setLoading(true);
        try {
            const qs = filter ? `?status=${encodeURIComponent(filter)}` : '';
            const res = await fetch(`${API}/api/admin/orders${qs}`, {
                headers: { 'X-Admin-Key': adminKey },
            });
            if (res.status === 401) {
                setError('🔴 Unauthorized: The Admin Key is incorrect. Please check your .env file.');
                onAuthError?.();
                return;
            }
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const data = await res.json();
            setOrders(asArray(data));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [adminKey, filter, onAuthError]);

    useEffect(() => { load(); }, [load, refresh]);

    const val = (o, k) => (edits[o.id]?.[k] !== undefined ? edits[o.id][k] : o[k] || '');
    const edit = (o, k, v) => setEdits((e) => ({ ...e, [o.id]: { ...e[o.id], [k]: v } }));

    // Check if the current order has unsaved changes
    const hasChanges = (o) => {
        const e = edits[o.id];
        if (!e) return false;
        return Object.keys(e).some((k) => e[k] !== (o[k] || ''));
    };

    const save = async (o) => {
        setError('');
        try {
            const res = await fetch(`${API}/api/admin/orders/${o.id}`, {
                method: 'PATCH',
                headers: { 'X-Admin-Key': adminKey, 'Content-Type': 'application/json' },
                body: JSON.stringify(edits[o.id] || {}),
            });
            if (res.status === 401) {
                onAuthError?.();
                throw new Error('Wrong admin key');
            }
            if (!res.ok) throw new Error(`Save failed (${res.status})`);
            setEdits((e) => ({ ...e, [o.id]: {} }));
            setSaved(o.id);
            setTimeout(() => setSaved(null), 1800);
            await load();
        } catch (e) {
            setError(e.message);
        }
    };

    const waiting = orders.filter((o) => o.status === 'pending').length;
    const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((s, o) => s + (Number(o.subtotal) || 0), 0);

    const imageFor = useMemo(() => (it) => {
        const slug = String(it.slug || '').toLowerCase();
        if (slug === 'glowbeam-sculpt-brief' && COLOR_IMAGES[it.color]) {
            return COLOR_IMAGES[it.color];
        }
        return CODE_IMAGES[slug] || '';
    }, []);

    return (
        <div className="adm-orders-wrapper">
            <div className="adm-stats">
                <div className="adm-stat"><span>Orders</span><strong>{orders.length}</strong></div>
                <div className="adm-stat"><span>Waiting for you</span><strong>{waiting}</strong></div>
                <div className="adm-stat"><span>Revenue</span><strong>{formatPrice(revenue)}</strong></div>
            </div>

            <div className="adm-toolbar">
                <div className="adm-chips">
                    {[['', 'All'], ...STATUSES.map((s) => [s, s[0].toUpperCase() + s.slice(1)])].map(([v, label]) => (
                        <button
                            key={v}
                            type="button"
                            className={filter === v ? 'is-on' : ''}
                            onClick={() => setFilter(v)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="adm-msg adm-msg--err" style={{ padding: '15px', background: '#fee', color: 'red', fontWeight: 'bold' }}>
                    {error}
                </p>
            )}
            {loading && orders.length === 0 && <p className="adm-empty">Loading orders…</p>}

            {!loading && orders.length === 0 && !error && (
                <p className="adm-empty">No orders found.</p>
            )}

            <div className="adm-carts">
                {orders.map((o) => {
                    const isOpen = open === o.id;
                    const items = asArray(o.items);
                    const changed = hasChanges(o);

                    return (
                        <article className={`adm-cart ${isOpen ? 'is-open' : ''}`} key={o.id} style={{ display: 'block', marginBottom: '15px' }}>

                            <button
                                type="button"
                                className="adm-cart__head"
                                onClick={() => setOpen(isOpen ? null : o.id)}
                            >
                                <span className="adm-ordno">{o.order_number || `#${o.id}`}</span>

                                <span className="adm-cart__meta">
                                    <strong>{o.name || '—'}</strong>
                                    <small>{[o.city, fmtTime(o.created_at)].filter(Boolean).join(' · ')}</small>
                                </span>

                                <span className={`adm-pill adm-pill--${o.status}`}>
                                    {o.status}
                                </span>

                                <span className="adm-cart__total">
                                    <strong>{formatPrice(o.subtotal)}</strong>
                                    <small>{o.payment_status}</small>
                                </span>

                                <span className="adm-caret">{isOpen ? '▴' : '▾'}</span>
                            </button>

                            {isOpen && (
                                <div className="adm-order">
                                    <div className="adm-order__info">
                                        <p><strong>Email</strong> <a href={`mailto:${o.email}`}>{o.email || '—'}</a></p>
                                        <p><strong>Phone</strong> {o.phone || '—'}</p>
                                        <p><strong>Address</strong> {[o.address, o.city, o.postal_code].filter(Boolean).join(', ') || '—'}</p>
                                        <p><strong>Payment</strong> {(o.payment_method || '—').toUpperCase()}</p>
                                        {o.note && <p><strong>Note</strong> {o.note}</p>}
                                    </div>

                                    <ul className="adm-lines">
                                        {items.map((it, i) => (
                                            <li key={i}>
                                                <Thumb src={imageFor(it)} name={it.name} />
                                                <div className="adm-lines__name">
                                                    <strong>{String(it.name || '').split(' — ')[0]}</strong>
                                                    <small>{[it.color, it.size].filter(Boolean).join(' · ')}</small>
                                                </div>
                                                <span className="adm-lines__qty">×{it.qty}</span>
                                                <span className="adm-lines__price">
                                                    {(Number(it.line_total) || 0) === 0 ? 'Free' : formatPrice(it.line_total)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="adm-order__edit">
                                        <label>Status
                                            <select value={val(o, 'status')} onChange={(e) => edit(o, 'status', e.target.value)}>
                                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </label>
                                        <label>Payment
                                            <select value={val(o, 'payment_status')} onChange={(e) => edit(o, 'payment_status', e.target.value)}>
                                                {PAYMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </label>
                                        <label>Courier
                                            <input
                                                value={val(o, 'carrier')}
                                                onChange={(e) => edit(o, 'carrier', e.target.value)}
                                                placeholder="e.g. TCS"
                                            />
                                        </label>
                                        <label>Tracking
                                            <input
                                                value={val(o, 'tracking_number')}
                                                onChange={(e) => edit(o, 'tracking_number', e.target.value)}
                                                placeholder="Tracking #"
                                            />
                                        </label>

                                        {/* Save Button: Visually greyed out if nothing changed, turns black when you type */}
                                        <button
                                            type="button"
                                            className="adm-btn"
                                            onClick={() => save(o)}
                                            disabled={!changed && saved !== o.id}
                                            style={{
                                                alignSelf: 'end',
                                                height: '44px',
                                                marginTop: '2px',
                                                opacity: (!changed && saved !== o.id) ? 0.5 : 1,
                                                cursor: (!changed && saved !== o.id) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {saved === o.id ? 'Saved ✓' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
}