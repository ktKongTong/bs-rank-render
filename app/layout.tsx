// 'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from '@tanstack/react-query'

// const queryClient = new QueryClient()
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer
          src="https://analytics.us.umami.is/script.js"
          data-website-id="d049a9db-d66c-4e55-86ea-2971d1173830"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
