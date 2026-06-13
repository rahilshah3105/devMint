import { useEffect, useRef } from 'react';

function loadAdSenseScript(client) {
  if (!client || typeof document === 'undefined') {
    return;
  }

  // Prevent loading the script multiple times
  const existingScript = document.querySelector('script[data-devmint-adsense="true"]');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.setAttribute('data-ad-client', client);
  script.setAttribute('data-devmint-adsense', 'true');
  document.head.appendChild(script);
}

export default function AdBanner({ client, slot, mode = 'dark', className = '', ariaLabel = 'Advertisement', minHeight = '90px' }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Only push ads if keys are valid and present
    const isPlaceholder = !client || !slot || client.includes('YOUR_PUBLISHER_ID') || slot === '1234567890' || slot === '0987654321';
    if (isPlaceholder || typeof window === 'undefined') {
      return;
    }

    loadAdSenseScript(client);

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad scripts can fail silently in dev or without a valid network connection.
    }
  }, [client, slot]);

  const isPlaceholder = !client || !slot || client.includes('YOUR_PUBLISHER_ID') || slot === '1234567890' || slot === '0987654321';

  // Fallback / Placeholder when environment variables are missing or default
  if (isPlaceholder) {
    return (
      <div
        className={`ad-banner ad-banner--placeholder ${className}`.trim()}
        role="note"
        aria-label={ariaLabel}
        style={{
          border: `1px dashed ${mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
          borderRadius: '12px',
          padding: '16px',
          minHeight,
          background: mode === 'dark' ? 'rgba(24, 24, 27, 0.5)' : 'rgba(255, 255, 255, 0.6)',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          fontSize: '0.85rem',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Advertisement Space
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
          Live ads will appear here once VITE_ADSENSE_CLIENT_ID and slot IDs are configured.
        </span>
      </div>
    );
  }

  // Live Google Ad
  return (
    <div className={`ad-banner ${className}`.trim()} aria-label={ariaLabel} style={{ minHeight, width: '100%', margin: '0 auto' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight, width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
