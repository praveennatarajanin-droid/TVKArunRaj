const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const fixSidebarHeight = `

/* OVERRIDE: Limit sidebar height to prevent it from outgrowing the main column and creating a white void */
.news-sidebar-column {
  /* No longer need sticky if we are just shortening it, but sticky is good. */
}

/* Hide the Anjali Ammal Ad block since it's a massive placeholder causing empty space */
.news-sidebar-column > .sidebar-widget[style*="border-radius"] {
  display: none !important;
}

/* Limit the number of recommended posts shown to a maximum of 3 to balance the columns */
#side-news-list .recommended-item:nth-child(n+4) {
  display: none !important;
}
`;

fs.appendFileSync('css/style.css', fixSidebarHeight);
console.log("Applied sidebar height limit CSS.");
