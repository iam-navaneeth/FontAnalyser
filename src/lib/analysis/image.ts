import { WebsiteAnalysisResult } from './website';
import puppeteer from 'puppeteer';
import Tesseract from 'tesseract.js';

export async function analyzeImage(base64Image: string): Promise<WebsiteAnalysisResult> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // 1. Text Extraction (OCR)
        // Remove header for buffer if needed, but Tesseract handles base64 string usually.
        const { data: { text } } = await Tesseract.recognize(base64Image, 'eng', {
            logger: m => console.log(m)
        });

        // 2. Color Extraction using Puppeteer Canvas
        const page = await browser.newPage();
        const colors = await page.evaluate(async (imgSrc) => {
            return new Promise<string[]>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { resolve([]); return; }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Advanced Color Extraction: Histogram Analysis
                    // We scan pixels (with a step to save perf) and count frequencies
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    const colorMap: Record<string, number> = {};
                    const step = 20; // Check every 20th pixel for performance

                    for (let i = 0; i < data.length; i += 4 * step) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        if (a < 128) continue; // Skip transparent

                        // Group similar colors (reduce bit depth)
                        const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
                        colorMap[key] = (colorMap[key] || 0) + 1;
                    }

                    // Sort by frequency
                    const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);

                    // Take top 8 prominent colors, converting back to Hex
                    const results = sorted.slice(0, 8).map(([key]) => {
                        const [r, g, b] = key.split(',').map(Number);
                        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                    });

                    resolve(results);
                };
                img.onerror = reject;
                img.src = imgSrc;
            });
        }, base64Image);

        await browser.close();

        // Mock typography result based on OCR
        // OCR gives us text, but not font family.
        // We will return a generic font result.
        return {
            typography: [{
                element: "Detected Text",
                fontFamily: "Unknown (Image Source)",
                fontWeight: "Regular",
                fontSize: "Varied",
                lineHeight: "Normal",
                letterSpacing: "Normal",
                textTransform: "None",
                color: "N/A",
                backgroundColor: "N/A"
            }],
            colors: colors
        };

    } catch (error) {
        await browser.close();
        throw error;
    }
}
