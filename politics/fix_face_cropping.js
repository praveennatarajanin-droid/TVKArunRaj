const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Fix face cropping by adjusting object-position
css = css.replace(/\.editorial-featured-img \{\s*width: 100%;\s*height: 100%;\s*object-fit: cover;\s*transition: var\(--transition-smooth\);\s*\}/,
`.editorial-featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: var(--transition-smooth);
}`);

// Also fix for the other featured image wrap that might have this issue (e.g. community-main-grid hero images)
css = css.replace(/\.recommended-hero img \{\s*width: 100%;\s*height: 100%;\s*object-fit: cover;\s*transition: var\(--transition-smooth\);\s*\}/,
`.recommended-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: var(--transition-smooth);
}`);

fs.writeFileSync('css/style.css', css);
console.log("Fixed face cropping by setting object-position: top center");
