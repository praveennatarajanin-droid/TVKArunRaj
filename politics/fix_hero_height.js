const fs = require('fs');
const path = require('path');

const cssFilePath = path.join(__dirname, 'css', 'style.css');
let css = fs.readFileSync(cssFilePath, 'utf8');

// 1. Desktop height: 240px -> 380px
css = css.replace(/\.editorial-featured-img-wrap\s*\{\s*width:\s*100%;\s*height:\s*240px;/g, 
  '.editorial-featured-img-wrap {\n  width: 100%;\n  height: 380px;');

// 2. Mobile height: 200px -> 280px
css = css.replace(/\.editorial-featured-img-wrap\s*\{\s*height:\s*200px\s*!important;\s*\/\*\s*Shorter image on mobile\s*\*\/\s*\}/g,
  '.editorial-featured-img-wrap {\n    height: 280px !important; /* Shorter image on mobile */\n  }');

fs.writeFileSync(cssFilePath, css, 'utf8');
console.log('Editorial image height successfully increased to 380px in style.css!');
