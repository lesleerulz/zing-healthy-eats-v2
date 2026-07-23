"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin and auth pages
  if (pathname === "/auth" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#1C1816] text-[#EBE5D9] pt-20 pb-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#EBE5D9]/10 pb-16">
        
        {/* Brand Section */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold italic tracking-tight text-[#D4A373]">
            Zing Healthy Treats.
          </h2>
          <p className="text-sm text-[#EBE5D9]/70 max-w-sm leading-relaxed">
            Raw, roasted, and real. Artisanal granola, trail mixes, and breakfast nuts baked in small batches for the unmistakable crunch.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#EBE5D9]/50">Explore</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="text-sm hover:text-[#D4A373] transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/catalog" className="text-sm hover:text-[#D4A373] transition-colors">Shop the Pantry</Link>
            </li>
            <li>
              <Link href="/subscribe" className="text-sm hover:text-[#D4A373] transition-colors">Subscriptions</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#EBE5D9]/50">Connect</h3>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-sm hover:text-[#D4A373] transition-colors">Instagram</a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-[#D4A373] transition-colors">Facebook</a>
            </li>
            <li>
              <a href="mailto:hello@zinghealthytreats.com" className="text-sm hover:text-[#D4A373] transition-colors">hello@zinghealthytreats.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#EBE5D9]/40">
        <p>&copy; {new Date().getFullYear()} Zing Healthy Treats. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#D4A373] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#D4A373] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
