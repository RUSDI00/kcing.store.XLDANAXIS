import React, { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  theme?: 'light' | 'dark';
  action?: string;
  style?: React.CSSProperties;
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ siteKey, onVerify, theme = 'light', action = 'submit', style }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Cloudflare Turnstile script if not already present
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Render widget after script loads
    const renderWidget = () => {
      if ((window as any).turnstile && ref.current) {
        (window as any).turnstile.render(ref.current, {
          sitekey: siteKey,
          theme,
          action,
          callback: (token: string) => onVerify(token),
        });
      }
    };

    if ((window as any).turnstile) {
      renderWidget();
    } else {
      window.addEventListener('turnstile-loaded', renderWidget);
      return () => window.removeEventListener('turnstile-loaded', renderWidget);
    }
  }, [siteKey, theme, action, onVerify]);

  return <div ref={ref} style={style} />;
};

export default TurnstileWidget;
