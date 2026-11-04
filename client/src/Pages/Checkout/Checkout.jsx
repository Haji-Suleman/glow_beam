// src/Pages/Checkout/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { useStore } from '../../Store/StoreContext';
import { formatPrice } from '../../Store/Products/Products';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const EMPTY = { name: '', email: '', phone: '', address: '', city: '', postal_code: '', note: '' };

const Checkout = () => {
    const { lines, subtotal, savings, clearCart, restartTimer } = useStore();
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [serverError, setServerError] = useState('');
    const [done, setDone] = useState(null);

    // The cart expires after 5 minutes, so keep it alive while the customer types
    useEffect(() => {
        if (done || lines.length === 0) return undefined;
        restartTimer();
        const id = setInterval(restartTimer, 60000);
        return () => clearInterval(id);
    }, [done, lines.length, restartTimer]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (form.name.trim().length < 2) e.name = 'Enter your full name';
        if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(form.email.trim())) e.email = 'Enter a valid email address';
        if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
        if (form.address.trim().length < 5) e.address = 'Enter your street address';
        if (form.city.trim().length < 2) e.city = 'Enter your city';
        return e;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        setServerError('');
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setBusy(true);
        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    session_id: localStorage.getItem('saybeam_session_id') || '',
                    payment_method: 'cod',
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(
                    typeof data.detail === 'string'
                        ? data.detail
                        : 'Could not place the order. Please check your details.'
                );
            }
            setDone(data);
            clearCart();
        } catch (err) {
            setServerError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const field = (k, label, props = {}) => (
        <label className="co-field">
            <span>{label}</span>
            <input value={form[k]} onChange={set(k)} className={errors[k] ? 'has-err' : ''} {...props} />
            {errors[k] && <small>{errors[k]}</small>}
        </label>
    );

    let content;

    if (done) {
        content = (
            <div className="co co--done">
                <div className="co-done">
                    <span className="co-tick">✓</span>
                    <h1>Thank you!</h1>
                    <p>
                        Your order <strong>{done.order_number}</strong> is placed. A confirmation was sent to{' '}
                        <strong>{done.email}</strong>.
                    </p>
                    <Link className="co-btn" to="/app/parcelpanel">Track your order</Link>
                    <Link className="co-link" to="/">Continue shopping</Link>
                </div>
            </div>
        );
    } else if (lines.length === 0) {
        content = (
            <div className="co co--done">
                <div className="co-done">
                    <h1>Your cart is empty</h1>
                    <Link className="co-btn" to="/">Back to shop</Link>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="co">
                <form className="co-grid" onSubmit={submit} noValidate>
                    <div className="co-main">
                        <Link to="/" className="co-back">← Back to shop</Link>
                        <h1>Checkout</h1>

                        <h2>Contact</h2>
                        {field('email', 'Email address', { type: 'email', autoComplete: 'email', placeholder: 'you@gmail.com' })}
                        {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel' })}

                        <h2>Delivery address</h2>
                        {field('name', 'Full name', { autoComplete: 'name' })}
                        {field('address', 'Street address', { autoComplete: 'street-address' })}
                        <div className="co-row">
                            {field('city', 'City', { autoComplete: 'address-level2' })}
                            {field('postal_code', 'Postal code (optional)', { autoComplete: 'postal-code' })}
                        </div>
                        <label className="co-field">
                            <span>Order note (optional)</span>
                            <textarea rows={2} value={form.note} onChange={set('note')} />
                        </label>

                        <h2>Payment</h2>
                        <label className="co-pay is-on">
                            <input type="radio" checked readOnly />
                            <span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span>
                        </label>
                        <label className="co-pay is-off">
                            <input type="radio" disabled />
                            <span><strong>Card</strong><small>Coming soon</small></span>
                        </label>

                        {serverError && <p className="co-err">{serverError}</p>}
                        <button type="submit" className="co-btn co-btn--full" disabled={busy}>
                            {busy ? 'Placing order…' : `PLACE ORDER · ${formatPrice(subtotal)}`}
                        </button>
                    </div>

                    <aside className="co-summary">
                        <h2>Order summary</h2>
                        <ul>
                            {lines.map((l) => (
                                <li key={l.key}>
                                    <span className="co-thumb">
                                        <img src={l.image} alt="" />
                                        <em>{l.qty}</em>
                                    </span>
                                    <span className="co-name">
                                        <strong>{l.name.split(' — ')[0]}</strong>
                                        {l.variant && <small>{l.variant}</small>}
                                    </span>
                                    <span>{l.paid === 0 ? 'Free' : formatPrice(l.paid)}</span>
                                </li>
                            ))}
                        </ul>
                        {savings > 0 && (
                            <p className="co-sum"><span>You save</span><span>{formatPrice(savings)}</span></p>
                        )}
                        <p className="co-sum co-sum--total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></p>
                    </aside>
                </form>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            {content}
            <Footer />
        </>
    );
};

export default Checkout;