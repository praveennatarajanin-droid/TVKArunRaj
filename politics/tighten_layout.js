const fs = require('fs');

let style = fs.readFileSync('css/style.css', 'utf8');

// Reduce global section padding to tighten the layout
style = style.replace(/\.section-padding\s*\{\s*padding:\s*4rem 0;\s*\}/g, '.section-padding {\n  padding: 2.5rem 0;\n}');

// Also there might be a margin-bottom of 2rem on section-title, let's keep it but maybe it's fine.
// Any other huge paddings? Let's reduce padding in mla-profile-section or stats-banner if they have custom ones.
// I will append a utility to specifically trim whitespace if needed, but reducing section-padding should fix most of it.

fs.writeFileSync('css/style.css', style);
console.log("Reduced global section padding from 4rem to 2.5rem");

// Let's also check index.html for any inline margins that are too big.
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/margin-bottom: 3rem;/g, 'margin-bottom: 1.5rem;');
html = html.replace(/margin-bottom: 2rem;/g, 'margin-bottom: 1rem;');
// We also have multiple empty lines in index.html which don't affect layout but let's clean them up.
html = html.replace(/\n\s*\n\s*\n/g, '\n\n'); 

fs.writeFileSync('index.html', html);
console.log("Reduced inline margins in index.html and cleaned up empty lines");
