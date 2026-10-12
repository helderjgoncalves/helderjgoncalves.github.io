import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type TouchEvent } from 'react';
import { largeSrc, type Photo } from '../data/photos';
import { Icon } from './Icon';

interface PhotoViewerProps {
  photos: Photo[];
  /** Index of the open photo, or null when the viewer is closed. */
  index: number | null;
  onChange: (index: number | null) => void;
  /** An optional link under the caption, e.g. to the trip the photo is from. */
  linkFor?: (photo: Photo) => { href: string; label: string } | undefined;
}

const SWIPE_PX = 50;

// A native <dialog> opened with showModal(): the browser supplies Esc to
// close, the focus trap, and focus returning to the tile that opened it.
// No auto-advance — the visitor moves through the photos, never the page.
export function PhotoViewer({ photos, index, onChange, linkFor }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();

    const root = document.documentElement;
    root.style.overflow = index === null ? '' : 'hidden';
    return () => {
      root.style.overflow = '';
    };
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    for (const offset of [1, -1]) {
      new Image().src = largeSrc(photos[(index + offset + photos.length) % photos.length]);
    }
  }, [index, photos]);

  if (index === null || !photo) {
    return <dialog ref={dialogRef} className="viewer" aria-label="Photo viewer" />;
  }

  const step = (by: number) => onChange((index + by + photos.length) % photos.length);
  const link = linkFor?.(photo);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  }

  // Clicks on the dark surround (the dialog itself or the stage) close it;
  // clicks on the photo, caption or buttons don't.
  function onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.classList.contains('viewer__stage')) {
      onChange(null);
    }
  }

  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
  }

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label="Photo viewer"
      onClose={() => onChange(null)}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button type="button" className="viewer__button viewer__close" aria-label="Close" onClick={() => onChange(null)}>
        <Icon name="close" />
      </button>

      <div className="viewer__stage">
        <figure className="viewer__figure">
          <img key={photo.src} className="viewer__img" src={largeSrc(photo)} alt={photo.alt} />
          <figcaption className="viewer__caption">
            <span className="viewer__title">{photo.caption}</span>
            {photo.place && <span className="viewer__place">{photo.place}</span>}
            <span className="viewer__meta">
              <span className="viewer__count" aria-live="polite">
                {index + 1} / {photos.length}
              </span>
              {link && (
                <a className="viewer__link" href={link.href}>
                  {link.label}
                  <Icon name="chevronRight" />
                </a>
              )}
            </span>
          </figcaption>
        </figure>
      </div>

      <button type="button" className="viewer__button viewer__nav viewer__nav--prev" aria-label="Previous photo" onClick={() => step(-1)}>
        <Icon name="chevronLeft" />
      </button>
      <button type="button" className="viewer__button viewer__nav viewer__nav--next" aria-label="Next photo" onClick={() => step(1)}>
        <Icon name="chevronRight" />
      </button>
    </dialog>
  );
}
