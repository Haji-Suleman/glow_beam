import { useEffect, useId, useMemo } from "react";
import { buildCountryOptions } from "../../Store/Country/Countries.js";
import useCountry from "../../Store/Country/UseCountry.js";
import "./Footer.css";
import { PAYMENTS } from "../ShopHero/ShopHero.jsx";

/* ---------- Animated waves at the top of the footer ----------
   Three layers drawn as sine waves. Each one is wider than the screen and
   slides by exactly one period, so the loop never jumps. */
const WAVE_HEIGHT = 56;
const REPEATS = 3;

function wavePath({ period, amp, mean, phase }) {
    const width = period * REPEATS;
    const y = (x) => (mean - amp * Math.sin((2 * Math.PI * x) / period + phase)).toFixed(1);
    let d = `M0 ${WAVE_HEIGHT} L0 ${y(0)}`;
    for (let x = 10; x <= width; x += 10) d += ` L${x} ${y(x)}`;
    return `${d} L${width} ${WAVE_HEIGHT} Z`;
}

const WAVES = [
    { id: "back", period: 1750, amp: 19, mean: 25, phase: 0, duration: "8s", dir: "right" },
    { id: "mid", period: 1500, amp: 10, mean: 27, phase: 2, duration: "12s", dir: "right" },
    { id: "front", period: 1750, amp: 18.9, mean: 31.6, phase: 1.2, duration: "10s", dir: "left" },
].map((wave) => ({ ...wave, d: wavePath(wave), width: wave.period * REPEATS }));

function Chevron() {
    return (
        <svg className="footer__chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 1.5l5 5 5-5" />
        </svg>
    );
}

// Replace all placeholder text below with your own.
// You need to write your own policy pages. Only show payment methods you really accept.
export default function Footer({
    // Optional badge image shown in the first column, e.g. { src: "https://res.cloudinary.com/...", alt: "..." }
    badge = null,
    helpTitle = "We are here to help",
    helpText = "Tell customers how to reach you and what to expect.",
    email = "hello@yourstore.com",
    helpNote = " — add your support hours and reply time here.",
    linksTitle = "Quick links",
    links = [
        { label: "Contact Information", href: "/contact" },
        { label: "Legal Notice", href: "/legal-notice" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Terms of Sale", href: "/terms-of-sale" },
        { label: "Terms of Service", href: "/terms-of-service" },
    ],
    countryLabel = "Country/region",
    // Called whenever the country changes (detected or chosen), with the 2-letter code, e.g. "PK"
    onCountryChange = () => { },
    // Where your backend tells us the visitor's country (see the FastAPI route)
    countryApiUrl = "/api/country",
    // Add your own image for each method: { name: "Visa", src: "https://res.cloudinary.com/..." }

    storeName = "Your Store Name",
    address = "Your business address",
}) {
    const selectId = useId();
    const year = new Date().getFullYear();

    // Every country, A to Z, and the visitor's country (detected, or saved from last time)
    const options = useMemo(() => buildCountryOptions(), []);
    const [country, setCountry] = useCountry({ apiUrl: countryApiUrl });

    // Tell the rest of your app about the country as soon as it is known or changes
    useEffect(() => {
        onCountryChange(country);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country]);

    return (
        <footer className="footer">
            <div className="footer__waves" aria-hidden="true">
                {WAVES.map((wave) => (
                    <svg
                        key={wave.id}
                        className={`footer__wave footer__wave--${wave.id} footer__wave--${wave.dir}`}
                        style={{ "--wave-period": `${wave.period}px`, "--wave-duration": wave.duration }}
                        width={wave.width}
                        height={WAVE_HEIGHT}
                        viewBox={`0 0 ${wave.width} ${WAVE_HEIGHT}`}
                    >
                        <path d={wave.d} />
                    </svg>
                ))}
            </div>

            <div className="footer__body">
                <div className="footer__top">
                    <div className="footer__badge">
                        {badge && <img src={badge.src} alt={badge.alt || ""} width="96" />}
                    </div>

                    <div className="footer__col">
                        <h2 className="footer__heading">{helpTitle}</h2>
                        <p className="footer__text">
                            {helpText}
                            <br />
                            <a className="footer__email" href={`mailto:${email}`}>
                                {email}
                            </a>
                            {helpNote}
                        </p>
                    </div>

                    <nav className="footer__col" aria-label="Footer">
                        <h2 className="footer__heading">{linksTitle}</h2>
                        <ul className="footer__links">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <hr className="footer__divider" />

                <div className="footer__bottom">
                    <div className="footer__bottom-row">
                        <div className="footer__country">
                            <label className="footer__country-label" htmlFor={selectId}>
                                {countryLabel}
                            </label>
                            <div className="footer__select-wrap">
                                <select
                                    id={selectId}
                                    className="footer__select"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    {options.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                        </div>

                        <ul className="footer__payments">
                            {PAYMENTS.map((method) => (
                                <li key={method.name} className="footer__paymnt" title={method.name}>
                                    {method.svg && (
                                        <div dangerouslySetInnerHTML={{ __html: method.svg }} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="footer__copy">
                        © {year}, {storeName} - {address}
                    </p>
                </div>
            </div>
        </footer>
    );
}