import { useState } from "react";
import "./Navbar.css";

// Change these to your own brand and pages
const BRAND_NAME = "Your Brand";
const ANNOUNCEMENT = "90-day money-back guarantee";

const LINKS = [
    { label: "Home", href: "/" },
    { label: "The Sculpt Brief™", href: "/products/glowbeam-sculpt-brief" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "About Us", href: "/pages/about-us" },
    { label: "Track Your Order", href: "/app/parcelpanel" },
    { label: "Contact", href: "/pages/contact" },
];

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1 12H6L5 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
    );
}

export default function Navbar({ cartCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Simple active-link check. Once you add React Router,
    // replace the <a> tags below with <NavLink> and drop this.
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

    return (
        <>
            {/* Upper nav: announcement bar */}
            <div className="announcement" role="note">
                {ANNOUNCEMENT}
            </div>

            {/* Lower nav: main header */}
            <header className="navbar">
                <button
                    type="button"
                    className="navbar__toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="main-nav"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav
                    id="main-nav"
                    className={`navbar__nav ${menuOpen ? "is-open" : ""}`}
                    aria-label="Main"
                >
                    {LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`navbar__link ${currentPath === link.href ? "is-active" : ""}`}
                            aria-current={currentPath === link.href ? "page" : undefined}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Swap this text for an <img src="/logo.png" alt={BRAND_NAME} /> when you have a logo */}
                <a href="/" className="navbar__logo">
                    {BRAND_NAME}
                </a>

                <div className="navbar__actions">
                    <button type="button" className="navbar__icon-btn" aria-label="Search">
                        <SearchIcon />
                    </button>
                    <a href="/account" className="navbar__icon-btn" aria-label="Log in">
                        <UserIcon />
                    </a>
                    <a href="/cart" className="navbar__icon-btn" aria-label={`Cart, ${cartCount} items`}>
                        <BagIcon />
                        {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
                    </a>
                </div>
            </header>
        </>
    );
}