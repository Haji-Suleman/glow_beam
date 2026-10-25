import React from "react";
import "./Customersaying.css";

// Replace the `video` values with your own Cloudinary / local video URLs.
const FEATURES = [
    {
        id: "01",
        eyebrow: "The second you put it on",
        title: "A flatter stomach, instantly.",
        text: "The high waist wraps your belly and waistline in gentle, targeted compression, so you see a smoother, more sculpted shape the moment you pull it on. No squeezing. No pinching. No discomfort.",
        video: "/videos/sculpt-1.mp4",
        ratio: "square",
    },
    {
        id: "02",
        eyebrow: "Invisible under everything",
        title: "Disappears under your clothes.",
        text: "Seamless edges mean no lines, no marks, no telltale shapewear bulge. Tight dress, slim jeans, leggings, it vanishes. Just a smooth, natural shape that still looks like you.",
        video: "/videos/sculpt-2.mp4",
        ratio: "portrait",
    },
    {
        id: "03",
        eyebrow: "All-day hold",
        title: "It never rolls down. Ever.",
        text: "The soft, breathable fabric hugs your body and stays exactly where you put it. No rolling, no sliding, no readjusting in the bathroom. Put it on in the morning and forget it's there until night.",
        video: "/videos/sculpt-3.mp4",
        ratio: "landscape",
    },
];

const Customersaying = () => {
    return (
        <section className="cs-section">
            <div className="cs-header">
                <p className="cs-kicker">Why it actually works</p>
                <h2 className="cs-heading">Designed to do three things perfectly.</h2>
            </div>

            <div className="cs-list">
                {FEATURES.map((item, index) => (
                    <div
                        key={item.id}
                        className={`cs-row ${index % 2 === 1 ? "cs-row--reverse" : ""}`}
                    >
                        <div className={`cs-media cs-media--${item.ratio}`}>
                            <video
                                className="cs-video"
                                src={item.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                            />
                        </div>

                        <div className="cs-content">
                            <span className="cs-badge">{item.id}</span>
                            <p className="cs-eyebrow">{item.eyebrow}</p>
                            <h3 className="cs-title">{item.title}</h3>
                            <p className="cs-text">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Customersaying;