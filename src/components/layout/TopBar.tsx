import tactileManifestLogo from '../../assets/tactile-manifest-logo.png';
import tactileManifestLogoDark from '../../assets/tactile-manifest-logo-dark.svg';
import tactileManifestLogoTwo from '../../assets/tactile-manifest-logo-2.svg';
import tactileManifestLogoTwoDark from '../../assets/tactile-manifest-logo-2-dark.svg';

import { VinylPlayer } from '../audio/VinylPlayer';
import { WaitlistButton } from '../cta/WaitlistButton';

type TopBarProps = {
  side: 'left' | 'right';
  theme: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenWaitlist?: () => void;
};

export function TopBar({
  side,
  theme,
  onToggleTheme,
  onOpenWaitlist
}: TopBarProps) {
  if (side === 'left') {
    return (
      <header className="top-bar top-bar--left">
        <img
          className="brand-lockup brand-lockup--primary"
          src={theme === 'dark' ? tactileManifestLogoDark : tactileManifestLogo}
          alt="Tactile Manifesto beta"
        />

        <div className="top-bar__actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <WaitlistButton variant="topbar" onClick={onOpenWaitlist} />
        </div>
      </header>
    );
  }

  return (
    <header className="top-bar top-bar--right">
      <img
        className="brand-lockup brand-lockup--secondary"
        src={theme === 'dark' ? tactileManifestLogoTwoDark : tactileManifestLogoTwo}
        alt="Tactile Manifesto beta"
      />
      <div className="top-bar__media">
        <VinylPlayer compact />
      </div>
    </header>
  );
}
