import Head from "next/head";
import { Inter, Pixelify_Sans } from "next/font/google";
import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

// Pixel font for the in-game UI, exposed as the --font-pixel CSS variable (used in globals.css).
const pixelFont = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>My Cozy Portfolio</title>
                <meta name="description" content="An isometric interactive portfolio built with Phaser and Next.js." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={`${styles.main} ${inter.className} ${pixelFont.variable}`}>
                <AppWithoutSSR />
            </main>
        </>
    );
}
