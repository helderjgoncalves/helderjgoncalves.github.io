import type { JSX, SVGProps } from 'react';

export type IconName =
  | 'email'
  | 'phone'
  | 'linkedin'
  | 'github'
  | 'website'
  | 'briefcase'
  | 'graduationCap'
  | 'lab'
  | 'code'
  | 'star'
  | 'globe'
  | 'badge'
  | 'user'
  | 'languages'
  | 'download'
  | 'mountain'
  | 'motorbike'
  | 'camera'
  | 'check';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

// Lightweight inline SVG set, no external dependency.
const PATHS: Record<IconName, JSX.Element> = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 0 1 4 0v5M12 13v5" />
    </>
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-1.99 1.03-2.69-.1-.26-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.8a9.6 9.6 0 0 1 2.5.34c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.39.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.59.69.49A10 10 0 0 0 12 2z" />
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </>
  ),
  graduationCap: (
    <>
      <path d="M2 9l10-4 10 4-10 4z" />
      <path d="M6 11v4a6 6 0 0 0 12 0v-4M22 9v5" />
    </>
  ),
  lab: <path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-10V3" />,
  code: (
    <>
      <path d="M8 7l-5 5 5 5" />
      <path d="M16 7l5 5-5 5" />
      <path d="M14 4l-4 16" />
    </>
  ),
  star: (
    <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z" />
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M9 13l-1.5 8L12 18l4.5 3L15 13" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  languages: (
    <>
      <path d="M4 5h7M7.5 5v2c0 4-3.5 7-3.5 7" />
      <path d="M5 11c1 2 4 4 7 4M13 21l5-12 5 12M14.5 17h7" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  mountain: (
    <>
      <path d="M2 20l7-12 4 6 2.5-3.5L22 20z" />
      <path d="M7.2 11l1.8-3 1.8 2.7" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  motorbike: (
    <>
      <circle cx="5" cy="16" r="3.5" />
      <circle cx="19" cy="16" r="3.5" />
      <path d="M5 16l4-6h5.5l4.5 6M14.5 10l1.5-4h2.5M9 10l-1.5-3H5" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3l1.5-2.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
};

export function Icon({ name, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
