import { useCallback, useEffect, useState } from "react";
import { COUNTRY_CODES } from "./Countries.js";

const STORAGE_KEY = "country";

function readSaved() {
    try {
        const code = localStorage.getItem(STORAGE_KEY);
        return COUNTRY_CODES.includes(code) ? code : null;
    } catch {
        return null;
    }
}

// Quick guess from the browser language, e.g. "en-PK" gives "PK".
// Plain "en" has no country, so it returns null.
function regionFromBrowser() {
    try {
        for (const lang of navigator.languages || [navigator.language]) {
            const region = new Intl.Locale(lang).region;
            if (region && COUNTRY_CODES.includes(region)) return region;
        }
    } catch {
        /* ignore */
    }
    return null;
}

/**
 * Returns [country, chooseCountry].
 * Order: 1) what the visitor picked before, 2) your backend (/api/country),
 *        3) the browser language, 4) the fallback.
 */
export default function useCountry({ apiUrl = "/api/country", fallback = "US" } = {}) {
    const [country, setCountry] = useState(() => readSaved() || regionFromBrowser() || fallback);

    useEffect(() => {
        if (readSaved()) return undefined; // the visitor already chose, so do not override it

        const controller = new AbortController();
        fetch(apiUrl, { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && COUNTRY_CODES.includes(data.country)) setCountry(data.country);
            })
            .catch(() => {
                /* no backend answer: keep the browser guess */
            });

        return () => controller.abort();
    }, [apiUrl]);

    const chooseCountry = useCallback((code) => {
        setCountry(code);
        try {
            localStorage.setItem(STORAGE_KEY, code);
        } catch {
            /* private mode: the choice just will not be remembered */
        }
    }, []);

    return [country, chooseCountry];
}