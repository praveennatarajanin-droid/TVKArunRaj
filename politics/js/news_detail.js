document.addEventListener("DOMContentLoaded", async () => {
    // Initialize DB if not already initialized
    if(typeof TVKDb !== 'undefined') {
        await TVKDb.init();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    const currentLang = localStorage.getItem("tvk_tiruchengodu_lang") || "ta";
    
    // Fallback getter if TVKDb exposes getNews, else try to read from local storage directly
    let allNews = [];
    if(typeof TVKDb !== 'undefined' && TVKDb.getNews) {
        allNews = TVKDb.getNews();
    } else {
        const stored = localStorage.getItem("tvk_tiruchengodu_database");
        if(stored) {
            allNews = JSON.parse(stored).news || [];
        }
    }
    
    const newsItem = allNews.find(n => n.id === newsId);
    
    if (!newsItem) {
        document.getElementById('detail-title').textContent = "செய்தி கிடைக்கவில்லை / News not found.";
        document.getElementById('detail-content').textContent = "";
        return;
    }
    
    // Translation dictionary for categories
    const categoriesTamil = {
        "Constituency Work": "தொகுதி பணிகள்",
        "Welfare Activities": "நலத்திட்ட உதவிகள்",
        "Press Releases": "அறிக்கைகள்",
        "Party Alliance": "கூட்டணி",
        "Governance": "நிர்வாகம்"
    };
    
    const categoryStr = currentLang === "en" ? newsItem.category : (categoriesTamil[newsItem.category] || newsItem.category);
    
    // Set text elements
    if(document.getElementById('breadcrumb-category')) document.getElementById('breadcrumb-category').textContent = categoryStr;
    if(document.getElementById('breadcrumb-title')) document.getElementById('breadcrumb-title').textContent = newsItem[`title_${currentLang}`];
    if(document.getElementById('detail-title')) document.getElementById('detail-title').textContent = newsItem[`title_${currentLang}`];
    
    // Format date
    const dateObj = new Date(newsItem.date);
    let formattedDate = "";
    if(currentLang === "en") {
        formattedDate = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    } else {
        const monthsTamil = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];
        formattedDate = `${dateObj.getDate()} ${monthsTamil[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    }
    
    if(document.getElementById('detail-date')) document.getElementById('detail-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
    if(document.getElementById('detail-img')) document.getElementById('detail-img').src = newsItem.image_url;
    if(document.getElementById('detail-content')) document.getElementById('detail-content').innerHTML = newsItem[`content_${currentLang}`].replace(/\n/g, "<br><br>");
    if(document.getElementById('detail-category-tag')) document.getElementById('detail-category-tag').textContent = categoryStr;
    
    // Populate Sidebar Latest News
    const sidebarContainer = document.getElementById('sidebar-latest-news');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = '';
        const topNews = allNews.filter(n => n.id !== newsId).slice(0, 4);
        topNews.forEach(item => {
            const cat = currentLang === "en" ? item.category : (categoriesTamil[item.category] || item.category);
            sidebarContainer.innerHTML += `
                <div style="display: flex; gap: 1rem; cursor: pointer; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem;" onclick="window.location.href='news.html?id=${item.id}'">
                    <img src="${item.image_url}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;" referrerpolicy="no-referrer">
                    <div>
                        <h5 style="font-size: 0.85rem; margin-bottom: 0.3rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--text-color);">${item[`title_${currentLang}`]}</h5>
                        <span style="font-size: 0.7rem; color: var(--primary); font-weight: bold;">${cat}</span>
                    </div>
                </div>
            `;
        });
    }

    // Populate Related News Grid
    const relatedContainer = document.getElementById('related-news-grid');
    if (relatedContainer) {
        relatedContainer.innerHTML = '';
        let relatedNews = allNews.filter(n => n.id !== newsId && n.category === newsItem.category).slice(0, 4);
        
        // Fallback if not enough related news
        if(relatedNews.length < 3) {
            relatedNews = allNews.filter(n => n.id !== newsId).slice(2, 6); // Grab some other news
        }
        
        relatedNews.forEach(item => {
            relatedContainer.innerHTML += `
                <div style="background: var(--bg-card); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); cursor: pointer; border: 1px solid var(--border-color); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'" onclick="window.location.href='news.html?id=${item.id}'">
                    <img src="${item.image_url}" style="width: 100%; height: 160px; object-fit: cover;" referrerpolicy="no-referrer">
                    <div style="padding: 1rem;">
                        <span style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; display: block;">${formatDate(item.date, currentLang)}</span>
                        <h4 style="font-size: 1rem; font-weight: bold; margin-bottom: 0.5rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--text-color);">${item[`title_${currentLang}`]}</h4>
                    </div>
                </div>
            `;
        });
    }

    // Share Links logic (update href dynamically if needed, current URL)
    const pageUrl = window.location.href;
    const pageTitle = encodeURIComponent(newsItem[`title_${currentLang}`]);
    const encodedUrl = encodeURIComponent(pageUrl);
    
    const fbShare = document.querySelector('.share-buttons a[href*="facebook.com"]');
    const twShare = document.querySelector('.share-buttons a[href*="twitter.com"]');
    const waShare = document.querySelector('.share-buttons a[href*="whatsapp"]');

    if (fbShare) fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    if (twShare) twShare.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${pageTitle}`;
    if (waShare) waShare.href = `https://wa.me/?text=${pageTitle}%20${encodedUrl}`;
    
    // Helper function scoped to this block for related cards
    function formatDate(dateStr, lang) {
        const dObj = new Date(dateStr);
        if (lang === "en") {
            return dObj.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
        } else {
            const mTamil = ["ஜன", "பிப்", "மார்", "ஏப்", "மே", "ஜூன்", "ஜூலை", "ஆக", "செப்", "அக்ட்", "நவ", "டிச"];
            return `${dObj.getDate()} ${mTamil[dObj.getMonth()]}, ${dObj.getFullYear()}`;
        }
    }
});
