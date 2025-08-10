// Default assets and constants used across the client app

// Lightweight inline SVG data URI for a neutral user avatar placeholder
// Colors use Tailwind gray palette equivalents
export const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="#f3f4f6"/>
      <circle cx="64" cy="48" r="28" fill="#d1d5db"/>
      <path d="M16 116c0-24 22-40 48-40s48 16 48 40" fill="#d1d5db"/>
    </svg>`
  );

// Default post image path (served from public/). Save your provided image as this filename.
export const DEFAULT_POST_IMAGE = '/default-post.png';


