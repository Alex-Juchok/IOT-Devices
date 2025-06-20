import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LocationsProvider } from "../app/context/LocationsContext";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Iot Devices",
  description: "Manage Internet of thing devices. Control devices, event, location, users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Toaster position="bottom-right" reverseOrder={false} />
         <ThemeProvider>
          <LocationsProvider>
            {children}
          </LocationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
