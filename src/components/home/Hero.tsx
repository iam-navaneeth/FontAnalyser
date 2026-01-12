"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="container px-6 mx-auto relative z-10 text-center">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Identify Fonts & <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">Design Styles</span> Instantly
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    The ultimate tool for designers and developers. Extract typography, colors, and styling from Websites, Images, and PDFs with professional precision.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                        Start Analyzing <ArrowRight size={20} />
                    </button>
                    <button className="px-8 py-4 rounded-full bg-card border border-border text-foreground font-semibold hover:bg-secondary/10 transition-all flex items-center justify-center">
                        View Demo
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
