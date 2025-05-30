import Link from "next/link";

import "./globals.css";
import { satoshi_sans } from "@/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi_sans.variable}`}>
        <div className="border-b h-16 flex space-x-4 items-center justify-center text-2xl font-bold text-black/40 p-8">
          <Link className="hover:text-black/80" href="/">Explore</Link>
          <span className="text-2xl" >&#xB7;</span>
          <Link className="hover:text-black/80" href="/moments">Moments</Link>
        </div>
        {children}
      </body>
    </html >
  );
}
