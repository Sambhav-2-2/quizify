import ThemeProvider from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";
import "./globals.css";

export const metadata = {
  title: "Quizify",
  description: "Quizify is a platform for creating and taking quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider> {children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
