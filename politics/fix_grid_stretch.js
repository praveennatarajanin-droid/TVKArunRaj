const fs = require('fs');

const cssOverride = `

/* ==========================================================================
   FIX FOR GRID STRETCHING (REMOVING UNWANTED WHITESPACE IN CARDS)
   ========================================================================== */

.news-portal-wrapper {
  align-items: start !important;
}
`;

fs.appendFileSync('css/style.css', cssOverride);
console.log("Appended grid stretch fix to style.css");
