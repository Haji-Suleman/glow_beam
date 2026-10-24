// All countries and territories (ISO 3166-1 alpha-2 codes).
// Delete any country you do not ship to and it disappears from the selector.
export const COUNTRY_CODES = [
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ",
    "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ",
    "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR",
    "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY",
    "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP",
    "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
    "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
    "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM",
    "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA",
    "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ",
    "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
    "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW",
];

// The currency you show prices in for each country.
// Any country not listed here shows STORE_CURRENCY. Check this list before launch.
export const STORE_CURRENCY = "USD";

const EURO = ["AD", "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MC", "ME", "MT", "NL", "PT", "SI", "SK", "SM", "VA"];

const CURRENCY_BY_COUNTRY = {
    PK: "PKR", US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", IN: "INR",
    AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR",
    JP: "JPY", CN: "CNY", HK: "HKD", SG: "SGD", MY: "MYR", KR: "KRW",
    TH: "THB", PH: "PHP", ID: "IDR", VN: "VND", BD: "BDT", LK: "LKR",
    CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF",
    TR: "TRY", ZA: "ZAR", NG: "NGN", KE: "KES", EG: "EGP", MX: "MXN", BR: "BRL",
    ...Object.fromEntries(EURO.map((code) => [code, "EUR"])),
};

export function currencyFor(code) {
    return CURRENCY_BY_COUNTRY[code] || STORE_CURRENCY;
}

function currencySymbol(currency, locale) {
    try {
        const parts = new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            currencyDisplay: "narrowSymbol",
        }).formatToParts(0);
        return parts.find((p) => p.type === "currency")?.value || currency;
    } catch {
        return currency;
    }
}

export function countryName(code, locale = "en") {
    try {
        return new Intl.DisplayNames([locale], { type: "region" }).of(code) || code;
    } catch {
        return code;
    }
}

// Ready-made options for the <select>, sorted A to Z, e.g. "Pakistan (PKR Rs)"
export function buildCountryOptions(locale = "en") {
    return COUNTRY_CODES.map((code) => {
        const currency = currencyFor(code);
        return {
            code,
            name: countryName(code, locale),
            label: `${countryName(code, locale)} (${currency} ${currencySymbol(currency, locale)})`,
        };
    }).sort((a, b) => a.name.localeCompare(b.name, locale));
}