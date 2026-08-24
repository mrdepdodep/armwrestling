import './globals.css';
import '@/components/layout/layout.css';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'Arm Helper',
  description: 'Calculators and info for Arm Wrestling Simulator',
};

// Applies the saved theme before hydration to avoid a flash of the wrong theme.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('armHelper_theme');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

// Preloaded in the background on first visit so every image on the site is
// already cached by the browser before the user navigates to the page that uses it.
const preloadImages = [
  '/assets/atlantis-slime-bucket.png',
  '/assets/charm_coal.png',
  '/assets/charm_endless.png',
  '/assets/charm_infinite.png',
  '/assets/charm_leaderboard.png',
  '/assets/charm_loot.png',
  '/assets/charm_luck.png',
  '/assets/charm_training.jpg',
  '/assets/charm_winner.png',
  '/assets/crescent_charm.webp',
  '/assets/defender_charm.webp',
  '/assets/fishy-slime-bucket.png',
  '/assets/furnace-slime-bucket.png',
  '/assets/molten_machine.webp',
  '/assets/toxic-slime-bucket.png',
  '/assets/valentines-slime-bucket.png',
  '/assets/vibe-slime-bucket.png',
  '/assets/warfare_charm.webp',
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {preloadImages.map((src) => (
          <link
            key={src}
            rel="prefetch"
            as="image"
            href={src}
            fetchPriority="low"
          />
        ))}
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
