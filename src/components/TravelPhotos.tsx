import type { TravelPhoto } from '../data/travel';

interface TravelPhotosProps {
  photos: TravelPhoto[];
  /** The CV preview is a single row; the travel page lets landscapes span two columns. */
  variant: 'glance' | 'full';
}

export function TravelPhotos({ photos, variant }: TravelPhotosProps) {
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
            <figcaption className="gallery__caption">{photo.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
