import Link from "next/link";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-grow flex items-center justify-center px-6 relative z-10">
        <div className="text-center">
          <h1 className="font-display text-[15vw] leading-none text-white/5 select-none">
            404
          </h1>
          <div className="relative -mt-12 md:-mt-20">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
              Lost in the Void
            </h2>
            <p className="font-sans text-sm text-platinum/50 tracking-widest mb-10 max-w-md mx-auto">
              THE COORDINATES YOU SEEK DO NOT EXIST IN THIS REALITY.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] text-hologram hover:text-white transition-colors uppercase border-b border-hologram/30 pb-1 hover:border-white"
            >
              Return to Base
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

