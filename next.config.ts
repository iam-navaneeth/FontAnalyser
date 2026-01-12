import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "tesseract.js", "pdf-parse", "@sparticuz/chromium-min", "puppeteer-core"],
};

export default nextConfig;
