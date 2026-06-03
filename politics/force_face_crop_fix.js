const fs = require('fs');

const cssOverride = `

/* OVERRIDE: Prevent face cropping in featured and recommended images */
.editorial-featured-img, 
.recommended-hero img, 
.overlay-card-img, 
.hero-col-featured img {
  object-fit: cover !important;
  object-position: top center !important;
}
`;

fs.appendFileSync('css/style.css', cssOverride);
console.log('Appended face crop fix to style.css');
