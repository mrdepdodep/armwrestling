// Minimalist stroke icons (no external deps). Keyed by name.
const PATHS = {
  // calculators
  paw: <><circle cx="5.5" cy="12.5" r="1.7" /><circle cx="9.5" cy="8.5" r="1.7" /><circle cx="14.5" cy="8.5" r="1.7" /><circle cx="18.5" cy="12.5" r="1.7" /><path d="M12 13c-2.2 0-4 1.6-4 3.6 0 1.4 1.1 2.4 2.5 2.4.7 0 1-.3 1.5-.3s.8.3 1.5.3c1.4 0 2.5-1 2.5-2.4C16 14.6 14.2 13 12 13z" /></>,
  dumbbell: <><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" /></>,
  trending: <><path d="M3 17l6-6 4 4 8-8" /><path d="M21 10V7h-3" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></>,
  swords: <><path d="M14.5 4H20v5.5L9.5 20 4 14.5 14.5 4z" /><path d="M5 19l2-2M14 4l6 6" /></>,
  flame: <><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1.5-3.5C10 8 10 5 12 3z" /><path d="M12 21a4 4 0 0 0 4-4c0-2-2-3-4-6-2 3-4 4-4 6a4 4 0 0 0 4 4z" /></>,
  flask: <><path d="M9 3h6M10 3v6l-4.5 8a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" /><path d="M7.5 15h9" /></>,
  ruler: <><rect x="3" y="8" width="18" height="8" rx="1.5" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
  bulb: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5M3 17l9 5 9-5" /></>,
  bolt: <><path d="M13 3L5 13h6l-1 8 8-11h-6l1-7z" /></>,
  arrowright: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  // info
  rocket: <><path d="M12 3c3 1 5 4 5 8l-2 4H9l-2-4c0-4 2-7 5-8z" /><path d="M9 15l-3 3M15 15l3 3M12 11h.01" /></>,
  sparkles: <><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" /><path d="M18 15l.8 2 .2.8-2-.8M5 5l.6 1.5" /></>,
  ghost: <><path d="M6 20V11a6 6 0 0 1 12 0v9l-2-1.5L14 20l-2-1.5L10 20l-2-1.5L6 20z" /><path d="M9.5 10h.01M14.5 10h.01" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M4 13h16M12 9v11" /><path d="M12 9S10.5 4 8 5.5 12 9 12 9zM12 9s1.5-5 4-3.5S12 9 12 9z" /></>,
  star: <><path d="M12 4l2.4 5 5.6.8-4 4 1 5.6L12 16.8 7 19.4l1-5.6-4-4 5.6-.8L12 4z" /></>,
  trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 13v4" /></>,
  gem: <><path d="M6 4h12l3 5-9 11L3 9l3-5z" /><path d="M3 9h18M9 4l-1.5 5L12 20M15 4l1.5 5L12 20" /></>,
  globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" /></>,
  // system
  help: <><circle cx="12" cy="12" r="8" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 16.5h.01" /></>,
  heart: <><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20z" /></>,
  // category headers
  calc: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01" /></>,
  info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
  // ui misc
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></>,
  moon: <><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  chevron: <><path d="M9 6l6 6-6 6" /></>,
  close: <><path d="M6 6l12 12M18 6L6 18" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15V5a1 1 0 0 1 1-1h9" /></>,
  check: <><path d="M5 12l4 4 10-10" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 1.6, className, style }) {
  const content = PATHS[name];
  if (!content) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
