import Head from "next/head";
import { Inter, Pixelify_Sans } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

// Pixel font for the in-game UI, exposed as the --font-pixel CSS variable (used in globals.css).
const pixelFont = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

const SITE_TITLE = "Keith Tramm | Cozy Portfolio";
const SITE_DESCRIPTION = "Explore Keith Tramm's software projects by walking around an isometric pixel-art world built with Phaser and Next.js.";
// Link previews need an absolute image URL. Vercel sets this variable automatically on deploy.
const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "";
const PREVIEW_IMAGE = `${SITE_URL}/og-image.png`;

export default function Home() {
    return (
        <>
            <Head>
                <title>{SITE_TITLE}</title>
                <meta name="description" content={SITE_DESCRIPTION} />

                {/* Link previews (LinkedIn, Slack, Discord, X) */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={SITE_TITLE} />
                <meta property="og:description" content={SITE_DESCRIPTION} />
                <meta property="og:image" content={PREVIEW_IMAGE} />
                {SITE_URL && <meta property="og:url" content={SITE_URL} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={SITE_TITLE} />
                <meta name="twitter:description" content={SITE_DESCRIPTION} />
                <meta name="twitter:image" content={PREVIEW_IMAGE} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={`${styles.main} ${inter.className} ${pixelFont.variable}`}>
                <AppWithoutSSR />
            </main>
        </>
    );
}
