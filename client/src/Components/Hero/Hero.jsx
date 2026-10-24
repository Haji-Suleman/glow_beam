import "./Hero.css";

// 1. Paste your Cloudinary image URL here.
//    Keep "c_fill,ar_4:5,w_760,f_auto,q_auto" in it: it crops the image to the
//    right shape and serves a small, modern file format automatically.
const HERO_IMAGE =
    "https://res.cloudinary.com/fozdhxik/image/upload/f_auto/q_auto/avis-02-blonde30-nude-hold-ALT.png";

function CheckIcon() {
    return (
        <svg className="hero__check" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
            <path
                d="M7 12.5l3.2 3.2L17 9"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 2. Replace the placeholder text below with your own.
//    Only show a rating or review count if it is real.
export default function Hero({
    ratingText = "Your rating or review count goes here",
    title = "Your Product Name —",
    highlight = "one clear promise about what it does for your customer",
    description = "Two or three sentences about your product: what it is, who it is for, and why it is worth buying. Keep it short and specific.",
    bullets = ["First key benefit", "Second key benefit", "Third key benefit"],
    ctaLabel = "Shop now",
    ctaHref = "/shop",
    image = HERO_IMAGE,
    imageAlt = "Your product",
}) {
    return (
        <section className="hero">
            <div className="hero__inner">
                <div className="hero__content">
                    {ratingText && (
                        <p className="hero__rating">
                            <span className="hero__stars" aria-hidden="true">
                                ★★★★★
                            </span>
                            <span>{ratingText}</span>
                        </p>
                    )}

                    <h1 className="hero__title">
                        {title} <span className="hero__highlight">{highlight}</span>
                    </h1>

                    <p className="hero__description">{description}</p>

                    <ul className="hero__bullets">
                        {bullets.map((item) => (
                            <li key={item}>
                                <CheckIcon />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <a href={ctaHref} className="hero__cta">
                        {ctaLabel}
                    </a>
                </div>

                <img
                    className="hero__image"
                    src={image}
                    alt={imageAlt}
                    width="760"
                    height="950"
                    fetchpriority="high"
                />
            </div>
        </section>
    );
}