import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Mail, Copy, Check, Send, ExternalLink, Sparkles } from 'lucide-react';

export const ContactView = ({ playBeep }) => {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sentStatus, setSentStatus] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    if (playBeep) playBeep(920, 0.1);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playBeep) playBeep(840, 0.12);
    setSentStatus(true);

    // Also prepare mailto link for direct sending
    const subject = encodeURIComponent(`Portfolio Transmission from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, '_blank');

    setTimeout(() => {
      setSentStatus(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="page-transition-frame animate-crt-entrance">
      <div className="hero-header-block">
        <div className="terminal-badge">
          <span>COMMUNICATION_RELAY // FREQ_142.8</span>
          <span className="terminal-badge-cursor" />
        </div>
        <h1 className="retro-oversized-title">
          contact
        </h1>
      </div>

      <div className="contact-layout-wrapper">
        <div className="contact-grid">
          {/* Left Column: Direct info & Social Matrix */}
          <div className="contact-info-card">
            <h2 className="contact-headline">
              {contact.headline}
            </h2>

            <p className="contact-bio-lead">
              {contact.description}
            </p>

            {/* 1-Click Copy Email Box */}
            <div className="direct-email-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={16} color="var(--accent-primary)" />
                <span className="email-address-text">{contact.email}</span>
              </div>
              <button
                className="copy-badge-btn"
                onClick={handleCopyEmail}
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#4ade80' }}>
                    <Check size={12} /> COPIED!
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Copy size={12} /> COPY
                  </span>
                )}
              </button>
            </div>

            {/* Direct Phone Box */}
            <div className="direct-email-box" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--accent-primary)' }}>☎</span>
                <a href={`tel:${contact.phone}`} className="email-address-text" style={{ textDecoration: 'none' }}>
                  {contact.phone}
                </a>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {contact.location}
              </span>
            </div>

            {/* Socials Matrix */}
            <div className="section-label" style={{ marginBottom: 12 }}>
              // TRANSMISSION CHANNELS
            </div>
            <div className="socials-matrix">
              {contact.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-matrix-link"
                >
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '11px' }}>
                    <span>{item.handle}</span>
                    <ExternalLink size={12} />
                  </div>
                </a>
              ))}
            </div>

            {/* Status footnote */}
            <div style={{ marginTop: 28, padding: 14, background: '#130C06', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-primary)', marginBottom: 4, fontWeight: 600, fontSize: '11px' }}>
                <span className="beacon-dot" />
                <span>ACTIVE DEV DISPATCH</span>
              </div>
              {contact.status}
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="contact-form-card">
            <div className="section-label" style={{ marginBottom: 16 }}>
              // TRANSMIT DIRECT MESSAGE
            </div>

            {sentStatus ? (
              <div style={{ padding: 32, background: 'rgba(240, 161, 43, 0.08)', border: '1px solid var(--accent-primary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '26px', color: 'var(--accent-primary)', marginBottom: 8 }}>
                  TRANSMISSION DISPATCHED!
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  Thank you for reaching out. Opening your default mail client with the transmission.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    NAME / CALLSIGN
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="retro-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    RETURN FREQUENCY (EMAIL)
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="your.email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="retro-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg">
                    TRANSMISSION MESSAGE
                  </label>
                  <textarea
                    id="contact-msg"
                    required
                    rows={4}
                    placeholder="Share your thoughts, project brief, or sci-fi recommendations..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="retro-textarea"
                  />
                </div>

                <button type="submit" className="retro-submit-btn">
                  <Send size={15} />
                  <span>DISPATCH TRANSMISSION</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
