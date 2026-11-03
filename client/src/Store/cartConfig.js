import { getProductBySlug } from './Products/Products';

/* ------------------------------------------------------------------ */
/*  Deal configuration                                                 */
/* ------------------------------------------------------------------ */
export const BOGO_SLUGS = ['Glowbeam-sculpt-brief']; // Buy 1 Get 1 Free
export const MAIN_SLUGS = ['Glowbeam-sculpt-brief']; // products that unlock free gifts
export const UPSELL_ADDONS = ['belly-brush', 'flat-belly-ebook']; // shown in "You Might Also Like"

const round2 = (n) => +Number(n).toFixed(2);

/* ------------------------------------------------------------------ */
/*  Images / colors                                                    */
/* ------------------------------------------------------------------ */
// The cart shows the exact image for the selected color
export const COLOR_IMAGES = {
    Black: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915233/hf_20260831_132809_47a4a29b-6df6-4e44-909f-db4ef68a1cb3.png',
    Beige: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915264/hf_20260831_132821_6e58af11-3748-4e69-8ae0-f98574666aa8.png',
    Navy: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915325/hf_20260831_132836_44947fba-5c73-44f8-b8fc-e79f1d7e0197.png',
    Lilac: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915445/hf_20260831_132846_a5faca2e-1c7d-4199-a287-93266a3b6e47.png',
    Purple: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915527/hf_20260831_133028_8b701cf5-ba9d-4e01-91d6-be2660c9690c.png',
    Violet: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792915554/hf_20260831_132853_b47d758f-b612-4d26-9f5c-e1b537950930.png',
};

export const COLOR_HEX = {
    'Black': '#000000',
    'Beige': '#e8d5a3',
    'Dark Gray': '#4a5558',
    'Light Gray': '#d9d9d9',
    'Lavender': '#c5c8f0',
    'Turquoise': '#12b3f0',
    'Fuchsia pink': '#e0116f',
    'Raspberry': '#a0426f',
    'Teal': '#7fc6c0',
    'Sky Blue': '#18b9f0',
    'Pink': '#f4b6cc',
    'Grey': '#9ca3a8',
    'Navy Blue': '#1f2a4d',
    'Coffee': '#6b4a3a',
    'Navy': '#1c1c96',
    'Lilac': '#e2c9f1',
    'Purple': '#a43fcf',
    'Violet': '#e20d72',
};

/* ------------------------------------------------------------------ */
/*  Non-catalog items shown in the drawer                              */
/* ------------------------------------------------------------------ */
export const ADDONS = {
    'belly-brush': {
        id: 'belly-brush',
        slug: 'lymphatic-body-brush',
        name: 'Belly Sculpt Brush',
        price: 2785.9,
        compare: 6442.28,
        image: 'https://res.cloudinary.com/fozdhxik/image/upload/v1792919369/13_200x200_4e0b8349-d68d-4d88-805a-a460974ffabb.png',
        tag: 'Special offer',
        description: 'The brief holds you in, the brush de-bloats and firms from the outside. Two minutes a day, made to pair with your Sculpt Brief.',
        bullets: ['Gentle lymphatic massage bristles', '2 minutes a day', 'Works on belly, thighs and arms'],
    },
    'flat-belly-ebook': {
        id: 'flat-belly-ebook',
        slug: 'e-book-the-flat-belly-method-your-simple-guide-to-a-flatter-firmer-lower-belly',
        name: 'E-Book: The Flat Belly Method — Your simple guide to a flatter, firmer lower belly',
        price: 0,
        compare: 4219.84,
        image: 'https://saybeam.com/cdn/shop/files/hf_20260628_062226_f031e89c-5f4d-4ce4-9f1f-7244a5abae1b.png?v=1782627998',
        tag: 'FREE GIFT',
        gift: true,
        maxQty: 1,
        description: 'A simple step-by-step guide to a flatter, firmer lower belly, made to go with your Sculpt Brief.',
        bullets: ['Instant digital download', 'Easy daily routine', 'Free with any Sculpt Brief order'],
    },
    'gift-card': {
        id: 'gift-card',
        name: '$10 Gift Card',
        price: 0, // free only while a main product is in the cart (see applyGifts)
        compare: 2807.84,
        image: 'https://saybeam.com/cdn/shop/files/hf_20260701_140626_e734817e-4fad-4492-9ca5-23a6a67f23aa.png?v=1782914958',
        tag: 'FREE GIFT',
        gift: true,
        maxQty: 1,
    },
};

// "You Might Also Like": fixed discount per product
export const UPSELL_OFF = {
    'sculpt-leggings-stay-up': 5626.45,
    'sculpt-shorts-no-ride-up': 4219.84,
    'sculpt-bra-wireless-lift': 4219.84,
    'sculpt-pant-flat-front': 4219.84,
};

export const upsellPrice = (p) => {
    if (!p || typeof p.price !== 'number') return 0;
    const off = UPSELL_OFF[p.slug] || 0;
    return round2(Math.max(0, p.price - off));
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const thumb = (url) =>
    typeof url === 'string' ? url.replace(/width=\d+/, 'width=200') : url;

const isMain = (l) => l && l.type === 'product' && MAIN_SLUGS.includes(l.id);

/* ------------------------------------------------------------------ */
/*  Resolve one stored line into a display line                        */
/* ------------------------------------------------------------------ */
export const resolveLine = (line) => {
    if (!line) return null;

    // ---- Add-ons (brush, e-book, gift card) ----
    if (line.type === 'addon') {
        const a = ADDONS[line.id];
        if (!a) return null;

        const maxQty = a.maxQty || 99;
        const qty = Math.min(line.qty || 1, maxQty); // gifts can't stack past maxQty

        return {
            ...line,
            qty,
            name: a.name,
            image: a.image,
            variant: '',
            unit: a.price,
            compare: round2(a.compare * qty),
            paid: round2(a.price * qty),
            tag: a.tag,
            gift: !!a.gift,
            maxQty,
        };
    }

    // ---- Catalog products ----
    const p = getProductBySlug(line.id);
    if (!p) return null;

    // Exact image for the selected color, else gallery, else product image
    const colorImg = COLOR_IMAGES[line.color];
    const idx = p.colorImages?.[line.color];
    const fallbackImg = idx !== undefined ? p.gallery?.[idx] : p.gallery?.[0];
    const image = thumb(colorImg || fallbackImg || p.image);

    const variant = [line.color, line.size].filter(Boolean).join(', ');
    const qty = line.qty || 1;

    let unit = p.price;
    let tag = '';
    if (line.deal === 'upsell') {
        unit = upsellPrice(p);
        tag = 'Special offer';
    }

    return {
        ...line,
        qty,
        name: p.name,
        image,
        variant,
        unit,
        compare: round2(p.price * qty),
        paid: round2(unit * qty), // BOGO discount is applied in applyBogo
        tag,
        gift: false,
        maxQty: 99,
    };
};

/* ------------------------------------------------------------------ */
/*  Cart-level rules                                                   */
/* ------------------------------------------------------------------ */

// Buy 1 Get 1 Free, counted across colors/sizes of the same product.
export const applyBogo = (lines) => {
    if (!Array.isArray(lines)) return [];

    const out = lines.map((l) => ({ ...l }));

    BOGO_SLUGS.forEach((slug) => {
        const group = out.filter(
            (l) => l && l.type === 'product' && l.id === slug && !l.deal
        );

        let free = Math.floor(group.reduce((n, l) => n + (l.qty || 0), 0) / 2);
        if (!free) return;

        group.forEach((l) => {
            if (typeof l.unit !== 'number' || free <= 0) return;

            const f = Math.min(free, l.qty);
            l.paid = round2(l.unit * (l.qty - f));
            l.tag = 'BUY 1 GET 1 FREE';
            free -= f;
        });
    });

    return out;
};

// Gifts are only free while a main product is in the cart.
// Without one, they show (and charge) their full price.
export const applyGifts = (lines) => {
    if (!Array.isArray(lines)) return [];
    if (lines.some(isMain)) return lines;

    return lines.map((l) =>
        l.gift
            ? {
                ...l,
                gift: false,
                unit: round2(l.compare / l.qty),
                paid: l.compare,
                tag: '',
            }
            : l
    );
};

// Price shown on the "You Might Also Like" add-on cards
export const addonDisplayPrice = (a, hasMain) =>
    a.gift ? (hasMain ? 0 : a.compare) : a.price;

export const resolveCart = (lines = []) =>
    applyGifts(applyBogo(lines.map(resolveLine).filter(Boolean)));

export const cartTotals = (lines = []) => {
    const resolved = lines.every((l) => typeof l?.unit === 'number')
        ? lines
        : resolveCart(lines);

    return resolved.reduce(
        (acc, l) => {
            acc.compare += l.compare || 0;
            acc.paid += l.paid || 0;
            acc.qty += l.qty || 0;
            return acc;
        },
        { compare: 0, paid: 0, qty: 0 }
    );
};
export const getAddonBySlug = (slug) =>
    Object.values(ADDONS).find((a) => a.slug === slug && !a.hidden);