/**
 * TVK Tambaram MLA - Portal Script (app.js)
 * Implements English/Tamil language translation engines, dynamic DOM rendering,
 * real-time search engine, petition form handling, and modal players.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Language & Translation Engine State
  let currentLang = localStorage.getItem("tvk_tambaram_lang") || "ta"; // Default to Tamil!
  let allNews = [];
  let allProjects = [];
  let allGallery = [];
  let allVideos = [];
  let siteConfig = {};

  // Interface Translation Dictionary
  const uiTranslations = {
    en: {
      nav_home: "Home",
      nav_about: "About Leader",
      nav_news: "News & Media",
      nav_projects: "Welfare & Schemes",
      nav_gallery: "Gallery",
      nav_grievance: "MLA Grievance",
      nav_admin: "Admin Control",
      breaking_news: "Breaking News",
      featured_tag: "Featured News",
      sidebar_title: "Latest Updates",
      filter_all: "All News",
      filter_constituency: "Constituency Work",
      filter_welfare: "Welfare Activities",
      filter_press: "Press Releases",
      search_placeholder: "Search updates...",
      read_more: "Read More",
      about_title: "Tambaram MLA & Cabinet Minister",
      about_badge: "Hon'ble Minister & Tambaram MLA",
      profile_mla_name: "D. Sarathkumar",
      profile_mla_title: "Cabinet Minister for Human Resources Management & Tambaram MLA",
      profile_mla_bio_1: "D. Sarathkumar is the Cabinet Minister for Human Resources Management of Tamil Nadu and the elected Member of Legislative Assembly (MLA) representing the Tambaram constituency. With a dedicated focus on public administration and citizen service, he works continuously to bring infrastructural and welfare development to the residents of Tambaram.",
      profile_mla_bio_2: "His priority areas include modernization of public services, local corporation infrastructure desilting and storm water drain upgrades, free educational programs for underprivileged students, and active citizen grievance redressal.",
      about_minister_label: "Minister Portfolio",
      highlight_1_title: "HRM Ministry",
      highlight_1_desc: "Directing administrative and employment reforms for public services.",
      highlight_2_title: "Tambaram MLA",
      highlight_2_desc: "Serving the residents of Tambaram constituency with dedication.",
      highlight_3_title: "Welfare Schemes",
      highlight_3_desc: "Distributing educational aid, healthcare support, and employment skills.",
      highlight_4_title: "Active Redressal",
      highlight_4_desc: "Resolving civic issues (water, roads, drains) in coordination with Tambaram Corporation.",
      gallery_title: "Media Gallery",
      videos_title: "Video Feeds",
      projects_title: "TVK Welfare Projects",
      projects_subtitle: "Tracking key development works in Tambaram",
      proj_status_completed: "Completed",
      proj_status_ongoing: "In Progress",
      proj_status_planned: "Planned",
      proj_impact: "Public Impact",
      proj_location: "Location",
      grievance_title: "Reach Your MLA & Minister",
      grievance_subtitle: "Submit your local issues directly to Tambaram MLA D. Sarathkumar's desk.",
      grievance_intro: "Are you facing issues with public infrastructure, school facilities, drinking water, or drainage in Tambaram? Fill out the petition below. The MLA Grievance Cell will coordinate with local authorities to resolve it.",
      griev_step_1: "Submit Details Online",
      griev_step_2: "Automatic Tracking ID",
      griev_step_3: "Direct Field Inspection",
      form_name: "Your Full Name",
      form_phone: "Contact Phone Number",
      form_email: "Email Address",
      form_ward: "Select Constituency Ward",
      form_type: "Select Issue Category",
      form_desc: "Detailed Description of Grievance",
      form_desc_placeholder: "Describe your issue, including landmarks and location details in Tambaram...",
      form_submit: "Submit Petition",
      form_submitting: "Submitting...",
      form_success: "Thank you! Your petition has been submitted successfully to MLA office. Tracking ID: ",
      form_error: "Please fill in all required fields accurately.",
      footer_about_desc: "Official public interaction portal for D. Sarathkumar, Cabinet Minister for Human Resources Management & TVK MLA of Tambaram constituency.",
      footer_links_title: "Quick Navigation",
      footer_contact_title: "TVK Constituency Office Address",
      footer_newsletter_title: "Stay Connected",
      footer_newsletter_desc: "Subscribe to receive weekly updates on welfare programs.",
      footer_newsletter_btn: "Join",
      footer_newsletter_success: "Subscribed successfully!",
      footer_copyright: "All Rights Reserved. Tamilaga Vettri Kazhagam.",
      stat_votes_label: "Total Votes Polled",
      stat_margin_label: "Winning Margin",
      stat_projects_label: "Development Works",
      stat_grievance_label: "Petitions Resolved"
    },
    ta: {
      nav_home: "முகப்பு",
      nav_about: "சட்டமன்ற உறுப்பினர் பற்றி",
      nav_news: "செய்திகள்",
      nav_projects: "மக்கள் நலத்திட்டங்கள்",
      nav_gallery: "புகைப்படங்கள்",
      nav_grievance: "எம்.எல்.ஏ மனு பிரிவு",
      nav_admin: "அதிகாரப்பூர்வ பக்கம்",
      breaking_news: "முக்கிய செய்திகள்",
      featured_tag: "சிறப்பு செய்தி",
      sidebar_title: "சமீபத்திய செய்திகள்",
      filter_all: "அனைத்து செய்திகள்",
      filter_constituency: "தொகுதி பணிகள்",
      filter_welfare: "நலத்திட்ட உதவிகள்",
      filter_press: "அறிக்கைகள்",
      search_placeholder: "செய்திகளைத் தேடுக...",
      read_more: "மேலும் படிக்க",
      about_title: "தாம்பரம் சட்டமன்ற உறுப்பினர் & அமைச்சர்",
      about_badge: "மாண்புமிகு அமைச்சர் & தாம்பரம் சட்டமன்ற உறுப்பினர்",
      profile_mla_name: "டி. சரத்குமார்",
      profile_mla_title: "மனிதவள மேலாண்மைத் துறை அமைச்சர் & தாம்பரம் சட்டமன்ற உறுப்பினர்",
      profile_mla_bio_1: "டி. சரத்குமார் அவர்கள் தமிழக அரசின் மனிதவள மேலாண்மைத் துறை அமைச்சராகவும், தாம்பரம் சட்டமன்ற தொகுதி உறுப்பினராகவும் (MLA) மக்கள் பணியாற்றி வருகிறார். தாம்பரம் தொகுதியின் உட்கட்டமைப்பு வசதிகளை மேம்படுத்துவதிலும், ஏழை எளிய மக்களின் வாழ்வாதாரத்தை உயர்த்துவதிலும் அவர் தீவிர கவனம் செலுத்தி வருகிறார்.",
      profile_mla_bio_2: "பொதுமக்களின் குடிநீர் பிரச்சனை, சாலை வசதிகள், மழைநீர் வடிகால் அமைப்புகள் மற்றும் இளைஞர்களுக்கான வேலைவாய்ப்பு பயிற்சி வகுப்புகள் போன்ற தொகுதி சார்ந்த திட்டங்களை முன்னின்று செயல்படுத்தி வருகிறார்.",
      about_minister_label: "அமைச்சரவை துறை",
      highlight_1_title: "மனிதவள மேலாண்மைத் துறை",
      highlight_1_desc: "அரசு வேலைவாய்ப்பு சீர்திருத்தங்கள், அரசுப் பணியாளர் திறன் மேம்பாடு.",
      highlight_2_title: "தாம்பரம் எம்.எல்.ஏ",
      highlight_2_desc: "தாம்பரம் தொகுதி மக்களின் தேவைகளுக்கு முன்னுரிமை அளித்து மக்கள் பணியாற்றுதல்.",
      highlight_3_title: "நலத்திட்ட உதவிகள்",
      highlight_3_desc: "தொகுதி மக்களுக்கு கல்வி உதவித்தொகை, மருத்துவ உதவிகள் வழங்குதல்.",
      highlight_4_title: "குறைதீர்ப்பு முகாம்",
      highlight_4_desc: "தாம்பரம் மாநகராட்சி வார்டு பிரச்சனைகளுக்கு விரைவான தீர்வு காணுதல்.",
      gallery_title: "புகைப்பட கேலரி",
      videos_title: "காணொளிகள்",
      projects_title: "தவெக மக்கள் திட்டங்கள்",
      projects_subtitle: "தாம்பரம் தொகுதியில் நடைபெறும் முக்கிய மக்கள் நலத் திட்டங்களின் விபரம்",
      proj_status_completed: "நிறைவடைந்தது",
      proj_status_ongoing: "தொடர்கிறது",
      proj_status_planned: "திட்டமிடப்பட்டுள்ளது",
      proj_impact: "மக்கள் பயன்பாடு",
      proj_location: "இடம்",
      grievance_title: "உங்கள் சட்டமன்ற உறுப்பினரிடம் மனு கொடுங்கள்",
      grievance_subtitle: "உங்கள் வார்டு மற்றும் பகுதி பிரச்சனைகளை நேரடியாக தாம்பரம் சட்டமன்ற உறுப்பினர் டி. சரத்குமார் அவர்களின் கவனத்திற்கு கொண்டு செல்லுங்கள்.",
      grievance_intro: "தாம்பரம் மாநகராட்சி பகுதியில் குடிநீர் தட்டுப்பாடு, பொது சுகாதாரம், சாலை வசதி, அல்லது வடிகால் பிரச்சனைகள் இருந்தால் கீழே உள்ள படிவத்தில் மனுவை சமர்ப்பிக்கவும். உடனடியாக நடவடிக்கை எடுக்கப்படும்.",
      griev_step_1: "விபரங்களை ஆன்லைனில் பதிவு செய்தல்",
      griev_step_2: "மனு எண் பெறுதல்",
      griev_step_3: "நேரடி கள ஆய்வு",
      form_name: "உங்கள் முழு பெயர்",
      form_phone: "தொடர்பு தொலைபேசி எண்",
      form_email: "மின்னஞ்சல் முகவரி",
      form_ward: "உங்களது வார்டை தேர்வு செய்க",
      form_type: "பிரச்சனையின் வகை",
      form_desc: "மனுவின் விரிவான விபரம்",
      form_desc_placeholder: "பிரச்சனை உள்ள இடம், தெருவின் பெயர் மற்றும் அடையாளங்களை விரிவாக விவரிக்கவும்...",
      form_submit: "மனுவைச் சமர்ப்பி",
      form_submitting: "சமர்ப்பிக்கப்படுகிறது...",
      form_success: "நன்றி! உங்கள் மனு வெற்றிகரமாக சட்டமன்ற உறுப்பினர் அலுவலகத்தில் சமர்ப்பிக்கப்பட்டது. மனு எண்: ",
      form_error: "தயவுசெய்து அனைத்து விபரங்களையும் சரியாக நிரப்பவும்.",
      footer_about_desc: "தாம்பரம் தொகுதி சட்டமன்ற உறுப்பினரும் மாண்புமிகு மனிதவள மேலாண்மைத் துறை அமைச்சருமான டி. சரத்குமார் அவர்களின் அதிகாரப்பூர்வ மக்கள் தொடர்பு இணையதளம்.",
      footer_links_title: "இணைப்புகள்",
      footer_contact_title: "தவெக தொகுதி அலுவலக முகவரி",
      footer_newsletter_title: "இணைந்திருங்கள்",
      footer_newsletter_desc: "தாம்பரம் தொகுதி வளர்ச்சிப் பணிகள் மற்றும் கொள்கைகள் குறித்த விபரங்களை மின்னஞ்சலில் பெறுக.",
      footer_newsletter_btn: "பதிவு செய்",
      footer_newsletter_success: "பதிவு செய்யப்பட்டது!",
      footer_copyright: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தமிழக வெற்றி கழகம்.",
      stat_votes_label: "பதிவான மொத்த வாக்குகள்",
      stat_margin_label: "வெற்றி முகாம் வாக்குகள்",
      stat_projects_label: "நிறைவேற்றப்பட்ட திட்டங்கள்",
      stat_grievance_label: "தீர்க்கப்பட்ட மனுக்கள்"
    }
  };

  // 2. DOM Elements Selection
  const elements = {
    langBtn: document.getElementById("lang-toggle-btn"),
    marqueeText: document.getElementById("marquee-text"),
    phoneLink: document.getElementById("phone-link"),
    emailLink: document.getElementById("email-link"),
    addressText: document.getElementById("address-text"),
    socialFb: document.getElementById("social-fb"),
    socialTw: document.getElementById("social-tw"),
    socialIg: document.getElementById("social-ig"),
    socialYt: document.getElementById("social-yt"),
    siteTitle: document.querySelector("title"),
    brandTitle: document.getElementById("brand-title"),
    brandSubtitle: document.getElementById("brand-sub"),
    headerAvatar: document.getElementById("header-avatar"),
    headerMlaName: document.getElementById("header-mla-name"),
    headerMlaTitle: document.getElementById("header-mla-title"),
    
    // Hero & Sidebar News
    featuredImg: document.getElementById("featured-img"),
    featuredCategory: document.getElementById("featured-category"),
    featuredTitle: document.getElementById("featured-title"),
    featuredDesc: document.getElementById("featured-desc"),
    featuredDate: document.getElementById("featured-date"),
    featuredStoryCard: document.getElementById("featured-story-card"),
    sidebarNewsList: document.getElementById("sidebar-news-list"),
    
    // News Hub
    newsGrid: document.getElementById("news-grid"),
    filterTabs: document.querySelectorAll(".filter-tab"),
    searchInput: document.getElementById("news-search"),
    
    // Projects
    projectsGrid: document.getElementById("projects-grid"),
    
    // Media & Gallery
    galleryGrid: document.getElementById("gallery-grid"),
    videoPlayerFrame: document.getElementById("video-player-frame"),
    videoListSidebar: document.getElementById("video-list-sidebar"),
    
    // Grievance Form
    grievanceForm: document.getElementById("grievance-form"),
    grievanceAlert: document.getElementById("grievance-alert"),
    
    // Footer
    footerDesc: document.getElementById("footer-desc"),
    footerAddress: document.getElementById("footer-address"),
    footerCopyright: document.getElementById("footer-copyright"),
    
    // Modal
    modalOverlay: document.getElementById("info-modal"),
    modalClose: document.getElementById("modal-close-btn"),
    modalBody: document.getElementById("modal-body-content"),
    
    // Newsletter
    newsletterForm: document.getElementById("newsletter-form"),
    newsletterInput: document.getElementById("newsletter-input"),
    newsletterBtn: document.getElementById("newsletter-btn")
  };

  // ---------------- DATA SYNCHRONIZATION ----------------
  const loadDataFromDb = () => {
    siteConfig = TVKDb.getConfig();
    allNews = TVKDb.getNews();
    allProjects = TVKDb.getProjects();
    allGallery = TVKDb.getGallery();
    allVideos = TVKDb.getVideos();
  };

  // ---------------- TRANSLATION INJECTOR ----------------
  const updateLanguageUI = () => {
    loadDataFromDb();
    const t = uiTranslations[currentLang];
    
    // Translate plain textual nodes (matching IDs with data-i18n attributes)
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.setAttribute("placeholder", t[key]);
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Toggle button label
    if (elements.langBtn) elements.langBtn.textContent = currentLang === "en" ? "தமிழ்" : "English";

    // Dynamic Database Translations based on chosen language keys
    if (elements.siteTitle) elements.siteTitle.textContent = siteConfig[`site_title_${currentLang}`];
    if (elements.brandTitle) elements.brandTitle.textContent = siteConfig[`party_name_${currentLang}`];
    if (elements.brandSubtitle) elements.brandSubtitle.textContent = siteConfig[`mla_title_${currentLang}`];
    if (elements.marqueeText) elements.marqueeText.textContent = siteConfig[`marquee_news_${currentLang}`];
    if (elements.headerMlaName) elements.headerMlaName.textContent = siteConfig[`mla_name_${currentLang}`];
    if (elements.headerMlaTitle) elements.headerMlaTitle.textContent = siteConfig[`mla_title_${currentLang}`];
    
    // Static fields
    if (elements.phoneLink) {
      elements.phoneLink.textContent = siteConfig.phone || "";
      elements.phoneLink.href = `tel:${siteConfig.phone || ""}`;
    }
    if (elements.emailLink) {
      elements.emailLink.textContent = siteConfig.email || "";
      elements.emailLink.href = `mailto:${siteConfig.email || ""}`;
    }
    if (elements.addressText) elements.addressText.textContent = siteConfig[`office_address_${currentLang}`] || "";
    
    if (elements.socialFb) elements.socialFb.href = siteConfig.facebook || "#";
    if (elements.socialTw) elements.socialTw.href = siteConfig.twitter || "#";
    if (elements.socialIg) elements.socialIg.href = siteConfig.instagram || "#";
    if (elements.socialYt) elements.socialYt.href = siteConfig.youtube || "#";
    
    if (elements.headerAvatar) {
      let logoSrc = siteConfig.leader_image_url || "images/tvklogo.png";
      if (logoSrc.includes("tvk_logo.png")) {
        logoSrc = "images/tvklogo.png";
      }
      elements.headerAvatar.src = logoSrc;
    }
    if (siteConfig.mla_image_url) {
      const mlaProfileImg = document.getElementById("profile-mla-img");
      if (mlaProfileImg) mlaProfileImg.src = siteConfig.mla_image_url;
    }

    // Footer translations
    if (elements.footerDesc) elements.footerDesc.textContent = t.footer_about_desc;
    if (elements.footerAddress) elements.footerAddress.textContent = siteConfig[`office_address_${currentLang}`] || "";
    if (elements.footerCopyright) elements.footerCopyright.textContent = `© 2026 ${t.footer_copyright}`;

    // Link dynamic sidebar social follow widgets
    const followFb = document.getElementById("follow-fb");
    const followTw = document.getElementById("follow-tw");
    const followIg = document.getElementById("follow-ig");
    const followYt = document.getElementById("follow-yt");
    if (followFb) followFb.href = siteConfig.facebook || "#";
    if (followTw) followTw.href = siteConfig.twitter || "#";
    if (followIg) followIg.href = siteConfig.instagram || "#";
    if (followYt) followYt.href = siteConfig.youtube || "#";

    // Re-render all dynamic listing items under the updated translation state
    renderHeroNews();
    renderPressReleases();
    renderConstituencyNews();
    renderProjectsBoard();
    renderGalleryGrid();
    renderVideoSection();
  };

  // Toggle Language Handler
  if (elements.langBtn) {
    elements.langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "ta" : "en";
      localStorage.setItem("tvk_tambaram_lang", currentLang);
      updateLanguageUI();
    });
  }

  // ---------------- RENDER 1: HERO FEATURED NEWS ----------------
  const renderHeroNews = () => {
    const featured = allNews.find(n => n.is_featured) || allNews[0];
    if (!featured) return;

    // Featured Block rendering
    if (elements.featuredImg) elements.featuredImg.src = featured.image_url;
    if (elements.featuredCategory) elements.featuredCategory.textContent = currentLang === "en" ? featured.category : getCategoryTamil(featured.category);
    if (elements.featuredTitle) elements.featuredTitle.textContent = featured[`title_${currentLang}`];
    if (elements.featuredDesc) elements.featuredDesc.textContent = featured[`content_${currentLang}`];
    
    const formattedDate = formatDateString(featured.date);
    if (elements.featuredDate) elements.featuredDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;

    // Add click event to open featured story
    if (elements.featuredStoryCard) {
      elements.featuredStoryCard.onclick = () => openNewsModal(featured.id);
    }

    // Sidebar small news updates rendering (other than the featured story)
    const sidebarItems = allNews.filter(n => n.id !== featured.id).slice(0, 3);
    if (elements.sidebarNewsList) {
      elements.sidebarNewsList.innerHTML = "";
      
      if (sidebarItems.length === 0) {
        elements.sidebarNewsList.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No other news available.</p>`;
        return;
      }

      sidebarItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "sidebar-card";
        card.onclick = () => openNewsModal(item.id);
        
        card.innerHTML = `
          <img class="sidebar-thumb" src="${item.image_url}" alt="News thumbnail" referrerpolicy="no-referrer">
          <div class="sidebar-card-content">
            <h5 class="sidebar-card-title">${item[`title_${currentLang}`]}</h5>
            <span class="sidebar-card-date"><i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}</span>
          </div>
        `;
        elements.sidebarNewsList.appendChild(card);
      });
    }
  };

  // ---------------- RENDER 2: PRESS RELEASES (அறிக்கைகள்) ----------------
  const renderPressReleases = () => {
    const pressList = allNews.filter(n => n.category === "Press Releases");
    const featured = pressList[0];
    
    // Render featured card
    const featCard = document.getElementById("press-featured-card");
    const featImg = document.getElementById("press-featured-img");
    const featTitle = document.getElementById("press-featured-title");
    const featDesc = document.getElementById("press-featured-desc");
    const featDate = document.getElementById("press-featured-date");
    
    if (featured) {
      if (featCard) {
        featCard.style.display = "block";
        featCard.onclick = () => openNewsModal(featured.id);
      }
      if (featImg) featImg.src = featured.image_url;
      if (featTitle) featTitle.textContent = featured[`title_${currentLang}`];
      if (featDesc) featDesc.textContent = featured[`content_${currentLang}`];
      if (featDate) featDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDateString(featured.date)}`;
    } else {
      if (featCard) featCard.style.display = "none";
    }

    // Render list cards
    const sidebarList = document.getElementById("press-sidebar-list");
    if (sidebarList) {
      sidebarList.innerHTML = "";
      const listItems = pressList.slice(1, 5);
      
      if (listItems.length === 0) {
        sidebarList.innerHTML = `<p style="padding: 2.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No other press releases available.</p>`;
        return;
      }

      listItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "press-card-mini";
        card.onclick = () => openNewsModal(item.id);
        
        card.innerHTML = `
          <img class="press-thumb" src="${item.image_url}" alt="Press release thumbnail" referrerpolicy="no-referrer">
          <div class="press-card-mini-body">
            <h5 class="press-card-mini-title">${item[`title_${currentLang}`]}</h5>
            <span class="press-card-mini-date"><i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}</span>
          </div>
        `;
        sidebarList.appendChild(card);
      });
    }
  };

  // ---------------- RENDER 3: CONSTITUENCY NEWS GRID ----------------
  let searchQuery = "";

  const renderConstituencyNews = () => {
    if (!elements.newsGrid) return;
    elements.newsGrid.innerHTML = "";
    const t = uiTranslations[currentLang];

    const filteredNews = allNews.filter(item => {
      const isConstituencyOrWelfare = item.category === "Constituency Work" || item.category === "Welfare Activities";
      const matchesSearch = item[`title_${currentLang}`].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item[`content_${currentLang}`].toLowerCase().includes(searchQuery.toLowerCase());
      return isConstituencyOrWelfare && matchesSearch;
    });

    if (filteredNews.length === 0) {
      elements.newsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #FFF; border-radius: 12px; border: 1px dashed var(--border-color);">
          <i class="far fa-newspaper" style="font-size: 3rem; color: var(--primary); opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
          <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500;">
            ${currentLang === "en" ? "No news matches your search." : "தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை."}
          </p>
        </div>
      `;
      return;
    }

    filteredNews.forEach(item => {
      const card = document.createElement("div");
      card.className = "news-card";
      
      card.innerHTML = `
        <div class="news-card-img-wrap">
          <img class="news-card-img" src="${item.image_url}" alt="News image" referrerpolicy="no-referrer">
          <span class="badge badge-primary news-card-category">${currentLang === "en" ? item.category : getCategoryTamil(item.category)}</span>
        </div>
        <div class="news-card-body">
          <span class="news-card-date"><i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}</span>
          <h4 class="news-card-title">${item[`title_${currentLang}`]}</h4>
          <p class="news-card-desc">${item[`content_${currentLang}`]}</p>
        </div>
        <div class="news-card-footer">
          <button class="read-more-btn" onclick="openNewsModal('${item.id}')">
            ${t.read_more} <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
          </button>
        </div>
      `;
      elements.newsGrid.appendChild(card);
    });
  };

  // Helper category Tamil translators
  const getCategoryTamil = (cat) => {
    const categories = {
      "Constituency Work": "தொகுதி பணிகள்",
      "Welfare Activities": "நலத்திட்ட உதவிகள்",
      "Press Releases": "அறிக்கைகள்"
    };
    return categories[cat] || cat;
  };

  // Search Input Listener
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderConstituencyNews();
    });
  }

  // ---------------- RENDER 3: PROJECTS BOARD ----------------
  const renderProjectsBoard = () => {
    if (!elements.projectsGrid) return;
    elements.projectsGrid.innerHTML = "";
    const t = uiTranslations[currentLang];

    if (allProjects.length === 0) {
      elements.projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No projects available.</p>`;
      return;
    }

    allProjects.forEach(proj => {
      const card = document.createElement("div");
      card.className = `project-card status-${proj.status}`;
      
      card.innerHTML = `
        <div class="project-header">
          <span class="status-pill">${t[`proj_status_${proj.status}`]}</span>
        </div>
        <h4 class="project-title">${proj[`title_${currentLang}`]}</h4>
        <p class="project-desc">${proj[`description_${currentLang}`]}</p>
        <div class="project-meta-item">
          <span class="project-meta-label">${t.proj_location}</span>
          <span class="project-meta-value">${proj[`location_${currentLang}`]}</span>
        </div>
        <div class="project-meta-item">
          <span class="project-meta-label">${t.proj_impact}</span>
          <span class="project-meta-value" style="color: var(--primary); font-weight: 600;">${proj[`impact_${currentLang}`]}</span>
        </div>
      `;
      elements.projectsGrid.appendChild(card);
    });
  };

  // ---------------- RENDER 4: PHOTO GALLERY & VIDEO SECTION ----------------
  const renderGalleryGrid = () => {
    if (!elements.galleryGrid) return;
    elements.galleryGrid.innerHTML = "";
    if (allGallery.length === 0) {
      elements.galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No photos available.</p>`;
      return;
    }

    allGallery.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.onclick = () => openLightbox(item.id);
      
      card.innerHTML = `
        <img class="gallery-img" src="${item.image_url}" alt="Gallery photo" referrerpolicy="no-referrer">
        <div class="gallery-card-overlay">
          <p class="gallery-card-caption">${item[`caption_${currentLang}`]}</p>
          <span class="gallery-card-date">${formatDateString(item.date)}</span>
        </div>
      `;
      elements.galleryGrid.appendChild(card);
    });
  };

  const renderVideoSection = () => {
    if (!elements.videoListSidebar) return;
    elements.videoListSidebar.innerHTML = "";
    if (allVideos.length === 0) {
      elements.videoListSidebar.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No videos available.</p>`;
      return;
    }

    // Set initial main video iframe source if not loaded
    const initialVid = allVideos[0];
    if (initialVid && elements.videoPlayerFrame && !elements.videoPlayerFrame.src) {
      elements.videoPlayerFrame.src = initialVid.video_url;
    }

    allVideos.forEach((vid, index) => {
      const card = document.createElement("div");
      card.className = `video-item-card ${index === 0 ? "active" : ""}`;
      card.onclick = () => playSelectedVideo(vid.video_url, card);
      
      card.innerHTML = `
        <div class="video-thumb-wrap">
          <img class="video-thumb" src="${vid.thumbnail_url}" alt="Video thumbnail" referrerpolicy="no-referrer">
          <div class="video-thumb-play"><i class="fas fa-play"></i></div>
        </div>
        <div class="video-item-info">
          <h5 class="video-item-title">${vid[`title_${currentLang}`]}</h5>
        </div>
      `;
      elements.videoListSidebar.appendChild(card);
    });
  };

  const playSelectedVideo = (url, cardEl) => {
    if (elements.videoPlayerFrame) elements.videoPlayerFrame.src = url;
    document.querySelectorAll(".video-item-card").forEach(c => c.classList.remove("active"));
    cardEl.classList.add("active");
  };

  // ---------------- RENDER 5: MODALS (NEWS & GALLERY LIGHTBOX) ----------------
  const openNewsModal = (id) => {
    const item = allNews.find(n => n.id === id);
    if (!item) return;

    elements.modalBody.innerHTML = `
      <img class="modal-news-img" src="${item.image_url}" alt="Full article image" referrerpolicy="no-referrer">
      <h3 class="modal-news-title">${item[`title_${currentLang}`]}</h3>
      <div class="modal-news-meta">
        <span><i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}</span>
        <span><i class="far fa-newspaper"></i> ${currentLang === "en" ? item.category : getCategoryTamil(item.category)}</span>
      </div>
      <div class="modal-news-text">
        <p>${item[`content_${currentLang}`].replace(/\n/g, "</p><p>")}</p>
      </div>
    `;

    elements.modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const openLightbox = (id) => {
    const item = allGallery.find(g => g.id === id);
    if (!item) return;

    elements.modalBody.innerHTML = `
      <div class="lightbox-body">
        <img class="lightbox-img" src="${item.image_url}" alt="Lightbox photo" referrerpolicy="no-referrer">
        <p class="lightbox-caption">${item[`caption_${currentLang}`]}</p>
        <span class="gallery-card-date">${formatDateString(item.date)}</span>
      </div>
    `;

    elements.modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  // Modal Close handler
  const closeModal = () => {
    elements.modalOverlay.style.display = "none";
    document.body.style.overflow = ""; // Re-enable scrolling
    elements.modalBody.innerHTML = "";
  };

  elements.modalClose.onclick = closeModal;
  elements.modalOverlay.onclick = (e) => {
    if (e.target === elements.modalOverlay) closeModal();
  };

  // ---------------- CITIZEN GRIEVANCE PORTAL HANDLING ----------------
  elements.grievanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = uiTranslations[currentLang];
    
    const name = document.getElementById("grievance-name").value.trim();
    const phone = document.getElementById("grievance-phone").value.trim();
    const email = document.getElementById("grievance-email").value.trim();
    const ward = document.getElementById("grievance-ward").value;
    const type = document.getElementById("grievance-type").value;
    const description = document.getElementById("grievance-desc").value.trim();

    if (!name || !phone || !ward || !type || !description) {
      showGrievanceAlert(t.form_error, "error");
      return;
    }

    const petition = {
      name,
      phone,
      email,
      ward_no: ward,
      grievance_type: type,
      description
    };

    const saved = TVKDb.addGrievance(petition);
    
    // Success feedback
    showGrievanceAlert(`${t.form_success} <strong>${saved.id}</strong>`, "success");
    elements.grievanceForm.reset();
  });

  const showGrievanceAlert = (msg, status) => {
    elements.grievanceAlert.className = `custom-alert custom-alert-${status}`;
    elements.grievanceAlert.innerHTML = `
      <i class="${status === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
      <span>${msg}</span>
    `;
    elements.grievanceAlert.style.display = "flex";
    
    // Auto-scroll to alert
    elements.grievanceAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // ---------------- NEWSLETTER FORM HANDLING ----------------
  elements.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = uiTranslations[currentLang];
    const email = elements.newsletterInput.value.trim();
    
    if (email) {
      elements.newsletterBtn.textContent = "✓";
      elements.newsletterInput.value = "";
      elements.newsletterInput.setAttribute("disabled", "true");
      setTimeout(() => {
        elements.newsletterBtn.textContent = t.footer_newsletter_btn;
        elements.newsletterInput.removeAttribute("disabled");
      }, 3000);
    }
  });

  // ---------------- DYNAMIC STATS VALUE COUNTER ----------------
  const animateStatsCounters = () => {
    const stats = [
      { id: "stat-votes", end: 118967, speed: 50, hasPlus: true },
      { id: "stat-margin", end: 35621, speed: 50, hasPlus: true },
      { id: "stat-projects", end: 42, speed: 100, hasPlus: true },
      { id: "stat-grievance", end: 489, speed: 80, hasPlus: true }
    ];

    stats.forEach(stat => {
      const el = document.getElementById(stat.id);
      if (!el) return;
      
      let currentVal = 0;
      const step = Math.ceil(stat.end / 40); // 40 iterations
      
      const timer = setInterval(() => {
        currentVal += step;
        if (currentVal >= stat.end) {
          clearInterval(timer);
          el.textContent = stat.end.toLocaleString("en-IN") + (stat.hasPlus ? "+" : "");
        } else {
          el.textContent = currentVal.toLocaleString("en-IN") + (stat.hasPlus ? "+" : "");
        }
      }, stat.speed);
    });
  };

  // ---------------- DATE FORMATTING HELPER ----------------
  const formatDateString = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateStr);
    
    if (currentLang === "en") {
      return dateObj.toLocaleDateString("en-US", options);
    } else {
      // Tamil Date format helper
      const monthsTamil = [
        "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", 
        "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
      ];
      return `${dateObj.getDate()} ${monthsTamil[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    }
  };

  // ---------------- INITIALIZE PAGE ----------------
  const initPage = async () => {
    // Sync with backend API
    await TVKDb.init();
    
    // Populate dynamic translation nodes
    updateLanguageUI();
    
    // Live date-time ticker update
    setInterval(() => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const dateStr = new Date().toLocaleString(currentLang === "en" ? "en-US" : "ta-IN", options);
      const liveTimeEl = document.getElementById("live-time-node");
      if (liveTimeEl) liveTimeEl.textContent = dateStr;
    }, 1000);

    // Run dynamic counter animations
    animateStatsCounters();
  };

  // Cross-tab real-time sync for immediate reflection of admin changes
  window.addEventListener("storage", (e) => {
    if (e.key === "tvk_tambaram_database") {
      console.log("Database updated in admin tab. Syncing homepage UI instantly...");
      updateLanguageUI();
    }
  });

  initPage();
});
