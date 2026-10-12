import type { Photo } from '../data/offTheClock';

interface PhotoGridProps {
  photos: Photo[];
  /** The front-page preview is a single row; the full page lets landscapes span two columns. */
  variant: 'glance' | 'full';
}

export function PhotoGrid({ photos, variant }: PhotoGridProps) {
  return (
    <ul className={`gallery gallery--${variant}`}>
      {photos.map((photo) => (
        <li
          key={photo.src}
          className={
            variant === 'full' && photo.wide ? 'gallery__item gallery__item--wide' : 'gallery__item'
          }
        >
          <figure className="gallery__figure">
            <img
              className="gallery__img"
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              style={photo.focus ? { objectPosition: photo.focus } : undefined}
            />
            <figcaption className="gallery__caption">
              {photo.stat && <span className="gallery__stat">{photo.stat}</span>}
              <span className="gallery__title">{photo.caption}</span>
              {photo.place && <span className="gallery__place">{photo.place}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
