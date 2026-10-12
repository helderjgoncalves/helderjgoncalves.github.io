import type { MouseEvent } from 'react';
import { photoId, type Photo } from '../data/offTheClock';

interface PhotoGridProps {
  photos: Photo[];
  /** The front-page preview is a single row; the full page lets landscapes span two columns. */
  variant: 'glance' | 'full';
  /** Load the first photo eagerly — set where the grid sits above the fold. */
  eager?: boolean;
  /** Makes each tile a link, e.g. from the front-page glance to the photo on the full page. */
  linkTo?: (photo: Photo) => string;
  /** Intercepts a plain click on a linked tile, e.g. to open the photo viewer. */
  onOpen?: (photo: Photo) => void;
}

export function PhotoGrid({ photos, variant, eager = false, linkTo, onOpen }: PhotoGridProps) {
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

  return (
    <ul className={`gallery gallery--${variant}`}>
      {photos.map((photo, index) => {
        const classes = ['gallery__item'];
        if (isWide(photo)) classes.push('gallery__item--wide');
        if (fillLast && index === photos.length - 1) classes.push('gallery__item--fill');

        const figure = (
          <figure className="gallery__figure">
            <img
              className="gallery__img"
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading={eager && index === 0 ? 'eager' : 'lazy'}
              fetchPriority={eager && index === 0 ? 'high' : undefined}
              decoding="async"
              style={photo.focus ? { objectPosition: photo.focus } : undefined}
            />
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
              <a className="gallery__link" href={linkTo(photo)} onClick={(event) => handleClick(event, photo)}>
                {figure}
              </a>
            ) : (
              figure
            )}
          </li>
        );
      })}
    </ul>
  );
}
