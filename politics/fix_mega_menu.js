const fs = require('fs');
const path = require('path');

const cssFilePath = path.join(__dirname, 'css', 'style.css');
let css = fs.readFileSync(cssFilePath, 'utf8');

// 1. Add --text-dark to :root
css = css.replace(/(--text-color:\s*#[0-9A-Fa-f]+;)/, '$1\n  --text-dark: #111827;');

// 2. Add --text-dark to .dark-theme
css = css.replace(/(--text-color:\s*#F9FAFB;)/, '$1\n  --text-dark: #F3F4F6;');

// 3. Fix .mega-card-img-wrap height
css = css.replace(/\.mega-card-img-wrap\s*\{[\s\S]*?height:\s*120px;/, '.mega-card-img-wrap {\n  height: 160px;');

// 4. Fix .mega-card-img object-position
css = css.replace(/(\.mega-card-img\s*\{[\s\S]*?object-fit:\s*cover;)/, '$1\n  object-position: center 20% !important;');

// 5. Fix .mega-card-title line-height and padding
css = css.replace(/line-height:\s*1\.35;\s*color:\s*var\(--text-dark\);/, 'line-height: 1.5;\n  padding-bottom: 2px;\n  color: var(--text-dark);');

fs.writeFileSync(cssFilePath, css, 'utf8');
console.log('Mega menu fixes applied successfully to style.css!');
