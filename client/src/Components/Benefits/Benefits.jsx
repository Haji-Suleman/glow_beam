import "./Benefits.css";

// 1. Paste your Cloudinary image URL here.
//    Keep "c_fill,w_760,h_560,f_auto,q_auto" in it: it crops the image to the
//    right shape (19:14) and serves a small, modern file format automatically.
const REVIEW_IMAGE =
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/c_fill,w_760,h_560,f_auto,q_auto/YOUR_IMAGE.jpg";

function CheckIcon() {
    return (
        <svg className="benefits__check" viewBox="0 0 28 28" aria-hidden="true">
            <circle cx="14" cy="14" r="14" fill="currentColor" />
            <path
                d="M8.5 14.4l3.9 3.9 7.1-7.6"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 2. Replace all placeholder text below with your own.
//    Only show reviews that real customers gave you, and ask before using a name.
export default function Benefits({
    title = "Your main benefit headline.",
    highlight = "Short italic phrase",
    subtitle = "One or two sentences that explain why customers choose your product and what it does for them.",
    benefits = [
        {
            title: "First benefit",
            text: "Two short lines that explain this benefit in plain words. Keep it specific and true for your product.",
        },
        {
            title: "Second benefit",
            text: "Two short lines that explain this benefit in plain words. Keep it specific and true for your product.",
        },
        {
            title: "Third benefit",
            text: "Two short lines that explain this benefit in plain words. Keep it specific and true for your product.",
        },
        {
            title: "Fourth benefit",
            text: "Two short lines that explain this benefit in plain words. Keep it specific and true for your product.",
        },
    ],
    image = REVIEW_IMAGE,
    imageAlt = "Customer with your product",
    review = {
        heading: "What customers say",
        subheading: "Add real reviews from real customers.",
        // Use several parts if you want one phrase in bold: { text: "...", bold: true }
        parts: [
            {
                text: "Paste a real customer review here. Only use reviews that customers have actually given you, and ask for permission to show their name.",
            },
        ],
        name: "Customer name",
        verifiedLabel: "", // e.g. "Verified Customer", only if it is true
        stars: 5,
    },
}) {
    return (
        <section className="benefits">
            <div className="benefits__inner">
                {/* Left column: headline + benefit cards */}
                <div className="benefits__content">
                    <h2 className="benefits__title">
                        {title} <em className="benefits__highlight">{highlight}</em>
                    </h2>
                    <p className="benefits__subtitle">{subtitle}</p>

                    <ul className="benefits__list">
                        {benefits.map((item) => (
                            <li key={item.title} className="benefits__card">
                                <CheckIcon />
                                <div>
                                    <h3 className="benefits__card-title">{item.title}</h3>
                                    <p className="benefits__card-text">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right column: image + review card */}
                <aside className="review">
                    <img
                        className="review__image"
                        src={image}
                        alt={imageAlt}
                        width="760"
                        height="560"
                        loading="lazy"
                    />

                    <div className="review__body">
                        <h3 className="review__heading">{review.heading}</h3>
                        <p className="review__sub">{review.subheading}</p>

                        <p className="review__text">
                            {review.parts.map((part, i) =>
                                part.bold ? (
                                    <strong key={i}>{part.text} </strong>
                                ) : (
                                    <span key={i}>{part.text} </span>
                                )
                            )}
                        </p>

                        <p className="review__author">
                            <span
                                className="review__stars"
                                role="img"
                                aria-label={`${review.stars} out of 5 stars`}
                            >
                                {"★".repeat(review.stars)}
                            </span>
                            <span className="review__name">{review.name}</span>
                            {review.verifiedLabel && (
                                <span className="review__verified">✓ {review.verifiedLabel}</span>
                            )}
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}