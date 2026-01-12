// DYNAMIC IMPORT FOR VERCEL
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export interface TypographyStyle {
    element: string;
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform: string;
    color: string;
    backgroundColor: string;
}

export interface WebsiteAnalysisResult {
    typography: TypographyStyle[];
    colors: string[];
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
    let browser: any;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        // Vercel / Production: Use Sparticuz Chromium
        browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar'),
            headless: chromium.headless,
        });
    } else {
        // Local: Use Standard Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            ],
            ignoreHTTPSErrors: true
        } as any);
    }
    const page = await browser.newPage();

    try {
        // Set a realistic User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const analysis = await page.evaluate(() => {
            const fontCounts: Record<string, number> = {};
            const uniqueFonts = new Map<string, any>();
            const colorCounts: Record<string, number> = {};

            function processElement(el: Element) {
                const style = window.getComputedStyle(el);

                // Typography
                // Create a signature for the font style
                const fontSig = `${style.fontFamily}-${style.fontWeight}-${style.fontSize}`;
                if (!uniqueFonts.has(fontSig) && style.display !== 'none' && style.visibility !== 'hidden') {
                    // Only keep if it has text content
                    if (el.textContent && el.textContent.trim().length > 0) {
                        uniqueFonts.set(fontSig, {
                            element: el.tagName.toLowerCase(),
                            fontFamily: style.fontFamily,
                            fontWeight: style.fontWeight,
                            fontSize: style.fontSize,
                            lineHeight: style.lineHeight,
                            letterSpacing: style.letterSpacing,
                            textTransform: style.textTransform,
                            color: style.color,
                            backgroundColor: style.backgroundColor
                        });
                    }
                }

                // Color counting (Heuristic: frequency implies palette importance)
                const color = style.color;
                const bg = style.backgroundColor;

                if (color && color !== 'rgba(0, 0, 0, 0)') {
                    colorCounts[color] = (colorCounts[color] || 0) + 1;
                }
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    colorCounts[bg] = (colorCounts[bg] || 0) + 1;
                }
            }

            // Walk the DOM
            // Walk the DOM - Limit to avoid timeout on large pages
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
            let currentNode = walker.currentNode;
            let count = 0;
            const MAX_NODES = 2000; // Cap at 2000 nodes for performance on Vercel

            while (currentNode && count < MAX_NODES) {
                processElement(currentNode as Element);
                currentNode = walker.nextNode() as Node;
                count++;
            }

            // Sort fonts by importance (Headings > Body) and limit
            // Actually, let's just return the unique ones found, prioritized by tag name
            const importantTags = ['h1', 'h2', 'h3', 'p', 'a', 'button'];
            const typography = Array.from(uniqueFonts.values())
                .filter(f => importantTags.includes(f.element) || parseInt(f.fontSize) > 14)
                .sort((a, b) => {
                    const scoreA = importantTags.indexOf(a.element) !== -1 ? importantTags.indexOf(a.element) : 99;
                    const scoreB = importantTags.indexOf(b.element) !== -1 ? importantTags.indexOf(b.element) : 99;
                    return scoreA - scoreB;
                })
                .slice(0, 8); // Top 8 distinct styles

            // Sort colors by frequency
            const topColors = Object.entries(colorCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10) // Top 10 colors
                .map(([color]) => color);

            return { typography, colors: topColors };
        });

        await browser.close();
        return analysis as WebsiteAnalysisResult;
    } catch (e) {
        console.error("Puppeteer Analysis Error:", e);
        // Attempt to close in case of error
        try { await browser.close(); } catch (err) { console.error("Failed to close browser:", err); }
        throw e;
    }
}
