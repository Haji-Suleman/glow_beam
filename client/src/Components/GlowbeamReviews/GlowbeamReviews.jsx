import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "./GlowbeamReviews.css";

/* ------------------------------------------------------------------
   1. PRESS LOGOS
   Put your logo image paths in `src` (e.g. "/logos/forbes.svg").
   While `src` is "", a text wordmark is shown instead.
------------------------------------------------------------------- */
const LOGOS = [
    { name: "Forbes", key: "forbes", src: "" },
    { name: "COSMOPOLITAN", key: "cosmo", src: "" },
    { name: "marie claire", key: "marie", src: "" },
    { name: "ELLE", key: "elle", src: "" },
    { name: "VOGUE", key: "vogue", src: "" },
];

/* ------------------------------------------------------------------
   2. REVIEWS  (the "mother sayings")
   Each slide = 3 videos + one review.
   Add your video files in `src`, and a preview image in `poster`.
------------------------------------------------------------------- */
const REVIEWS = [
    {
        stars: 5,
        title: "Flat under everything",
        quote:
            "My youngest is three and people still asked if I was expecting. Two weeks in and the pooch just disappeared under my clothes.",
        name: "Nina R., 37",
        videos: [
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792999134/3cbe9d77334a48c5971ebd4ab7e74d18.mp4", poster: "" },
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792999184/09471e19966444bd9b69bfbf55d28ebb.mp4", poster: "" },
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792999160/669a8ade37dd44adaf32cbc5a4749e35.mp4", poster: "" },
        ],
    },
    {
        stars: 4,
        title: "It finally stays put",
        quote:
            "Every shaper I tried rolled down by lunch. This one wraps all the way around and never moves. Size up if you're between.",
        name: "Amanda T., 44",
        videos: [
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792998424/c318e830a7754fbc820feb2182a3d9f2.mp4", poster: "" },
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792998461/223f314d56dc49efadd6370d97054d5a.mp4", poster: "" },
            { src: "https://res.cloudinary.com/fozdhxik/video/upload/v1792998483/348f27c75f0a440089df1d184961fb73.mp4", poster: "" },

        ],
    },
];

/* ---------- small helpers ---------- */
function Stars({ count }) {
    return (
        <div className="sbr-stars" role="img" aria-label={`${count} out of 5 stars`}>
            {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={i < count ? "is-on" : ""}>
                    ★
                </span>
            ))}
        </div>
    );
}

// Adds data-in="true" once the element scrolls into view (for entrance animations)
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.setAttribute("data-in", "true");
                    io.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return ref;
}

function LogoItem({ logo }) {
    return (
        <li className="sbr-logo-item" aria-hidden="true">
            {logo.src ? (
                <img src={logo.src} alt="" className="sbr-logo-img" />
            ) : (
                <span className={`sbr-logo sbr-logo--${logo.key}`}>{logo.name}</span>
            )}
        </li>
    );
}

/* ---------- main component ---------- */
export default function SaybeamReviews({ onCtaClick }) {
    const [swiper, setSwiper] = useState(null);
    const [active, setActive] = useState(0);
    const revealRef = useReveal();

    // Play only the videos on the visible slide
    const syncVideos = (sw) => {
        sw.slides.forEach((slide, i) => {
            slide.querySelectorAll("video").forEach((v) => {
                if (i === sw.activeIndex) v.play().catch(() => { });
                else v.pause();
            });
        });
    };

    return (
        <section className="sbr">
            {/* Press logo marquee */}
            <div className="sbr-press" aria-label="As seen in">
                <div className="sbr-track">
                    {[0, 1].map((g) => (
                        <ul className="sbr-group" key={g}>
                            {[...LOGOS, ...LOGOS].map((logo, i) => (
                                <LogoItem logo={logo} key={`${g}-${i}`} />
                            ))}
                        </ul>
                    ))}
                </div>
            </div>

            {/* Reviews */}
            <div className="sbr-reviews" ref={revealRef}>
                <h2 className="sbr-title">Loved by 50,000+ women</h2>

                <Swiper
                    className="sbr-swiper"
                    modules={[Autoplay, EffectFade, Keyboard, A11y]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={700}
                    rewind
                    keyboard={{ enabled: true }}
                    autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    onSwiper={(sw) => {
                        setSwiper(sw);
                        syncVideos(sw);
                    }}
                    onSlideChange={(sw) => {
                        setActive(sw.activeIndex);
                        syncVideos(sw);
                    }}
                >
                    {REVIEWS.map((r, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="sbr-videos">
                                {r.videos.map((v, i) => (
                                    <div className="sbr-video" style={{ "--i": i }} key={i}>
                                        {v.src ? (
                                            <video
                                                src={v.src}
                                                poster={v.poster || undefined}
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : v.poster ? (
                                            <img src={v.poster} alt="" />
                                        ) : (
                                            <div className="sbr-video-ph" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="sbr-copy">
                                <Stars count={r.stars} />
                                <h3 className="sbr-review-title">{r.title}</h3>
                                <p className="sbr-quote">"{r.quote}"</p>
                                <p className="sbr-name">{r.name}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Controls */}
                <div className="sbr-controls">
                    <button
                        type="button"
                        className="sbr-arrow sbr-arrow--prev"
                        aria-label="Previous review"
                        onClick={() => swiper?.slidePrev()}
                    >
                        ‹
                    </button>

                    <div className="sbr-dots">
                        {REVIEWS.map((_, i) => (
                            <button
                                type="button"
                                key={i}
                                className={`sbr-dot ${i === active ? "is-active" : ""}`}
                                aria-label={`Go to review ${i + 1}`}
                                aria-current={i === active}
                                onClick={() => swiper?.slideTo(i)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="sbr-arrow sbr-arrow--next"
                        aria-label="Next review"
                        onClick={() => swiper?.slideNext()}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="sbr-cta-wrap">
                <button type="button" className="sbr-cta" onClick={onCtaClick}>
                    Get My Sculpt Brief
                </button>
            </div>
        </section>
    );
}