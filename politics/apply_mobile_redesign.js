const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const completeMobileFixes = `

/* ==========================================================================
   FINAL PRODUCTION MOBILE RESPONSIVENESS OVERHAUL (320px - 768px)
   ========================================================================== */

/* 1. GLOBAL FIXES: Prevent all horizontal scrolling and bleed */
html, body {
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100vw !important;
  position: relative;
}

@media (max-width: 768px) {
  /* 2. SECTION SPACING: Reduce massive vertical paddings on mobile */
  .section-padding {
    padding: 2.5rem 0 !important;
  }
  
  .container {
    padding: 0 1rem !important; /* Smaller horizontal padding */
  }

  /* 3. TOP UTILITY BAR: Compact everything */
  .top-bar-content {
    flex-direction: row !important;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
  .top-bar-left {
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    display: block !important;
    margin-bottom: 0.25rem;
  }
  .top-bar-right {
    width: 100%;
    justify-content: center;
  }
  
  /* 4. MAIN BRANDING HEADER: Shrink fonts & wrap */
  .brand-area {
    flex-direction: column !important;
    align-items: center !important;
    text-align: center;
    gap: 0.5rem !important;
  }
  .brand-area img {
    height: 60px !important;
    width: 60px !important;
  }
  .brand-text h1 {
    font-size: 1.3rem !important; /* Crucial: Shrink massive titles */
    line-height: 1.2 !important;
    word-break: break-word; /* Prevent long words from breaking layout */
  }
  #brand-sub {
    font-size: 0.75rem !important;
  }
  .header-right-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .search-box-wrap {
    width: 100% !important;
  }
  .mla-right-logo-wrap {
    display: none !important; /* Hide secondary logo on tiny screens to save space */
  }
  
  /* 5. HERO NEWS GRID: Un-squish the tall featured card */
  .hero-col-featured {
    height: auto !important; /* Let content dictate height */
    min-height: 300px;
  }
  .editorial-featured-img-wrap {
    height: 200px !important; /* Shorter image on mobile */
  }
  .editorial-featured-title {
    font-size: 1.1rem !important;
  }
  
  /* 6. NEWS WRAPPER & SIDEBARS: Strict 1 Column Stacking */
  .news-portal-wrapper {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
  .editorial-top-block {
    display: flex !important;
    flex-direction: column !important;
  }
  .editorial-list-columns {
    grid-template-columns: 1fr !important; /* Single list column on mobile */
  }
  
  /* 7. ALL OTHER GRIDS: Force 1 Column */
  #community-main-grid,
  .projects-grid,
  .gallery-grid,
  .voices-grid,
  .video-center-layout,
  .profile-layout,
  .grievance-layout,
  .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
  
  /* 8. ALIGNMENTS */
  .profile-content,
  .footer-col {
    text-align: center;
  }
  .key-highlights-grid {
    text-align: left; /* Keep these readable */
  }
  
  /* 9. STATS: 2 columns */
  .stats-grid {
    grid-template-columns: 1fr 1fr !important;
  }
  .stat-card h3 {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  /* Extra narrow devices */
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
  .ticker-title {
    font-size: 0.75rem;
    padding: 0 0.75rem;
  }
  .editorial-list-item {
    flex-direction: column; /* Stack image and text in small lists */
  }
  .editorial-thumb-wrap {
    width: 100% !important;
    height: 120px !important;
  }
  .gallery-card-img {
    height: 200px;
  }
}
`;

fs.appendFileSync('css/style.css', completeMobileFixes);
console.log("Applied production mobile overhaul CSS.");
