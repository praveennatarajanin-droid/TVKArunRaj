const fs = require('fs');

const cssOverride = `

/* ==========================================================================
   FINAL HERO SECTION REDESIGN & FACE CROP FIXES (OVERRIDE)
   ========================================================================== */

/* 1. Ensure the Grid stretches items to match heights */
.hero-grid-trio {
  align-items: stretch !important;
}

/* 2. Main Featured Card Setup */
.hero-col-featured {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-end !important;
  position: relative !important;
  background-color: #000 !important;
  overflow: hidden !important;
  min-height: 100% !important;
  height: 100% !important;
}

/* 3. Convert Image Wrap to Absolute Background */
.featured-img-wrap {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
}

/* 4. Ensure perfect Image Covering and Face Safe Positioning */
.featured-img, 
.stacked-img, 
.recommended-thumb, 
.recommended-hero img, 
.overlay-card-img,
.editorial-thumb {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: top center !important; /* Prioritize the upper half where faces are */
}

/* 5. Add Cinematic Gradient Overlay to protect text */
.featured-img-wrap::after {
  content: "" !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 70% !important; /* Gradient covers bottom 70% */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 40%, transparent 100%) !important;
  z-index: 2 !important;
}

/* 6. Push Text Layer to Top and Force White Color */
.featured-overlay-content {
  position: relative !important;
  z-index: 3 !important;
  padding: 2rem !important;
  background: transparent !important; /* Remove any solid background */
}

.featured-headline, 
.featured-excerpt, 
.featured-meta-row span,
#featured-date,
#featured-title,
#featured-desc {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
}

/* Category Badge Fixes for Overlay */
.featured-category-badge {
  position: absolute !important;
  top: 1.5rem !important;
  left: 1.5rem !important;
  z-index: 4 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
}
`;

let cssContent = fs.readFileSync('css/style.css', 'utf8');
fs.writeFileSync('css/style.css', cssContent + cssOverride);

console.log("Successfully overhauled Hero CSS and added face-safe image positioning.");
