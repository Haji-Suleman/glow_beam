import "./GlowbeamCompare.css";

// Drop your images in /src/assets (or /public) and import / point to them here.
// Leave as "" to show an empty placeholder box.
const ORDINARY_IMG = "https://res.cloudinary.com/fozdhxik/image/upload/v1792997692/image1-ceinture-classique-croix-maman.png"; // e.g. "/images/ordinary-shapewear.jpg"
const SAYBEAM_IMG = "https://res.cloudinary.com/fozdhxik/image/upload/v1792997700/image2-purple-maman-arrows.png"; // e.g. "/images/saybeam-brief.jpg"

const ordinaryPoints = [
    "Squeezes only the front of your belly",
    "Rolls and slides as the day goes on",
    "Shows lines through your clothes",
    "The effect is gone the moment you take it off",
];

const saybeamPoints = [
    { bold: "Full 360° support", rest: ": front, sides and back" },
    { rest: "Feels just like everyday underwear" },
    { rest: "Hidden under anything you wear" },
    { rest: "A visible difference in 2 to 3 weeks" },
];

const XIcon = () => (
    <svg className="sbc-icon sbc-icon--x" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
);

const CheckIcon = () => (
    <svg className="sbc-icon sbc-icon--check" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

const LayersIcon = () => (
    <svg className="sbc-layers" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
        <path d="M3 12l9 4.5 9-4.5" />
        <path d="M3 16.5L12 21l9-4.5" />
    </svg>
);

export default function GlowbeamCompare({ onCtaClick }) {
    return (
        <section className="sbc">
            <div className="sbc-cta-wrap">
                <button type="button" className="sbc-cta" onClick={onCtaClick}>
                    Yes, I Want a Flatter Tummy
                </button>
            </div>

            <h2 className="sbc-title">Not all shapewear works the same way.</h2>

            <div className="sbc-grid">
                {/* Ordinary shapewear */}
                <article className="sbc-card">
                    <div className="sbc-img">
                        {ORDINARY_IMG && <img src={ORDINARY_IMG} alt="Ordinary shapewear" />}
                    </div>
                    <div className="sbc-body">
                        <h3 className="sbc-card-title">
                            <XIcon />
                            Ordinary Shapewear
                        </h3>
                        <ul className="sbc-list">
                            {ordinaryPoints.map((t) => (
                                <li key={t}>
                                    <XIcon />
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>

                {/* Saybeam */}
                <article className="sbc-card sbc-card--brand">
                    <div className="sbc-img">
                        {SAYBEAM_IMG && <img src={SAYBEAM_IMG} alt="Saybeam Sculpt Brief" />}
                    </div>
                    <div className="sbc-body">
                        <h3 className="sbc-card-title">
                            <CheckIcon />
                            Saybeam
                        </h3>
                        <ul className="sbc-list sbc-list--brand">
                            {saybeamPoints.map((p, i) => (
                                <li key={i}>
                                    <CheckIcon />
                                    <span>
                                        {p.bold && <strong>{p.bold}</strong>}
                                        {p.rest}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            </div>

            <div className="sbc-note">
                <LayersIcon />
                <p>
                    <strong>Rooted in the Malaysian Bengkung:</strong> a wraparound
                    compression technique used for centuries to help hold and support the
                    abdominal wall after birth.
                </p>
            </div>
        </section>
    );
}