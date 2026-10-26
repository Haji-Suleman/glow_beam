import { useEffect, useRef } from "react";
import "./GlowbeamRealReviews.css";

/* ------------------------------------------------------------------
   Same image host + file names + versions as the original HTML.
------------------------------------------------------------------- */
const CDN = "https://cdn.shopify.com/s/files/1/0940/8321/9834/files/";
const img = (file, v, w) => `${CDN}${file}?v=${v}&width=${w}`;
const SIZES = "(min-width: 980px) 330px, (min-width: 560px) 42vw, 74vw";

/* ---------- ROW 1 ---------- */
const ROW_ONE = [
    {
        file: "avis-09-southasian28-nude-mirror-ALT.png",
        v: "1784107757",
        name: "Priya N., 30",
        stars: 5,
        text: "C-section mama here. It's gentle over my scar but it really holds everything in, all the way around, not just the front. The nude is completely invisible under my work clothes.",
        date: "1 month ago",
    },
    {
        file: "avis-01-black45-fuchsia-mirror-ALT.png",
        v: "1784107758",
        name: "Deborah M., 46",
        stars: 5,
        text: "Four kids and I'd given up on my stomach ever going back. This holds the whole area in, all the way around, and three weeks in my waist is actually coming back. Got the fuchsia.",
        date: "2 months ago",
    },
    {
        file: "avis-08-plussize-black-hold-ALT.png",
        v: "1784107758",
        name: "Rebecca H., 32",
        stars: 5,
        text: "Most shapewear cuts into me or won't go up high enough on my figure. I went by the waist measurement instead of my usual size and it's perfect, it smooths my waist without choking me. The only one I wear now.",
        date: "6 weeks ago",
    },
    {
        file: "avis-02-blonde30-nude-hold-ALT.png",
        v: "1784107758",
        name: "Megan K., 33",
        stars: 5,
        text: "Three years postpartum and people still asked if I was expecting. Two weeks in and the pooch is gone under my clothes, I actually teared up. The nude disappears under a fitted dress.",
        date: "6 weeks ago",
    },
    {
        file: "avis-06-brunette32-navy-mirror.png",
        v: "1784107759",
        name: "Hannah R., 32",
        stars: 5,
        text: "Wore the navy under a fitted dress for eight hours, zero lines and zero readjusting in the bathroom. My waist looked snatched and I was actually comfortable all night. That never happens.",
        date: "1 month ago",
    },
];

/* ---------- ROW 2 ---------- */
const ROW_TWO = [
    {
        file: "avis-05-blonde-curvy-lilac-hold-ALT.png",
        v: "1784107759",
        name: "Chloe B., 29",
        stars: 4,
        text: "Measure your waist and go by the chart, don't guess from your usual size like I did the first time. Once I got it right it's the comfiest hold I've owned, smooths everything and I forget it's on.",
        date: "3 weeks ago",
    },
    {
        file: "avis-11-blondemom-navy-mirror-ALT.png",
        v: "1784107759",
        name: "Emily S., 36",
        stars: 4,
        text: "Does exactly what it says, holds my mom-pooch in all day and you can't see it under anything. Only reason it's not five stars is I wish it came in more colors. I wear it every single day.",
        date: "4 weeks ago",
    },
    {
        file: "avis-10-latina35-plum-hold-ALT.png",
        v: "1784107760",
        name: "Daniela V., 37",
        stars: 5,
        text: "Two kids and my lower belly never went back. This is the only thing that holds it flat all day without rolling down or pinching. Bought the plum first, already ordered two more colors.",
        date: "7 weeks ago",
    },
    {
        file: "avis-07-balayage33-fuchsia-hold-ALT.png",
        v: "1784107760",
        name: "Jenna P., 34",
        stars: 5,
        text: "My belly was flat in the morning and pushed out by evening, every single day. This holds it in from morning to night, no rolling down. Honestly I wish I'd found it two years ago.",
        date: "5 weeks ago",
    },
    {
        file: "avis-03-latina-curly-plum-hold.png",
        v: "1784107760",
        name: "Gabriela R., 33",
        stars: 5,
        text: "It was never fat, it's the gap after two babies that nothing fixed. This is the first thing that actually pulls it in. Flat the second I put it on and it stays that way all day.",
        date: "1 month ago",
    },
];

/* ------------------------------------------------------------------
   MOTION SETTINGS
   direction:  1 = row slides LEFT   (what row 1 does in your screenshots)
              -1 = row slides RIGHT  (what row 2 does in your screenshots)
   Swap the two numbers below if you want the opposite way round.
------------------------------------------------------------------- */
const ROW_ONE_DIRECTION = 1;
const ROW_TWO_DIRECTION = -1;
const SPEED = 20; // pixels per second
const RAMP_MS = 3500; // "slowly start moving": time to reach full speed
const COPIES = 3; // each row's cards are repeated 3 times

function Stars({ count }) {
    return (
        <div className="sbR-card-stars" aria-label={`${count} out of 5 stars`}>
            {"★".repeat(count)}
            {count < 5 && <span className="sbR-star-off">{"★".repeat(5 - count)}</span>}
        </div>
    );
}

function Card({ r, hidden }) {
    return (
        <div className="sbR-card" aria-hidden={hidden || undefined}>
            <div className="sbR-card-img">
                <img
                    src={img(r.file, r.v, 600)}
                    srcSet={`${img(r.file, r.v, 300)} 300w, ${img(r.file, r.v, 450)} 450w, ${img(
                        r.file,
                        r.v,
                        600
                    )} 600w`}
                    sizes={SIZES}
                    width="600"
                    height="600"
                    alt={`${r.name.split(",")[0]} review`}
                    loading="lazy"
                    draggable={false}
                />
            </div>
            <div className="sbR-card-body">
                <Stars count={r.stars} />
                <div className="sbR-card-meta">
                    <span className="sbR-card-name">{r.name}</span>
                    <span className="sbR-verified">✓ Verified Buyer</span>
                </div>
                <p className="sbR-card-text">{r.text}</p>
                <div className="sbR-card-date">Verified Purchase · {r.date}</div>
            </div>
        </div>
    );
}

function MarqueeRow({ reviews, direction }) {
    const viewportRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let pos = 0; // distance travelled inside one set of cards
        let last = performance.now();
        let rampStart = null; // set when the row first becomes visible
        let visible = false;
        let hovering = false;
        let dragging = false;
        let lastX = 0;
        let raf;

        const setWidth = () =>
            track.children[reviews.length].offsetLeft - track.children[0].offsetLeft;

        const render = () => {
            const w = setWidth();
            if (!w) return;
            pos = ((pos % w) + w) % w;
            const x = direction === 1 ? -pos : -w + pos;
            track.style.transform = `translate3d(${x}px,0,0)`;
        };

        const tick = (now) => {
            const dt = Math.min(now - last, 50) / 1000;
            last = now;

            if (visible && !hovering && !dragging && !reduce) {
                if (rampStart === null) rampStart = now;
                const t = Math.min(1, (now - rampStart) / RAMP_MS);
                const eased = t * t * (3 - 2 * t); // smoothstep: slow start
                pos += SPEED * eased * dt;
            }
            render();
            raf = requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
            threshold: 0.1,
        });
        io.observe(viewport);

        const onEnter = (e) => e.pointerType === "mouse" && (hovering = true);
        const onLeave = (e) => e.pointerType === "mouse" && (hovering = false);
        const onDown = (e) => {
            dragging = true;
            lastX = e.clientX;
            viewport.setPointerCapture?.(e.pointerId);
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            lastX = e.clientX;
            pos += direction === 1 ? -dx : dx;
        };
        const onUp = () => (dragging = false);

        viewport.addEventListener("pointerenter", onEnter);
        viewport.addEventListener("pointerleave", onLeave);
        viewport.addEventListener("pointerdown", onDown);
        viewport.addEventListener("pointermove", onMove);
        viewport.addEventListener("pointerup", onUp);
        viewport.addEventListener("pointercancel", onUp);

        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            viewport.removeEventListener("pointerenter", onEnter);
            viewport.removeEventListener("pointerleave", onLeave);
            viewport.removeEventListener("pointerdown", onDown);
            viewport.removeEventListener("pointermove", onMove);
            viewport.removeEventListener("pointerup", onUp);
            viewport.removeEventListener("pointercancel", onUp);
        };
    }, [direction, reviews.length]);

    return (
        <div className="sbR-row-viewport" ref={viewportRef}>
            <div className="sbR-row" ref={trackRef} data-dir={direction}>
                {Array.from({ length: COPIES }).flatMap((_, c) =>
                    reviews.map((r) => <Card key={`${c}-${r.name}`} r={r} hidden={c > 0} />)
                )}
            </div>
        </div>
    );
}

export default function GlowbeamRealReviews() {
    return (
        <section className="sbR">
            <h2 className="sbR-title">
                Real Bodies. <em>Real Confidence.</em>
            </h2>

            <ul className="sbR-trust">
                <li>
                    <span>✓</span> 50,000+ verified reviews
                </li>
                <li>
                    <span>✓</span> 90-day money-back
                </li>
                <li>
                    <span>✓</span> Worldwide shipping
                </li>
            </ul>

            <div className="sbR-rows">
                <MarqueeRow reviews={ROW_ONE} direction={ROW_ONE_DIRECTION} />
                <MarqueeRow reviews={ROW_TWO} direction={ROW_TWO_DIRECTION} />
            </div>

            <p className="sbR-hint">Swipe to browse all reviews</p>
        </section>
    );
}