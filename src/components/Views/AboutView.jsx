import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Terminal, GraduationCap, Award, Languages, Code2, Layers, Database, Wrench } from 'lucide-react';

export const AboutView = () => {
  const { about, location } = portfolioData;

  const getCategoryIcon = (category) => {
    if (category.includes('Languages')) return <Code2 size={13} color="var(--accent-primary)" />;
    if (category.includes('Frameworks')) return <Layers size={13} color="var(--accent-primary)" />;
    if (category.includes('Backend')) return <Database size={13} color="var(--accent-primary)" />;
    return <Wrench size={13} color="var(--accent-primary)" />;
  };

  return (
    <div className="page-transition-frame animate-crt-entrance">
      <div className="hero-header-block">
        <div className="terminal-badge">
          <span>IDENTITY_RECORD // ARCHIVE_02</span>
          <span className="terminal-badge-cursor" />
        </div>
        <h1 className="retro-oversized-title">
          about
        </h1>
      </div>

      <div className="about-page-layout">
        {/* Left Column: Objective, Education, Skills, Certification */}
        <div className="about-bio-stack">
          {/* Objective */}
          <div className="bio-card bio-card-main">
            <div className="section-label">
              <Terminal size={14} color="var(--accent-primary)" />
              <span>Professional Objective</span>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.75, fontWeight: 500 }}>
              {about.objective}
            </p>
          </div>

          {/* Education & Training Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* Education */}
            <div className="bio-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent-primary)' }}>
                <GraduationCap size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Education
                </span>
              </div>
              <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: 4, fontWeight: 600 }}>
                {about.education.degree}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--accent-secondary)', fontWeight: 500 }}>
                {about.education.institution}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                {about.education.timeline}
              </p>
            </div>

            {/* Certification */}
            <div className="bio-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent-primary)' }}>
                <Award size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Certification
                </span>
              </div>
              <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: 4, fontWeight: 600 }}>
                {about.certification.course}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--accent-secondary)', fontWeight: 500 }}>
                {about.certification.organization}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                {about.certification.detail}
              </p>
            </div>
          </div>

          {/* Technical Skills Telemetry (Categorized from Resume) */}
          <div className="bio-card">
            <div className="section-label">
              <Code2 size={14} color="var(--accent-primary)" />
              <span>Technical Skills Telemetry</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 12 }}>
              {about.skillCategories.map((group) => (
                <div key={group.category}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    {getCategoryIcon(group.category)}
                    <span>{group.category}</span>
                  </div>
                  <div className="skills-telemetry" style={{ marginTop: 0 }}>
                    {group.items.map((skill) => (
                      <span key={skill} className="tech-chip">
                        <span className="chip-status-dot" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spoken Languages */}
          <div className="bio-card">
            <div className="section-label">
              <Languages size={14} color="var(--accent-primary)" />
              <span>Spoken Languages</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              {about.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                    {lang.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>
                    ({lang.proficiency})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CRT Profile Photo Frame */}
        <div className="about-photo-col">
          <div className="crt-photo-module">
            <div className="crt-photo-frame">
              <img
                src="/assets/profileforpoerfolio.png"
                alt="Rudraksh Kashyap Profile"
                className="crt-photo-img"
                onError={(e) => {
                  e.target.src = '/assets/Profile.png';
                }}
              />
              <div className="crt-frame-overlay" />
              <div className="crt-corner-brackets" aria-hidden="true">
                <span className="corner-tl" />
                <span className="corner-tr" />
                <span className="corner-bl" />
                <span className="corner-br" />
              </div>
            </div>

            <div className="crt-photo-caption">
              <span>PHOTO_SPEC</span>
              <span className="caption-id">RK.DEV // RAW</span>
            </div>

            <div style={{ marginTop: 14, padding: 14, background: '#130C06', borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>STATUS:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>AVAILABLE FOR HIRE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>ROLE:</span>
                <span style={{ color: 'var(--text-primary)' }}>FULL STACK DEVELOPER</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>EDUCATION:</span>
                <span style={{ color: 'var(--text-primary)' }}>BCA (2025–2028)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>LOCATION:</span>
                <span style={{ color: 'var(--text-primary)' }}>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
