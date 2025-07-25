import "@/styles/globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import MainHeader from "@/components/headers/main-header";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { Pacifico, Caveat } from "next/font/google";
import { NotificationsProvider } from "@/contexts/notifications-context";

const Nunito = localFont({
  src: "../fonts/Nunito-VariableFont.ttf",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400", // or ['400'] for multiple
  variable: "--font-pacifico",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adkins Ninja Blog",
  description: "A dynamic and personalized blog experience.",
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
          autoCapitalize="words"
        />
      </head>
      <body className={`antialiased ${Nunito.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <NotificationsProvider>
              <MainHeader />
              <Toaster richColors position="top-center" />
              {children}
            </NotificationsProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
