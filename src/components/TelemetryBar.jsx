import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal, Cpu, Play, Pause, SkipForward } from 'lucide-react';

export const TelemetryBar = ({
  isMuted,
  setIsMuted,
  playBeep,
  isAudioPlaying,
  toggleMusic,
  nextTrack,
  currentTrack,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds} LCL`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted && playBeep) {
      playBeep(640, 0.08);
    }
  };

  const handleMiniTogglePlay = () => {
    if (playBeep) playBeep(!isAudioPlaying ? 750 : 400, 0.08);
    if (toggleMusic) toggleMusic();
  };

  const handleMiniNext = () => {
    if (playBeep) playBeep(880, 0.08);
    if (nextTrack) nextTrack();
  };

  return (
    <header className="top-telemetry-bar">
      <div className="telemetry-left">
        <span className="status-beacon">
          <span className="beacon-dot" />
          <span>PORTFOLIO.SYS</span>
        </span>
        <span className="telemetry-chip">
          <Terminal size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          TTY_01 // ACTIVE
        </span>

        {/* Global Persistent Mini Music Deck visible on ALL pages */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <button
            onClick={handleMiniTogglePlay}
            className={`crt-audio-btn ${isAudioPlaying ? 'active' : ''}`}
            title={isAudioPlaying ? 'Pause background music' : 'Play background music'}
            aria-label={isAudioPlaying ? 'Pause background music' : 'Play background music'}
            style={{ padding: '3px 8px' }}
          >
            {isAudioPlaying ? <Pause size={11} /> : <Play size={11} />}
            <span style={{ fontSize: '10px' }}>
              {isAudioPlaying ? 'MUSIC ON' : 'MUSIC OFF'}
            </span>
          </button>

          {isAudioPlaying && currentTrack && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '13px',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                ♫ {currentTrack.title}
              </span>
              <button
                onClick={handleMiniNext}
                className="crt-audio-btn"
                title="Next song"
                aria-label="Next song"
                style={{ padding: '3px 6px' }}
              >
                <SkipForward size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="telemetry-right">
        <span className="telemetry-chip">
          <Cpu size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          60 FPS
        </span>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
          {timeStr}
        </span>

        <button
          className={`crt-audio-btn ${!isMuted ? 'active' : ''}`}
          onClick={handleAudioToggle}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{isMuted ? 'MUTED' : 'SFX ON'}</span>
        </button>
      </div>
    </header>
  );
};
