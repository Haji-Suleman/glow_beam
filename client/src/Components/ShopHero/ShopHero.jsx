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

/* Each color has its OWN image url in `img` – clicking a swatch switches the picture. */
const COLORS = [
    { name: "Black", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915233/hf_20260831_132809_47a4a29b-6df6-4e44-909f-db4ef68a1cb3.png", hex: "#000000" },
    { name: "Beige", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915264/hf_20260831_132821_6e58af11-3748-4e69-8ae0-f98574666aa8.png", hex: "#e9d9a6" },
    { name: "Navy", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915325/hf_20260831_132836_44947fba-5c73-44f8-b8fc-e79f1d7e0197.png", hex: "#1c1c96" },
    { name: "Lilac", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915445/hf_20260831_132846_a5faca2e-1c7d-4199-a287-93266a3b6e47.png", hex: "#e2c9f1" },
    { name: "Purple", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915527/hf_20260831_133028_8b701cf5-ba9d-4e01-91d6-be2660c9690c.png", hex: "#a43fcf" },
    { name: "Violet", img: "https://res.cloudinary.com/fozdhxik/image/upload/v1792915554/hf_20260831_132853_b47d758f-b612-4d26-9f5c-e1b537950930.png", hex: "#e20d72" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

/* original starts with #1 = pink and #2 = lilac (names must exist in COLORS above) */
const DEFAULT_COLORS = ["Violet", "Lilac"];

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
                I am twenty years and three kids out, and I had wasted money on wraps and belts that did nothing, so I doubted this too, and I ordered the wrong size. Their team let me keep it and sent the right one free in a few days.{" "}
                <b>It stays put all day and my belly is visibly flatter,</b> a couple of pounds gone too. It really was not too late after all. Four stars only because I wish the nude came in more shades.
            </>
        ),
        meta: "Verified buyer · 6 weeks",
    },
    {
        name: "Rachel P., 40",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        title: "“The shelf above my c-section scar is finally gone”",
        body: (
            <>
                I am a mother of three and have been struggling with the shelf above my c-section scar for years. This product has completely transformed my confidence.{" "}
                <b>It stays in place all day and my belly is visibly flatter,</b> a couple of pounds gone too. It really was not too late after all. Four stars only because I wish the nude came in more shades.
            </>
        ),
        meta: "Verified buyer · 4 weeks",
    },
    {
        name: "Jessica M., 37",
        img: "https://randomuser.me/api/portraits/women/3.jpg",
        title: "“Everyone thought I was pregnant. Not anymore.”",
        body: (
            <>
                My youngest is two and I was still getting "when are you due." I thought it was just fat that would not go. It was my abs, separated in pregnancy and never closed. This holds the whole wall in, 360°, and{" "}
                <b>in about two weeks my belly had come in and stopped pushing forward.</b> My waist is back and my jeans button without a fight. It genuinely works, and I wish I had known years ago.
            </>
        ),
        meta: "Verified buyer · 3 months",
    },
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

/* real payment icons (raw SVG, rendered with dangerouslySetInnerHTML – static, your own markup) */
export const PAYMENTS = [
    {
        name: "Amazon Pay",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-amazon"><title id="pi-amazon">Amazon</title><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" fill-rule="nonzero" opacity=".07"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF" fill-rule="nonzero"></path><path d="M25.26 16.23c-1.697 1.48-4.157 2.27-6.275 2.27-2.97 0-5.644-1.3-7.666-3.463-.16-.17-.018-.402.173-.27 2.183 1.504 4.882 2.408 7.67 2.408 1.88 0 3.95-.46 5.85-1.416.288-.145.53.222.248.47v.001zm.706-.957c-.216-.328-1.434-.155-1.98-.078-.167.024-.193-.148-.043-.27.97-.81 2.562-.576 2.748-.305.187.272-.047 2.16-.96 3.063-.14.138-.272.064-.21-.12.205-.604.664-1.96.446-2.29h-.001z" fill="#F90" fill-rule="nonzero"></path><path d="M21.814 15.291c-.574-.498-.676-.73-.993-1.205-.947 1.012-1.618 1.315-2.85 1.315-1.453 0-2.587-.938-2.587-2.818 0-1.467.762-2.467 1.844-2.955.94-.433 2.25-.51 3.25-.628v-.235c0-.43.033-.94-.208-1.31-.212-.333-.616-.47-.97-.47-.66 0-1.25.353-1.392 1.085-.03.163-.144.323-.3.33l-1.677-.187c-.14-.033-.296-.153-.257-.38.386-2.125 2.223-2.766 3.867-2.766.84 0 1.94.234 2.604.9.842.82.762 1.918.762 3.11v2.818c0 .847.335 1.22.65 1.676.113.164.138.36-.003.482-.353.308-.98.88-1.326 1.2a.367.367 0 0 1-.414.038zm-1.659-2.533c.34-.626.323-1.214.323-1.918v-.392c-1.25 0-2.57.28-2.57 1.82 0 .782.386 1.31 1.05 1.31.487 0 .922-.312 1.197-.82z" fill="#221F1F"></path></svg>`,
    },
    {
        name: "American Express",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" fill="none" aria-labelledby="pi-american_express"><title id="pi-american_express">American Express</title><rect x=".5" y=".5" width="37" height="23" rx="2.5" stroke="#000" stroke-opacity=".07" fill="none"></rect><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z" fill="#0071CE"></path><path d="M3 0.5H35C36.3348 0.5 37.5 1.58692 37.5 3V21C37.5 22.4239 36.4239 23.5 35 23.5H3C1.66524 23.5 0.5 22.4131 0.5 21V3C0.5 1.57614 1.57614 0.5 3 0.5Z" stroke="black" stroke-opacity="0.07"></path><path d="M25.8662 6.33203V3H31L31.8662 5.5332L32.7334 3H37V14.2002H36.7998L34.8672 16.2656L36.7998 18.3594H37V21.2666H33.5996L31.9336 19.3994L30.2002 21.2666H19.4668V12.666H16L20.2666 3H24.4004L25.8662 6.33203ZM20.5996 20.2656H27V18.5322H22.666V17.3994H26.8662V15.666H22.666V14.5322H27V12.7988H20.5996V20.2656ZM30.5332 16.5322L27 20.2656H29.5996L31.8662 17.8662L34.0664 20.2656H36.7324L33.1992 16.4658L36.7324 12.7988H34.1328L31.8662 15.1992L29.7324 12.7988H27L30.5332 16.5322ZM17.666 11.7324H19.9326L20.5332 10.1992H23.999L24.666 11.7324H26.999L23.666 4.19922H20.999L17.666 11.7324ZM33.5996 4.19922L31.9326 8.86621L30.1992 4.19922H27V11.666H29.0664V6.39941L31 11.666H32.7998L34.7324 6.39941V11.666H36.7324V4.13281L33.5996 4.19922ZM23.2656 8.46582H21.2656L22.2656 5.99902L23.2656 8.46582Z" fill="white"></path></svg>`,
    },
    {
        name: "Apple Pay",
        svg: `<svg class="icon icon--full-color" version="1.1" xmlns="http://www.w3.org/2000/svg" role="img" x="0" y="0" width="38" height="24" viewBox="0 0 165.521 105.965" xml:space="preserve" aria-labelledby="pi-apple_pay"><title id="pi-apple_pay">Apple Pay</title><path fill="#000" d="M150.698 0H14.823c-.566 0-1.133 0-1.698.003-.477.004-.953.009-1.43.022-1.039.028-2.087.09-3.113.274a10.51 10.51 0 0 0-2.958.975 9.932 9.932 0 0 0-4.35 4.35 10.463 10.463 0 0 0-.975 2.96C.113 9.611.052 10.658.024 11.696a70.22 70.22 0 0 0-.022 1.43C0 13.69 0 14.256 0 14.823v76.318c0 .567 0 1.132.002 1.699.003.476.009.953.022 1.43.028 1.036.09 2.084.275 3.11a10.46 10.46 0 0 0 .974 2.96 9.897 9.897 0 0 0 1.83 2.52 9.874 9.874 0 0 0 2.52 1.83c.947.483 1.917.79 2.96.977 1.025.183 2.073.245 3.112.273.477.011.953.017 1.43.02.565.004 1.132.004 1.698.004h135.875c.565 0 1.132 0 1.697-.004.476-.002.952-.009 1.431-.02 1.037-.028 2.085-.09 3.113-.273a10.478 10.478 0 0 0 2.958-.977 9.955 9.955 0 0 0 4.35-4.35c.483-.947.789-1.917.974-2.96.186-1.026.246-2.074.274-3.11.013-.477.02-.954.022-1.43.004-.567.004-1.132.004-1.699V14.824c0-.567 0-1.133-.004-1.699a63.067 63.067 0 0 0-.022-1.429c-.028-1.038-.088-2.085-.274-3.112a10.4 10.4 0 0 0-.974-2.96 9.94 9.94 0 0 0-4.35-4.35A10.52 10.52 0 0 0 156.939.3c-1.028-.185-2.076-.246-3.113-.274a71.417 71.417 0 0 0-1.431-.022C151.83 0 151.263 0 150.698 0z"></path><path fill="#FFF" d="M150.698 3.532l1.672.003c.452.003.905.008 1.36.02.793.022 1.719.065 2.583.22.75.135 1.38.34 1.984.648a6.392 6.392 0 0 1 2.804 2.807c.306.6.51 1.226.645 1.983.154.854.197 1.783.218 2.58.013.45.019.9.02 1.36.005.557.005 1.113.005 1.671v76.318c0 .558 0 1.114-.004 1.682-.002.45-.008.9-.02 1.35-.022.796-.065 1.725-.221 2.589a6.855 6.855 0 0 1-.645 1.975 6.397 6.397 0 0 1-2.808 2.807c-.6.306-1.228.511-1.971.645-.881.157-1.847.2-2.574.22-.457.01-.912.017-1.379.019-.555.004-1.113.004-1.669.004H14.801c-.55 0-1.1 0-1.66-.004a74.993 74.993 0 0 1-1.35-.018c-.744-.02-1.71-.064-2.584-.22a6.938 6.938 0 0 1-1.986-.65 6.337 6.337 0 0 1-1.622-1.18 6.355 6.355 0 0 1-1.178-1.623 6.935 6.935 0 0 1-.646-1.985c-.156-.863-.2-1.788-.22-2.578a66.088 66.088 0 0 1-.02-1.355l-.003-1.327V14.474l.002-1.325a66.7 66.7 0 0 1 .02-1.357c.022-.792.065-1.717.222-2.587a6.924 6.924 0 0 1 .646-1.981c.304-.598.7-1.144 1.18-1.623a6.386 6.386 0 0 1 1.624-1.18 6.96 6.96 0 0 1 1.98-.646c.865-.155 1.792-.198 2.586-.22.452-.012.905-.017 1.354-.02l1.677-.003h135.875"></path><g><g><path fill="#000" d="M43.508 35.77c1.404-1.755 2.356-4.112 2.105-6.52-2.054.102-4.56 1.355-6.012 3.112-1.303 1.504-2.456 3.959-2.156 6.266 2.306.2 4.61-1.152 6.063-2.858"></path><path fill="#000" d="M45.587 39.079c-3.35-.2-6.196 1.9-7.795 1.9-1.6 0-4.049-1.8-6.698-1.751-3.447.05-6.645 2-8.395 5.1-3.598 6.2-.95 15.4 2.55 20.45 1.699 2.5 3.747 5.25 6.445 5.151 2.55-.1 3.549-1.65 6.647-1.65 3.097 0 3.997 1.65 6.696 1.6 2.798-.05 4.548-2.5 6.247-5 1.95-2.85 2.747-5.6 2.797-5.75-.05-.05-5.396-2.101-5.446-8.251-.05-5.15 4.198-7.6 4.398-7.751-2.399-3.548-6.147-3.948-7.447-4.048"></path></g><g><path fill="#000" d="M78.973 32.11c7.278 0 12.347 5.017 12.347 12.321 0 7.33-5.173 12.373-12.529 12.373h-8.058V69.62h-5.822V32.11h14.062zm-8.24 19.807h6.68c5.07 0 7.954-2.729 7.954-7.46 0-4.73-2.885-7.434-7.928-7.434h-6.706v14.894z"></path><path fill="#000" d="M92.764 61.847c0-4.809 3.665-7.564 10.423-7.98l7.252-.442v-2.08c0-3.04-2.001-4.704-5.562-4.704-2.938 0-5.07 1.507-5.51 3.82h-5.252c.157-4.86 4.731-8.395 10.918-8.395 6.654 0 10.995 3.483 10.995 8.89v18.663h-5.38v-4.497h-.13c-1.534 2.937-4.914 4.782-8.579 4.782-5.406 0-9.175-3.222-9.175-8.057zm17.675-2.417v-2.106l-6.472.416c-3.64.234-5.536 1.585-5.536 3.95 0 2.288 1.975 3.77 5.068 3.77 3.95 0 6.94-2.522 6.94-6.03z"></path><path fill="#000" d="M120.975 79.652v-4.496c.364.051 1.247.103 1.715.103 2.573 0 4.029-1.09 4.913-3.899l.52-1.663-9.852-27.293h6.082l6.863 22.146h.13l6.862-22.146h5.927l-10.216 28.67c-2.34 6.577-5.017 8.735-10.683 8.735-.442 0-1.872-.052-2.261-.157z"></path></g></g></svg>`,
    },
    {
        name: "Bancontact",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" aria-labelledby="pi-bancontact" role="img" viewBox="0 0 38 24" width="38" height="24"><title id="pi-bancontact">Bancontact</title><path fill="#000" opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M4.703 3.077h28.594c.139 0 .276.023.405.068.128.045.244.11.343.194a.9.9 0 0 1 .229.29c.053.107.08.223.08.34V20.03a.829.829 0 0 1-.31.631 1.164 1.164 0 0 1-.747.262H4.703a1.23 1.23 0 0 1-.405-.068 1.09 1.09 0 0 1-.343-.194.9.9 0 0 1-.229-.29.773.773 0 0 1-.08-.34V3.97c0-.118.027-.234.08-.342a.899.899 0 0 1 .23-.29c.098-.082.214-.148.342-.193a1.23 1.23 0 0 1 .405-.068Z" fill="#fff"></path><path d="M6.38 18.562v-3.077h1.125c.818 0 1.344.259 1.344.795 0 .304-.167.515-.401.638.338.132.536.387.536.734 0 .62-.536.91-1.37.91H6.38Zm.724-1.798h.537c.328 0 .468-.136.468-.387 0-.268-.255-.356-.599-.356h-.406v.743Zm0 1.262h.448c.438 0 .693-.093.693-.383 0-.286-.219-.404-.63-.404h-.51v.787Zm3.284.589c-.713 0-1.073-.295-1.073-.69 0-.436.422-.69 1.047-.695.156.002.31.014.464.035v-.105c0-.269-.183-.396-.531-.396a2.128 2.128 0 0 0-.688.105l-.13-.474a3.01 3.01 0 0 1 .9-.132c.767 0 1.147.343 1.147.936v1.222c-.214.093-.615.194-1.136.194Zm.438-.497v-.47a2.06 2.06 0 0 0-.37-.036c-.24 0-.427.08-.427.286 0 .185.156.281.432.281a.947.947 0 0 0 .365-.061Zm1.204.444v-2.106a3.699 3.699 0 0 1 1.177-.193c.76 0 1.198.316 1.198.9v1.399h-.719v-1.354c0-.303-.167-.444-.484-.444a1.267 1.267 0 0 0-.459.079v1.719h-.713Zm4.886-2.167-.135.479a1.834 1.834 0 0 0-.588-.11c-.422 0-.652.25-.652.664 0 .453.24.685.688.685.2-.004.397-.043.578-.114l.115.488a2.035 2.035 0 0 1-.75.128c-.865 0-1.365-.453-1.365-1.17 0-.712.495-1.182 1.323-1.182.27-.001.538.043.787.132Zm1.553 2.22c-.802 0-1.302-.47-1.302-1.178 0-.704.5-1.174 1.302-1.174.807 0 1.297.47 1.297 1.173 0 .708-.49 1.179-1.297 1.179Zm0-.502c.37 0 .563-.259.563-.677 0-.413-.193-.672-.563-.672-.364 0-.568.26-.568.672 0 .418.204.677.568.677Zm1.713.449v-2.106a3.699 3.699 0 0 1 1.177-.193c.76 0 1.198.316 1.198.9v1.399h-.719v-1.354c0-.303-.166-.444-.484-.444a1.268 1.268 0 0 0-.459.079v1.719h-.713Zm3.996.053c-.62 0-.938-.286-.938-.866v-.95h-.354v-.484h.355v-.488l.718-.03v.518h.578v.484h-.578v.94c0 .256.125.374.36.374.093 0 .185-.008.276-.026l.036.488c-.149.028-.3.041-.453.04Zm1.814 0c-.713 0-1.073-.295-1.073-.69 0-.436.422-.69 1.047-.695.155.002.31.014.464.035v-.105c0-.269-.183-.396-.532-.396a2.128 2.128 0 0 0-.687.105l-.13-.474a3.01 3.01 0 0 1 .9-.132c.766 0 1.146.343 1.146.936v1.222c-.213.093-.614.194-1.135.194Zm.438-.497v-.47a2.06 2.06 0 0 0-.37-.036c-.24 0-.427.08-.427.286 0 .185.156.281.432.281a.946.946 0 0 0 .365-.061Zm3.157-1.723-.136.479a1.834 1.834 0 0 0-.588-.11c-.422 0-.651.25-.651.664 0 .453.24.685.687.685.2-.004.397-.043.578-.114l.115.488a2.035 2.035 0 0 1-.75.128c-.865 0-1.365-.453-1.365-1.17 0-.712.495-1.182 1.323-1.182.27-.001.538.043.787.132Zm1.58 2.22c-.62 0-.938-.286-.938-.866v-.95h-.354v-.484h.354v-.488l.72-.03v.518h.577v.484h-.578v.94c0 .256.125.374.36.374.092 0 .185-.008.276-.026l.036.488c-.149.028-.3.041-.453.04Z" fill="#1E3764"></path><path d="M11.394 13.946c3.803 0 5.705-2.14 7.606-4.28H6.38v4.28h5.014Z" fill="url(#pi-bancontact-a)"></path><path d="M26.607 5.385c-3.804 0-5.705 2.14-7.607 4.28h12.62v-4.28h-5.013Z" fill="url(#pi-bancontact-b)"></path><defs><linearGradient id="pi-bancontact-a" x1="8.933" y1="12.003" x2="17.734" y2="8.13" gradientUnits="userSpaceOnUse"><stop stop-color="#005AB9"></stop><stop offset="1" stop-color="#1E3764"></stop></linearGradient><linearGradient id="pi-bancontact-b" x1="19.764" y1="10.037" x2="29.171" y2="6.235" gradientUnits="userSpaceOnUse"><stop stop-color="#FBA900"></stop><stop offset="1" stop-color="#FFD800"></stop></linearGradient></defs></svg>`,
    },
    {
        name: "Diners Club",
        svg: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-diners_club"><title id="pi-diners_club">Diners Club</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z" fill="#3086C8"></path></svg>`,
    },
    {
        name: "Discover",
        svg: `<svg class="icon icon--full-color" viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-discover" fill="none" xmlns="http://www.w3.org/2000/svg"><title id="pi-discover">Discover</title><path fill="#000" opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z" fill="#fff"></path><path d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z" fill="#231F20"></path><path d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint0_linear)"></path><path opacity=".65" d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z" fill="url(#pi-paint1_linear)"></path><path d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z" fill="#231F20"></path><path d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z" fill="#231F20"></path><path d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z" fill="#F48120"></path><defs><linearGradient id="pi-paint0_linear" x1="21.657" y1="12.275" x2="19.632" y2="9.104" gradientUnits="userSpaceOnUse"><stop stop-color="#F89F20"></stop><stop offset=".25" stop-color="#F79A20"></stop><stop offset=".533" stop-color="#F68D20"></stop><stop offset=".62" stop-color="#F58720"></stop><stop offset=".723" stop-color="#F48120"></stop><stop offset="1" stop-color="#F37521"></stop></linearGradient><linearGradient id="pi-paint1_linear" x1="21.338" y1="12.232" x2="18.378" y2="6.446" gradientUnits="userSpaceOnUse"><stop stop-color="#F58720"></stop><stop offset=".359" stop-color="#E16F27"></stop><stop offset=".703" stop-color="#D4602C"></stop><stop offset=".982" stop-color="#D05B2E"></stop></linearGradient></defs></svg>`,
    },
    {
        name: "Google Pay",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-google_pay"><title id="pi-google_pay">Google Pay</title><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"></path><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"></path><path d="M18.093 11.976v3.2h-1.018v-7.9h2.691a2.447 2.447 0 0 1 1.747.692 2.28 2.28 0 0 1 .11 3.224l-.11.116c-.47.447-1.098.69-1.747.674l-1.673-.006zm0-3.732v2.788h1.698c.377.012.741-.135 1.005-.404a1.391 1.391 0 0 0-1.005-2.354l-1.698-.03zm6.484 1.348c.65-.03 1.286.188 1.778.613.445.43.682 1.03.65 1.649v3.334h-.969v-.766h-.049a1.93 1.93 0 0 1-1.673.931 2.17 2.17 0 0 1-1.496-.533 1.667 1.667 0 0 1-.613-1.324 1.606 1.606 0 0 1 .613-1.336 2.746 2.746 0 0 1 1.698-.515c.517-.02 1.03.093 1.49.331v-.208a1.134 1.134 0 0 0-.417-.901 1.416 1.416 0 0 0-.98-.368 1.545 1.545 0 0 0-1.319.717l-.895-.564a2.488 2.488 0 0 1 2.182-1.06zM23.29 13.52a.79.79 0 0 0 .337.662c.223.176.5.269.785.263.429-.001.84-.17 1.146-.472.305-.286.478-.685.478-1.103a2.047 2.047 0 0 0-1.324-.374 1.716 1.716 0 0 0-1.03.294.883.883 0 0 0-.392.73zm9.286-3.75l-3.39 7.79h-1.048l1.281-2.728-2.224-5.062h1.103l1.612 3.885 1.569-3.885h1.097z" fill="#5F6368"></path><path d="M13.986 11.284c0-.308-.024-.616-.073-.92h-4.29v1.747h2.451a2.096 2.096 0 0 1-.9 1.373v1.134h1.464a4.433 4.433 0 0 0 1.348-3.334z" fill="#4285F4"></path><path d="M9.629 15.721a4.352 4.352 0 0 0 3.01-1.097l-1.466-1.14a2.752 2.752 0 0 1-4.094-1.44H5.577v1.17a4.53 4.53 0 0 0 4.052 2.507z" fill="#34A853"></path><path d="M7.079 12.05a2.709 2.709 0 0 1 0-1.735v-1.17H5.577a4.505 4.505 0 0 0 0 4.075l1.502-1.17z" fill="#FBBC04"></path><path d="M9.629 8.44a2.452 2.452 0 0 1 1.74.68l1.3-1.293a4.37 4.37 0 0 0-3.065-1.183 4.53 4.53 0 0 0-4.027 2.5l1.502 1.171a2.715 2.715 0 0 1 2.55-1.875z" fill="#EA4335"></path></svg>`,
    },
    {
        name: "Mastercard",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" fill="none" aria-labelledby="pi-master"><title id="pi-master">Mastercard</title><rect x=".5" y=".5" width="37" height="23" rx="2.5" stroke="#000" stroke-opacity=".07" fill="none"></rect><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z" fill="#1C1C1C"></path><path d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z" fill="#232323"></path><path d="M14.6364 19.2727C18.8538 19.2727 22.2727 15.8538 22.2727 11.6364C22.2727 7.41892 18.8538 4 14.6364 4C10.4189 4 7 7.41892 7 11.6364C7 15.8538 10.4189 19.2727 14.6364 19.2727Z" fill="#EB001B"></path><path d="M23.3637 19.2727C27.5811 19.2727 31 15.8538 31 11.6364C31 7.41892 27.5811 4 23.3637 4C19.1462 4 15.7273 7.41892 15.7273 11.6364C15.7273 15.8538 19.1462 19.2727 23.3637 19.2727Z" fill="#F79E1B"></path><path d="M22.2727 11.6362C22.2727 9.01797 20.9637 6.72706 19 5.41797C17.0364 6.83615 15.7273 9.12706 15.7273 11.6362C15.7273 14.1452 17.0364 16.5452 19 17.8543C20.9637 16.5452 22.2727 14.2543 22.2727 11.6362Z" fill="#FF5F00"></path></svg>`,
    },
    {
        name: "MB WAY",
        svg: `<svg class="icon icon--full-color" viewBox="0 0 38 24" role="img" width="38" height="24" aria-labelledby="pi-mbway" xmlns="http://www.w3.org/2000/svg"><title id="pi-mbway">MB WAY</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M2.652 18.267l-.059.459a.38.38 0 00.381.424H17.88c.232 0 .41-.198.383-.424l-.061-.459a.658.658 0 01.579-.72.646.646 0 01.712.579l.057.445c.116.998-.448 1.872-1.456 1.872H2.761c-1.008 0-1.573-.874-1.457-1.872l.058-.445a.646.646 0 01.711-.579.657.657 0 01.579.72" fill="#d81e25"></path><path d="M18.225 10.154c0 .608-.215.952-.571 1.374l-.036.043.05.029c.705.43 1.197 1.079 1.234 1.991.055 1.359-1.097 2.482-2.463 2.479h-3.602a.642.642 0 01-.634-.65V8.435c0-.361.283-.652.632-.652l2.974.009c1.297.002 2.416.955 2.416 2.362m-1.793 4.659c.726 0 1.303-.528 1.288-1.223-.016-.712-.663-1.172-1.385-1.174h-1.46a.595.595 0 01-.588-.605c0-.337.264-.606.588-.606h.974c.658-.026 1.165-.424 1.196-1.046.032-.666-.539-1.165-1.238-1.165H13.44l-.008 5.819h3" fill="#100f0d"></path><path d="M6.616 13.676l.016.049.018-.049c.168-.46.369-.969.583-1.525.22-.584.439-1.143.658-1.675.221-.541.431-1.024.631-1.444.2-.429.366-.724.493-.886a.97.97 0 01.781-.354h.149c.199 0 .354.053.47.15.107.093.171.2.188.323l.931 7.219a.593.593 0 01-.159.437c-.105.1-.256.149-.453.149-.198 0-.353-.047-.469-.138a.506.506 0 01-.218-.361c-.03-.24-.06-.507-.089-.8-.04-.292-.186-1.552-.226-1.868-.038-.327-.301-2.368-.389-3.109l-.008-.062-.299.625c-.101.215-.21.474-.331.776-.119.3-.241.618-.36.954-.13.325-.707 1.972-.707 1.972-.052.15-.154.451-.245.727a12.48 12.48 0 01-.202.572.82.82 0 01-.744.455.813.813 0 01-.746-.455 10.32 10.32 0 01-.202-.572c-.093-.276-.193-.577-.248-.727 0 0-.577-1.647-.704-1.972a29.247 29.247 0 00-.363-.954c-.12-.302-.229-.561-.328-.776l-.3-.625-.007.062c-.09.741-.35 2.782-.39 3.109-.041.316-.186 1.576-.226 1.868-.03.293-.06.56-.093.8a.502.502 0 01-.215.361c-.116.091-.273.138-.47.138-.197 0-.345-.049-.451-.149-.106-.106-.159-.252-.16-.437l.931-7.219a.529.529 0 01.189-.323.703.703 0 01.467-.15h.151c.325 0 .585.119.781.354.128.162.292.457.492.886.202.42.41.903.632 1.444.219.532.439 1.091.659 1.675.214.556.415 1.065.582 1.525" fill="#100f0d"></path><path d="M4.79 3.419h11.322c1.066 0 1.597.8 1.722 1.856l.047.339a.662.662 0 01-.583.725.652.652 0 01-.715-.587l-.046-.323c-.047-.401-.217-.711-.625-.711H4.989c-.407 0-.577.31-.625.711l-.043.323a.653.653 0 11-1.301-.138l.047-.339c.126-1.056.656-1.856 1.723-1.856" fill="#d81e25"></path><path d="M25.154 11.027c-.079.302-.159.625-.244.969-.085.343-.17.67-.253.984-.082.313-.161.588-.236.825a3.002 3.002 0 01-.185.486c-.089.154-.243.232-.464.232-.061 0-.141-.013-.241-.039-.098-.025-.18-.096-.248-.21a3.005 3.005 0 01-.185-.511 24.53 24.53 0 01-.235-.873c-.084-.33-.165-.679-.249-1.047a79.928 79.928 0 01-.223-1.026c-.066-.316-.121-.587-.166-.808a13.422 13.422 0 01-.074-.4c-.004-.028-.007-.047-.007-.058v-.033c0-.093.033-.169.106-.228a.42.42 0 01.264-.086c.1 0 .179.022.241.064.06.039.105.113.132.218 0 .01.016.091.045.239.032.148.07.338.116.568.048.232.101.49.158.776.058.285.117.576.182.869.063.293.128.576.191.853.063.275.12.512.176.708a36.527 36.527 0 00.381-1.38c.066-.256.13-.51.19-.767l.17-.712c.053-.221.098-.415.136-.586.039-.171.069-.297.091-.379a.46.46 0 01.157-.248c.079-.06.17-.09.281-.09a.46.46 0 01.299.095.437.437 0 01.148.243c.062.268.127.57.199.903a59.514 59.514 0 00.463 2.011c.084.327.163.617.24.869.055-.197.115-.434.178-.708l.194-.85c.067-.289.129-.578.19-.865l.167-.771a106.486 106.486 0 00.164-.778c.027-.105.072-.179.132-.218a.418.418 0 01.24-.064c.104 0 .193.03.264.086a.28.28 0 01.109.228v.033a6.253 6.253 0 01-.088.458 108.095 108.095 0 01-.392 1.829 49.61 49.61 0 01-.244 1.042c-.08.33-.156.621-.232.872a2.898 2.898 0 01-.185.506.439.439 0 01-.252.218.92.92 0 01-.245.047.663.663 0 01-.099-.01.748.748 0 01-.141-.033.516.516 0 01-.148-.078.362.362 0 01-.117-.144 3.826 3.826 0 01-.178-.52 37.54 37.54 0 01-.458-1.776c-.077-.332-.15-.645-.215-.935" fill="#100f0d"></path><path d="M31.315 12.279a40 40 0 00-.33-.984 17.49 17.49 0 00-.411-1.065l-.052-.142a.692.692 0 00-.053.136 16.567 16.567 0 00-.408 1.071c-.1.299-.209.627-.325.984zm-1.835.718a24.52 24.52 0 00-.22.732 5.932 5.932 0 01-.178.553c-.06.16-.181.241-.363.241-.127 0-.219-.032-.278-.096a.347.347 0 01-.086-.243.36.36 0 01.016-.109c.011-.031.045-.144.105-.337.057-.191.132-.431.226-.717.093-.286.197-.599.31-.939a34.26 34.26 0 01.707-1.941c.115-.289.224-.522.322-.696a.382.382 0 01.178-.192.785.785 0 01.303-.049c.123 0 .225.021.309.059a.324.324 0 01.178.198c.078.164.171.386.279.662.106.278.22.578.338.899.118.322.235.651.352.985.115.336.223.648.318.937l.248.738c.068.203.113.335.128.393.01.035.017.071.017.109a.32.32 0 01-.099.243c-.067.064-.163.096-.289.096-.096 0-.164-.022-.213-.064a.404.404 0 01-.11-.177 11.55 11.55 0 01-.196-.553c-.073-.225-.153-.468-.235-.732H29.48" fill="#100f0d"></path><path d="M34.12 12.443a.654.654 0 01-.079-.091 5.456 5.456 0 01-.33-.514 9.736 9.736 0 01-.275-.497c-.09-.177-.177-.356-.262-.534a12.458 12.458 0 01-.231-.496c-.071-.155-.13-.289-.178-.4a1.671 1.671 0 01-.112-.298.428.428 0 01-.005-.062c0-.099.034-.182.103-.246a.395.395 0 01.286-.101c.11 0 .187.028.235.083.047.056.082.11.103.165.01.029.038.088.079.181l.152.346c.061.138.13.289.207.453.079.166.156.328.237.488.079.159.158.311.232.458.073.144.145.264.21.359a6.14 6.14 0 00.34-.603c.12-.242.236-.48.347-.716.11-.238.204-.447.286-.627.079-.182.127-.295.144-.339a.666.666 0 01.103-.165c.046-.055.126-.083.235-.083.122 0 .216.034.287.101a.327.327 0 01.101.246c0 .026 0 .048-.002.062-.003.014-.011.035-.02.062l-.096.239a24.658 24.658 0 01-.405.903c-.087.178-.174.355-.265.531-.091.175-.182.344-.274.503-.09.158-.175.295-.252.404a1.237 1.237 0 01-.156.188v1.707c0 .11-.035.199-.105.27a.37.37 0 01-.268.103.37.37 0 01-.268-.103.366.366 0 01-.104-.27v-1.707" fill="#100f0d"></path></svg>`,
    },
    {
        name: "PayPal",
        svg: `<svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"></path><path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"></path><path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"></path></svg>`,
    },
    {
        name: "Shop Pay",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-shopify_pay"><title id="pi-shopify_pay">Shop Pay</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000"></path><path d="M35.889 0C37.05 0 38 .982 38 2.182v19.636c0 1.2-.95 2.182-2.111 2.182H2.11C.95 24 0 23.018 0 21.818V2.182C0 .982.95 0 2.111 0H35.89z" fill="#5A31F4"></path><path d="M9.35 11.368c-1.017-.223-1.47-.31-1.47-.705 0-.372.306-.558.92-.558.54 0 .934.238 1.225.704a.079.079 0 00.104.03l1.146-.584a.082.082 0 00.032-.114c-.475-.831-1.353-1.286-2.51-1.286-1.52 0-2.464.755-2.464 1.956 0 1.275 1.15 1.597 2.17 1.82 1.02.222 1.474.31 1.474.705 0 .396-.332.582-.993.582-.612 0-1.065-.282-1.34-.83a.08.08 0 00-.107-.035l-1.143.57a.083.083 0 00-.036.111c.454.92 1.384 1.437 2.627 1.437 1.583 0 2.539-.742 2.539-1.98s-1.155-1.598-2.173-1.82v-.003zM15.49 8.855c-.65 0-1.224.232-1.636.646a.04.04 0 01-.069-.03v-2.64a.08.08 0 00-.08-.081H12.27a.08.08 0 00-.08.082v8.194a.08.08 0 00.08.082h1.433a.08.08 0 00.081-.082v-3.594c0-.695.528-1.227 1.239-1.227.71 0 1.226.521 1.226 1.227v3.594a.08.08 0 00.081.082h1.433a.08.08 0 00.081-.082v-3.594c0-1.51-.981-2.577-2.355-2.577zM20.753 8.62c-.778 0-1.507.24-2.03.588a.082.082 0 00-.027.109l.632 1.088a.08.08 0 00.11.03 2.5 2.5 0 011.318-.366c1.25 0 2.17.891 2.17 2.068 0 1.003-.736 1.745-1.669 1.745-.76 0-1.288-.446-1.288-1.077 0-.361.152-.657.548-.866a.08.08 0 00.032-.113l-.596-1.018a.08.08 0 00-.098-.035c-.799.299-1.359 1.018-1.359 1.984 0 1.46 1.152 2.55 2.76 2.55 1.877 0 3.227-1.313 3.227-3.195 0-2.018-1.57-3.492-3.73-3.492zM28.675 8.843c-.724 0-1.373.27-1.845.746-.026.027-.069.007-.069-.029v-.572a.08.08 0 00-.08-.082h-1.397a.08.08 0 00-.08.082v8.182a.08.08 0 00.08.081h1.433a.08.08 0 00.081-.081v-2.683c0-.036.043-.054.069-.03a2.6 2.6 0 001.808.7c1.682 0 2.993-1.373 2.993-3.157s-1.313-3.157-2.993-3.157zm-.271 4.929c-.956 0-1.681-.768-1.681-1.783s.723-1.783 1.681-1.783c.958 0 1.68.755 1.68 1.783 0 1.027-.713 1.783-1.681 1.783h.001z" fill="#fff"></path></svg>`,
    },
    {
        name: "Visa",
        svg: `<svg class="icon icon--full-color" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" fill="none" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><rect x=".5" y=".5" width="37" height="23" rx="2.5" stroke="#000" stroke-opacity=".07" fill="none"></rect><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.4 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.6 0 35 0Z" fill="#142FBD"></path><path d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z" fill="#1532CB"></path><path d="M29.5944 10.2167H29.2778C28.8556 11.2722 28.5389 11.8 28.2222 13.3833H30.2278C29.9111 11.8 29.9111 11.0611 29.5944 10.2167V10.2167ZM32.6556 16.4444H30.8611C30.7556 16.4444 30.7556 16.4444 30.65 16.3389L30.4389 15.3889L30.3333 15.1778H27.8C27.6944 15.1778 27.5889 15.1778 27.5889 15.3889L27.2722 16.3389C27.2722 16.4444 27.1667 16.4444 27.1667 16.4444H24.95L25.1611 15.9167L28.2222 8.73889C28.2222 8.21111 28.5389 8 29.0667 8H30.65C30.7556 8 30.8611 8 30.8611 8.21111L32.3389 15.0722C32.4444 15.4944 32.55 15.8111 32.55 16.2333C32.6556 16.3389 32.6556 16.3389 32.6556 16.4444V16.4444ZM18.5111 16.1278L18.9333 14.2278C19.0389 14.2278 19.1444 14.3333 19.1444 14.3333C19.8833 14.65 20.6222 14.8611 21.3611 14.7556C21.5722 14.7556 21.8889 14.65 22.1 14.5444C22.6278 14.3333 22.6278 13.8056 22.2056 13.3833C21.9944 13.1722 21.6778 13.0667 21.3611 12.8556C20.9389 12.6444 20.5167 12.4333 20.2 12.1167C18.9333 11.0611 19.3556 9.58333 20.0944 8.84444C20.7278 8.42222 21.0444 8 21.8889 8C23.1556 8 24.5278 8 25.1611 8.21111H25.2667C25.1611 8.84444 25.0556 9.37222 24.8444 10.0056C24.3167 9.79444 23.7889 9.58333 23.2611 9.58333C22.9444 9.58333 22.6278 9.58333 22.3111 9.68889C22.1 9.68889 21.9944 9.79444 21.8889 9.9C21.6778 10.1111 21.6778 10.4278 21.8889 10.6389L22.4167 11.0611C22.8389 11.2722 23.2611 11.4833 23.5778 11.6944C24.1056 12.0111 24.6333 12.5389 24.7389 13.1722C24.95 14.1222 24.6333 14.9667 23.7889 15.6C23.2611 16.0222 23.05 16.2333 22.3111 16.2333C20.8333 16.2333 19.6722 16.3389 18.7222 16.0222C18.6167 16.2333 18.6167 16.2333 18.5111 16.1278V16.1278ZM14.8167 16.4444C14.9222 15.7056 14.9222 15.7056 15.0278 15.3889C15.5556 13.0667 16.0833 10.6389 16.5056 8.31667C16.6111 8.10556 16.6111 8 16.8222 8H18.7222C18.5111 9.26667 18.3 10.2167 17.9833 11.3778C17.6667 12.9611 17.35 14.5444 16.9278 16.1278C16.9278 16.3389 16.8222 16.3389 16.6111 16.3389L14.8167 16.4444ZM5 8.21111C5 8.10556 5.21111 8 5.31667 8H8.90556C9.43333 8 9.85556 8.31667 9.96111 8.84444L10.9111 13.4889C10.9111 13.5944 10.9111 13.5944 11.0167 13.7C11.0167 13.5944 11.1222 13.5944 11.1222 13.5944L13.3389 8.21111C13.2333 8.10556 13.3389 8 13.4444 8H15.6611C15.6611 8.10556 15.6611 8.10556 15.5556 8.21111L12.2833 15.9167C12.1778 16.1278 12.1778 16.2333 12.0722 16.3389C11.9667 16.4444 11.7556 16.3389 11.5444 16.3389H9.96111C9.85556 16.3389 9.75 16.3389 9.75 16.1278L8.06111 9.58333C7.85 9.37222 7.53333 9.05556 7.11111 8.95C6.47778 8.63333 5.31667 8.42222 5.10556 8.42222L5 8.21111Z" fill="white"></path></svg>`,
    },
];

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

            <ul className="sh-pay" role="list">
                {PAYMENTS.map((p) => (
                    <li key={p.name} aria-label={`${p.name} payment method`} dangerouslySetInnerHTML={{ __html: p.svg }} />
                ))}
            </ul>

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
                    <video src={IMG.wear1} loop muted autoPlay playsInline preload="metadata" />
                    <figcaption><b>Invisible under your clothes</b>Seamless edges, no ridges or lines. It disappears under dresses, jeans and leggings.</figcaption>
                </figure>
                <figure>
                    <video src={IMG.wear2} loop muted autoPlay playsInline preload="metadata" />
                    <figcaption><b>Stays put, morning to night</b>Soft and breathable, it molds to you and never rolls or bunches. Slip it on and forget it.</figcaption>
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