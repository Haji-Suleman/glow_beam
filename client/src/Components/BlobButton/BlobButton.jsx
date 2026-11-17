import "./BlobButton.css";

export default function BlobButton({ href, children, className = "", ...props }) {
    const Tag = href ? "a" : "button";

    return (
        <Tag className={`blob-btn ${className}`} href={href} {...props}>
            {children}
            <span className="blob-btn__inner">
                <span className="blob-btn__blobs">
                    <span className="blob-btn__blob" />
                    <span className="blob-btn__blob" />
                    <span className="blob-btn__blob" />
                    <span className="blob-btn__blob" />
                </span>
            </span>
        </Tag>
    );
}

// The gooey SVG filter. Render this ONCE in your app (see step 3).
export function GooFilter() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0"
            height="0"
            style={{ position: "absolute" }}
            aria-hidden="true"
        >
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
                        result="goo"
                    />
                    <feBlend in2="goo" in="SourceGraphic" result="mix" />
                </filter>
            </defs>
        </svg>
    );
}