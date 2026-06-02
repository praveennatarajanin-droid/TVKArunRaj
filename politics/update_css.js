const fs = require('fs');
let styleCss = fs.readFileSync('css/style.css', 'utf8');

const responsiveCss = `

/* --- MOBILE RESPONSIVENESS UPDATES --- */

@media (max-width: 992px) {
  .news-detail-container {
    grid-template-columns: 1fr !important;
  }
  
  .news-sidebar {
    gap: 1.5rem !important;
  }
}

@media (max-width: 768px) {
  /* Fix header branding for mobile */
  .brand-area {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  /* Make sure related news grid stacks correctly */
  #related-news-grid {
    grid-template-columns: 1fr !important;
  }

  /* News article padding reduction */
  .news-article-content {
    padding: 1rem !important;
  }
  
  #detail-title {
    font-size: 1.5rem !important;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-right-actions {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }

  /* Force stacked layout for any main grid not caught */
  .services-interactive-grid, .mega-dropdown-grid, .footer-grid {
    grid-template-columns: 1fr !important;
  }
}
`;

if (!styleCss.includes('/* --- MOBILE RESPONSIVENESS UPDATES --- */')) {
    fs.appendFileSync('css/style.css', responsiveCss);
    console.log('Appended mobile responsiveness updates to css/style.css');
} else {
    console.log('Mobile responsiveness updates already exist in css/style.css');
}
