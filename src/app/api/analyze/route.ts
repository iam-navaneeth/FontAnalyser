import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/analysis/website';
import { analyzeImage } from '@/lib/analysis/image';
import { analyzePDF } from '@/lib/analysis/pdf';

// Set max duration to 60 seconds (Vercel Pro/Hobby limit)
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, url } = body;

        console.log(`Analyzing: ${type} - ${url?.substring(0, 50)}...`);

        if (type === 'website' && url) {
            if (!url.startsWith('http')) {
                return NextResponse.json({ error: "Invalid URL. Must start with http:// or https://" }, { status: 400 });
            }
            try {
                const data = await analyzeWebsite(url);
                return NextResponse.json(data);
            } catch (innerError: any) {
                console.error("Website analysis failed internally:", innerError);
                return NextResponse.json({
                    error: "Website analysis failed",
                    details: innerError.message || String(innerError)
                }, { status: 500 });
            }
        }

        if (type === 'image' && url) {
            try {
                const data = await analyzeImage(url);
                return NextResponse.json(data);
            } catch (innerError: any) {
                console.error("Image analysis failed internally:", innerError);
                return NextResponse.json({
                    error: "Image analysis failed",
                    details: innerError.message
                }, { status: 500 });
            }
        }

        if (type === 'pdf' && url) {
            try {
                const data = await analyzePDF(url);
                return NextResponse.json(data);
            } catch (innerError: any) {
                console.error("PDF analysis failed internally:", innerError);
                return NextResponse.json({
                    error: "PDF analysis failed",
                    details: innerError.message
                }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    } catch (error) {
        console.error("SERVER ANALYSIS CRITICAL ERROR:", error);
        return NextResponse.json({
            error: "Server Analysis Failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
