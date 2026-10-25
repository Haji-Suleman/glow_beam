import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./ShopHero.css";

/* ------------------------------------------------------------------ */
/*  1. GALLERY  – put your own images / videos here                    */
/*     { type: "image", src, alt }                                     */
/*     { type: "video", src, poster, alt }                             */
/* ------------------------------------------------------------------ */
const GALLERY = [
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792914921/hf_20260901_132006_386d39af-1e77-4e65-97f6-16cc602a2872.png", alt: "Sculpt Brief in 3 colours" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792914891/05_diagram_62a6e59e-8b3d-4dea-8eee-324ca92cc6d5.png", alt: "Feel beautiful and confident" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915002/02_without-with.png", alt: "Size guide" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915036/06_stats.png", alt: "Before and after" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915082/07_tech_ee746d99-54ad-438e-8d0a-531be0da9da5.png", alt: "Sculpt Brief in 3 colours" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915136/08_highstretch_ea978d1e-eda0-4847-a77d-b19cd34c9153.png", alt: "Feel beautiful and confident" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915166/6colors_74cc49d9-ab4d-4311-a244-67f685e93234.png", alt: "Size guide" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915198/newcarousselupdated.png", alt: "Before and after" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915233/hf_20260831_132809_47a4a29b-6df6-4e44-909f-db4ef68a1cb3.png", alt: "Before and after" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915264/hf_20260831_132821_6e58af11-3748-4e69-8ae0-f98574666aa8.png", alt: "Size guide" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915325/hf_20260831_132836_44947fba-5c73-44f8-b8fc-e79f1d7e0197.png", alt: "Sculpt Brief in 3 colours" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915445/hf_20260831_132846_a5faca2e-1c7d-4199-a287-93266a3b6e47.png", alt: "Feel beautiful and confident" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915527/hf_20260831_133028_8b701cf5-ba9d-4e01-91d6-be2660c9690c.png", alt: "Before and after" },
    { type: "image", src: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915554/hf_20260831_132853_b47d758f-b612-4d26-9f5c-e1b537950930.png", alt: "Before and after" },


];

/* ------------------------------------------------------------------ */
/*  2. CONTENT                                                         */
/* ------------------------------------------------------------------ */
const IMG = {
    bundle: "/images/brief-black.png",
    brush: "https://res.cloudinary.com/fozdhxik/image/upload/v1792919369/13_200x200_4e0b8349-d68d-4d88-805a-a460974ffabb.png",
    ebook: "https://saybeam.com/cdn/shop/files/hf_20260628_062226_f031e89c-5f4d-4ce4-9f1f-7244a5abae1b.png?v=1782627998",
    gift: "/images/gift-card.png",
    wear1: "https://res.cloudinary.com/fozdhxik/video/upload/v1792923851/e1daf45fa99a4960af6821b1ab1f9f30.mp4",
    wear2: "https://res.cloudinary.com/fozdhxik/video/upload/v1792924166/8b46fbb68d7e4b819ae01dc6ae2f6e62.mp4",
    avatars: ["https://res.cloudinary.com/fozdhxik/image/upload/v1792914522/65.jpg", "https://res.cloudinary.com/fozdhxik/image/upload/v1792914565/68.jpg", "https://res.cloudinary.com/fozdhxik/image/upload/v1792914592/76.jpg"],
};

const BENEFITS = [
    { icon: "waist", html: <><b>Up to 2 inches off your</b> waist, in a few days</> },
    { icon: "gap", html: <><b>Closes the gap</b> pregnancy left open (diastasis)</> },
    { icon: "band", html: <><b>Patented 360° crossed band,</b> front, sides &amp; back</> },
    { icon: "eye", html: <><b>Invisible</b> under your clothes, never rolls down</> },
    { icon: "clock", html: <><b>Belly back in 2-3 weeks,</b> your jeans button again</> },
    { icon: "heart", html: <><b>Breastfeeding, C-section</b> and menopause friendly</> },
];

/* Each color needs its OWN image url in `img`.
   Right now they all point to the same picture, so the thumbnail
   cannot visibly change when you click a swatch. */
const COLORS = [
    { name: "Black", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915233/hf_20260831_132809_47a4a29b-6df6-4e44-909f-db4ef68a1cb3.png", hex: "#000000" },
    { name: "Beige", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915264/hf_20260831_132821_6e58af11-3748-4e69-8ae0-f98574666aa8.png", hex: "#e9d9a6" },
    { name: "Navy", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915325/hf_20260831_132836_44947fba-5c73-44f8-b8fc-e79f1d7e0197.png", hex: "#1c1c96" },
    { name: "Lilac", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915445/hf_20260831_132846_a5faca2e-1c7d-4199-a287-93266a3b6e47.png", hex: "#e2c9f1" },
    { name: "Purple", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915527/hf_20260831_133028_8b701cf5-ba9d-4e01-91d6-be2660c9690c.png", hex: "#a43fcf" },
    { name: "Violet", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915554/hf_20260831_132853_b47d758f-b612-4d26-9f5c-e1b537950930.png", hex: "#e20d72" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

/* the original starts with item #1 = Pink and item #2 = Lilac */
const DEFAULT_COLORS = ["Pink", "Lilac"];

const BUNDLES = [
    { id: 1, qty: 2, title: "BUY 1 GET 1 FREE", each: "Rs.5,601.95", price: "Rs.11,203.90", was: "Rs.22,406.80" },
    { id: 2, qty: 4, title: "BUY 2 GET 2 FREE", each: "Rs.3,502.98", price: "Rs.14,011.90", was: "Rs.44,813.60", badge: "MOST POPULAR 🔥" },
    { id: 3, qty: 6, title: "BUY 3 GET 3 FREE", each: "Rs.3,037.15", price: "Rs.18,222.90", was: "Rs.67,210.50", badge: "BEST VALUE 🔥" },
];

const REVIEWS = [
    {
        name: "Sandra L., 41",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        title: "“After my kids and a hysterectomy, it finally held”",
        body: (
            <>
                After three kids and a hysterectomy, my lower belly changed and nothing held it in a way that felt good.
                This wraps the whole middle, 360°, without digging in anywhere near the scar.{" "}
                <b>Within a few weeks it was visibly flatter, and it stays flat all day.</b> Soft, seamless, and it does not
                roll down once. This actually did what everything else promised and never delivered. I wear it every single
                day now.
            </>
        ),
        meta: "Verified buyer · 5 weeks",
    },
    {
        name: "Megan T., 35",
        img: "https://randomuser.me/api/portraits/women/3.jpg",
        title: "“Two inches off my waist, and I forget I’m wearing it”",
        body: (
            <>
                The mom pooch was the one thing that never shifted, no matter what I did.{" "}
                <b>By the end of the first week I had taken about two inches off my waist</b> and my clothes were loose. It is
                thin and breathable, so I honestly forget it is on, and it is completely invisible under a fitted dress. Eight
                hours on my feet, no lines, no rolling, no readjusting in the bathroom.
            </>
        ),
        meta: "Verified buyer · 1 month",
    },
    {
        name: "Donna H., 39",
        img: "https://cdn.shopify.com/s/files/1/0940/8321/9834/files/donna-52-v2.png?v=1789585955",
        title: "“Twenty years and three kids later, and won over”",
        body: (
            <>
                I am twenty years and three kids out, and I had wasted money on wraps and belts that did nothing, so I doubted this too, and I ordered the wrong size. Their team let me keep it and sent the right one free in a few days.<strong>It stays put all day and my belly is visibly flatter,</strong> a couple of pounds gone too. It really was not too late after all. Four stars only because I wish the nude came in more shades.
            </>
        ),
        meta: "Verified buyer · 6 weeks",
    },
    {
        name: "Rachel P., 40",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        title: "“The shelf above my c- section scar is finally gone”",
        body: (
            <>
                I am a mother of three and have been struggling with the shelf above my c-section scar for years. This product has completely transformed my confidence. <strong>It stays in place all day and my belly is visibly flatter,</strong> a couple of pounds gone too. It really was not too late after all. Four stars only because I wish the nude came in more shades.
            </>
        ),
        meta: "Verified buyer · 4 weeks",
    },
    {
        name: "Jessica M., 37",
        img: "https://randomuser.me/api/portraits/women/3.jpg",
        title: "“Everyone thought I was pregnant.Not anymore.”",
        body: (
            <>
                My youngest is two and I was still getting "when are you due." I thought it was just fat that would not go. It was my abs, separated in pregnancy and never closed. This holds the whole wall in, 360°, and <strong>in about two weeks my belly had come in and stopped pushing forward.</strong> My waist is back and my jeans button without a fight. It genuinely works, and I wish I had known years ago.
            </>
        ),
        meta: "Verified buyer · 3 months",
    }

];

const FAQS = [
    ["Which size should I order?", "Use the Find Your Size button. If you are between sizes, size up for the comfiest fit."],
    ["Will it roll down or slide like other shapewear?", "No. The crossed band is built to stay in place from morning to night."],
    ["Will it show under my clothes?", "No. The edges are seamless, so it disappears under dresses, jeans and leggings."],
    ["What is it made of?", "A soft, breathable, stretch seamless fabric. Add your exact fabric details here."],
    ["Do I wear it over my underwear or on its own?", "Either. It is designed to be worn on its own as a high-waist brief."],
    ["Do I have to wear it every day?", "Daily wear gives the best results, but you can wear it as often as you like."],
    ["Can I wear it at night?", "Yes, it is soft enough to sleep in."],
    ["When can I wear it after birth, including after a C-section?", "Ask your doctor first. Add your own guidance here."],
    ["I had my baby years ago (5, 10, even 20+ years). Will it still work for me?", "Yes. It is worn by moms from days after birth to 40+ years postpartum."],
    ["How do I wash it?", "Machine wash cold on a gentle cycle and hang dry."],
    ["How soon will I see a difference, and what if it’s not for me?", "Most people see a difference within days. Every order has a 90-day money-back guarantee."],
];

const PAYMENTS = ["Amazon", "Amex", "Apple Pay", "Diners", "Discover", "G Pay", "Mastercard", "PayPal", "Shop", "Visa"];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const Icon = ({ name }) => {
    const p = {
        width: 16, height: 16, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round",
    };
    switch (name) {
        case "waist": return (<svg {...p}><rect x="3" y="9" width="18" height="6" rx="3" /><path d="M8 12h8" /></svg>);
        case "gap": return (<svg {...p}><path d="M9 5v14M15 5v14M4 12h3M17 12h3" /></svg>);
        case "band": return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 8l8 8M16 8l-8 8" /></svg>);
        case "eye": return (<svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M4 4l16 16" /></svg>);
        case "clock": return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
        case "heart": return (<svg {...p}><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /></svg>);
        case "shield": return (<svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>);
        case "ruler": return (<svg {...p}><rect x="2" y="8" width="20" height="8" rx="1.5" /><path d="M6 8v3M10 8v3M14 8v3M18 8v3" /></svg>);
        case "stock": return (<svg {...p}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></svg>);
        default: return null;
    }
};

const pad = (n) => String(n).padStart(2, "0");

function useCountdown(startSeconds = 11 * 3600 + 31 * 60 + 5) {
    const [left, setLeft] = useState(startSeconds);
    useEffect(() => {
        const id = setInterval(() => setLeft((s) => (s <= 1 ? 12 * 3600 : s - 1)), 1000);
        return () => clearInterval(id);
    }, []);
    return `${pad(Math.floor(left / 3600))} : ${pad(Math.floor((left % 3600) / 60))} : ${pad(left % 60)}`;
}

/* ------------------------------------------------------------------ */
/*  LEFT: sticky gallery (Swiper, endless loop)                        */
/* ------------------------------------------------------------------ */
function Gallery({ slides = GALLERY }) {
    const mainRef = useRef(null);
    const thumbsRef = useRef(null);
    const [active, setActive] = useState(0);
    const canLoop = slides.length > 2;

    const pauseVideos = (swiper) => {
        swiper.el.querySelectorAll("video").forEach((v) => v.pause());
    };

    const handleChange = (swiper) => {
        pauseVideos(swiper);
        setActive(swiper.realIndex);
        // keep active thumbnail in view; jumps back to the start after the last one
        thumbsRef.current?.slideTo(Math.max(0, swiper.realIndex - 2));
    };

    const goTo = (i) => (canLoop ? mainRef.current?.slideToLoop(i) : mainRef.current?.slideTo(i));
    // next on last slide -> first, prev on first slide -> last
    const next = () => mainRef.current?.slideNext();
    const prev = () => mainRef.current?.slidePrev();

    return (
        <div className="sh-gallery">
            <Swiper
                className="sh-main"
                modules={[Keyboard, A11y]}
                loop={canLoop}
                rewind={!canLoop}
                slidesPerView={1}
                speed={450}
                keyboard={{ enabled: true }}
                onSwiper={(s) => (mainRef.current = s)}
                onSlideChange={handleChange}
            >
                {slides.map((s, i) => (
                    <SwiperSlide key={i}>
                        {s.type === "video" ? (
                            <video className="sh-media" src={s.src} poster={s.poster} controls playsInline preload="metadata" />
                        ) : (
                            <img className="sh-media" src={s.src} alt={s.alt || ""} loading={i === 0 ? "eager" : "lazy"} draggable="false" />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="sh-thumbs-row">
                <button type="button" className="sh-arrow" onClick={prev} aria-label="Previous">‹</button>
                <Swiper
                    className="sh-thumbs"
                    slidesPerView={5}
                    spaceBetween={10}
                    watchOverflow
                    onSwiper={(s) => (thumbsRef.current = s)}
                >
                    {slides.map((s, i) => (
                        <SwiperSlide key={i}>
                            <button
                                type="button"
                                className={`sh-thumb ${i === active ? "is-active" : ""}`}
                                onClick={() => goTo(i)}
                                aria-label={`Show media ${i + 1}`}
                            >
                                <img src={s.type === "video" ? s.poster : s.src} alt="" draggable="false" />
                                {s.type === "video" && <span className="sh-play">▶</span>}
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <button type="button" className="sh-arrow" onClick={next} aria-label="Next">›</button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  RIGHT: product info (scrolls normally)                             */
/* ------------------------------------------------------------------ */
function Info() {
    const time = useCountdown();
    const [bundle, setBundle] = useState(1);
    const [brush, setBrush] = useState(true);
    const [units, setUnits] = useState({});
    const [openFaq, setOpenFaq] = useState(null);

    // image of a color; if that color has no image yet, use the first color that has one
    const colorImg = (name) =>
        COLORS.find((c) => c.name === name)?.img ||
        COLORS.find((c) => c.img)?.img ||
        IMG.bundle;

    const unit = (i) =>
        units[i] || { color: DEFAULT_COLORS[i % DEFAULT_COLORS.length], size: "XS" };
    const setUnit = (i, patch) => setUnits((u) => ({ ...u, [i]: { ...unit(i), ...patch } }));

    return (
        <div className="sh-info">
            {/* rating */}
            <div className="sh-rating">
                <span className="sh-avatars">
                    {IMG.avatars.map((a, i) => (<img key={i} src={a} alt="" />))}
                </span>
                <span>
                    <span className="sh-stars">★★★★★</span>
                    <span className="sh-rated">Rated <b>4.8/5</b> by <b>50,000+ happy moms</b></span>
                </span>
            </div>

            <h1 className="sh-title">Saybeam Sculpt Brief</h1>
            <p className="sh-sub">The belly that won’t go, <b>finally gone.</b></p>

            <ul className="sh-benefits">
                {BENEFITS.map((b, i) => (
                    <li key={i}>
                        <span className="sh-bicon"><Icon name={b.icon} /></span>
                        <span>{b.html}</span>
                    </li>
                ))}
            </ul>

            <p className="sh-worn-daily">Worn daily, the results <b>build and stay with you.</b></p>
            <div className="sh-worn-box">
                Worn by moms from <b>days after birth to 40+ years</b> postpartum.
                <strong>It’s never too late.</strong>
            </div>

            <div className="sh-divider"><span>Try it risk-free — 90-day guarantee</span></div>
            <p className="sh-timer">🎃 Halloween Offer ends in: <b>{time}</b></p>

            {/* bundles */}
            <div className="sh-bundles">
                {BUNDLES.map((b) => {
                    const selected = bundle === b.id;
                    return (
                        <div key={b.id} className={`sh-bundle ${selected ? "is-selected" : ""}`} onClick={() => setBundle(b.id)}>
                            {b.badge && <span className={`sh-badge ${b.id === 3 ? "is-best" : ""}`}>{b.badge}</span>}
                            <div className="sh-bundle-top">
                                <input type="radio" name="bundle" checked={selected} onChange={() => setBundle(b.id)} />
                                {selected && <img className="sh-bundle-img" src={colorImg(unit(0).color)} alt="" />}
                                <div className="sh-bundle-text">
                                    <strong>{b.title}</strong>
                                    <small>Only {b.each} each</small>
                                </div>
                                <div className="sh-bundle-price">
                                    <strong>{b.price}</strong>
                                    <s>{b.was}</s>
                                </div>
                            </div>

                            {selected && (
                                <div className="sh-units" onClick={(e) => e.stopPropagation()}>
                                    {Array.from({ length: b.qty }).map((_, i) => (
                                        <div className="sh-unit" key={i}>
                                            <span className="sh-unit-n">#{i + 1}</span>
                                            <img className="sh-unit-img" src={colorImg(unit(i).color)} alt="" />

                                            <div className="sh-field">
                                                <label>Color</label>
                                                <div className="sh-swatches">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.name}
                                                            type="button"
                                                            title={c.name}
                                                            aria-label={c.name}
                                                            className={unit(i).color === c.name ? "is-on" : ""}
                                                            style={{ background: c.hex }}
                                                            onClick={() => setUnit(i, { color: c.name })}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="sh-field">
                                                <label>Size</label>
                                                <select value={unit(i).size} onChange={(e) => setUnit(i, { size: e.target.value })}>
                                                    {SIZES.map((s) => (<option key={s}>{s}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* add-on */}
                <label className="sh-addon">
                    <strong className="sh-addon-title">Belly Sculpt Brush</strong>
                    <span className="sh-addon-row">
                        <input type="checkbox" checked={brush} onChange={(e) => setBrush(e.target.checked)} />
                        <img src={IMG.brush} alt="" />
                        <span className="sh-addon-text">
                            <b>Added to 8 in 10 Sculpt Brief orders.</b> The brief holds you in, the brush de-bloats and firms from
                            the outside. 2 minutes a day, made to pair with your Sculpt Brief.
                        </span>
                        <span className="sh-bundle-price">
                            <strong>Rs.2,779.90</strong>
                            <s>Rs.6,429.04</s>
                        </span>
                    </span>
                </label>
            </div>

            {/* gifts */}
            <div className="sh-gifts-title"><span>Go bigger, save more, get more free gifts 🎁</span></div>
            <div className="sh-gifts">
                <div>
                    <s>Rs.4,211.75</s>
                    <img src={IMG.ebook} alt="" />
                    <p>E-Book: The Flat Belly Method</p>
                </div>
                <div>
                    <s>Rs.2,807.84</s>
                    <img src={IMG.gift} alt="" />
                    <p>Free $10 Gift Card</p>
                </div>
            </div>

            <p className="sh-low"><Icon name="stock" /> LOW IN STOCK</p>

            <button type="button" className="sh-find"><Icon name="ruler" /> Find Your Size</button>
            <p className="sh-fit">Fits snug by design. Between sizes? <b>Size up</b> from your usual for the comfiest fit.</p>

            <button type="button" className="sh-cart">ADD TO CART</button>

            <div className="sh-guarantee">
                <Icon name="shield" />
                <span><b>Try it risk-free for 90 days.</b> Don’t love it? Reach out and we’ll make it right, with a refund.</span>
            </div>

            <div className="sh-pay">
                {PAYMENTS.map((p) => (<span key={p}>{p}</span>))}
            </div>

            {/* reviews (Swiper, loops back to first) */}
            <h3 className="sh-h3">What moms are saying</h3>
            <Swiper
                className="sh-reviews"
                modules={[Autoplay, Pagination]}
                loop={REVIEWS.length > 2}
                rewind={REVIEWS.length <= 2}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                autoHeight
            >
                {REVIEWS.map((r, i) => (
                    <SwiperSlide key={i}>
                        <div className="sh-review">
                            <div className="sh-review-head">
                                <img src={r.img} alt="" />
                                <div>
                                    <strong>{r.name} <i>✓</i></strong>
                                    <span className="sh-stars">★★★★★</span>
                                </div>
                            </div>
                            <h4>{r.title}</h4>
                            <p>{r.body}</p>
                            <small>● {r.meta}</small>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="sh-limited">
                <strong>● LIMITED STOCK: Selling fast</strong>
                <p>
                    Due to high demand, only a few units left. We recommend ordering now to secure yours before this restock runs
                    out — next batch ships in 3-4 weeks.
                </p>
            </div>

            <p className="sh-made">MADE TO WEAR AND FORGET</p>
            <div className="sh-wear">
                <figure>
                    <video src={IMG.wear1} loop muted autoPlay playsInline />
                    <figcaption>
                        <b>Invisible under your clothes</b>
                        Seamless edges, no ridges or lines. It disappears under dresses, jeans and leggings.
                    </figcaption>
                </figure>
                <figure>
                    <video src={IMG.wear2} loop muted autoPlay playsInline />
                    <figcaption>
                        <b>Stays put, morning to night</b>
                        Soft and breathable, it molds to you and never rolls or bunches. Slip it on and forget it.
                    </figcaption>
                </figure>
            </div>


            {/* FAQ */}
            <div className="sh-faq">
                {FAQS.map(([q, a], i) => (
                    <div key={i} className={`sh-faq-item ${openFaq === i ? "is-open" : ""}`}>
                        <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                            <span>{q}</span>
                            <i>{openFaq === i ? "–" : "+"}</i>
                        </button>
                        <div className="sh-faq-a"><p>{a}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
export default function ShopHero({ slides }) {
    return (
        <section className="sh">
            <div className="sh-grid">
                <Gallery slides={slides} />
                <Info />
            </div>
        </section>
    );
}