import "./globals.css";

export const metadata = {
  title: "Character Generator Pro",
  description: "AI-powered character image generator using Groq and Replicate Nano Banana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
