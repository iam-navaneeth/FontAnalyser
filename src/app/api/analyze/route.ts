import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/analysis/website';
import { analyzeImage } from '@/lib/analysis/image';
import { analyzePDF } from '@/lib/analysis/pdf';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, url } = body;

        if (type === 'website' && url) {
            if (!url.startsWith('http')) {
                return NextResponse.json({ error: "Invalid URL. Must start with http:// or https://" }, { status: 400 });
            }
            const data = await analyzeWebsite(url);
            return NextResponse.json(data);
        }

        if (type === 'image' && url) {
            const data = await analyzeImage(url);
            return NextResponse.json(data);
        }

        if (type === 'pdf' && url) {
            const data = await analyzePDF(url);
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    } catch (error) {
        console.error("SERVER ANALYSIS ERROR:", error);
        return NextResponse.json({
            error: "Analysis failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
