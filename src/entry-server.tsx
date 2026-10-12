import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Re-exported so scripts/prerender.mjs can read per-page metadata from the
// typed data file instead of keeping its own copy of the same strings.
export { homelab } from './data/homelab';
export { offTheClock, allPhotos } from './data/offTheClock';
export { frontDoor } from './data/frontDoor';

export function render(url = '/'): string {
  return renderToString(
    <StrictMode>
      <App path={url} />
    </StrictMode>,
  );
}
