import type { Photo } from '../data/offTheClock';

interface PhotoGridProps {
  photos: Photo[];
  /** The front-page preview is a single row; the full page lets landscapes span two columns. */
  variant: 'glance' | 'full';
}

export function PhotoGrid({ photos, variant }: PhotoGridProps) {
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

        return (
          <li key={photo.src} className={classes.join(' ')}>
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
                <span className="gallery__title">{photo.caption}</span>
                {photo.place && <span className="gallery__place">{photo.place}</span>}
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
