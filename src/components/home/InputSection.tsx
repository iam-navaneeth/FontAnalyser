"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Image as ImageIcon, FileText, Upload, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisType = "website" | "image" | "pdf";

interface InputSectionProps {
    onAnalyze: (type: "website" | "image" | "pdf", data: string | File) => void;
    isAnalyzing: boolean;
}

export default function InputSection({ onAnalyze, isAnalyzing }: InputSectionProps) {
    const [activeTab, setActiveTab] = useState<AnalysisType>("website");
    const [url, setUrl] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            onAnalyze(activeTab as "image" | "pdf", base64);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = () => {
        if (activeTab === 'website') {
            onAnalyze('website', url);
        }
    };

    return (
        <section className="py-12 -mt-10 relative z-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab("website")}
                            className={cn(
                                "flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 outline-none",
                                activeTab === "website" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <Globe size={18} /> Website URL
                        </button>
                        <button
                            onClick={() => setActiveTab("image")}
                            className={cn(
                                "flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 outline-none",
                                activeTab === "image" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <ImageIcon size={18} /> Upload Image
                        </button>
                        <button
                            onClick={() => setActiveTab("pdf")}
                            className={cn(
                                "flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 outline-none",
                                activeTab === "pdf" ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <FileText size={18} /> Upload PDF
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[200px] flex flex-col justify-center bg-card">
                        <AnimatePresence mode="wait">
                            {activeTab === "website" && (
                                <motion.div
                                    key="website"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="w-full"
                                >
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Enter Website URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            className="flex-1 px-4 py-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={!url || isAnalyzing}
                                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                                        >
                                            {isAnalyzing ? "Analyzing..." : <><Search size={18} /> Analyze</>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {(activeTab === "image" || activeTab === "pdf") && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl py-10 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {isAnalyzing ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> : <Upload className="text-primary w-8 h-8" />}
                                    </div>
                                    <p className="text-lg font-medium text-foreground">{isAnalyzing ? "Analyzing..." : "Click to upload or drag and drop"}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {activeTab === "image" ? "JPG, PNG, WebP (Max 10MB)" : "PDF Documents (Max 20MB)"}
                                    </p>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept={activeTab === "image" ? "image/*" : "application/pdf"}
                                        onChange={handleFileChange}
                                        disabled={isAnalyzing}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
