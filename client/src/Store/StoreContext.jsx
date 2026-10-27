import React, {
    createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, useCallback,
} from 'react';
import { resolveLine } from './cartConfig';

const CART_KEY = 'saybeam_cart_v1';
const SESSION_KEY = 'saybeam_session_id';
const EXPIRY_KEY = 'saybeam_cart_expiry';
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const CART_MINUTES = 5;
const SYNC_DELAY = 800; // ms, batches rapid clicks into one request

const read = (key, fallback) => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
};
const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* storage full or blocked: cart still works in memory */ }
};

const getSessionId = () => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
};

const makeKey = ({ type, id, color, size, deal }) =>
    [type, id, color || '', size || '', deal || ''].join('|');

function cartReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return action.lines;
        case 'ADD': {
            const { type = 'product', id, color = '', size = '', qty = 1, deal = null } = action.item;
            const key = makeKey({ type, id, color, size, deal });
            const found = state.find((l) => l.key === key);
            if (found) {
                return state.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
            }
            return [...state, { key, type, id, color, size, deal, qty }];
        }
        case 'SET_QTY':
            return state
                .map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l))
                .filter((l) => l.qty > 0);
        case 'REMOVE':
            return state.filter((l) => l.key !== action.key);
        case 'CLEAR':
            return [];
        default:
            return state;
    }
}

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [stored, dispatch] = useReducer(cartReducer, null, () => read(CART_KEY, []));
    const [isOpen, setIsOpen] = useState(false);
    const [expiresAt, setExpiresAt] = useState(() => read(EXPIRY_KEY, null));
    const sessionId = useRef(getSessionId());
    const firstRun = useRef(true);

    // Display data comes from product data, so prices stay fresh
    const lines = useMemo(() => stored.map(resolveLine).filter(Boolean), [stored]);

    const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
    const subtotal = useMemo(() => lines.reduce((s, l) => s + l.paid, 0), [lines]);
    const savings = useMemo(
        () => lines.reduce((s, l) => s + Math.max(l.compare - l.paid, 0), 0),
        [lines]
    );

    // 1) Persist to localStorage on every change
    useEffect(() => {
        write(CART_KEY, stored);
    }, [stored]);

    // 2) Cross-tab sync
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === CART_KEY) dispatch({ type: 'SET', lines: read(CART_KEY, []) });
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // 3) Expiry timer: starts with the first item, clears when the cart is empty
    useEffect(() => {
        if (stored.length > 0 && !expiresAt) {
            const t = Date.now() + CART_MINUTES * 60 * 1000;
            setExpiresAt(t);
            write(EXPIRY_KEY, t);
        }
        if (stored.length === 0 && expiresAt) {
            setExpiresAt(null);
            localStorage.removeItem(EXPIRY_KEY);
        }
    }, [stored.length, expiresAt]);

    const restartTimer = useCallback(() => {
        const t = Date.now() + CART_MINUTES * 60 * 1000;
        setExpiresAt(t);
        write(EXPIRY_KEY, t);
    }, []);

    // 4) Debounced sync to FastAPI (color included on every item)
    const buildPayload = useCallback(
        () => ({
            session_id: sessionId.current,
            items: lines.map((l) => ({
                kind: l.type,
                slug: l.id,
                name: l.name,
                color: l.color || null,
                size: l.size || null,
                qty: l.qty,
                unit_price: l.unit,
                line_total: l.paid,
                deal: l.deal || null,
            })),
            subtotal: +subtotal.toFixed(2),
            savings: +savings.toFixed(2),
        }),
        [lines, subtotal, savings]
    );

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            if (lines.length === 0) return; // nothing to send on a fresh visit
        }
        const timer = setTimeout(() => {
            fetch(`${API}/api/cart/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload()),
                keepalive: true,
            }).catch(() => { /* offline: localStorage is the source of truth */ });
        }, SYNC_DELAY);
        return () => clearTimeout(timer);
    }, [stored]); // eslint-disable-line react-hooks/exhaustive-deps

    // Actions
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const addToCart = useCallback((item, { open = true } = {}) => {
        dispatch({ type: 'ADD', item });
        if (open) setIsOpen(true);
    }, []);

    const addMany = useCallback((items, { open = true } = {}) => {
        items.forEach((item) => dispatch({ type: 'ADD', item }));
        if (open) setIsOpen(true);
    }, []);

    const setQty = useCallback((key, qty) => dispatch({ type: 'SET_QTY', key, qty }), []);
    const removeLine = useCallback((key) => dispatch({ type: 'REMOVE', key }), []);
    const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

    const checkout = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/cart/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload()),
            });
            const data = await res.json();
            window.location.href = data.checkout_url || '/checkout';
        } catch {
            window.location.href = '/checkout';
        }
    }, [buildPayload]);

    const value = {
        lines, count, subtotal, savings,
        isOpen, openCart, closeCart,
        addToCart, addMany, setQty, removeLine, clearCart, checkout,
        expiresAt, restartTimer,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};