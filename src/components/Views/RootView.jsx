import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Play, Pause, SkipForward, Disc, ArrowRight } from 'lucide-react';

export const RootView = ({
  onNavigate,
  playBeep,
  isAudioPlaying,
  currentTrackIndex,
  toggleMusic,
  nextTrack,
}) => {
  const [eqHeights, setEqHeights] = useState([4, 6, 8, 4, 6, 4, 8, 5]);
  const track = portfolioData.audioTracks[currentTrackIndex];

  // Animated EQ equalizer effect
  useEffect(() => {
    if (!isAudioPlaying) {
      setEqHeights([3, 3, 3, 3, 3, 3, 3, 3]);
      return;
    }
    const interval = setInterval(() => {
      setEqHeights(
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 4)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  const handleNextTrack = () => {
    if (playBeep) playBeep(880, 0.08);
    nextTrack();
  };

  const handleTogglePlay = () => {
    if (playBeep) playBeep(!isAudioPlaying ? 750 : 400, 0.08);
    toggleMusic();
  };

  return (
    <div className="page-transition-frame animate-crt-entrance">
      <div className="hero-header-block">
        <div className="terminal-badge">
          <span>{portfolioData.badge}</span>
          <span className="terminal-badge-cursor" />
        </div>
        <h1 className="retro-oversized-title">
          {portfolioData.name}
        </h1>
      </div>

      <div className="root-content-grid">
        {/* Left Column: TLDR and Meta info */}
        <div className="root-narrative-col">
          <div className="section-label">tldr</div>
          <p className="tldr-paragraph">
            I am an enthusiastic and detail-oriented <span className="highlight-term">full stack developer</span> pursuing
            a <span className="highlight-term">BCA degree</span> at <span className="highlight-term">Shoolini University</span>. I build responsive web
            interfaces and full-stack applications using modern JavaScript frameworks including <span className="highlight-term">React.js</span>, <span className="highlight-term">Node.js</span>, <span className="highlight-term">Express</span>, and <span className="highlight-term">MongoDB</span>, eager to contribute to real-world engineering projects and grow as a developer.
          </p>

          <div className="meta-split-row">
            <div className="meta-col">
              <div className="section-label">today</div>
              <p>{portfolioData.today.text}</p>
            </div>

            <div className="meta-col">
              <div className="section-label">yesterday</div>
              <p>{portfolioData.yesterday.text}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Synthesizer / Audio Module */}
        <div className="root-side-col">
          <aside className="retro-synth-widget" aria-label="Terminal Audio Deck">
            <div className="synth-header">
              <div className="synth-screws">
                <span className="screw" />
                <span className="screw" />
              </div>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
                AUDIO_DECK // MK-84
              </span>
              <div className="synth-screws">
                <span className="screw" />
                <span className="screw" />
              </div>
            </div>

            <div className="synth-display">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Disc
                  size={15}
                  color="var(--accent-primary)"
                  className={isAudioPlaying ? 'animate-spin' : ''}
                  style={{ animationDuration: '4s' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {track.genre} • {track.bpm} BPM
                </span>
              </div>
              <div className="synth-track-name">{track.title}</div>
              <div className="synth-track-sub">
                {isAudioPlaying ? '● SIGNAL TRANSMITTING' : '○ SIGNAL PAUSED'}
              </div>

              {/* Real-time reactive EQ visualizer */}
              <div className="synth-eq-bars" aria-hidden="true">
                {eqHeights.map((h, i) => (
                  <div
                    key={i}
                    className="eq-bar"
                    style={{
                      height: isAudioPlaying ? `${h}px` : '3px',
                      opacity: isAudioPlaying ? 0.9 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="synth-controls">
              <button
                className={`synth-btn play-btn ${isAudioPlaying ? 'active' : ''}`}
                onClick={handleTogglePlay}
                aria-label={isAudioPlaying ? 'Pause transmission' : 'Play transmission'}
              >
                {isAudioPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isAudioPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                className="synth-btn"
                onClick={handleNextTrack}
                aria-label="Next track in queue"
              >
                <SkipForward size={14} />
                <span>NEXT CH</span>
              </button>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                QUICK DIRECTORY
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => onNavigate('work')}
                  className="synth-btn"
                  style={{ flex: 1, padding: '8px 10px', fontSize: '10px' }}
                >
                  <span>VIEW WORK</span>
                  <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="synth-btn"
                  style={{ flex: 1, padding: '8px 10px', fontSize: '10px' }}
                >
                  <span>ABOUT ME</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
