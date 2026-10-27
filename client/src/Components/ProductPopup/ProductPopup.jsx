import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductPopup.css';
import { formatPrice } from '../../Store/Products/Products';

const ProductPopup = ({ product, onClose }) => {
    const [color, setColor] = useState(product.colors[0]);
    const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);

    // Close on Escape + lock page scroll while open
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    const handleAddToCart = () => {
        // Replace with your cart logic / API call
        console.log('Add to cart:', { id: product.id, name: product.name, color, size });
        onClose();
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup"
                role="dialog"
                aria-modal="true"
                aria-label={product.name}
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" className="popup__close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <div className="popup__media">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="popup__body">
                    <h2 className="popup__title">{product.name}</h2>
                    <p className="popup__price">{formatPrice(product.price)}</p>

                    <fieldset className="popup__option">
                        <legend>Color - <strong>{color}</strong></legend>
                        <div className="popup__pills">
                            {product.colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`popup__pill ${c === color ? 'selected' : ''}`}
                                    onClick={() => setColor(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <div className="popup__option">
                        <label htmlFor={`popup-size-${product.id}`}>
                            Size - <strong>{size}</strong>
                        </label>
                        <select
                            id={`popup-size-${product.id}`}
                            className="popup__select"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {product.sizes.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <button type="button" className="popup__add-btn" onClick={handleAddToCart}>
                        ADD TO CART
                    </button>

                    <Link to={`/products/${product.slug}`} className="popup__details-link" onClick={onClose}>
                        View full details →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;