import React from 'react';

export const Footer = () => {
  return (
    <footer className="site-bottom-footer" role="contentinfo">
      <div className="footer-copy">
        © 2026 Rudraksh Kashyap
      </div>

      <div className="footer-meta-links">
        <span>Built with React & Vite</span>
        <span className="footer-bullet">•</span>
        <span>Retro CRT Edition</span>
        <span className="footer-bullet">•</span>
        <a
          href="https://github.com/rudracoderr"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
