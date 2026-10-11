import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TelemetryBar } from './components/TelemetryBar';
import { NavigationDock } from './components/NavigationDock';
import { Footer } from './components/Footer';
import { RootView } from './components/Views/RootView';
import { AboutView } from './components/Views/AboutView';
import { WorkView } from './components/Views/WorkView';
import { ContactView } from './components/Views/ContactView';
import { retroAudio } from './utils/retroAudioEngine';
import { portfolioData } from './data/portfolioData';
import { RetroCursor } from './components/RetroCursor';
import { TVStaticNoise } from './components/TVStaticNoise';

// Route ID resolver from URL
const getRouteFromUrl = () => {
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (hash === '#about' || path === '/about') return 'about';
  if (hash === '#work' || path === '/work') return 'work';
  if (hash === '#contact' || path === '/contact') return 'contact';
  return 'root';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Sync mute state with audio engine
  useEffect(() => {
    retroAudio.setMuted(isMuted);
  }, [isMuted]);

  // Global music controls (keeps playing when navigating between pages!)
  const toggleMusic = useCallback(() => {
    setIsAudioPlaying((prev) => {
      const nextState = !prev;
      if (nextState) {
        retroAudio.playTrack(currentTrackIndex);
      } else {
        retroAudio.stopTrack();
      }
      return nextState;
    });
  }, [currentTrackIndex]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const next = (prev + 1) % portfolioData.audioTracks.length;
      if (isAudioPlaying) {
        retroAudio.playTrack(next);
      }
      return next;
    });
  }, [isAudioPlaying]);

  // Web Audio synthesizer for tactile retro terminal audio feedback
  const playBeep = useCallback((freq = 600, duration = 0.06) => {
    retroAudio.playBeep(freq, duration);
  }, []);

  // Synchronize route changes to browser history and document title
  const navigateTo = useCallback((routeId) => {
    if (routeId === currentRoute && !isTransitioning) return;

    setIsTransitioning(true);

    // Update URL hash or pathname cleanly
    let newUrl = '/';
    let pageTitle = 'Rudraksh Kashyap • Full Stack Developer';

    if (routeId === 'about') {
      newUrl = '/#about';
      pageTitle = 'About • Rudraksh Kashyap';
    } else if (routeId === 'work') {
      newUrl = '/#work';
      pageTitle = 'Work • Rudraksh Kashyap';
    } else if (routeId === 'contact') {
      newUrl = '/#contact';
      pageTitle = 'Contact • Rudraksh Kashyap';
    }

    window.history.pushState({ route: routeId }, '', newUrl);
    document.title = pageTitle;

    // Smooth CRT TV channel static burst transition
    setTimeout(() => {
      setCurrentRoute(routeId);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 140);
    }, 130);
  }, [currentRoute, isTransitioning]);

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const targetRoute = getRouteFromUrl();
      setCurrentRoute(targetRoute);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure scroll is at top on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Update initial title
  useEffect(() => {
    if (currentRoute === 'about') document.title = 'About • Rudraksh Kashyap';
    else if (currentRoute === 'work') document.title = 'Work • Rudraksh Kashyap';
    else if (currentRoute === 'contact') document.title = 'Contact • Rudraksh Kashyap';
    else document.title = 'Rudraksh Kashyap • Full Stack Developer';
  }, [currentRoute]);

  return (
    <div className="crt-screen-wrapper">
      {/* Interactive CRT Retro Cursor System */}
      <RetroCursor />

      {/* Background CRT Layers */}
      <div className="crt-grid-bg" aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <TVStaticNoise isTransitioning={isTransitioning} />
      <div className="crt-vignette" aria-hidden="true" />
      <div className="crt-flicker-layer" aria-hidden="true" />

      {/* Top Telemetry / Status Bar */}
      <TelemetryBar
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        playBeep={playBeep}
        isAudioPlaying={isAudioPlaying}
        toggleMusic={toggleMusic}
        nextTrack={nextTrack}
        currentTrack={portfolioData.audioTracks[currentTrackIndex]}
      />

      {/* Main Scrollable Viewport */}
      <main
        className="viewport-content-container"
        ref={scrollContainerRef}
        id="main-content"
      >
        <div className="page-inner-content">
          {currentRoute === 'root' && (
            <RootView
              onNavigate={navigateTo}
              playBeep={playBeep}
              isAudioPlaying={isAudioPlaying}
              currentTrackIndex={currentTrackIndex}
              toggleMusic={toggleMusic}
              nextTrack={nextTrack}
            />
          )}
          {currentRoute === 'about' && (
            <AboutView onNavigate={navigateTo} playBeep={playBeep} />
          )}
          {currentRoute === 'work' && (
            <WorkView onNavigate={navigateTo} playBeep={playBeep} />
          )}
          {currentRoute === 'contact' && (
            <ContactView onNavigate={navigateTo} playBeep={playBeep} />
          )}
        </div>
      </main>

      {/* Floating Bottom Pill Navigation Bar */}
      <NavigationDock
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        playBeep={playBeep}
      />

      {/* Fixed Bottom Footer */}
      <Footer />
    </div>
  );
}
