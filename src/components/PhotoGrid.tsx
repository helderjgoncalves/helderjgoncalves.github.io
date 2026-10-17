import type { MouseEvent } from 'react';
import { avifSrc, hasAvif, photoId, type Photo } from '../data/photos';
import { Icon } from './Icon';

interface PhotoGridProps {
  photos: Photo[];
  /** The front-page preview is a single row; the full page lets landscapes span two columns. */
  variant: 'glance' | 'full';
  /** Load the first photo eagerly — set where the grid sits above the fold. */
  eager?: boolean;
  /** Makes each tile a link, e.g. to the photo's 2048 px copy, for when onOpen can't run. */
  linkTo?: (photo: Photo) => string;
  /** Intercepts a plain click on a linked tile, e.g. to open the photo viewer. */
  onOpen?: (photo: Photo) => void;
  /** A curiosity, placed in the grid rather than above it. Full grids only. */
  note?: { label: string; text: string };
}

export function PhotoGrid({ photos, variant, eager = false, linkTo, onOpen, note }: PhotoGridProps) {
  // Modified clicks keep the browser's own behaviour (new tab, save link…).
  function handleClick(event: MouseEvent, photo: Photo) {
    if (!onOpen || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onOpen(photo);
  }

  const isWide = (photo: Photo) => variant === 'full' && Boolean(photo.wide);
  // Phones show two columns, so an odd cell count strands the last photo alone on its row.
  const cells = photos.reduce((sum, photo) => sum + (isWide(photo) ? 2 : 1), 0);
  const fillLast = variant === 'full' && cells % 2 === 1;

  // Desktop rows (three columns) that end on a photo before the last one.
  const rowEnds: number[] = [];
  photos.reduce((sum, photo, index) => {
    const next = sum + (isWide(photo) ? 2 : 1);
    if (next % 3 === 0 && index < photos.length - 1) rowEnds.push(index);
    return next;
  }, 0);
  // A note sits beside the last row only when two cells are open there; one
  // cell is too narrow for it. Otherwise it is a band, splitting two or more
  // rows at the middle row break. The DOM keeps it last, so phones still show
  // it under the photos.
  const besideLastRow = cells % 3 === 1;
  const splitAfter =
    note && variant === 'full' && !besideLastRow && rowEnds.length > 0
      ? rowEnds[Math.floor((rowEnds.length - 1) / 2)]
      : undefined;

  return (
    <ul className={`gallery gallery--${variant}`}>
      {photos.map((photo, index) => {
        const classes = ['gallery__item'];
        if (isWide(photo)) classes.push('gallery__item--wide');
        if (fillLast && index === photos.length - 1) classes.push('gallery__item--fill');
        if (splitAfter !== undefined && index > splitAfter) classes.push('gallery__item--after-note');

        const img = (
          <img
            className="gallery__img"
            draggable={false}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={eager && index === 0 ? 'eager' : 'lazy'}
            fetchPriority={eager && index === 0 ? 'high' : undefined}
            decoding="async"
            style={photo.focus ? { objectPosition: photo.focus } : undefined}
          />
        );

        const figure = (
          <figure className="gallery__figure">
            {hasAvif(photo) ? (
              <picture>
                <source type="image/avif" srcSet={avifSrc(photo.src)} />
                {img}
              </picture>
            ) : (
              img
            )}
            {photo.video && (
              <span className="gallery__play">
                <Icon name="play" />
              </span>
            )}
            <figcaption className="gallery__caption">
              <span className="gallery__title">{photo.caption}</span>
              {photo.place && <span className="gallery__place">{photo.place}</span>}
            </figcaption>
          </figure>
        );

        return (
          <li
            key={photo.src}
            id={variant === 'full' ? photoId(photo) : undefined}
            className={classes.join(' ')}
          >
            {linkTo ? (
              <a
                className="gallery__link"
                href={linkTo(photo)}
                draggable={false}
                onClick={(event) => handleClick(event, photo)}>
                {figure}
              </a>
            ) : (
              figure
            )}
          </li>
        );
      })}
      {note && variant === 'full' && (
        <li
          className={`gallery__note${splitAfter !== undefined ? ' gallery__note--split' : ''}`}
          data-beside={besideLastRow || undefined}>
          <span className="gallery__note-mark">
            <Icon name="spark" />
          </span>
          <div>
            <p className="gallery__note-label">{note.label}</p>
            <p className="gallery__note-text">{note.text}</p>
          </div>
        </li>
      )}
    </ul>
  );
}
