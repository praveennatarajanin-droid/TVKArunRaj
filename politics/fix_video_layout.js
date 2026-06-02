const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const overrideCss = `

/* OVERRIDE: Video layout changed to single column full-width since sidebar was removed */
.video-center-layout {
  grid-template-columns: 1fr !important;
}
`;

fs.appendFileSync('css/style.css', overrideCss);
console.log("Appended override for video center layout.");
