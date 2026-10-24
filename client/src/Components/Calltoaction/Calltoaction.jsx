import "./CallToAction.css";

// 1. Paste your Cloudinary image URL here.
//    Keep "c_fill,g_auto,w_400,h_400,f_auto,q_auto" in it: it crops the image
//    to a square around the main subject and serves a small, modern file format.
const CTA_IMAGE =
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/c_fill,g_auto,w_400,h_400,f_auto,q_auto/YOUR_IMAGE.jpg";

function ShieldIcon() {
    return (
        <svg
            className="cta__shield"
            viewBox="0 0 18 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M9 1.2l7 2.6v5.4c0 4.3-2.9 7.7-7 9.6-4.1-1.9-7-5.3-7-9.6V3.8l7-2.6z" />
            <path d="M5.8 9.8l2.3 2.3 4.2-4.4" />
        </svg>
    );
}

// 2. Replace all placeholder text below with your own.
//    Only mention a guarantee or shipping promise that you really offer.
export default function CallToAction({
    image = CTA_IMAGE,
    imageAlt = "Your product",
    title = "Your closing headline",
    highlight = "in italic?",
    description = "One or two sentences that remind customers why they should buy now. Keep it short and honest.",
    ctaLabel = "Shop now",
    ctaHref = "/shop",
    guarantee = { bold: "Your guarantee", rest: ", explained in a few words" },
    trustItems = [
        "First trust point",
        "Second trust point",
        "Third trust point",
        "Fourth trust point",
        "Fifth trust point",
    ],
}) {
    return (
        <section className="cta">
            <div className="cta__inner">
                <img
                    className="cta__photo"
                    src={image}
                    alt={imageAlt}
                    width="400"
                    height="400"
                    loading="lazy"
                />

                <h2 className="cta__title">
                    {title} <em className="cta__highlight">{highlight}</em>
                </h2>

                <p className="cta__text">{description}</p>

                <a href={ctaHref} className="cta__button">
                    {ctaLabel}
                </a>

                {guarantee && guarantee.bold && (
                    <p className="cta__guarantee">
                        <ShieldIcon />
                        <span>
                            <strong>{guarantee.bold}</strong>
                            {guarantee.rest}
                        </span>
                    </p>
                )}

                {trustItems.length > 0 && (
                    <ul className="cta__trust">
                        {trustItems.map((item) => (
                            <li key={item}>
                                <span aria-hidden="true">✓</span> {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}