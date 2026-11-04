import React, { useState } from 'react';
import './Track.css';
import Navbar from '../../Components/Navbar/Navbar';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Track = () => {
    // 1. Add state for all inputs
    const [orderNumber, setOrderNumber] = useState('');
    const [contact, setContact] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    // 2. Add state for the API response
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 3. Create the tracking function
    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);

        // Determine which API format to send based on what the user filled in
        const payload = {
            order_number: orderNumber.trim(),
            contact: contact.trim(),
            tracking_number: trackingNumber.trim(),
        };

        // Basic frontend validation
        const hasOrderDetails = payload.order_number && payload.contact;
        const hasTracking = payload.tracking_number;
        if (!hasOrderDetails && !hasTracking) {
            setError('Please enter an order number and contact, or a tracking number.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/api/orders/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Order not found');
            }

            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="track-page">
                <div className="track-container">
                    <h1 className="track-title">Track Your Order</h1>

                    <div className="track-box">
                        {/* Left Column: Order Tracking */}
                        <form className="track-column" onSubmit={handleTrack}>
                            <div className="input-group">
                                <label htmlFor="order-number">Order Number</label>
                                <input
                                    type="text"
                                    id="order-number"
                                    className="track-input"
                                    placeholder="e.g. #1011"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="contact-info">Email or Phone Number</label>
                                <input
                                    type="text"
                                    id="contact-info"
                                    className="track-input"
                                    placeholder="The email or phone used to order"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="track-btn" disabled={loading}>
                                {loading ? 'Tracking...' : 'Track'}
                            </button>
                        </form>

                        {/* Middle Divider */}
                        <div className="track-divider">
                            <span className="divider-text">Or</span>
                        </div>

                        {/* Right Column: Tracking Number */}
                        <form className="track-column right-column" onSubmit={handleTrack}>
                            <div className="input-group">
                                <label htmlFor="tracking-number">Tracking Number</label>
                                <input
                                    type="text"
                                    id="tracking-number"
                                    className="track-input"
                                    placeholder="Enter tracking number"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="track-btn" disabled={loading}>
                                {loading ? 'Tracking...' : 'Track'}
                            </button>
                        </form>
                    </div>

                    {/* 4. Show the Error */}
                    {error && (
                        <div style={{ marginTop: '20px', padding: '15px', background: '#fee', color: 'red', borderRadius: '8px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* 5. Show the Result Card */}
                    {order && (
                        <div className="track-result" style={{ marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e6e6ec', textAlign: 'left' }}>
                            <h2 style={{ marginTop: 0, color: '#c4547e' }}>Order {order.order_number}</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{order.status}</span></p>
                                <p><strong>Payment:</strong> <span style={{ textTransform: 'capitalize' }}>{order.payment_status}</span></p>
                                <p><strong>City:</strong> {order.city}</p>
                                <p><strong>Placed:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>

                            {order.tracking_number && (
                                <div style={{ background: '#f8edf3', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                                    <strong>Courier:</strong> {order.carrier || 'N/A'} <br />
                                    <strong>Tracking #:</strong> {order.tracking_number}
                                </div>
                            )}

                            <h3>Items</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {order.items.map((it, i) => (
                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                        <span>
                                            {it.name} {it.color && `(${it.color})`} {it.size && `- ${it.size}`}
                                        </span>
                                        <strong>x{it.qty}</strong>
                                    </li>
                                ))}
                            </ul>

                            <p style={{ textAlign: 'right', fontSize: '18px', marginTop: '20px' }}>
                                Total: <strong>Rs. {order.subtotal.toLocaleString()}</strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default Track;