import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';
import CustomerService from '../../Components/CustomerService/Customerservice';
import Footer from '../../Components/Footer/Footer';
import Navbar from '../../Components/Navbar/Navbar';

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
        regex: /^[\s\S]{5,1000}$/,
        message: 'Comment must be between 5 and 1000 characters',
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
// Component
// ---------------------------------------------------------------------------
const Contact = () => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [isSending, setIsSending] = useState(false);

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

        // 1. Validate every field
        const newErrors = {};
        Object.keys(RULES).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return; // Stop here, nothing is sent
        }

        // 2. Send data
        setIsSending(true);

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            orderNumber: formData.orderNumber.trim(),
            phone: formData.phone.trim(),
            comment: formData.comment.trim(),
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            // Success
            toast.success('Thanks! Your message has been sent.');
            setFormData(EMPTY_FORM);
            setErrors({});
        } catch (err) {
            // Error
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            {/* Toast Container for react-toastify */}
            <ToastContainer position="top-right" autoClose={4000} />

            <Navbar />

            <div className="contact-section">
                <div className="contact-container">
                    <h1 className="contact-title">Get in touch</h1>

                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-row split-row">
                            <div className="form-field">
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-input${errors.name ? ' invalid' : ''}`}
                                    placeholder="Name"
                                    aria-label="Name"
                                    aria-invalid={!!errors.name}
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.name && <p className="form-error">{errors.name}</p>}
                            </div>

                            <div className="form-field">
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-input${errors.email ? ' invalid' : ''}`}
                                    placeholder="Email"
                                    aria-label="Email"
                                    aria-invalid={!!errors.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && <p className="form-error">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <textarea
                                name="orderNumber"
                                className={`form-input form-textarea${errors.orderNumber ? ' invalid' : ''}`}
                                placeholder="Order number (#1234)"
                                aria-label="Order number"
                                aria-invalid={!!errors.orderNumber}
                                rows="3"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></textarea>
                            {errors.orderNumber && <p className="form-error">{errors.orderNumber}</p>}
                        </div>

                        <div className="form-row">
                            <input
                                type="tel"
                                name="phone"
                                className={`form-input${errors.phone ? ' invalid' : ''}`}
                                placeholder="Phone number"
                                aria-label="Phone number"
                                aria-invalid={!!errors.phone}
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.phone && <p className="form-error">{errors.phone}</p>}
                        </div>

                        <div className="form-row">
                            <textarea
                                name="comment"
                                className={`form-input form-textarea large-textarea${errors.comment ? ' invalid' : ''}`}
                                placeholder="Comment"
                                aria-label="Comment"
                                aria-invalid={!!errors.comment}
                                rows="5"
                                value={formData.comment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></textarea>
                            {errors.comment && <p className="form-error">{errors.comment}</p>}
                        </div>

                        <div className="form-row">
                            <button type="submit" className="send-button" disabled={isSending}>
                                {isSending ? 'Sending…' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <CustomerService />
            <Footer />
        </>
    );
};

export default Contact;