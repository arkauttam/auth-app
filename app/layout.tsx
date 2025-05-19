import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Auth Portal",
  description: "Auth Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={rubik.className}
        id="main-content"
      >
          <QueryProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
      </body>
    </html>
  );
}
