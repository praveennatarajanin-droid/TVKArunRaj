const fs = require('fs');
const path = require('path');

const cssFilePath = path.join(__dirname, 'css', 'style.css');

const globalCropFix = `

/* ==========================================================================
   GLOBAL FIX: PREVENT FACE CROPPING (Object Position Override)
   ========================================================================== */
img {
    object-position: top center !important;
}

/* Ensure background images also prioritize top center for focal points */
.bg-cover,
[style*="background-image"] {
    background-position: top center !important;
}

/* Target specific interactive/slider elements just to be safe */
.editorial-featured-img,
.recommended-hero img,
.overlay-card-img,
.hero-col-featured img,
.news-card-img img,
.gallery-img,
.video-thumbnail img,
.sidebar-widget-img,
.trending-img {
    object-position: top center !important;
}
`;

try {
  fs.appendFileSync(cssFilePath, globalCropFix, 'utf8');
  console.log('Global image cropping fix successfully applied to css/style.css');
} catch (err) {
  console.error('Error applying global fix:', err);
}
