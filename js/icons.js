/**
 * SVG Icons Repository
 * High-quality vector icons for UI and application brands.
 * Fully offline-capable, crisp on high-DPI displays.
 */

const ICONS = {
  // App Brand Icons
  windows: `
    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12.402L35.688 7.525V42.062H0V12.402ZM0 46.125H35.688V80.662L0 75.785V46.125ZM39.812 6.958L88 0V42.062H39.812V6.958ZM88 46.125L39.812 81.229V46.125H88V88L88 46.125Z" fill="#0078D4"/>
      <path d="M39.812 46.125H88V88L39.812 81.229V46.125Z" fill="#0078D4"/>
    </svg>
  `,
  excel: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="14" width="60" height="68" rx="8" fill="#107C41"/>
      <path d="M36 28H70V34H36V28ZM36 40H70V46H36V40ZM36 52H70V58H36V52ZM36 64H70V70H36V64Z" fill="#8CE1A3" opacity="0.35"/>
      <rect x="14" y="24" width="44" height="48" rx="6" fill="#185C37" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"/>
      <path d="M26 36L34 48L26 60H32L37 52.5L42 60H48L40 48L48 36H42L37 43.5L32 36H26Z" fill="#FFFFFF"/>
    </svg>
  `,
  word: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="14" width="60" height="68" rx="8" fill="#185ABD"/>
      <path d="M36 28H70V34H36V28ZM36 40H70V46H36V40ZM36 52H70V58H36V52ZM36 64H58V70H36V64Z" fill="#88B4F5" opacity="0.4"/>
      <rect x="14" y="24" width="44" height="48" rx="6" fill="#103F91" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"/>
      <path d="M25 36L30.5 58H35.5L39 45L42.5 58H47.5L53 36H47.5L44.5 50L41 36H37L33.5 50L30.5 36H25Z" fill="#FFFFFF"/>
    </svg>
  `,
  chrome: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="48" cy="48" r="42" fill="#FFFFFF"/>
      <path d="M48 24C61.2548 24 72 34.7452 72 48H48V24Z" fill="#EA4335"/>
      <path d="M48 24C34.7452 24 24 34.7452 24 48L48 24Z" fill="#EA4335"/>
      <path d="M89.7 34L48 34L37.5 52.2L68.8 52.2L89.7 34Z" fill="#EA4335"/>
      <path d="M89.7 34C86 20.4 75 9.8 61 7L40 43.4L58.2 43.4L89.7 34Z" fill="#EA4335"/>
      <circle cx="48" cy="48" r="38" fill="#FFC107"/>
      <path d="M48 10C68.9868 10 86 27.0132 86 48C86 52.54 85.2 56.88 83.74 60.9L57.5 48L48 10Z" fill="#EA4335"/>
      <path d="M83.74 60.9C78.4 75.7 64.5 86 48 86C37.5 86 28 81.8 21.1 75L40 48L83.74 60.9Z" fill="#4CAF50"/>
      <path d="M21.1 75C14.2 68.2 10 58.6 10 48C10 32.5 19.3 19.2 32.7 13.5L48 48L21.1 75Z" fill="#FFC107"/>
      <circle cx="48" cy="48" r="18" fill="#FFFFFF"/>
      <circle cx="48" cy="48" r="14" fill="#1A73E8"/>
    </svg>
  `,
  vscode: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M68.5 90.5L88 81V15L68.5 5.5L34 36.5L16 23L7 28V68L16 73L34 59.5L68.5 90.5Z" fill="#0065A9"/>
      <path d="M68.5 90.5L88 81V15L68.5 5.5L36 34.5L68.5 63.5V90.5Z" fill="#007ACC"/>
      <path d="M68.5 5.5L34 36.5L16 23L7 28L25.5 43.5L68.5 5.5Z" fill="#1F9CF0"/>
      <path d="M68.5 90.5L25.5 52.5L7 68L16 73L34 59.5L68.5 90.5Z" fill="#0065A9"/>
      <path d="M68.5 63.5L34 36.5L68.5 9.5V63.5Z" fill="#007ACC"/>
    </svg>
  `,
  terminal: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="80" height="68" rx="10" fill="#202020"/>
      <rect x="8" y="14" width="80" height="20" rx="10" fill="#2D2D2D"/>
      <circle cx="20" cy="24" r="4" fill="#FF5F56"/>
      <circle cx="32" cy="24" r="4" fill="#FFBD2E"/>
      <circle cx="44" cy="24" r="4" fill="#27C93F"/>
      <path d="M24 46L36 56L24 66" stroke="#4AF626" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="44" y1="66" x2="60" y2="66" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `,
  appDefault: `
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="72" height="72" rx="18" fill="url(#appDefaultGrad)"/>
      <path d="M34 32H62M34 48H62M34 64H50" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      <defs>
        <linearGradient id="appDefaultGrad" x1="12" y1="12" x2="84" y2="84" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6366F1"/>
          <stop offset="1" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
    </svg>
  `,

  // UI Icons
  search: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,
  copy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `,
  check: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,
  plus: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,
  sparkles: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z"></path>
      <path d="M19 3v4"></path>
      <path d="M21 5h-4"></path>
    </svg>
  `,
  trash: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `,
  edit: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `,
  settings: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  `,
  cloud: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  `,
  sun: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,
  moon: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `,
  globe: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  `,
  arrowLeft: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  `,
  close: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,
  download: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,
  upload: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  `,
  drive: `
    <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  `
};

function getIcon(name, className = 'icon') {
  const svg = ICONS[name] || ICONS.appDefault;
  return `<span class="${className} icon-${name}">${svg}</span>`;
}

if (typeof window !== 'undefined') {
  window.ICONS = ICONS;
  window.getIcon = getIcon;
}
