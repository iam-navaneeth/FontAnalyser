"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Type } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white group-hover:bg-accent transition-colors duration-300">
                        <Type size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground">
                        Font<span className="text-primary group-hover:text-accent transition-colors duration-300">Analyzer</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Placeholder for future auth or github link */}
                    <div className="text-sm text-muted-foreground">v1.0.0</div>
                </div>
            </div>
        </nav>
    );
}
