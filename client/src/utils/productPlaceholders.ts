// Premium vector fallbacks for catalog hardware products
// Used when external CDN images fail or network is offline

export function getProductPlaceholderSvg(category: string, name: string): string {
  const cat = (category || '').toLowerCase();
  
  if (cat.includes('audio') || name.toLowerCase().includes('headphone')) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23063B2A"/>
          <stop offset="100%" stop-color="%23075E45"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23E5D09A"/>
          <stop offset="100%" stop-color="%23C9A86A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="32" fill="%23E7E2D8" fill-opacity="0.25"/>
      <circle cx="200" cy="190" r="130" fill="url(%23emGrad)" fill-opacity="0.08"/>
      <!-- Headphone Arch -->
      <path d="M120 220 C120 130 280 130 280 220" fill="none" stroke="url(%23emGrad)" stroke-width="14" stroke-linecap="round"/>
      <path d="M135 185 C145 145 255 145 265 185" fill="none" stroke="url(%23goldGrad)" stroke-width="4" stroke-linecap="round"/>
      <!-- Left Ear Cup -->
      <rect x="100" y="200" width="36" height="70" rx="18" fill="url(%23emGrad)"/>
      <rect x="106" y="208" width="10" height="54" rx="5" fill="url(%23goldGrad)"/>
      <!-- Right Ear Cup -->
      <rect x="264" y="200" width="36" height="70" rx="18" fill="url(%23emGrad)"/>
      <rect x="284" y="208" width="10" height="54" rx="5" fill="url(%23goldGrad)"/>
      <!-- Label -->
      <text x="200" y="325" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="bold" fill="%23063B2A" text-anchor="middle">AcousticPro Studio</text>
      <text x="200" y="348" font-family="'JetBrains Mono', monospace" font-size="11" letter-spacing="2" fill="%239A7D43" text-anchor="middle">HIGH-FIDELITY AUDIO</text>
    </svg>`;
  }

  if (cat.includes('wearable') || name.toLowerCase().includes('watch')) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23063B2A"/>
          <stop offset="100%" stop-color="%23075E45"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23E5D09A"/>
          <stop offset="100%" stop-color="%23C9A86A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="32" fill="%23E7E2D8" fill-opacity="0.25"/>
      <!-- Strap -->
      <rect x="165" y="70" width="70" height="260" rx="14" fill="%232D322F"/>
      <!-- Case -->
      <rect x="145" y="145" width="110" height="110" rx="32" fill="url(%23emGrad)" stroke="url(%23goldGrad)" stroke-width="4"/>
      <!-- Screen Ring -->
      <circle cx="200" cy="200" r="38" fill="none" stroke="url(%23goldGrad)" stroke-width="3" stroke-dasharray="8 4"/>
      <!-- Digital Display -->
      <text x="200" y="206" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">10:42</text>
      <!-- Label -->
      <text x="200" y="365" font-family="'Playfair Display', Georgia, serif" font-size="15" font-weight="bold" fill="%23063B2A" text-anchor="middle">${encodeURIComponent(name)}</text>
    </svg>`;
  }

  if (name.toLowerCase().includes('keyboard')) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23063B2A"/>
          <stop offset="100%" stop-color="%23075E45"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23E5D09A"/>
          <stop offset="100%" stop-color="%23C9A86A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="32" fill="%23E7E2D8" fill-opacity="0.25"/>
      <!-- Keyboard Base -->
      <rect x="80" y="150" width="240" height="110" rx="14" fill="url(%23emGrad)" stroke="url(%23goldGrad)" stroke-width="3"/>
      <!-- Key Rows -->
      <g fill="%23FAF9F6" opacity="0.9">
        <rect x="95" y="165" width="22" height="16" rx="3"/>
        <rect x="122" y="165" width="22" height="16" rx="3"/>
        <rect x="149" y="165" width="22" height="16" rx="3"/>
        <rect x="176" y="165" width="22" height="16" rx="3"/>
        <rect x="203" y="165" width="22" height="16" rx="3"/>
        <rect x="230" y="165" width="22" height="16" rx="3"/>
        <rect x="257" y="165" width="22" height="16" rx="3"/>
        <rect x="284" y="165" width="22" height="16" rx="3"/>

        <rect x="95" y="187" width="28" height="16" rx="3"/>
        <rect x="128" y="187" width="22" height="16" rx="3"/>
        <rect x="155" y="187" width="22" height="16" rx="3"/>
        <rect x="182" y="187" width="22" height="16" rx="3"/>
        <rect x="209" y="187" width="22" height="16" rx="3"/>
        <rect x="236" y="187" width="22" height="16" rx="3"/>
        <rect x="263" y="187" width="43" height="16" rx="3"/>

        <!-- Spacebar Row -->
        <rect x="95" y="210" width="34" height="16" rx="3"/>
        <rect x="134" y="210" width="120" height="16" rx="3" fill="url(%23goldGrad)"/>
        <rect x="259" y="210" width="47" height="16" rx="3"/>
      </g>
      <!-- Label -->
      <text x="200" y="315" font-family="'Playfair Display', Georgia, serif" font-size="15" font-weight="bold" fill="%23063B2A" text-anchor="middle">Precision Mech-96</text>
      <text x="200" y="338" font-family="'JetBrains Mono', monospace" font-size="11" letter-spacing="2" fill="%239A7D43" text-anchor="middle">WIRELESS MECHANICAL</text>
    </svg>`;
  }

  // Generic Premium Hardware Fallback
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23063B2A"/>
        <stop offset="100%" stop-color="%23075E45"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23E5D09A"/>
        <stop offset="100%" stop-color="%23C9A86A"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="32" fill="%23E7E2D8" fill-opacity="0.25"/>
    <circle cx="200" cy="180" r="80" fill="url(%23emGrad)" fill-opacity="0.12"/>
    <rect x="140" y="120" width="120" height="120" rx="24" fill="url(%23emGrad)" stroke="url(%23goldGrad)" stroke-width="3"/>
    <circle cx="200" cy="180" r="32" fill="none" stroke="%23E5D09A" stroke-width="4"/>
    <text x="200" y="300" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="bold" fill="%23063B2A" text-anchor="middle">${encodeURIComponent(name || 'Hardware Asset')}</text>
    <text x="200" y="322" font-family="'JetBrains Mono', monospace" font-size="11" letter-spacing="2" fill="%239A7D43" text-anchor="middle">PAYFLOW VERIFIED</text>
  </svg>`;
}
