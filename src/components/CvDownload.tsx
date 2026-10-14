import { Icon } from './Icon';

// The filename is part of the saved download URL, so it stays stable across
// revisions of the PDF itself. See AGENTS.md.
const CV_HREF = '/helder-goncalves-cv.pdf';
const CV_FILENAME = 'helder-goncalves-cv.pdf';

interface CvDownloadProps {
  /** `pill` under the hero title from md up; `icon` in the contacts row below md. */
  variant: 'pill' | 'icon';
}

export function CvDownload({ variant }: CvDownloadProps) {
  const className =
    variant === 'pill'
      ? 'hero__download hero__download--pill'
      : 'hero__contact hero__download hero__download--icon';

  return (
    <a className={className} href={CV_HREF} download={CV_FILENAME} draggable={false} aria-label="Download CV (PDF)">
      <Icon name="download" />
      <span>Download CV</span>
    </a>
  );
}
