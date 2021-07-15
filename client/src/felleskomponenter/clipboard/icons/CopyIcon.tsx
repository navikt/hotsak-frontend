import React from 'react';

const CopyIcon = ({ width = 24, height = 24, stroke = 'var(--navds-color-text-primary)' }) => {
    return (
        <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 24 24">
            <g
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <g transform="translate(4.000000, 2.000000)" stroke={stroke} strokeWidth="1.5">
                    <polygon points="4.4408921e-14 19.1729323 4.4408921e-14 4.5112782 10.1503759 4.5112782 10.1503759 19.1729323" />
                    <polyline points="5.63909774 2.19924812 5.63909774 -2.69118061e-13 15.7894737 -2.69118061e-13 15.7894737 14.6616541 13.2518797 14.6616541" />
                </g>
            </g>
        </svg>
    );
};

export default CopyIcon;
