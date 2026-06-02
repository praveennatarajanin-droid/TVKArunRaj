const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const navEndIndex = indexHtml.indexOf('</nav>') + '</nav>'.length;
const footerStartIndex = indexHtml.indexOf('<footer class="main-footer">');

if (navEndIndex > 0 && footerStartIndex > 0) {
    const headAndNav = indexHtml.substring(0, navEndIndex);
    const footerAndEnd = indexHtml.substring(footerStartIndex);

    const newsContent = `
  <!-- NEWS DETAIL CONTENT -->
  <main class="news-detail-page section-padding" style="background-color: var(--bg-body); padding-top: 2rem;">
    <div class="container news-detail-container" style="max-width: 1200px; display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
      
      <!-- Left Column: Article Content -->
      <article class="news-article-content" style="background: var(--bg-card); padding: 2rem; border-radius: 8px; box-shadow: var(--shadow-sm);">
        
        <!-- Breadcrumbs -->
        <div class="breadcrumbs" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          <a href="index.html" style="color: var(--primary); text-decoration: none;">Home</a> / 
          <span id="breadcrumb-category">News</span> / 
          <span id="breadcrumb-title" style="color: var(--text-color);">Title</span>
        </div>

        <!-- Title -->
        <h1 id="detail-title" style="font-family: var(--font-title); font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem; line-height: 1.3;">Loading...</h1>

        <!-- Meta info -->
        <div class="article-meta" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div style="font-size: 0.9rem; color: var(--text-muted);">
            <span id="detail-date"><i class="far fa-calendar-alt"></i> Loading...</span> | 
            <span><i class="far fa-user"></i> Admin</span>
          </div>
          <!-- Share buttons -->
          <div class="share-buttons" style="display: flex; gap: 0.5rem;">
            <button style="border: 1px solid var(--border-color); background: none; color: var(--text-color); padding: 0.4rem 0.6rem; cursor: pointer; border-radius: 4px;" onclick="window.print()"><i class="fas fa-print"></i></button>
            <a href="https://facebook.com/drarunrajtvk" target="_blank" style="background: #3b5998; color: #fff; padding: 0.4rem 0.6rem; border-radius: 4px; text-decoration: none;"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/drarunrajtvk" target="_blank" style="background: #1da1f2; color: #fff; padding: 0.4rem 0.6rem; border-radius: 4px; text-decoration: none;"><i class="fab fa-twitter"></i></a>
            <a href="https://wa.me/?text=Check%20out%20this%20news" target="_blank" style="background: #25d366; color: #fff; padding: 0.4rem 0.6rem; border-radius: 4px; text-decoration: none;"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>

        <!-- Featured Image -->
        <div style="margin-bottom: 2rem;">
          <img id="detail-img" src="" alt="News Image" style="width: 100%; height: auto; border-radius: 8px; box-shadow: var(--shadow-sm);" referrerpolicy="no-referrer">
        </div>

        <!-- Content -->
        <div id="detail-content" style="font-size: 1.1rem; line-height: 1.8; color: var(--text-color); margin-bottom: 2rem;">
          Loading content...
        </div>

        <!-- Tags -->
        <div class="article-tags" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
          <span style="font-weight: bold; color: var(--text-color);">Tags:</span>
          <span id="detail-category-tag" style="background: rgba(144,2,32,0.1); color: var(--primary); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; border: 1px solid var(--primary);">News</span>
        </div>

      </article>

      <!-- Right Column: Sidebar -->
      <aside class="news-sidebar" style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Top News Widget -->
        <div class="sidebar-widget" style="background: var(--bg-card); border-radius: 8px; padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <div class="category-ribbon" style="margin-bottom: 1rem;">
            <h3 style="font-size: 1.2rem;">சமீபத்திய செய்திகள்</h3>
            <span class="ribbon-decor" style="font-size: 0.7rem;">Top News</span>
          </div>
          <div id="sidebar-latest-news" style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- dynamically populated -->
            Loading...
          </div>
        </div>

      </aside>

    </div>
    
    <!-- Related News Row (Full Width) -->
    <div class="container" style="max-width: 1200px; margin-top: 3rem;">
        <div class="category-ribbon" style="margin-bottom: 1rem;">
            <h3 style="font-size: 1.5rem;">தொடர்புடைய செய்திகள்</h3>
            <span class="ribbon-decor" style="font-size: 0.8rem;">Related News</span>
        </div>
        <div id="related-news-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <!-- dynamically populated -->
        </div>
    </div>
  </main>
`;

    // Ensure we include news_detail.js at the end
    // Also remove info-modal if it exists since we don't need it on this page.
    let finalHtml = headAndNav + newsContent + footerAndEnd;
    finalHtml = finalHtml.replace('<script src="js/app.js"></script>', '<script src="js/app.js"></script>\n  <script src="js/news_detail.js"></script>');
    
    // Quick and dirty social links fix for the news.html header/footer
    finalHtml = finalHtml.replace(/id="social-fb" href="#"/g, 'id="social-fb" href="https://facebook.com/drarunrajtvk"');
    finalHtml = finalHtml.replace(/id="social-tw" href="#"/g, 'id="social-tw" href="https://twitter.com/drarunrajtvk"');
    finalHtml = finalHtml.replace(/id="social-ig" href="#"/g, 'id="social-ig" href="https://instagram.com/drarunrajtvk"');
    finalHtml = finalHtml.replace(/id="social-yt" href="#"/g, 'id="social-yt" href="https://youtube.com/@drarunrajtvk"');

    fs.writeFileSync('news.html', finalHtml);
    console.log('Successfully created news.html');
} else {
    console.log('Failed to find cut points in index.html');
}
