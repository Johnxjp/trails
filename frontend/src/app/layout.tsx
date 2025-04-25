import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="h-16 flex space-x-4 items-center justify-center text-2xl font-bold text-black/40 p-10">
          <Link className="hover:text-black/80" href="/">Explore</Link>
          <span className="text-6xl" >&#xB7;</span>
          <Link className="hover:text-black/80" href="/trails">Trails</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
