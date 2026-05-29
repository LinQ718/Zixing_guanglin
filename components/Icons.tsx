// SVG Icons Library
export const Icons = {
  // Features Icons
  NotebookIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <line x1="8" y1="6" x2="8" y2="18" strokeWidth="1.2" />
    </svg>
  ),

  TempleIcon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" opacity="0.85">
      <path d="M12 2l3 7h7l-5.5 4 2 6.5L12 15l-5.5 4 2-6.5L2 9h7l3-7z" />
      <rect x="11" y="14" width="2" height="8" fill="currentColor" opacity="0.6" />
      <rect x="4" y="18" width="16" height="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),

  HandsIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 2v7M7 6l3.5 4M17 6l-3.5 4M3 12c0 2.5 1.5 4 3 5l2-3M21 12c0 2.5-1.5 4-3 5l-2-3M5 16h14c1 0 1 1 1 2v3c0 1-1 1-1 1H5c-1 0-1 0-1-1v-3c0-1 0-2 1-2z" />
    </svg>
  ),

  BellIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),

  // Product Card Icon
  CandleIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <path d="M12 2v3M9 5h6M9 5c0 2 0 4-1 5l-2 8h12l-2-8c-1-1-1-3-1-5H9z" />
      <path d="M11 2l1 2l1-2M14 4l-2 1l1 2" fill="currentColor" opacity="0.3" />
    </svg>
  ),

  // Practice Notebook Icons
  CalendarIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),

  CheckmarkIcon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),

  StarIcon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),

  LotusIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v16M4 12h16M6.5 6.5l10.5 10.5M17.5 6.5l-10.5 10.5" strokeWidth="1" opacity="0.6" />
    </svg>
  ),

  // General Icons
  HeartIcon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" opacity="0.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),

  CommentIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),

  ShareIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M12 2v10M7 7l5-5 5 5" />
    </svg>
  ),

  ArrowIcon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M5 13l7-7 7 7M5 13h14" stroke="currentColor" fill="none" strokeWidth="2" />
    </svg>
  ),
};
