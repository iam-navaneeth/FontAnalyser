export default function Footer() {
    return (
        <footer className="border-t border-border mt-auto py-8 bg-card/50">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
                <p>&copy; {new Date().getFullYear()} Font & Design Analyzer.</p>
                <p>
                    Product by <span className="font-semibold text-foreground">Webartstic Technosol</span>
                </p>
            </div>
        </footer>
    );
}
