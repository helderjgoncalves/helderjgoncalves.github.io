import { cv } from '../data/cv';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()}{' '}
          <a href="/" draggable={false}>{cv.profile.name}</a> ·{' '}
          <a href="https://github.com/helderjgoncalves" target="_blank" rel="noopener noreferrer" draggable={false}>
            GitHub
          </a>{' '}
          ·{' '}
          <a href="https://linkedin.com/in/helderjgoncalves" target="_blank" rel="noopener noreferrer" draggable={false}>
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}
