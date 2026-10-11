import React, { useRef, useEffect } from 'react';

const routes = [
  { id: 'root', label: 'root', path: '/' },
  { id: 'about', label: 'about', path: '/#about' },
  { id: 'work', label: 'work', path: '/work' },
  { id: 'contact', label: 'contact', path: '/#contact' },
];

export const NavigationDock = ({ currentRoute, onNavigate, playBeep }) => {
  const trackRef = useRef(null);
  const activeIndex = routes.findIndex((r) => r.id === currentRoute);
  const validIndex = activeIndex >= 0 ? activeIndex : 0;

  // Keyboard navigation listener (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        const nextIdx = (validIndex + 1) % routes.length;
        onNavigate(routes[nextIdx].id);
        if (playBeep) playBeep(700, 0.05);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (validIndex - 1 + routes.length) % routes.length;
        onNavigate(routes[prevIdx].id);
        if (playBeep) playBeep(580, 0.05);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validIndex, onNavigate, playBeep]);

  const handleItemClick = (e, routeId) => {
    e.preventDefault();
    if (playBeep) playBeep(640, 0.06);
    onNavigate(routeId);
  };

  return (
    <nav
      id="terminal-status-nav"
      className="floating-nav-dock"
      aria-label="Portfolio Pages"
      role="navigation"
    >
      <div className="nav-pill-track" ref={trackRef}>
        {/* Sliding Highlight Pill */}
        <div
          className="nav-sliding-highlight"
          style={{
            width: `calc((100% - 8px) / ${routes.length})`,
            left: '4px',
            transform: `translate3d(${validIndex * 100}%, 0, 0)`,
          }}
          aria-hidden="true"
        />

        {/* Route Links */}
        {routes.map((route, idx) => {
          const isActive = route.id === currentRoute;
          return (
            <a
              key={route.id}
              href={route.path}
              onClick={(e) => handleItemClick(e, route.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              data-route-index={idx}
            >
              {route.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
