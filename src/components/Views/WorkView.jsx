import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { ExternalLink, ChevronLeft, ChevronRight, Eye, Code2 } from 'lucide-react';

export const WorkView = ({ playBeep }) => {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const projects = portfolioData.projects;
  const currentProject = projects[activeProjectIdx];

  const handleSelect = (idx) => {
    setActiveProjectIdx(idx);
    if (playBeep) playBeep(720, 0.06);
  };

  const handlePrev = () => {
    setActiveProjectIdx((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
    if (playBeep) playBeep(580, 0.06);
  };

  const handleNext = () => {
    setActiveProjectIdx((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
    if (playBeep) playBeep(820, 0.06);
  };

  return (
    <div className="page-transition-frame animate-crt-entrance">
      <div className="work-layout-wrapper">
        <div className="work-header-row">
          <div>
            <div className="terminal-badge">
              <span>PROJECT_CATALOG // REPO_INDEX</span>
              <span className="terminal-badge-cursor" />
            </div>
            <h1 className="retro-oversized-title" style={{ marginBottom: 0 }}>
              work
            </h1>
          </div>

          <div className="work-controls-cluster">
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
              INDEX {currentProject.id} / 0{projects.length}
            </span>
            <button
              onClick={handlePrev}
              className="work-nav-button"
              aria-label="Previous project"
              title="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="work-nav-button"
              aria-label="Next project"
              title="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Featured Project Stage */}
        <section className="featured-project-stage" aria-label={`Project: ${currentProject.title}`}>
          <div className="project-meta-kicker">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="project-id-display">{currentProject.id}</span>
              <span style={{ height: 2, width: 24, backgroundColor: 'var(--border-color)', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--text-muted)', fontWeight: 600 }}>
                {currentProject.category}
              </span>
            </div>

            <span className="project-impact-pill">
              {currentProject.impact}
            </span>
          </div>

          <div className="project-main-grid">
            {/* Info Side */}
            <div className="project-info-side">
              <h3>{currentProject.title}</h3>
              <div className="project-category-sub">{currentProject.category}</div>
              
              <p className="project-summary-text">
                {currentProject.summary}
              </p>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                {currentProject.detail}
              </p>

              <div className="project-tags-row">
                {currentProject.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="project-actions-row">
                <a
                  href={currentProject.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-primary-action"
                  id={`live-demo-${currentProject.id}`}
                >
                  <Eye size={15} />
                  <span>LIVE DEMO</span>
                  <ExternalLink size={13} />
                </a>

                <a
                  href={currentProject.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-secondary-action"
                >
                  <Code2 size={15} />
                  <span>SOURCE CODE</span>
                </a>
              </div>
            </div>

            {/* Device Mockup Frame */}
            <div className="project-preview-side">
              <div className="project-device-frame">
                <div className="device-titlebar">
                  <div className="device-buttons">
                    <span className="dot-btn close" />
                    <span className="dot-btn minimize" />
                    <span className="dot-btn maximize" />
                  </div>
                  <div className="device-url-display">
                    https://{currentProject.appUrl}
                  </div>
                  <div style={{ width: 24 }} />
                </div>

                <div className="device-screen">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="device-screen-img"
                  />
                  <div className="device-scanline-mesh" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Selector Cards Row */}
        <div className="projects-switcher-strip">
          {projects.map((proj, idx) => {
            const isSelected = idx === activeProjectIdx;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelect(idx)}
                className={`project-selector-card ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
              >
                <div className="selector-index">{proj.id}</div>
                <div className="selector-title">{proj.title}</div>
                <div className="selector-tag">{proj.category}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
