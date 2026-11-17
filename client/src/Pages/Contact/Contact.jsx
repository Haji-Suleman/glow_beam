import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Navbar/Navbar';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
// Set VITE_API_URL in your .env file for production; falls back to local dev.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
const COMMENT_MAX = 1000;

// ---------------------------------------------------------------------------
// Validation rules
// ---------------------------------------------------------------------------
const LABELS = {
    name: 'Name',
    email: 'Email',
    orderNumber: 'Order number',
    phone: 'Phone number',
    comment: 'Comment',
};

const RULES = {
    name: {
        required: true,
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
        message: 'Enter a valid name (letters, spaces, hyphens and apostrophes only)',
    },
    email: {
        required: true,
        regex: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/,
        message: 'Enter a valid email address (e.g. name@example.com)',
    },
    orderNumber: {
        required: false,
        regex: /^#?\d{3,12}$/,
        message: 'Order number should look like #1234',
    },
    phone: {
        required: false,
        regex: /^(?=(?:\D*\d){7,15}\D*$)\+?[\d\s()-]{7,20}$/,
        message: 'Enter a valid phone number (7–15 digits)',
    },
    comment: {
        required: true,
        regex: new RegExp(`^[\\s\\S]{5,${COMMENT_MAX}}$`),
        message: `Comment must be between 5 and ${COMMENT_MAX} characters`,
    },
};

const EMPTY_FORM = {
    name: '',
    email: '',
    orderNumber: '',
    phone: '',
    comment: '',
};

// Returns an error string, or null when the value is valid
const validateField = (field, value) => {
    const { required, regex, message } = RULES[field];
    const trimmed = value.trim();

    if (!trimmed) {
        return required ? `${LABELS[field]} is required` : null;
    }
    if (!regex.test(trimmed)) {
        return message;
    }
    return null;
};

// ---------------------------------------------------------------------------
// Send-button helpers
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CONFETTI_COLORS = ['#bc5386', '#e6a6c4', '#f8e8ef', '#2f9e6e', '#ffd166'];

// 16 particles flying outward in a circle (computed once)
const CONFETTI = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 70 + (i % 3) * 22;
    return {
        x: Math.round(Math.cos(angle) * distance),
        y: Math.round(Math.sin(angle) * distance),
        r: (i % 2 ? 1 : -1) * (120 + i * 15),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    };
});

const BUTTON_LABEL = {
    idle: 'Send',
    sending: 'Sending',
    success: 'Sent!',
    error: 'Try again',
};

// ---------------------------------------------------------------------------
// Reusable field (input or textarea) with its error message
// ---------------------------------------------------------------------------
const Field = ({ as: Tag = 'input', name, error, hint, className = '', ...props }) => (
    <div className="form-field">
        <Tag
            id={`field-${name}`}
            name={name}
            className={`form-input ${className}${error ? ' invalid' : ''}`.trim()}
            aria-label={LABELS[name]}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
        />
        {(error || hint) && (
            <div className="form-meta">
                {error ? (
                    <p id={`${name}-error`} className="form-error" role="alert">
                        {error}
                    </p>
                ) : (
                    <span />
                )}
                {hint}
            </div>
        )}
    </div>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Contact = () => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [ripples, setRipples] = useState([]);

    const formRef = useRef(null);
    const resetTimer = useRef(null);

    // Clear the pending reset timer if the page unmounts
    useEffect(() => () => clearTimeout(resetTimer.current), []);

    const flashStatus = (next, ms) => {
        setStatus(next);
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setStatus('idle'), ms);
    };

    const addRipple = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        setRipples((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                size,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            },
        ]);
    };

    const removeRipple = (id) =>
        setRipples((prev) => prev.filter((r) => r.id !== id));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Only re-validate while typing if that field is already showing an error
        setErrors((prev) =>
            prev[name] ? { ...prev, [name]: validateField(name, value) } : prev
        );
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'sending') return;

        // 1. Validate every field
        const newErrors = {};
        Object.keys(RULES).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);

        const firstInvalid = Object.keys(newErrors)[0];
        if (firstInvalid) {
            flashStatus('error', 900); // shake
            formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
            return; // Nothing is sent
        }

        // 2. Send data
        setStatus('sending');
        clearTimeout(resetTimer.current);

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            orderNumber: formData.orderNumber.trim(),
            phone: formData.phone.trim(),
            comment: formData.comment.trim(),
        };

        try {
            // sleep(700) keeps the spinner visible long enough to see, even on a fast server
            const [response] = await Promise.all([
                fetch(`${API_URL}/support`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                sleep(700),
            ]);

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            toast.success('Thanks! Your message has been sent.');
            setFormData(EMPTY_FORM);
            setErrors({});
            flashStatus('success', 2600);
        } catch (err) {
            // fetch() throws a TypeError when the server can't be reached at all
            const message =
                err instanceof TypeError
                    ? "Couldn't reach the server. Check your connection and try again."
                    : err.message || 'Something went wrong. Please try again.';
            toast.error(message);
            flashStatus('error', 1500);
        }
    };

    const isLocked = status === 'sending' || status === 'success';

    return (
        <>
            <ToastContainer position="top-right" autoClose={4000} />

            <Navbar />

            <main className="contact-section">
                <div className="contact-container">
                    <h1 className="contact-title">Get in touch</h1>
                    <p className="contact-subtitle">
                        Questions about an order or a pattern? Send us a message and we'll get
                        back to you.
                    </p>

                    <form
                        ref={formRef}
                        className="contact-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="form-row split-row">
                            <Field
                                name="name"
                                type="text"
                                placeholder="Name"
                                autoComplete="name"
                                value={formData.name}
                                error={errors.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Field
                                name="email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={formData.email}
                                error={errors.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="form-row">
                            <Field
                                name="orderNumber"
                                type="text"
                                placeholder="Order number (optional, e.g. #1234)"
                                autoComplete="off"
                                value={formData.orderNumber}
                                error={errors.orderNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="form-row">
                            <Field
                                name="phone"
                                type="tel"
                                placeholder="Phone number (optional)"
                                autoComplete="tel"
                                value={formData.phone}
                                error={errors.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="form-row">
                            <Field
                                as="textarea"
                                name="comment"
                                className="form-textarea large-textarea"
                                placeholder="Comment"
                                rows="5"
                                maxLength={COMMENT_MAX}
                                value={formData.comment}
                                error={errors.comment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                hint={
                                    <span className="form-counter">
                                        {formData.comment.length}/{COMMENT_MAX}
                                    </span>
                                }
                            />
                        </div>

                        <div className="form-row">
                            <div className="send-wrap">
                                <button
                                    type="submit"
                                    className={`btn-pink send-button is-${status}`}
                                    disabled={isLocked}
                                    aria-busy={status === 'sending'}
                                    onPointerDown={addRipple}
                                >
                                    {ripples.map((r) => (
                                        <span
                                            key={r.id}
                                            className="send-ripple"
                                            style={{
                                                left: r.x,
                                                top: r.y,
                                                width: r.size,
                                                height: r.size,
                                            }}
                                            onAnimationEnd={() => removeRipple(r.id)}
                                        />
                                    ))}

                                    <span className="send-label">
                                        {status === 'success' && (
                                            <svg
                                                className="send-check"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                                            </svg>
                                        )}
                                        {BUTTON_LABEL[status]}
                                    </span>

                                    <span className="send-spinner" aria-hidden="true" />
                                </button>

                                {status === 'success' && (
                                    <div className="send-confetti" aria-hidden="true">
                                        {CONFETTI.map((p, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    '--x': `${p.x}px`,
                                                    '--y': `${p.y}px`,
                                                    '--r': `${p.r}deg`,
                                                    background: p.color,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <CustomerService />
            <Footer />
        </>
    );
};

export default Contact;