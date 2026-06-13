# Google AdSense React Integration Guide

This guide details all the necessary steps and code snippets required to integrate Google AdSense into a React application, including handling placeholder states and environment variables for local and production builds.

## 1. The AdSense Global Script (`public/index.html`)
Google needs to verify your site. Place the global AdSense `<script>` tag inside the `<head>` of your `public/index.html` file.

```html
<head>
  <!-- Other meta tags... -->
  <title>Your App Title</title>
  
  <!-- Google AdSense verification code -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
    crossorigin="anonymous"></script>
</head>
```

## 2. Ads.txt (`public/ads.txt`)
Create an `ads.txt` file in your `public` folder. Google uses this to verify authorized sellers. It must exactly follow this format:

```text
google.com, pub-YOUR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```
*(Note: Remove the `ca-` prefix when adding your publisher ID here, it should start with `pub-`)*

## 3. Environment Variables (`.env` and `.env.example`)
Store your AdSense IDs in environment variables to prevent hardcoding them and to easily toggle ads across different environments. 

**`.env.example`** (Commit this to your repo to show developers what keys are needed)
```env
# Google AdSense Client ID (Your publisher ID)
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-YOUR_PUBLISHER_ID

# AdSense Slot IDs for different placements
REACT_APP_ADSENSE_TOP_SLOT=1234567890
REACT_APP_ADSENSE_SIDE_SLOT=0987654321
```

**`.env`** (Do NOT commit this to your repo - it goes in your `.gitignore`)
Copy `.env.example` to `.env` locally and fill in your actual keys.

## 4. Reusable AdBanner Component (`src/components/AdBanner.js`)
This is a reusable React component that will display the live ad if the environment variables are present, or a styled placeholder ("Ad space reserved") during local development when the keys might be missing.

```jsx
import React, { useEffect, useRef } from 'react';

function loadAdSenseScript(client) {
  if (!client || typeof document === 'undefined') {
    return;
  }

  // Prevent loading the script multiple times
  const existingScript = document.querySelector('script[data-textmint-adsense="true"]');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.setAttribute('data-ad-client', client);
  script.setAttribute('data-textmint-adsense', 'true');
  document.head.appendChild(script);
}

export default function AdBanner({ client, slot, mode = 'light', className = '', ariaLabel = 'Advertisement', minHeight = '90px' }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Only push ads if keys are present
    if (!client || !slot || typeof window === 'undefined') {
      return;
    }

    loadAdSenseScript(client);

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad scripts can fail silently in dev or without a valid account.
    }
  }, [client, slot]);

  // Fallback / Placeholder when environment variables are missing
  if (!client || !slot) {
    return (
      <div
        className={`ad-banner ad-banner--placeholder ${className}`.trim()}
        role="note"
        aria-label={ariaLabel}
        style={{
          border: `1px dashed ${mode === 'dark' ? '#4b5563' : '#cbd5e1'}`,
          borderRadius: '14px',
          padding: '16px',
          minHeight,
          background: mode === 'dark' ? '#111827' : '#f8fafc',
          color: mode === 'dark' ? '#cbd5e1' : '#475569',
          maxWidth: '350px',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '4px', color: mode === 'dark' ? '#e5e7eb' : '#0f172a' }}>
          Ad space reserved
        </strong>
        Configure `REACT_APP_ADSENSE_CLIENT_ID` and slot IDs to enable live ads.
      </div>
    );
  }

  // Live Google Ad
  return (
    <div className={`ad-banner ${className}`.trim()} aria-label={ariaLabel}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

## 5. Using the Component
Import and use the `AdBanner` component anywhere in your app, passing the environment variables as props.

```jsx
import AdBanner from './components/AdBanner';

function App() {
  return (
    <div className="container">
      <h1>My App</h1>
      
      {/* Top Banner Ad */}
      <AdBanner 
        client={process.env.REACT_APP_ADSENSE_CLIENT_ID} 
        slot={process.env.REACT_APP_ADSENSE_TOP_SLOT} 
        mode="light"
      />
    </div>
  );
}

export default App;
```

## 6. Deployment Considerations (Netlify / Vercel)
Remember that your CI/CD provider (e.g. Netlify) does not have access to your local `.env` file because it is not pushed to GitHub.

You must configure the environment variables in your hosting dashboard:
1. Go to **Site Settings > Environment Variables** (Netlify) or **Settings > Environment Variables** (Vercel).
2. Add `REACT_APP_ADSENSE_CLIENT_ID` and your slot IDs.
3. **Trigger a new deploy** so the build process injects the variables into your React bundle.
