import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Home",
    template: "%s | BloodDonor",
  },
  description: "Connect with blood donors and help save lives with BloodDonor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme ="light"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
