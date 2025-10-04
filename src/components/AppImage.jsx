import React from 'react';

function Image({
  src,
  alt = 'Image Name',
  className = '',
  ...props
}) {
  // Normalize src at runtime so leading-root paths ("/assets/...") also work
  // when the app is opened from a subpath or directly from filesystem.
  const normalize = (raw) => {
    if (!raw) return raw;
    // leave full URLs intact
    if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return raw;
    // convert absolute-root paths (/assets/...) to relative (./assets/...)
    if (raw.startsWith('/')) return '.' + raw;
    return raw;
  };

  const resolvedSrc = normalize(src);
  const fallback = './assets/images/no_image.png';

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        // avoid infinite loop if fallback fails
        if (!e.target.dataset.__imgFallbackApplied) {
          e.target.dataset.__imgFallbackApplied = '1';
          e.target.src = fallback;
        }
      }}
      {...props}
    />
  );
}

export default Image;
