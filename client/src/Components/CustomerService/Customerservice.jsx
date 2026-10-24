import "./CustomerService.css";

// Small outline icons, drawn in the accent color
const ICONS = {
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    shield: (
        <>
            <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11v-6l8-3z" />
            <path d="M8.5 12l2.5 2.5 4.5-5" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </>
    ),
};

function Icon({ name, className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {ICONS[name]}
        </svg>
    );
}

// Replace all placeholder text below with your own.
// Only promise support hours, reply times, and trust points that are true for your store.
export default function CustomerService({
    eyebrow = "We are here to help",
    title = "Customer Service",
    description = "Tell customers how to reach you and what to expect. Keep it short, friendly, and honest.",
    hours = "Your support hours go here",
    email = "hello@yourstore.com",
    replyNote = "Tell customers how fast you usually reply.",
    features = [
        { icon: "shield", label: "Your guarantee" },
        { icon: "globe", label: "Your shipping promise" },
        { icon: "lock", label: "Secure checkout" },
        { icon: "user", label: "Your trust point" },
    ],
}) {
    return (
        <section className="support">
            <div className="support__inner">
                {eyebrow && <p className="support__eyebrow">{eyebrow}</p>}
                <h2 className="support__title">{title}</h2>
                <p className="support__text">{description}</p>

                {hours && (
                    <p className="support__hours">
                        <Icon name="clock" className="support__hours-icon" />
                        <span>{hours}</span>
                    </p>
                )}

                <a className="support__email" href={`mailto:${email}`}>
                    {email}
                </a>
                {replyNote && <p className="support__note">{replyNote}</p>}

                {features.length > 0 && (
                    <>
                        <hr className="support__divider" />
                        <ul className="support__features">
                            {features.map((item) => (
                                <li key={item.label}>
                                    <Icon name={item.icon} className="support__feature-icon" />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </section>
    );
}