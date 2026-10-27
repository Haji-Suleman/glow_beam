import { getProductBySlug } from './Products/Products';

export const BOGO_SLUGS = ['glowbeam-sculpt-brief']; // Buy 1 Get 1 Free

// Non-catalog items shown in the drawer (add your Cloudinary URLs)
export const ADDONS = {
    'belly-brush': {
        id: 'belly-brush',
        name: 'Belly Sculpt Brush',
        price: 2785.9,
        compare: 6442.28,
        image: '/images/belly-brush.png',
        tag: 'Special offer',
    },
    'flat-belly-ebook': {
        id: 'flat-belly-ebook',
        name: 'E-Book: The Flat Belly Method — Your simple guide to a flatter, firmer lower belly',
        price: 0,
        compare: 4219.84,
        image: '/images/flat-belly-ebook.png',
        tag: 'FREE GIFT',
        gift: true,
        maxQty: 1,
    },
};

// "You Might Also Like": fixed discount per product (pant value is a guess)
export const UPSELL_OFF = {
    'sculpt-leggings-stay-up': 5626.45,
    'sculpt-shorts-no-ride-up': 4219.84,
    'sculpt-bra-wireless-lift': 4219.84,
    'sculpt-pant-flat-front': 4219.84,
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
};

export const upsellPrice = (p) => +(p.price - (UPSELL_OFF[p.slug] || 0)).toFixed(2);

const thumb = (url) => (url ? url.replace(/width=\d+/, 'width=200') : url);

// Turns a stored line {key,type,id,color,size,qty,deal} into display + price data
export const resolveLine = (line) => {
    if (line.type === 'addon') {
        const a = ADDONS[line.id];
        if (!a) return null;
        return {
            ...line,
            name: a.name,
            image: a.image,
            variant: '',
            unit: a.price,
            compare: a.compare * line.qty,
            paid: a.price * line.qty,
            tag: a.tag,
            gift: !!a.gift,
            maxQty: a.maxQty || 99,
        };
    }

    const p = getProductBySlug(line.id);
    if (!p) return null;

    const idx = p.colorImages?.[line.color];
    const image = thumb(idx !== undefined ? p.gallery[idx] : p.image);
    const variant = [line.color, line.size].filter(Boolean).join(', ');

    let unit = p.price;
    let tag = '';
    if (line.deal === 'upsell') {
        unit = upsellPrice(p);
        tag = 'Special offer';
    }

    const bogo = BOGO_SLUGS.includes(p.slug);
    const compare = p.price * line.qty;
    const paid = bogo ? p.price * Math.ceil(line.qty / 2) : unit * line.qty;
    if (bogo) tag = 'BUY 1 GET 1 FREE';

    return { ...line, name: p.name, image, variant, unit, compare, paid, tag, gift: false, maxQty: 99 };
};