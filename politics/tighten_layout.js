const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const layoutFixCss = `

/* ==========================================================================
   GLOBAL LAYOUT AUDIT & WHITESPACE REMOVAL
   ========================================================================== */

/* 1. Prevent Grid Stretching (Fixes the massive blank white column issue) */
.news-portal-wrapper,
.video-center-layout,
.profile-layout,
.hero-grid {
  align-items: start !important; 
}

/* 2. Sticky Sidebar (Allows sidebar to scroll cleanly with main content) */
.news-sidebar-column {
  position: sticky !important;
  top: 100px !important;
  height: max-content; /* Ensure the sticky sidebar collapses to its content */
}

/* 3. Aggressive Padding Reduction (Desktop & General) */
/* Old padding was up to 4rem, which is too much. */
.section-padding {
  padding: 3rem 0 !important; /* Slightly tighter on desktop */
}

@media (max-width: 1024px) {
  .section-padding {
    padding: 2rem 0 !important; /* Tablet */
  }
}

@media (max-width: 768px) {
  .section-padding {
    padding: 1.25rem 0 !important; /* Mobile */
  }
}

/* 4. Empty Container Collapse */
/* If a widget or container has no content, it vanishes completely instead of holding space */
.sidebar-widget:empty,
.editorial-col:empty,
.video-list-sidebar:empty,
.recommended-item:empty,
.mega-dropdown-grid:empty {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 0 !important;
}

/* 5. Fix oversized margins and wrappers */
.news-main-column,
.editorial-top-block,
.editorial-list-columns {
  gap: 1.5rem !important; /* Reduced from 2rem or 2.5rem */
}

.recommended-posts {
  margin-bottom: 1.5rem !important;
}

/* 6. Footer spacing optimization */
.footer-grid {
  gap: 2rem !important;
}
.footer-col {
  gap: 1rem !important;
}

/* 7. Strip forced minimum heights on hero elements */
.hero-col-featured {
  min-height: auto !important;
  height: max-content !important;
}
`;

fs.appendFileSync('css/style.css', layoutFixCss);
console.log("Applied layout tighten CSS.");
