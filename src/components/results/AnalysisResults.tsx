"use client";
import { motion } from "framer-motion";
import { Copy, Layers, Download } from "lucide-react";
import { TypographyStyle, WebsiteAnalysisResult } from "@/lib/analysis/website";

interface AnalysisResultsProps {
    results: WebsiteAnalysisResult;
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `font-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-end">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors font-medium"
                >
                    <Download size={18} /> Download Report
                </button>
            </div>
            {/* Typography Section */}
            <section>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">Aa</span>
                    Typography Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.typography.map((font, idx) => (
                        <motion.div
                            key={`${font.element}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
                                    {font.element}
                                </span>
                                <button className="text-muted-foreground hover:text-foreground transition-colors" title="Copy styles">
                                    <Copy size={16} />
                                </button>
                            </div>

                            <div className="mb-4">
                                {/* Preview */}
                                <p style={{
                                    fontFamily: font.fontFamily,
                                    fontWeight: font.fontWeight,
                                    fontSize: '1.5rem', // Fixed for card preview, or use real? Real might be too big.
                                    lineHeight: font.lineHeight,
                                }} className="truncate">
                                    The quick brown fox
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 truncate">{font.fontFamily}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="text-muted-foreground">Weight</div>
                                <div className="font-medium text-right">{font.fontWeight}</div>

                                <div className="text-muted-foreground">Size</div>
                                <div className="font-medium text-right">{font.fontSize}</div>

                                <div className="text-muted-foreground">Color</div>
                                <div className="font-medium text-right flex items-center justify-end gap-1">
                                    <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: font.color }}></span>
                                    {font.color}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Colors Section */}
            <section>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <Layers size={21} />
                    </span>
                    Color Palette
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.colors.map((color, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative aspect-square rounded-2xl border border-border shadow-sm overflow-hidden cursor-pointer"
                            style={{ backgroundColor: color }}
                        >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-background/90 text-foreground text-xs font-bold px-2 py-1 rounded shadow-lg uppercase">
                                    {color}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
