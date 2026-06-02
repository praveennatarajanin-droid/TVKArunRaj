const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

const mobileFixes = `

/* --- COMPREHENSIVE MOBILE RESPONSIVENESS FIXES --- */

@media (max-width: 1024px) {
  .news-portal-wrapper {
    grid-template-columns: 1fr !important; /* Stack main content and sidebar */
  }
  
  .hero-grid-trio {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
  }
  
  .editorial-top-block {
    grid-template-columns: 1fr !important; /* Stack featured and lists */
  }
  
  #community-main-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .profile-layout {
    grid-template-columns: 1fr !important;
    text-align: center;
  }
  
  .profile-media {
    margin: 0 auto 2rem auto;
  }
  
  .key-highlights-grid {
    grid-template-columns: 1fr !important;
    text-align: left;
  }
}

@media (max-width: 768px) {
  .editorial-list-columns {
    grid-template-columns: 1fr !important; /* Stack the two list columns */
  }
  
  .bottom-overlay-row, #editorial-bottom-row {
    grid-template-columns: 1fr !important; /* Stack overlay cards */
  }
  
  #community-main-grid {
    grid-template-columns: 1fr !important; /* Single column for community cards */
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .voices-grid {
    grid-template-columns: 1fr !important;
  }
  
  .grievance-layout {
    grid-template-columns: 1fr !important;
  }
  
  .video-center-layout {
    grid-template-columns: 1fr !important;
  }
  
  .follow-grid-premium {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr !important; /* Single column on very small phones */
  }
  
  .top-bar-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-right-actions {
    width: 100%;
  }
  
  .search-input {
    width: 100% !important;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
`;

if (!css.includes('/* --- COMPREHENSIVE MOBILE RESPONSIVENESS FIXES --- */')) {
    fs.appendFileSync('css/style.css', mobileFixes);
    console.log("Appended comprehensive mobile fixes.");
} else {
    console.log("Mobile fixes already exist.");
}
