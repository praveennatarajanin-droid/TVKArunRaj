/**
 * TVK Tiruchengodu MLA - Portal Script (app.js)
 * Implements English/Tamil language translation engines, dynamic DOM rendering,
 * real-time search engine, petition form handling, and modal players.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Language & Translation Engine State
  let currentLang = localStorage.getItem("tvk_tiruchengodu_lang") || "ta"; // Default to Tamil!
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
      about_title: "Tiruchengodu MLA & Commercial Taxes Minister",
      about_badge: "Hon'ble Minister & Tiruchengodu MLA",
      profile_mla_name: "Dr. K. G. Arunraj",
      profile_mla_title: "Cabinet Minister for Commercial Taxes & Registration & Tiruchengodu MLA",
      profile_mla_bio_1: "Dr. K. G. Arunraj is the Cabinet Minister for Commercial Taxes & Registration of Tamil Nadu and the elected Member of Legislative Assembly (MLA) representing the Tiruchengodu constituency. Combining his medical degree (MBBS) and 15 years of administrative experience as an Ex-IRS officer (Income Tax Consultant), he works to deliver transparent digital services, modern cooperative handloom modernization, and robust welfare programs to the people.",
      profile_mla_bio_2: "His priority areas include expanding multi-specialty wing building works at Tiruchengodu Government Hospital, modernizing cooperative handloom weaver colonies with solar-powered weaver inputs, launching free UPSC & TNPSC competitive coaching centers, and implementing digital deed registration reforms to eliminate intermediaries.",
      about_minister_label: "Minister Portfolio",
      highlight_1_title: "Commercial Taxes",
      highlight_1_desc: "Directing digital e-tax filing and registry transparency reforms.",
      highlight_2_title: "Tiruchengodu MLA",
      highlight_2_desc: "Serving the residents of Tiruchengodu constituency with dedication.",
      highlight_3_title: "Welfare Schemes",
      highlight_3_desc: "Distributing solar loom pads, medical aid, and government exam coaching.",
      highlight_4_title: "Active Redressal",
      highlight_4_desc: "Resolving civic issues (water, roads, drains) in coordination with Tiruchengodu municipal bodies.",
      gallery_title: "Media Gallery",
      videos_title: "Video Feeds",
      projects_title: "TVK Welfare Projects",
      projects_subtitle: "Tracking key development works in Tiruchengodu",
      proj_status_completed: "Completed",
      proj_status_ongoing: "In Progress",
      proj_status_planned: "Planned",
      proj_impact: "Public Impact",
      proj_location: "Location",
      grievance_title: "Reach Your MLA & Minister",
      grievance_subtitle: "Submit your local issues directly to Tiruchengodu MLA Minister Dr. K. G. Arunraj's desk.",
      grievance_intro: "Are you facing issues with public infrastructure, handloom work, drinking water, or hospital wings in Tiruchengodu? Fill out the petition below. The MLA Grievance Cell will coordinate with local authorities to resolve it.",
      griev_step_1: "Submit Details Online",
      griev_step_2: "Automatic Tracking ID",
      griev_step_3: "Direct Field Inspection",
      form_name: "Your Full Name",
      form_phone: "Contact Phone Number",
      form_email: "Email Address",
      form_ward: "Select Constituency Ward",
      form_type: "Select Issue Category",
      form_desc: "Detailed Description of Grievance",
      form_desc_placeholder: "Describe your issue, including landmarks and location details in Tiruchengodu...",
      form_submit: "Submit Petition",
      form_submitting: "Submitting...",
      form_success: "Thank you! Your petition has been submitted successfully to MLA office. Tracking ID: ",
      form_error: "Please fill in all required fields accurately.",
      footer_about_desc: "Official public interaction portal for Dr. K. G. Arunraj, Cabinet Minister for Commercial Taxes & Registration & TVK MLA of Tiruchengodu constituency.",
      footer_links_title: "Quick Navigation",
      footer_contact_title: "TVK Constituency Office Address",
      footer_newsletter_title: "Stay Connected",
      footer_newsletter_desc: "Subscribe to receive weekly updates on welfare programs in Tiruchengodu.",
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
      about_title: "திருச்செங்கோடு சட்டமன்ற உறுப்பினர் & அமைச்சர்",
      about_badge: "மாண்புமிகு அமைச்சர் & திருச்செங்கோடு சட்டமன்ற உறுப்பினர்",
      profile_mla_name: "டாக்டர் கே. ஜி. அருண்ராஜ்",
      profile_mla_title: "வணிகவரி மற்றும் பதிவுத் துறை அமைச்சர் & திருச்செங்கோடு சட்டமன்ற உறுப்பினர்",
      profile_mla_bio_1: "டாக்டர் கே. ஜி. அருண்ராஜ் (Ex-IRS, MBBS) அவர்கள் மாண்புமிகு தமிழக அரசின் வணிகவரி மற்றும் பதிவுத் துறை அமைச்சராகவும், திருச்செங்கோடு சட்டமன்ற தொகுதி உறுப்பினராகவும் (MLA) மக்கள் பணியாற்றி வருகிறார். சிவில் சர்வீசஸ் மற்றும் அரசுத்துறையில் 15 ஆண்டுகள் பணியாற்றிய நிர்வாக அனுபவத்தின் அடிப்படையில், வணிகவரி மற்றும் பத்திரப்பதிவுத்துறையை நவீனப்படுத்தி, தொகுதி வளர்ச்சிப் பணிகளை முன்னெடுத்து வருகிறார்.",
      profile_mla_bio_2: "அரசு மருத்துவமனைகளில் பன்னோக்கு சிறப்பு சிகிச்சை பிரிவுகளை மேம்படுத்தல், கூட்டுறவு கைத்தறி நெசவாளர் குடும்பங்களுக்கு சூரிய சக்தி நவீன கருவிகள் வழங்குதல், நாமக்கல் மாவட்ட இளைஞர்களுக்கான இலவச சிவில் சர்வீசஸ் அகாடமி அமைத்தல் மற்றும் பத்திரப்பதிவை இடைத்தரகர்கள் இன்றி எளிமையாக்குதல் ஆகியவற்றில் தீவிர கவனம் செலுத்தி வருகிறார்.",
      about_minister_label: "அமைச்சரவை துறை",
      highlight_1_title: "வணிகவரி & பத்திரப்பதிவு",
      highlight_1_desc: "டிஜிட்டல் e-வரி தாக்கல் மற்றும் பத்திரப்பதிவு சீர்திருத்தங்கள்.",
      highlight_2_title: "திருச்செங்கோடு எம்.எல்.ஏ",
      highlight_2_desc: "திருச்செங்கோடு தொகுதி மக்களின் தேவைகளுக்கு முன்னுரிமை அளித்து மக்கள் பணியாற்றுதல்.",
      highlight_3_title: "நலத்திட்ட உதவிகள்",
      highlight_3_desc: "கூட்டுறவு நெசவாளர்களுக்கு சோலார் கருவிகள், மருத்துவ மற்றும் போட்டித் தேர்வு பயிலகம்.",
      highlight_4_title: "குறைதீர்ப்பு முகாம்",
      highlight_4_desc: "திருச்செங்கோடு நகராட்சி மற்றும் வார்டு பிரச்சனைகளுக்கு விரைவான தீர்வு காணுதல்.",
      gallery_title: "புகைப்பட கேலரி",
      videos_title: "காணொளிகள்",
      projects_title: "தவெக மக்கள் திட்டங்கள்",
      projects_subtitle: "திருச்செங்கோடு தொகுதியில் நடைபெறும் முக்கிய மக்கள் நலத் திட்டங்களின் விபரம்",
      proj_status_completed: "நிறைவடைந்தது",
      proj_status_ongoing: "தொடர்கிறது",
      proj_status_planned: "திட்டமிடப்பட்டுள்ளது",
      proj_impact: "மக்கள் பயன்பாடு",
      proj_location: "இடம்",
      grievance_title: "உங்கள் சட்டமன்ற உறுப்பினரிடம் மனு கொடுங்கள்",
      grievance_subtitle: "உங்கள் வார்டு மற்றும் பகுதி பிரச்சனைகளை நேரடியாக திருச்செங்கோடு சட்டமன்ற உறுப்பினர் அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ் அவர்களின் கவனத்திற்கு கொண்டு செல்லுங்கள்.",
      grievance_intro: "திருச்செங்கோடு பகுதியில் குடிநீர் தட்டுப்பாடு, அரசு மருத்துவமனை, கைத்தறி நெசவு, அல்லது வடிகால் பிரச்சனைகள் இருந்தால் கீழே உள்ள படிவத்தில் மனுவை சமர்ப்பிக்கவும். உடனடியாக நடவடிக்கை எடுக்கப்படும்.",
      griev_step_1: "விபரங்களை ஆன்லைனில் பதிவு செய்தல்",
      griev_step_2: "மனு எண் பெறுதல்",
      griev_step_3: "நேரடி கள ஆய்வு",
      form_name: "உங்கள் முழு பெயர்",
      form_phone: "தொடர்பு தொலைபேசி எண்",
      form_email: "மின்னஞ்சல் முகவரி",
      form_ward: "உங்களது வார்டை தேர்வு செய்க",
      form_type: "பிரச்சனையின் வகை",
      form_desc: "மனுவின் விரிவான விபரம்",
      form_desc_placeholder: "பிரச்சனை உள்ள இடம், தெருவின் பெயர் மற்றும் அடையாளங்களை திருச்செங்கோடு பகுதிக்குள் விரிவாக விவரிக்கவும்...",
      form_submit: "மனுவைச் சமர்ப்பி",
      form_submitting: "சமர்ப்பிக்கப்படுகிறது...",
      form_success: "நன்றி! உங்கள் மனு வெற்றிகரமாக சட்டமன்ற உறுப்பினர் அலுவலகத்தில் சமர்ப்பிக்கப்பட்டது. மனு எண்: ",
      form_error: "தயவுசெய்து அனைத்து விபரங்களையும் சரியாக நிரப்பவும்.",
      footer_about_desc: "திருச்செங்கோடு தொகுதி சட்டமன்ற உறுப்பினரும் மாண்புமிகு வணிகவரி மற்றும் பதிவுத் துறை அமைச்சருமான டாக்டர் கே. ஜி. அருண்ராஜ் அவர்களின் அதிகாரப்பூர்வ மக்கள் தொடர்பு இணையதளம்.",
      footer_links_title: "இணைப்புகள்",
      footer_contact_title: "தவெக தொகுதி அலுவலக முகவரி",
      footer_newsletter_title: "இணைந்திருங்கள்",
      footer_newsletter_desc: "திருச்செங்கோடு தொகுதி வளர்ச்சிப் பணிகள் மற்றும் கொள்கைகள் குறித்த விபரங்களை மின்னஞ்சலில் பெறுக.",
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
    
    // Auto-patch stale social links from old cache
    if (siteConfig.twitter && siteConfig.twitter.includes('tvkofficial')) {
      siteConfig.twitter = 'https://x.com/arunraajkg';
      siteConfig.facebook = 'https://www.facebook.com/people/Arunraaj-TVK/61579221207463/#';
      siteConfig.instagram = 'https://www.instagram.com/arunraajkg/?hl=en';
      if (typeof TVKDb.updateConfig === 'function') {
        TVKDb.updateConfig({ 
          twitter: siteConfig.twitter, 
          facebook: siteConfig.facebook, 
          instagram: siteConfig.instagram 
        });
      }
    }
    
    allNews = TVKDb.getNews();
    allProjects = TVKDb.getProjects();
    allGallery = TVKDb.getGallery();
    allVideos = TVKDb.getVideos();
  };

  // ---------------- TRANSLATION INJECTOR ----------------
  const updateLanguageUI = () => {
    loadDataFromDb();
    document.documentElement.setAttribute("lang", currentLang);
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
    renderCommunityGrid();
    renderConstituencyNews();
    renderProjectsBoard();
    renderGalleryGrid();
    renderVideoSection();
    renderMegaMenus();
  };

  // 1. Theme Toggle: Light / Dark Mode Redirection
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    // Check local storage for initial theme state
    const currentTheme = localStorage.getItem("tvk_theme");
    if (currentTheme === "dark") {
      document.body.classList.add("dark-theme");
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("tvk_theme", isDark ? "dark" : "light");
      themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }

  // 2. Mobile Menu Toggle: Collapsible Sidebar Drawer
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const navLinksMenu = document.getElementById("nav-links-menu");
  if (menuToggleBtn && navLinksMenu) {
    menuToggleBtn.addEventListener("click", () => {
      navLinksMenu.classList.toggle("mobile-active");
    });
    // Close mobile menu when nav link is clicked
    navLinksMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinksMenu.classList.remove("mobile-active");
      });
    });
  }

  // Toggle Language Handler
  if (elements.langBtn) {
    elements.langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "ta" : "en";
      localStorage.setItem("tvk_tiruchengodu_lang", currentLang);
      updateLanguageUI();
    });
  }

  // ---------------- RENDER 1: EDITORIAL HERO NEWS GRID ----------------
  const renderHeroNews = () => {
    if (allNews.length === 0) return;

    // 1. Left Col: Featured news story (is_featured = true or first item)
    const featured = allNews.find(n => n.is_featured) || allNews[0];
    if (featured) {
      if (elements.featuredImg) elements.featuredImg.src = featured.image_url;
      if (elements.featuredCategory) elements.featuredCategory.textContent = currentLang === "en" ? featured.category : getCategoryTamil(featured.category);
      if (elements.featuredTitle) elements.featuredTitle.textContent = featured[`title_${currentLang}`];
      if (elements.featuredDesc) elements.featuredDesc.textContent = featured[`content_${currentLang}`];
      
      const formattedDate = formatDateString(featured.date);
      if (elements.featuredDate) elements.featuredDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
      
      if (elements.featuredStoryCard) {
        elements.featuredStoryCard.onclick = () => openNewsModal(featured.id);
      }
    }

    // 2. Middle Col: 2 stacked news visual cards (items index 1 and 2 in list excluding featured)
    const remainingNews = allNews.filter(n => n.id !== featured.id);
    const stackedContainer = document.getElementById("hero-stacked-cards");
    if (stackedContainer) {
      stackedContainer.innerHTML = "";
      const stackedItems = remainingNews.slice(0, 2);
      
      if (stackedItems.length === 0) {
        stackedContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No secondary updates available.</p>`;
      } else {
        stackedItems.forEach(item => {
          const card = document.createElement("div");
          card.className = "stacked-card-mini";
          card.onclick = () => openNewsModal(item.id);
          card.innerHTML = `
            <div class="stacked-img-wrap">
              <img class="stacked-img" src="${item.image_url}" alt="News thumbnail" referrerpolicy="no-referrer">
            </div>
            <div class="stacked-overlay-content">
              <span class="stacked-category">${currentLang === "en" ? item.category : getCategoryTamil(item.category)}</span>
              <h4 class="stacked-title">${item[`title_${currentLang}`]}</h4>
            </div>
          `;
          stackedContainer.appendChild(card);
        });
      }
    }

    // 3. Right Col: Dense list of 4 text-only trending news (indices 2 to 5 or remaining ones)
    const trendingContainer = document.getElementById("hero-trending-list");
    if (trendingContainer) {
      trendingContainer.innerHTML = "";
      const trendingItems = remainingNews.slice(2, 6);
      
      if (trendingItems.length === 0) {
        trendingContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No trending items.</p>`;
      } else {
        trendingItems.forEach((item, idx) => {
          const card = document.createElement("div");
          card.className = "trending-text-card";
          card.onclick = () => openNewsModal(item.id);
          card.innerHTML = `
            <span class="trending-num-tag">#${idx + 1} ${currentLang === "en" ? item.category : getCategoryTamil(item.category)}</span>
            <h4 class="trending-headline">${item[`title_${currentLang}`]}</h4>
            <span class="trending-meta">${formatDateString(item.date)}</span>
          `;
          trendingContainer.appendChild(card);
        });
      }
    }
  };

  // ---------------- RENDER 2: LATEST ARTICLES GRID WITH PAGINATION ----------------
  let searchQuery = "";
  let visibleArticlesLimit = 3;

  const renderConstituencyNews = () => {
    const featuredContainer = document.getElementById("editorial-featured");
    const col1Container = document.getElementById("editorial-col-1");
    const col2Container = document.getElementById("editorial-col-2");
    const bottomContainer = document.getElementById("editorial-bottom-row");
    const recHeroContainer = document.getElementById("recommended-hero-post");
    const recListContainer = document.getElementById("recommended-list-posts");

    if (!featuredContainer) return;

    // Filter by search query in real-time
    const filteredNews = allNews.filter(item => {
      const matchesSearch = item[`title_${currentLang}`].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item[`content_${currentLang}`].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Handle empty state
    if (filteredNews.length === 0) {
      featuredContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <i class="far fa-newspaper" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
          <p>${currentLang === "en" ? "No updates matches your search." : "தேடலுக்குரிய செய்திகள் எதுவும் கிடைக்கவில்லை."}</p>
        </div>
      `;
      if (col1Container) col1Container.innerHTML = "";
      if (col2Container) col2Container.innerHTML = "";
      if (bottomContainer) bottomContainer.innerHTML = "";
      if (recHeroContainer) recHeroContainer.innerHTML = "";
      if (recListContainer) recListContainer.innerHTML = "";
      return;
    }

    // 1. Featured Card (First item)
    const featured = filteredNews[0];
    featuredContainer.innerHTML = `
      <div class="editorial-featured-img-wrap">
        <img class="editorial-featured-img" src="${featured.image_url}" alt="Featured news image" referrerpolicy="no-referrer">
      </div>
      <div class="editorial-featured-content">
        <span class="editorial-featured-meta">
          <i class="far fa-calendar-alt"></i> ${formatDateString(featured.date)} • ${currentLang === 'en' ? featured.category : getCategoryTamil(featured.category)}
        </span>
        <h4 class="editorial-featured-title">${featured[`title_${currentLang}`]}</h4>
      </div>
    `;
    featuredContainer.onclick = () => openNewsModal(featured.id);

    // 2. Dense List Items (slice 1 to 9)
    const listItems = filteredNews.slice(1, Math.min(filteredNews.length, 9));
    if (col1Container) col1Container.innerHTML = "";
    if (col2Container) col2Container.innerHTML = "";

    listItems.forEach((item, idx) => {
      const itemHtml = `
        <div class="editorial-list-item" onclick="openNewsModal('${item.id}')">
          <div class="editorial-thumb-wrap">
            <img class="editorial-thumb" src="${item.image_url}" alt="Thumbnail" referrerpolicy="no-referrer">
          </div>
          <div class="editorial-list-content">
            <h4 class="editorial-list-title">${item[`title_${currentLang}`]}</h4>
            <span class="editorial-list-date">${formatDateString(item.date)}</span>
          </div>
        </div>
      `;
      if (idx % 2 === 0) {
        if (col1Container) col1Container.innerHTML += itemHtml;
      } else {
        if (col2Container) col2Container.innerHTML += itemHtml;
      }
    });

    // 3. Bottom Row Cards (slice 9 to 12, fallback to earlier items if not enough)
    let bottomItems = filteredNews.slice(9, 12);
    if (bottomItems.length === 0 && filteredNews.length > 1) {
      bottomItems = filteredNews.slice(Math.max(1, filteredNews.length - 3), filteredNews.length);
    }
    if (bottomContainer) {
      bottomContainer.innerHTML = "";
      bottomItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "overlay-news-card";
        card.onclick = () => openNewsModal(item.id);
        card.innerHTML = `
          <img class="overlay-card-img" src="${item.image_url}" alt="News image" referrerpolicy="no-referrer">
          <div class="overlay-card-mask">
            <span class="overlay-card-category">${currentLang === 'en' ? item.category : getCategoryTamil(item.category)}</span>
            <h4 class="overlay-card-title">${item[`title_${currentLang}`]}</h4>
            <span class="overlay-card-meta"><i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}</span>
          </div>
        `;
        bottomContainer.appendChild(card);
      });
    }

    // 4. Sidebar Recommended Hero (item 12, fallback to featured)
    const recHero = filteredNews[12] || filteredNews[0];
    if (recHeroContainer) {
      recHeroContainer.innerHTML = `
        <div class="recommended-hero" onclick="openNewsModal('${recHero.id}')">
          <img src="${recHero.image_url}" alt="Recommended hero image" referrerpolicy="no-referrer">
          <div class="recommended-hero-overlay">
            <h5 class="recommended-hero-title">${recHero[`title_${currentLang}`]}</h5>
          </div>
        </div>
      `;
    }

    // 5. Sidebar Recommended List (slice 13 to 17, fallback to slice 1 to 5)
    let recList = filteredNews.slice(13, 17);
    if (recList.length === 0 && filteredNews.length > 2) {
      recList = filteredNews.slice(1, Math.min(filteredNews.length, 5));
    }
    if (recListContainer) {
      recListContainer.innerHTML = "";
      recList.forEach(item => {
        const div = document.createElement("div");
        div.className = "recommended-item";
        div.onclick = () => openNewsModal(item.id);
        div.innerHTML = `
          <div class="recommended-thumb-wrap">
            <img class="recommended-thumb" src="${item.image_url}" alt="Thumbnail" referrerpolicy="no-referrer">
          </div>
          <div class="recommended-item-content">
            <h5 class="recommended-item-title">${item[`title_${currentLang}`]}</h5>
            <span class="recommended-item-date">${formatDateString(item.date)}</span>
          </div>
        `;
        recListContainer.appendChild(div);
      });
    }
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
      visibleArticlesLimit = 3; // Reset pagination upon search
      renderConstituencyNews();
    });
  }

  // Load More Button Event binding
  const loadMoreBtn = document.getElementById("btn-load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleArticlesLimit += 3;
      renderConstituencyNews();
    });
  }

  // ---------------- RENDER 3: COMMUNITY GRID UPDATES ----------------
  const renderCommunityGrid = () => {
    const mainGrid = document.getElementById("community-main-grid");
    const sideHero = document.getElementById("community-sidebar-hero");
    const sideList = document.getElementById("community-sidebar-list");

    if (!mainGrid) return;
    mainGrid.innerHTML = "";
    
    const communityNews = allNews.filter(n => n.category === "Welfare Activities" || n.category === "Constituency Work");

    if (communityNews.length === 0) {
      mainGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No community activities posted yet.</p>`;
      if (sideHero) sideHero.innerHTML = "";
      if (sideList) sideList.innerHTML = "";
      return;
    }

    const gridItems = communityNews.slice(0, Math.min(communityNews.length, 6));
    gridItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "editorial-featured-card";
      card.onclick = () => openNewsModal(item.id);
      card.style.boxShadow = "var(--shadow-sm)";
      card.style.border = "1px solid var(--border-color)";
      card.style.display = "flex";
      card.style.flexDirection = "column";

      card.innerHTML = `
        <div class="editorial-featured-img-wrap" style="height: 160px;">
          <img class="editorial-featured-img" src="${item.image_url}" alt="Community News" referrerpolicy="no-referrer">
        </div>
        <div class="editorial-featured-content" style="padding: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; flex-grow: 1;">
          <h4 class="editorial-featured-title" style="font-size: 0.9rem; font-weight: 700; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: auto;">
            ${item[`title_${currentLang}`]}
          </h4>
          <span class="editorial-featured-meta" style="font-size: 0.65rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; margin-top: 0.4rem;">
            <i class="far fa-user"></i> Admin • <i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}
          </span>
        </div>
      `;
      mainGrid.appendChild(card);
    });

    const heroItem = communityNews[6] || communityNews[0];
    if (sideHero && heroItem) {
      sideHero.innerHTML = `
        <div class="recommended-hero" onclick="openNewsModal('${heroItem.id}')">
          <img src="${heroItem.image_url}" alt="Top Week Hero" referrerpolicy="no-referrer">
          <div class="recommended-hero-overlay">
            <span class="overlay-card-category" style="margin-bottom: 0.35rem; font-size: 0.6rem;">${currentLang === 'en' ? heroItem.category : getCategoryTamil(heroItem.category)}</span>
            <h5 class="recommended-hero-title">${heroItem[`title_${currentLang}`]}</h5>
          </div>
        </div>
      `;
    }

    let listItems = communityNews.slice(7, 11);
    if (listItems.length === 0 && communityNews.length > 1) {
      listItems = communityNews.slice(1, Math.min(communityNews.length, 5));
    }
    if (sideList) {
      sideList.innerHTML = "";
      listItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "recommended-item";
        div.onclick = () => openNewsModal(item.id);
        div.innerHTML = `
          <div class="recommended-thumb-wrap">
            <img class="recommended-thumb" src="${item.image_url}" alt="Thumbnail" referrerpolicy="no-referrer">
          </div>
          <div class="recommended-item-content">
            <h5 class="recommended-item-title">${item[`title_${currentLang}`]}</h5>
            <span class="recommended-item-date">${formatDateString(item.date)}</span>
          </div>
        `;
        sideList.appendChild(div);
      });
    }
  };

  // ---------------- MEGA DROPDOWN RENDER ENGINE ----------------
  const renderMegaMenus = () => {
    const newsGrid = document.getElementById("mega-grid-news");
    const projectsGrid = document.getElementById("mega-grid-projects");
    const eventsGrid = document.getElementById("mega-grid-events");
    const galleryGrid = document.getElementById("mega-grid-gallery");

    const createMegaCard = (item) => {
      const card = document.createElement("div");
      card.className = "mega-dropdown-card";
      card.onclick = (e) => {
        e.stopPropagation();
        openNewsModal(item.id);
      };
      
      const categoryLabel = currentLang === "en" ? item.category : getCategoryTamil(item.category);
      
      card.innerHTML = `
        <div class="mega-card-img-wrap">
          <img class="mega-card-img" src="${item.image_url}" alt="News card" referrerpolicy="no-referrer">
        </div>
        <div class="mega-card-content">
          <h4 class="mega-card-title">${item[`title_${currentLang}`]}</h4>
          <span class="mega-card-meta">
            <i class="far fa-user"></i> Admin • <i class="far fa-calendar-alt"></i> ${formatDateString(item.date)}
          </span>
        </div>
      `;
      return card;
    };

    // 1. News Menu (4 latest articles)
    if (newsGrid) {
      newsGrid.innerHTML = "";
      allNews.slice(0, 4).forEach(item => {
        newsGrid.appendChild(createMegaCard(item));
      });
    }

    // 2. Projects Menu (4 latest constituency works)
    if (projectsGrid) {
      projectsGrid.innerHTML = "";
      const projectItems = allNews.filter(n => n.category === "Constituency Work").slice(0, 4);
      const itemsToRender = projectItems.length > 0 ? projectItems : allNews.slice(0, 4);
      itemsToRender.forEach(item => {
        projectsGrid.appendChild(createMegaCard(item));
      });
    }

    // 3. Events Menu (4 latest welfare activities)
    if (eventsGrid) {
      eventsGrid.innerHTML = "";
      const eventItems = allNews.filter(n => n.category === "Welfare Activities").slice(0, 4);
      const itemsToRender = eventItems.length > 0 ? eventItems : allNews.slice(0, 4);
      itemsToRender.forEach(item => {
        eventsGrid.appendChild(createMegaCard(item));
      });
    }

    // 4. Gallery Menu (4 latest photos from news list)
    if (galleryGrid) {
      galleryGrid.innerHTML = "";
      allNews.slice(Math.min(allNews.length - 4, 4), Math.min(allNews.length, 8)).forEach(item => {
        galleryGrid.appendChild(createMegaCard(item));
      });
    }
  };

  // ---------------- RENDER 4: DEVELOPMENT PROJECTS BOARD ----------------
  const renderProjectsBoard = () => {
    const projectGrid = document.getElementById("community-news-grid"); // Reuses community-news-grid or matches local elements
    // Let's implement a separate projects rendering if elements.projectsGrid exists
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

  // ---------------- RENDER 5: PHOTO GALLERY & VIDEO SECTION ----------------
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
        <img class="gallery-card-img" src="${item.image_url}" alt="Gallery photo" referrerpolicy="no-referrer">
        <div class="gallery-card-body">
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
      const playingTitle = document.getElementById("video-playing-title");
      if (playingTitle) playingTitle.textContent = initialVid[`title_${currentLang}`];
    }

    allVideos.forEach((vid, index) => {
      const card = document.createElement("div");
      card.className = `video-item-row ${index === 0 ? "active" : ""}`;
      card.onclick = () => {
        playSelectedVideo(vid.video_url, card);
        const playingTitle = document.getElementById("video-playing-title");
        if (playingTitle) playingTitle.textContent = vid[`title_${currentLang}`];
      };
      
      card.innerHTML = `
        <img class="video-item-thumb" src="${vid.thumbnail_url}" alt="Video thumbnail" referrerpolicy="no-referrer">
        <div class="video-item-details">
          <h5 class="video-item-title">${vid[`title_${currentLang}`]}</h5>
          <span class="video-item-date">${formatDateString(vid.date)}</span>
        </div>
      `;
      elements.videoListSidebar.appendChild(card);
    });
  };

  const playSelectedVideo = (url, cardEl) => {
    if (elements.videoPlayerFrame) elements.videoPlayerFrame.src = url;
    document.querySelectorAll(".video-item-row").forEach(c => c.classList.remove("active"));
    cardEl.classList.add("active");
  };

  // ---------------- PUBLIC SERVICES INFO SYSTEM ----------------
  const servicesContent = {
    en: {
      health: {
        title: "Public Health & Ambulance Assistance",
        body: "TVK Tiruchengodu Grievance Cell runs 24/7 dedicated local ambulance support services and regular Ward-level multi-specialty wellness camps. Direct referrals can be requested via the MLA office helpline."
      },
      education: {
        title: "Free IAS Coaching & Learning Centers",
        body: "A high-tech digital library and competitive exams learning center is functional in Tiruchengodu. The portal helps aspirants enroll for free offline batch cycles with complete course material."
      },
      infrastructure: {
        title: "Local Civic Infrastructure & Drainage desilting",
        body: "Ward street lighting, community center maintenance, park renovations, and concrete road laying requests are processed directly via corporation engineers through petition filing."
      },
      welfare: {
        title: "Welfare Schemes & Pension Helpline",
        body: "Assistance is provided for applying to Senior Citizen Old-Age Pensions, Widows Pension schemes, and Self-Help Group credits. File a petition to coordinate with the Social Welfare Inspector."
      },
      agriculture: {
        title: "Lake Restoration & Agricultural Advisory",
        body: "Tiruchengodu and local agricultural desilting schemes are active. Farming implements and fertilizer supply inquiries can be made directly under the MLA local development fund program."
      },
      employment: {
        title: "Employment Registration & Skills Center",
        body: "Free vocational training in IT skills, tailoring, and electrical works is provided for TVK local youth. Quarterly Job Fairs are hosted in partnership with corporate partners."
      }
    },
    ta: {
      health: {
        title: "சுகாதாரம் மற்றும் இலவச மருத்துவ உதவி",
        body: "திருச்செங்கோடு தொகுதி தவெக சார்பில் 24/7 ஆம்புலன்ஸ் சேவை மற்றும் வார்டு வாரியாக மாபெரும் இலவச மருத்துவ முகாம்கள் நடத்தப்படுகின்றன. அவசர உதவிகளுக்கு எம்.எல்.ஏ அலுவலகத்தை தொடர்பு கொள்ளலாம்."
      },
      education: {
        title: "இலவச ஐ.ஏ.எஸ் மற்றும் போட்டித் தேர்வு பயிலகம்",
        body: "திருச்செங்கோடு நாமக்கல் சாலையில் அமைந்துள்ள இலவச டிஜிட்டல் நூலகம் மற்றும் போட்டித் தேர்வு பயிற்சி மையத்தில் மாணவர்கள் தங்களை இணைத்துக் கொள்ள எம்.எல்.ஏ அலுவலகத்தில் நேரடி பதிவு செய்யலாம்."
      },
      infrastructure: {
        title: "உட்கட்டமைப்பு மற்றும் குடிநீர் வடிகால் வசதிகள்",
        body: "தெருவிளக்கு பழுதுகள், பூங்கா சீரமைப்புகள், மற்றும் மழைநீர் வடிகால் தூர்வாரும் பணிகள் மாநகராட்சி பொறியாளர்கள் மூலம் போர்க்கால அடிப்படையில் விரைவாக நிறைவேற்றப்படும்."
      },
      welfare: {
        title: "முதியோர் உதவித்தொகை மற்றும் மகளிர் சுயஉதவிக்குழு",
        body: "முதியோர் ஓய்வூதியம், மாற்றுத்திறனாளிகள் நல உதவிகள் மற்றும் மகளிர் சுயஉதவிக் குழுவினருக்கான வங்கிக் கடன் உதவிகளை பெற எளிய வழிகாட்டல்களையும் விண்ணப்பப் படிவங்களையும் இச்சேவையில் பெறலாம்."
      },
      agriculture: {
        title: "நீர்நிலை பாதுகாப்பு மற்றும் ஏரிப் பாசன மேம்பாடு",
        body: "திருச்செங்கோடு ஏரிகள் மற்றும் கிரிவலப் பாதை ஏரிகளை தூர்வாருதல், கரைகளை பலப்படுத்துதல் மற்றும் இயற்கை வேளாண் இடுபொருட்கள் விநியோகம் சார்ந்த தொகுதி வளர்ச்சி திட்டங்கள் தீவிரமாக செயல்படுத்தப்பட்டு வருகின்றன."
      },
      employment: {
        title: "இளைஞர் திறன் மேம்பாடு மற்றும் வேலைவாய்ப்பு முகாம்",
        body: "திருச்செங்கோடு பகுதி இளைஞர்களுக்கு கணினிப் பயிற்சி, தையல் கலை, மற்றும் எலக்ட்ரிக்கல் தொழிற்பயிற்சிகள் இலவசமாக அளிக்கப்பட்டு, முன்னணி நிறுவனங்களில் வேலைவாய்ப்பு பெற்றுத் தரப்படுகிறது."
      }
    }
  };

  window.openServiceDetails = (category) => {
    const content = servicesContent[currentLang][category];
    if (!content) return;

    elements.modalBody.innerHTML = `
      <div style="padding: 1.5rem; text-align: left;">
        <h3 style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem; border-bottom: 2px solid var(--secondary); padding-bottom: 0.5rem;">
          ${content.title}
        </h3>
        <p style="font-size: 1rem; color: var(--text-color); line-height: 1.6; margin-bottom: 1.5rem;">
          ${content.body}
        </p>
        <button class="btn-submit" onclick="document.getElementById('info-modal').style.display='none'; window.location.hash='#grievance';" style="padding: 0.5rem 1.25rem; font-size: 0.85rem; border-radius: 4px;">
          <i class="fas fa-edit"></i> ${currentLang === 'en' ? 'Submit Petition on this' : 'இது தொடர்பாக மனு சமர்ப்பி'}
        </button>
      </div>
    `;
    elements.modalOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  // ---------------- RENDER 5: MODALS (NEWS & GALLERY LIGHTBOX) ----------------
  const openNewsModal = (id) => {
    window.location.href = `news.html?id=${id}`;
  };
  window.openNewsModal = openNewsModal;

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

  if (elements.modalClose) elements.modalClose.onclick = closeModal;
  if (elements.modalOverlay) {
    elements.modalOverlay.onclick = (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    };
  }

  // ---------------- CITIZEN GRIEVANCE PORTAL HANDLING ----------------
  if (elements.grievanceForm) {
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
  }

  const showGrievanceAlert = (msg, status) => {
    if (!elements.grievanceAlert) return;
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
  if (elements.newsletterForm) {
    elements.newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = uiTranslations[currentLang];
      const email = elements.newsletterInput ? elements.newsletterInput.value.trim() : "";
      
      if (email && elements.newsletterBtn && elements.newsletterInput) {
        elements.newsletterBtn.textContent = "✓";
        elements.newsletterInput.value = "";
        elements.newsletterInput.setAttribute("disabled", "true");
        setTimeout(() => {
          if (elements.newsletterBtn) elements.newsletterBtn.textContent = t.footer_newsletter_btn;
          if (elements.newsletterInput) elements.newsletterInput.removeAttribute("disabled");
        }, 3000);
      }
    });
  }

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

  // Cross-tab real-time sync for immediate reflection of admin changes with loop prevention
  let isSyncing = false;
  let syncTimeout = null;
  window.addEventListener("storage", (e) => {
    if (e.key === "tvk_tiruchengodu_database" && !isSyncing) {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        console.log("Database updated in admin tab. Syncing homepage UI instantly...");
        isSyncing = true;
        updateLanguageUI();
        isSyncing = false;
      }, 1000);
    }
  });

  initPage();
});
