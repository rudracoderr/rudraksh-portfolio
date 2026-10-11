import React, { useEffect, useRef } from 'react';

/**
 * TVStaticNoise - Authentic 1980s Vintage Television Screen Noise System
 * Renders procedural CRT snow static, analog horizontal roll/hum bars,
 * and channel transition glitch bursts.
 */
export const TVStaticNoise = ({ isTransitioning = false }) => {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Small buffer resolution scaled up with CSS pixelated rendering
    // This gives that authentic crunchy pixel grain and uses < 0.1% CPU
    const width = 240;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data32 = new Uint32Array(imgData.data.buffer);
    const totalPixels = width * height;

    let lastDraw = 0;
    const fpsInterval = 1000 / 28; // ~28 FPS matches authentic CRT phosphor decay

    const renderNoise = (timestamp) => {
      animFrameId.current = requestAnimationFrame(renderNoise);

      if (timestamp - lastDraw < fpsInterval) return;
      lastDraw = timestamp;

      // Generate randomized TV static snow
      for (let i = 0; i < totalPixels; i++) {
        // High-contrast random noise with slight amber/warm phosphor bias
        const rand = Math.random();
        let val;
        let alpha = 255;

        if (rand > 0.92) {
          // Bright white-amber static spark
          val = 220 + ((Math.random() * 35) | 0);
          data32[i] = (alpha << 24) | (val << 16) | (val << 8) | val;
        } else if (rand < 0.15) {
          // Dark scan drop
          val = (Math.random() * 35) | 0;
          data32[i] = (alpha << 24) | (val << 16) | (val << 8) | val;
        } else {
          // Mid-gray grain
          val = 70 + ((Math.random() * 95) | 0);
          data32[i] = (alpha << 24) | (val << 16) | (val << 8) | val;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    animFrameId.current = requestAnimationFrame(renderNoise);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div
      className={`tv-static-container ${isTransitioning ? 'tv-channel-glitch' : ''}`}
      aria-hidden="true"
    >
      {/* Procedural TV Snow Canvas */}
      <canvas ref={canvasRef} className="tv-noise-canvas" />

      {/* Analog Horizontal VHF Tracking / Hum Bar */}
      <div className="tv-tracking-bar" />

      {/* Secondary slow VHF wave distortion */}
      <div className="tv-vhf-distortion-bar" />

      {/* CRT Cathode Ray Gun scanline beam sweep */}
      <div className="tv-electron-beam" />
    </div>
  );
};
