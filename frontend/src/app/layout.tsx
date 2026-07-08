import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/style/css/globals.css";
import { Providers } from "@/components/provider/Provider";
import { ToastContainer } from "react-toastify";
import TopLoaderProvider from "@/components/shared/TopLoader";
import Chatbot from "@/components/ui/chatbot/Chatbot";
import ChatbotButton from "@/components/ui/chatbot/ChatbotButton";

const bdoGrotesk = localFont({
  src: "../fonts/BDOGroteskVF.woff2",
  variable: "--font-bdo-grotesk",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Crisop",
  description: "Make healthy life with grocery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bdoGrotesk.variable} font-bdoGrotesk antialiased scroll-smooth`}
      >
        <ToastContainer position="top-center" />

        <Providers>
          <TopLoaderProvider>
            <>
              <Chatbot />
              <ChatbotButton />
              {children}
            </>
          </TopLoaderProvider>
        </Providers>
      </body>
    </html>
  );
}
