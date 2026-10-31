// Sent with every response
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // Stops other sites from embedding the portfolio in a frame
    { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

export default nextConfig;
