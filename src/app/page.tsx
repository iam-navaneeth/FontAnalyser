"use client";
import { useState } from "react";
import Hero from "@/components/home/Hero";
import InputSection from "@/components/home/InputSection";
import AnalysisResults from "@/components/results/AnalysisResults";
import { WebsiteAnalysisResult } from "@/lib/analysis/website";

export default function Home() {
  const [results, setResults] = useState<WebsiteAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (type: string, data: string | File) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url: data })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const resultData = await response.json();
      setResults(resultData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Hero />
      <InputSection onAnalyze={handleAnalysis} isAnalyzing={isLoading} />

      <section className="container mx-auto px-6 py-12">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-center max-w-2xl mx-auto mb-8">
            {error}
          </div>
        )}

        {results && <AnalysisResults results={results} />}
      </section>
    </div>
  );
}
