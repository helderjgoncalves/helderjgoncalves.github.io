import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import {
  avifSrc,
  hasAvif,
  largeSrc,
  largeSrcSet,
  videoSources,
  videoUnavailable,
  videoUnsupported,
  type Photo,
} from '../data/photos';
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

/** With Save-Data, the viewer offers at most this size. */
const SAVE_DATA_CAP = 1280;

/**
 * Whether the visitor has asked to save data (Chrome on Android, some iOS
 * browsers). No guessing from connection speed: Safari doesn't report it and
 * the estimates are unreliable, so only an explicit choice changes anything.
 */
function saveData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/** The grid tile, which the browser usually has already: the viewer shows it until the full copy arrives. */
function placeholderStyle(photo: Photo): CSSProperties {
  const tile = hasAvif(photo) ? avifSrc(photo.src) : photo.src;
  return { '--aspect': photo.width / photo.height, backgroundImage: `url("${tile}")` } as CSSProperties;
}

// Only called once the viewer is open, so never during prerendering.
function canPlay(photo: Photo): boolean {
  const probe = document.createElement('video');
  return videoSources(photo).some((source) => probe.canPlayType(source.type) !== '');
}

// A native <dialog> opened with showModal(): the browser supplies Esc to
// close, the focus trap, and focus returning to the tile that opened it.
// No auto-advance — the visitor moves through the photos, never the page.
export function PhotoViewer({ photos, index, onChange, linkFor }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  // The clip that failed to load, shown as its still instead. Moving to
  // another item (or closing) forgets it, so opening it again retries.
  const [failedVideo, setFailedVideo] = useState<string | null>(null);
  // A clip playing on its own keeps the browser's controls off it; they come
  // back once the visitor reaches for them, or whenever it isn't playing.
  const [playing, setPlaying] = useState(false);
  const [wantsControls, setWantsControls] = useState(false);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    setFailedVideo(null);
    setPlaying(false);
    setWantsControls(false);
  }, [index]);

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
    if (index === null || saveData()) return;
    for (const offset of [1, -1]) {
      const next = photos[(index + offset + photos.length) % photos.length];
      const image = new Image();
      const set = largeSrcSet(next);
      if (set) {
        image.sizes = set.sizes;
        image.srcset = set.srcSet;
      }
      image.src = hasAvif(next) ? avifSrc(largeSrc(next)) : largeSrc(next);
    }
  }, [index, photos]);

  if (index === null || !photo) {
    return <dialog ref={dialogRef} className="viewer" aria-label="Photo viewer" />;
  }

  const step = (by: number) => onChange((index + by + photos.length) % photos.length);
  const link = linkFor?.(photo);
  const videoUnplayable = photo.video !== undefined && !canPlay(photo);
  const videoFailed = videoUnplayable || (photo.video !== undefined && failedVideo === photo.video);

  const lite = saveData();
  const cap = lite ? SAVE_DATA_CAP : Infinity;
  const imgProps = { className: 'viewer__img', draggable: false, src: largeSrc(photo), alt: photo.alt, style: placeholderStyle(photo) };
  const avifSet = hasAvif(photo) ? (largeSrcSet(photo, cap) ?? { srcSet: avifSrc(largeSrc(photo)) }) : undefined;
  const still = avifSet ? (
    <picture key={photo.src}>
      <source type="image/avif" {...avifSet} />
      <img {...imgProps} />
    </picture>
  ) : (
    <img key={photo.src} {...imgProps} />
  );

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
          {photo.video && !videoFailed ? (
            <video
              key={photo.src}
              className="viewer__img"
              poster={avifSrc(largeSrc(photo))}
              style={placeholderStyle(photo)}
              aria-label={photo.alt}
              controls={wantsControls || !playing}
              tabIndex={0}
              onPlaying={() => setPlaying(true)}
              onEnded={() => setPlaying(false)}
              onClick={() => setWantsControls(true)}
              onFocus={() => setWantsControls(true)}
              onPointerMove={(event) => event.pointerType === 'mouse' && setWantsControls(true)}
              playsInline
              autoPlay={!lite}
              preload={lite ? 'none' : 'auto'}
              muted
            >
              {videoSources(photo).map((source, i, all) => (
                // A failing <source> reports on itself, not the <video>; the
                // last one failing means no copy could play.
                <source
                  key={source.src}
                  {...source}
                  onError={i === all.length - 1 ? () => setFailedVideo(photo.video ?? null) : undefined}
                />
              ))}
            </video>
          ) : videoFailed ? (
            <div className="viewer__media">
              {still}
              <span className="viewer__note" role="status">
                {videoUnplayable ? videoUnsupported : videoUnavailable}
              </span>
            </div>
          ) : (
            still
          )}
          <figcaption className="viewer__caption">
            <span className="viewer__title">{photo.caption}</span>
            {photo.place && <span className="viewer__place">{photo.place}</span>}
            <span className="viewer__meta">
              <span className="viewer__count" aria-live="polite">
                {index + 1} / {photos.length}
              </span>
              {link && (
                <a className="viewer__link" href={link.href} draggable={false}>
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
