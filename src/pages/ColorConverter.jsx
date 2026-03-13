import { useState, useEffect } from 'react';
import ResourceLinks from '../components/ResourceLinks';
import './ToolPage.css';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [hsl, setHsl] = useState('hsl(217, 91%, 60%)');

  const hexToRgb = (hexValue) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  useEffect(() => {
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    } else {
      setRgb('Invalid HEX');
      setHsl('Invalid HEX');
    }
  }, [hex]);

  const copyToClipboard = (text) => {
    if (text && !text.includes('Invalid')) {
      navigator.clipboard.writeText(text);
    }
  };

  const resources = [
    { title: "MDN: Color Values", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" }
  ];

  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header">
        <div>
          <h2>Color Code Converter</h2>
          <p>Easily convert between HEX, RGB, and HSL color formats.</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 mb-4">
        <div className="flex-1 glass-panel rounded-xl overflow-hidden shadow border-[var(--border-light)] p-6 flex flex-col items-center justify-center">
          <label className="text-sm text-[var(--text-secondary)] mb-4 uppercase tracking-wide font-semibold">Pick a Color</label>
          <input 
            type="color" 
            value={hex.match(/^#[0-9a-fA-F]{6}$/) ? hex : '#000000'} 
            onChange={(e) => setHex(e.target.value)}
            className="w-32 h-32 rounded-lg cursor-pointer border-none outline-none bg-transparent"
          />
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          {[
            { label: 'HEX Color', value: hex, onChange: (e) => setHex(e.target.value) },
            { label: 'RGB Color', value: rgb, readOnly: true },
            { label: 'HSL Color', value: hsl, readOnly: true }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel flex-1 rounded-xl overflow-hidden flex flex-col p-4 shadow border-[var(--border-light)] relative group">
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-semibold mb-2">{item.label}</label>
              <input 
                type="text" 
                value={item.value}
                onChange={item.onChange}
                readOnly={item.readOnly}
                className="bg-[rgba(128,128,128,0.1)] text-[var(--text-primary)] border border-[rgba(128,128,128,0.2)] rounded px-3 py-2 text-lg outline-none font-mono"
              />
              <button 
                className="absolute top-4 right-4 text-xs bg-[rgba(128,128,128,0.1)] hover:bg-[rgba(128,128,128,0.2)] px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => copyToClipboard(item.value)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      <ResourceLinks links={resources} />
    </div>
  );
}
