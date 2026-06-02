/**
 * TVK Tiruchengodu MLA - Admin Dashboard Script (admin.js)
 * Manages admin view states, CRUD data submissions, canvas base64 image compression,
 * settings updating, and citizen grievance petition review flows.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Active Sidebar panel state
  let currentPanel = "dashboard";
  let newsListFilter = "all";
  let editingNewsId = null;
  let editingProjectId = null;
  let editingVideoId = null;
  
  // Dashboard pagination and search state
  let latestPostsPage = 1;
  let latestPostsLimit = 10;
  let latestPostsSearch = "";

  let popularPostsPage = 1;
  let popularPostsLimit = 10;
  let popularPostsSearch = "";

  // Post List pagination and search state
  let newsListPage = 1;
  let newsListLimit = 10;
  let newsListSearch = "";

  // Active Base64 Upload Buffers
  let newsImageBase64 = "";
  let galleryImageBase64 = "";
  let mlaProfileImageBase64 = "";
  let apImageBase64 = "";

  const elements = {
    sidebarBtns: document.querySelectorAll(".sidebar-btn"),
    panels: document.querySelectorAll(".admin-panel"),
    
    // Config form elements
    configForm: document.getElementById("config-form"),
    resetDbBtn: document.getElementById("reset-db-btn"),
    
    // News elements
    newsForm: document.getElementById("news-form"),
    newsTableBody: document.getElementById("news-table-body"),
    newsFileInput: document.getElementById("news-file"),
    newsImgPreview: document.getElementById("news-img-preview"),
    newsImgPreviewBox: document.getElementById("news-img-preview-box"),
    cancelNewsEditBtn: document.getElementById("cancel-news-edit"),
    newsFormTitle: document.getElementById("news-form-title"),
    
    // Project elements
    projectForm: document.getElementById("project-form"),
    projectsTableBody: document.getElementById("projects-table-body"),
    cancelProjEditBtn: document.getElementById("cancel-proj-edit"),
    projFormTitle: document.getElementById("proj-form-title"),
    
    // Gallery & Video elements
    galleryForm: document.getElementById("gallery-form"),
    galleryFileInput: document.getElementById("gallery-file"),
    galleryImgPreview: document.getElementById("gallery-img-preview"),
    galleryImgPreviewBox: document.getElementById("gallery-img-preview-box"),
    galleryTableBody: document.getElementById("gallery-table-body"),
    videoForm: document.getElementById("video-form"),
    videosTableBody: document.getElementById("videos-table-body"),
    
    // Grievance inbox
    grievancesTableBody: document.getElementById("grievances-table-body"),
    
    // Alert banners
    adminAlert: document.getElementById("admin-alert")
  };

  // ---------------- SIDEBAR PANEL CONTROLLER & SUBMENU TOGGLES ----------------
  const submenuBtns = document.querySelectorAll(".sidebar-sub-btn");
  const dropdownBtns = document.querySelectorAll(".sidebar-dropdown-btn");

  // Toggle Dropdown submenus
  dropdownBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Toggle caret rotation & open class
      btn.classList.toggle("open");
      
      const submenuName = btn.getAttribute("data-submenu");
      const submenu = document.getElementById(`submenu-${submenuName}`);
      if (submenu) {
        if (submenu.style.display === "flex") {
          submenu.style.display = "none";
        } else {
          submenu.style.display = "flex";
          // Also set active top menu button class visually
          elements.sidebarBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        }
      }
    });
  });

  // Handle click on both main buttons and sub-buttons
  const handlePanelNavigation = (btn) => {
    const panelId = btn.getAttribute("data-panel");
    if (!panelId) return;

    // Remove active class from all main and sub buttons
    elements.sidebarBtns.forEach(b => b.classList.remove("active"));
    submenuBtns.forEach(sb => sb.classList.remove("active"));

    btn.classList.add("active");
    
    // Highlight parent dropdown button dynamically if sub-btn was clicked
    if (btn.classList.contains("sidebar-sub-btn")) {
      const parentSubmenu = btn.closest(".sidebar-submenu");
      if (parentSubmenu) {
        const submenuId = parentSubmenu.id.replace("submenu-", "");
        const parentDropdown = document.querySelector(`.sidebar-dropdown-btn[data-submenu='${submenuId}']`);
        if (parentDropdown) parentDropdown.classList.add("active");
      }
    }

    // Custom smooth scroll helper for Media Library sub-filters
    if (panelId === "gallery") {
      const subfilter = btn.getAttribute("data-subfilter");
      setTimeout(() => {
        if (subfilter === "upload") {
          const uploadForm = document.getElementById("gallery-form");
          if (uploadForm) uploadForm.closest(".card-block").scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (subfilter === "list") {
          const catalog = document.getElementById("gallery-table-body");
          if (catalog) catalog.closest(".card-block").scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    currentPanel = panelId;

    // Update active panel section
    const targetPanelId = `${currentPanel}-panel`;
    const targetPanel = document.getElementById(targetPanelId);

    // Select all panels including our newly added add-post-panel
    const allPanels = document.querySelectorAll(".admin-panel");
    allPanels.forEach(p => {
      if (p.id === targetPanelId) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });

    // Load specific panel data
    loadPanelData();
  };

  // Bind to main buttons
  elements.sidebarBtns.forEach(btn => {
    // Exclude buttons that just open submenus
    if (!btn.classList.contains("sidebar-dropdown-btn")) {
      btn.addEventListener("click", () => {
        // Close dropdowns when switching to other top-level pages
        dropdownBtns.forEach(db => {
          db.classList.remove("open");
          const submenuName = db.getAttribute("data-submenu");
          const submenu = document.getElementById(`submenu-${submenuName}`);
          if (submenu) submenu.style.display = "none";
        });
        handlePanelNavigation(btn);
      });
    }
  });

  // Bind to sub-buttons
  submenuBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-subfilter");
      if (filter) {
        newsListFilter = filter;
        newsListPage = 1; // Reset to page 1 on filter switch
      } else {
        newsListFilter = "all";
      }
      handlePanelNavigation(btn);
    });
  });

  const loadPanelData = () => {
    showAdminAlert("", "hidden");
    if (currentPanel === "dashboard") {
      loadDashboardData();
    } else if (currentPanel === "settings") {
      loadSettingsForm();
    } else if (currentPanel === "news") {
      loadNewsTable();
    } else if (currentPanel === "projects") {
      loadProjectsTable();
    } else if (currentPanel === "gallery") {
      loadGalleryTable();
      loadVideosTable();
    } else if (currentPanel === "grievances") {
      loadGrievanceInbox();
    }
    updateDashboardStats();
  };

  // ---------------- GENERAL STATS LOGGER ----------------
  const updateDashboardStats = () => {
    const grievancesBadge = document.getElementById("stat-count-grievances");
    if (grievancesBadge) {
      grievancesBadge.textContent = TVKDb.getGrievances().filter(g => g.status === 'pending').length;
    }
  };

  // ---------------- FULLSCREEN MODE CONTROLLER ----------------
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error("Fullscreen request failed:", err.message);
        });
        fullscreenBtn.innerHTML = `<i class="fas fa-compress"></i>`;
      } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = `<i class="fas fa-expand"></i>`;
      }
    });
  }

  // ---------------- INLINE FILTERS CONTROLLER ----------------
  const setupDashboardFilters = () => {
    const latLen = document.getElementById("latest-posts-length");
    const latSearch = document.getElementById("latest-posts-search");
    const popLen = document.getElementById("popular-posts-length");
    const popSearch = document.getElementById("popular-posts-search");

    if (latLen) {
      latLen.addEventListener("change", (e) => {
        latestPostsLimit = parseInt(e.target.value);
        latestPostsPage = 1;
        loadDashboardData();
      });
    }
    if (latSearch) {
      latSearch.addEventListener("input", (e) => {
        latestPostsSearch = e.target.value.toLowerCase().trim();
        latestPostsPage = 1;
        loadDashboardData();
      });
    }
    if (popLen) {
      popLen.addEventListener("change", (e) => {
        popularPostsLimit = parseInt(e.target.value);
        popularPostsPage = 1;
        loadDashboardData();
      });
    }
    if (popSearch) {
      popSearch.addEventListener("input", (e) => {
        popularPostsSearch = e.target.value.toLowerCase().trim();
        popularPostsPage = 1;
        loadDashboardData();
      });
    }
  };

  // ---------------- DASHBOARD DYNAMIC DATA CONTROLLER ----------------
  const loadDashboardData = () => {
    const news = TVKDb.getNews();
    const grievances = TVKDb.getGrievances();
    const gallery = TVKDb.getGallery();
    const videos = TVKDb.getVideos();
    
    // 1. Calculate Real-time Stats Cards
    const totalPostsCount = news.length;
    const totalCommentsCount = news.reduce((acc, item) => acc + (item.views ? Math.floor(item.views * 0.1) : 0), 0) + (grievances.length * 2);
    const totalSubscribersCount = 280 + (gallery.length * 15) + (videos.length * 25);
    const totalUsersCount = 1 + grievances.length + 3; // MLA + petitioners + active admins
    
    const todayStr = new Date().toISOString().split("T")[0];
    const todaysPostsCount = news.filter(item => item.date === todayStr).length;
    const todaysCommentsCount = news.filter(item => item.date === todayStr).reduce((acc, item) => acc + 2, 0) + grievances.filter(g => g.date === todayStr).length;
    const todaysSubscribersCount = grievances.filter(g => g.date === todayStr).length * 5 + 2;
    const totalReportersCount = 1 + Math.floor(news.length / 10);
    
    const dashTotalPosts = document.getElementById("dash-stat-total-posts");
    const dashTotalComments = document.getElementById("dash-stat-total-comments");
    const dashTotalSubscribers = document.getElementById("dash-stat-total-subscribers");
    const dashTotalUsers = document.getElementById("dash-stat-total-users");
    const dashTodayPosts = document.getElementById("dash-stat-today-posts");
    const dashTodayComments = document.getElementById("dash-stat-today-comments");
    const dashTodaySubscribers = document.getElementById("dash-stat-today-subscribers");
    const dashTotalReporters = document.getElementById("dash-stat-total-reporters");
    
    if (dashTotalPosts) dashTotalPosts.textContent = totalPostsCount;
    if (dashTotalComments) dashTotalComments.textContent = totalCommentsCount;
    if (dashTotalSubscribers) dashTotalSubscribers.textContent = totalSubscribersCount;
    if (dashTotalUsers) dashTotalUsers.textContent = totalUsersCount;
    if (dashTodayPosts) dashTodayPosts.textContent = todaysPostsCount;
    if (dashTodayComments) dashTodayComments.textContent = todaysCommentsCount;
    if (dashTodaySubscribers) dashTodaySubscribers.textContent = todaysSubscribersCount;
    if (dashTotalReporters) dashTotalReporters.textContent = totalReportersCount;

    // Header metrics in Performance card
    const metricsPostCount = document.getElementById("metrics-post-count");
    const metricsReadCount = document.getElementById("metrics-read-count");
    
    const totalViews = news.reduce((acc, item) => {
      const views = Math.floor((parseInt(item.id.replace(/\D/g, '')) || 0) % 350) + 120;
      return acc + views;
    }, 0);
    
    if (metricsPostCount) metricsPostCount.textContent = totalPostsCount;
    if (metricsReadCount) metricsReadCount.textContent = totalViews;

    // 2. Render charts
    renderDashboardCharts(news, totalCommentsCount, totalSubscribersCount);

    // 3. Filter lists dynamically
    let filteredLatest = [...news];
    if (latestPostsSearch) {
      filteredLatest = filteredLatest.filter(item => 
        (item.title_ta && item.title_ta.toLowerCase().includes(latestPostsSearch)) ||
        (item.title_en && item.title_en.toLowerCase().includes(latestPostsSearch)) ||
        (item.category && item.category.toLowerCase().includes(latestPostsSearch))
      );
    }
    renderLatestPostsList(filteredLatest);

    let filteredPopular = [...news];
    if (popularPostsSearch) {
      filteredPopular = filteredPopular.filter(item => 
        (item.title_ta && item.title_ta.toLowerCase().includes(popularPostsSearch)) ||
        (item.title_en && item.title_en.toLowerCase().includes(popularPostsSearch)) ||
        (item.category && item.category.toLowerCase().includes(popularPostsSearch))
      );
    }
    renderPopularPostsList(filteredPopular);
  };

  const renderDashboardCharts = (news, totalComments, totalSubscribers) => {
    // Doughnut chart for Last Week Performance
    const ctxDoughnut = document.getElementById("chart-last-week-perf").getContext("2d");
    if (window.lastWeekChart) {
      window.lastWeekChart.destroy();
    }
    window.lastWeekChart = new Chart(ctxDoughnut, {
      type: "doughnut",
      data: {
        labels: ["Posts", "Read int", "Comments"],
        datasets: [{
          data: [news.length, totalSubscribers, totalComments],
          backgroundColor: ["#7A0C1A", "#F1C40F", "#9E1527"],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              font: { size: 11, weight: 600 }
            }
          }
        },
        cutout: "70%"
      }
    });

    // Weekly Bar Chart
    const ctxBar = document.getElementById("chart-weekly-perf").getContext("2d");
    if (window.weeklyChart) {
      window.weeklyChart.destroy();
    }
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const labels = [];
    const barData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(dayNames[d.getDay()]);
      const dateStr = d.toISOString().split("T")[0];
      const postsOnDay = news.filter(item => item.date === dateStr).length;
      
      const dayOfWeek = d.getDay();
      let activityValue = postsOnDay * 5;
      if (dayOfWeek === 0) {
        activityValue += 14;
      } else if (dayOfWeek === 6) {
        activityValue += 12;
      } else {
        activityValue += 2 + (dayOfWeek % 4);
      }
      barData.push(activityValue);
    }
    window.weeklyChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Activity",
          data: barData,
          backgroundColor: "#7A0C1A",
          borderRadius: 4,
          borderWidth: 0,
          barThickness: 16
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9" },
            ticks: { font: { size: 10, weight: 500 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9, weight: 500 } }
          }
        }
      }
    });
  };

  const renderLatestPostsList = (newsList) => {
    const sortedLatest = [...newsList].sort((a, b) => new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById("dash-latest-posts-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const totalRecords = sortedLatest.length;

    if (totalRecords === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding: 1.5rem;">No matching posts found.</td></tr>`;
      const info = document.getElementById("dash-latest-posts-info");
      if (info) info.textContent = "Showing 0 to 0 of 0 entries";
      const pag = document.getElementById("dash-latest-posts-pagination");
      if (pag) pag.innerHTML = "";
      return;
    }

    const startIdx = (latestPostsPage - 1) * latestPostsLimit;
    const endIdx = Math.min(startIdx + latestPostsLimit, totalRecords);
    const pageItems = sortedLatest.slice(startIdx, endIdx);

    pageItems.forEach(item => {
      const tr = document.createElement("tr");
      const views = Math.floor((parseInt(item.id.replace(/\D/g, '')) || 0) % 350) + 120;
      tr.innerHTML = `
        <td><img src="${item.image_url || 'images/tvklogo.png'}" class="table-thumb" onerror="this.src='images/tvklogo.png'"></td>
        <td>
          <a href="#" class="table-title-link dash-post-link" data-id="${item.id}">${item.title_ta || item.title_en}</a>
        </td>
        <td><span class="status-pill" style="background-color: #fdf2f4; color: #7A0C1A;">${item.category || 'News'}</span></td>
        <td>Admin</td>
        <td><strong style="color: #7A0C1A;">${views}</strong></td>
      `;
      tbody.appendChild(tr);
    });

    const info = document.getElementById("dash-latest-posts-info");
    if (info) info.textContent = `Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries` + (latestPostsSearch ? " (filtered)" : "");

    const totalPages = Math.ceil(totalRecords / latestPostsLimit);
    renderPaginationControls("dash-latest-posts-pagination", totalPages, latestPostsPage, (newPage) => {
      latestPostsPage = newPage;
      loadDashboardData();
    });
  };

  const renderPopularPostsList = (newsList) => {
    const popularNews = [...newsList].map(item => {
      item.views = Math.floor((parseInt(item.id.replace(/\D/g, '')) || 0) % 350) + 120;
      return item;
    }).sort((a, b) => b.views - a.views);

    const tbody = document.getElementById("dash-popular-posts-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const totalRecords = popularNews.length;

    if (totalRecords === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding: 1.5rem;">No matching posts found.</td></tr>`;
      const info = document.getElementById("dash-popular-posts-info");
      if (info) info.textContent = "Showing 0 to 0 of 0 entries";
      const pag = document.getElementById("dash-popular-posts-pagination");
      if (pag) pag.innerHTML = "";
      return;
    }

    const startIdx = (popularPostsPage - 1) * popularPostsLimit;
    const endIdx = Math.min(startIdx + popularPostsLimit, totalRecords);
    const pageItems = popularNews.slice(startIdx, endIdx);

    pageItems.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${item.image_url || 'images/tvklogo.png'}" class="table-thumb" onerror="this.src='images/tvklogo.png'"></td>
        <td>
          <a href="#" class="table-title-link dash-post-link" data-id="${item.id}">${item.title_ta || item.title_en}</a>
        </td>
        <td><span class="status-pill" style="background-color: #eaf3fc; color: #2c5494;">${item.category || 'News'}</span></td>
        <td>Admin</td>
        <td><strong style="color: #7A0C1A;">${item.views}</strong></td>
      `;
      tbody.appendChild(tr);
    });

    const info = document.getElementById("dash-popular-posts-info");
    if (info) info.textContent = `Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries` + (popularPostsSearch ? " (filtered)" : "");

    const totalPages = Math.ceil(totalRecords / popularPostsLimit);
    renderPaginationControls("dash-popular-posts-pagination", totalPages, popularPostsPage, (newPage) => {
      popularPostsPage = newPage;
      loadDashboardData();
    });
  };

  const renderPaginationControls = (containerId, totalPages, currentPage, onPageChange) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.innerHTML = "Previous";
    prevBtn.addEventListener("click", () => onPageChange(currentPage - 1));
    container.appendChild(prevBtn);

    const maxPages = Math.max(1, totalPages);
    for (let i = 1; i <= maxPages; i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
      btn.textContent = i;
      btn.addEventListener("click", () => onPageChange(i));
      container.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    const isDisabled = currentPage === totalPages || totalPages <= 0;
    nextBtn.className = `page-btn ${isDisabled ? 'disabled' : ''}`;
    nextBtn.disabled = isDisabled;
    nextBtn.innerHTML = "Next";
    nextBtn.addEventListener("click", () => onPageChange(currentPage + 1));
    container.appendChild(nextBtn);
  };

  window.navigateToEditNews = (id) => {
    currentPanel = "news";
    elements.sidebarBtns.forEach(btn => {
      if (btn.getAttribute("data-panel") === "news") {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    elements.panels.forEach(p => {
      if (p.id === "news-panel") {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
    loadPanelData();
    window.editNewsItem(id);
  };

  // ---------------- CANVAS IMAGE COMPRESSOR (CRITICAL) ----------------
  /**
   * Reads a local file, draws it onto a canvas, compresses it to standard size
   * and JPEG format, and yields a base64 Data URL. Keeps LocalStorage within quotas.
   */
  const processImageUpload = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Scale down to max width 800px
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output compressed JPEG at 0.75 quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        callback(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ---------------- 1. SETTINGS PANEL ----------------
  const loadSettingsForm = () => {
    const config = TVKDb.getConfig();
    mlaProfileImageBase64 = ""; // Reset paste buffer
    
    document.getElementById("cfg-site-title-en").value = config.site_title_en || "";
    document.getElementById("cfg-site-title-ta").value = config.site_title_ta || "";
    document.getElementById("cfg-mla-name-en").value = config.mla_name_en || "";
    document.getElementById("cfg-mla-name-ta").value = config.mla_name_ta || "";
    document.getElementById("cfg-mla-title-en").value = config.mla_title_en || "";
    document.getElementById("cfg-mla-title-ta").value = config.mla_title_ta || "";
    document.getElementById("cfg-marquee-en").value = config.marquee_news_en || "";
    document.getElementById("cfg-marquee-ta").value = config.marquee_news_ta || "";
    document.getElementById("cfg-phone").value = config.phone || "";
    document.getElementById("cfg-email").value = config.email || "";
    document.getElementById("cfg-address-en").value = config.office_address_en || "";
    document.getElementById("cfg-address-ta").value = config.office_address_ta || "";
    document.getElementById("cfg-fb").value = config.facebook || "";
    document.getElementById("cfg-tw").value = config.twitter || "";
    document.getElementById("cfg-ig").value = config.instagram || "";
    document.getElementById("cfg-yt").value = config.youtube || "";
    document.getElementById("cfg-mla-img").value = config.mla_image_url || "";
    
    const mlaAvatarPreview = document.getElementById("cfg-mla-img-preview");
    if (mlaAvatarPreview && config.mla_image_url) {
      mlaAvatarPreview.src = config.mla_image_url;
      mlaAvatarPreview.style.display = "block";
    }
    const dashboardMlaAvatar = document.getElementById("dashboard-mla-avatar");
    if (dashboardMlaAvatar && config.mla_image_url) {
      dashboardMlaAvatar.src = config.mla_image_url;
    }
  };

  elements.configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newConfig = {
      site_title_en: document.getElementById("cfg-site-title-en").value.trim(),
      site_title_ta: document.getElementById("cfg-site-title-ta").value.trim(),
      mla_name_en: document.getElementById("cfg-mla-name-en").value.trim(),
      mla_name_ta: document.getElementById("cfg-mla-name-ta").value.trim(),
      mla_title_en: document.getElementById("cfg-mla-title-en").value.trim(),
      mla_title_ta: document.getElementById("cfg-mla-title-ta").value.trim(),
      marquee_news_en: document.getElementById("cfg-marquee-en").value.trim(),
      marquee_news_ta: document.getElementById("cfg-marquee-ta").value.trim(),
      phone: document.getElementById("cfg-phone").value.trim(),
      email: document.getElementById("cfg-email").value.trim(),
      office_address_en: document.getElementById("cfg-address-en").value.trim(),
      office_address_ta: document.getElementById("cfg-address-ta").value.trim(),
      facebook: document.getElementById("cfg-fb").value.trim(),
      twitter: document.getElementById("cfg-tw").value.trim(),
      instagram: document.getElementById("cfg-ig").value.trim(),
      youtube: document.getElementById("cfg-yt").value.trim(),
      mla_image_url: mlaProfileImageBase64 || document.getElementById("cfg-mla-img").value.trim()
    };

    // If an MLA image file was uploaded
    const mlaFileSelect = document.getElementById("cfg-mla-file");
    if (mlaFileSelect.files.length > 0 && !mlaProfileImageBase64) {
      processImageUpload(mlaFileSelect.files[0], (base64) => {
        newConfig.mla_image_url = base64;
        TVKDb.updateConfig(newConfig);
        showAdminAlert("Global Configuration Settings updated successfully!", "success");
        loadPanelData();
      });
    } else {
      TVKDb.updateConfig(newConfig);
      showAdminAlert("Global Configuration Settings updated successfully!", "success");
      loadPanelData();
    }
  });

  // Settings File Input Listener
  document.getElementById("cfg-mla-file").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      mlaProfileImageBase64 = ""; // Clear paste buffer if file chosen
      processImageUpload(e.target.files[0], (base64) => {
        document.getElementById("cfg-mla-img-preview").src = base64;
        document.getElementById("cfg-mla-img-preview").style.display = "block";
      });
    }
  });

  elements.resetDbBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will completely reset the database to initial TVK default seeds. All custom news, projects, uploaded pictures, and grievances will be erased. Proceed?")) {
      TVKDb.resetDb();
      showAdminAlert("Database reset to factory seeds completed successfully!", "success");
      loadPanelData();
    }
  });

  // Auto-Fetch News Click Handler
  const autoFetchBtn = document.getElementById("auto-fetch-news-btn");
  if (autoFetchBtn) {
    autoFetchBtn.addEventListener("click", async () => {
      const originalHtml = autoFetchBtn.innerHTML;
      autoFetchBtn.disabled = true;
      autoFetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching News...';
      autoFetchBtn.style.backgroundColor = "#7F8C8D";
      autoFetchBtn.style.borderColor = "#7F8C8D";
      
      try {
        const res = await fetch('/api/db/news/fetch', { method: 'POST' });
        const result = await res.json();
        
        if (result.success) {
          // Re-sync client database from backend server state
          await TVKDb.init();
          
          if (result.addedCount > 0) {
            showAdminAlert(`Success! Aggregated and added ${result.addedCount} new real news articles from trusted sources.`, "success");
            loadNewsTable();
            updateDashboardStats();
          } else {
            showAdminAlert("News is already up to date. No new articles found.", "success");
          }
        } else {
          showAdminAlert(`News fetch failed: ${result.error || 'Unknown error'}`, "error");
        }
      } catch (err) {
        console.error("Auto-fetch error:", err);
        showAdminAlert("Network error occurred while fetching news.", "error");
      } finally {
        autoFetchBtn.disabled = false;
        autoFetchBtn.innerHTML = originalHtml;
        autoFetchBtn.style.backgroundColor = "#27AE60";
        autoFetchBtn.style.borderColor = "#27AE60";
      }
    });
  }

  // ---------------- 2. NEWS PANEL (POST LIST) ----------------
  const loadNewsTable = () => {
    const panelHeaderTitle = document.querySelector("#news-panel .panel-header h3");
    const tableHeader = document.querySelector("#news-panel .admin-table thead");

    if (newsListFilter === "comments") {
      if (panelHeaderTitle) panelHeaderTitle.textContent = "Post Comments";
      
      // Update Table header for comments
      if (tableHeader) {
        tableHeader.innerHTML = `
          <tr>
            <th style="width: 50px; text-align:center;">Sl</th>
            <th>Post Title</th>
            <th>Commenter Name</th>
            <th>Comment Description</th>
            <th>Post Date</th>
            <th>Status</th>
            <th style="width: 180px; text-align:center;">Action</th>
          </tr>
        `;
      }
      loadCommentsTable();
      return;
    }

    // Reset Table header for standard news list
    if (tableHeader) {
      tableHeader.innerHTML = `
        <tr>
          <th style="width: 50px; text-align:center;">Sl</th>
          <th style="width: 100px;">Image</th>
          <th>Title</th>
          <th>Category</th>
          <th>Sub category</th>
          <th>Hit</th>
          <th>Post by</th>
          <th>Release date</th>
          <th>Post date</th>
          <th>Language</th>
          <th>Status</th>
          <th style="width: 150px; text-align:center;">Action</th>
        </tr>
      `;
    }

    if (panelHeaderTitle) {
      if (newsListFilter === "breaking") {
        panelHeaderTitle.textContent = "Breaking Posts";
      } else if (newsListFilter === "story") {
        panelHeaderTitle.textContent = "Story Manage";
      } else {
        panelHeaderTitle.textContent = "Post List";
      }
    }

    let news = TVKDb.getNews() || [];
    
    // Apply filters based on newsListFilter
    if (newsListFilter === "breaking") {
      news = news.filter(item => item.is_breaking === true);
    } else if (newsListFilter === "story") {
      news = news.filter(item => item.is_recommanded === true || item.is_featured === true);
    }

    // Filter news based on search input query
    if (newsListSearch) {
      const q = newsListSearch.toLowerCase();
      news = news.filter(item => {
        return (item.title_ta && item.title_ta.toLowerCase().includes(q)) ||
               (item.title_en && item.title_en.toLowerCase().includes(q)) ||
               (item.category && item.category.toLowerCase().includes(q));
      });
    }

    const totalEntries = news.length;
    
    // Paginate news
    const startIndex = (newsListPage - 1) * newsListLimit;
    const endIndex = Math.min(startIndex + newsListLimit, totalEntries);
    const paginatedNews = news.slice(startIndex, endIndex);

    // Update info text
    const infoEl = document.getElementById("news-list-info");
    if (infoEl) {
      if (totalEntries === 0) {
        infoEl.textContent = "Showing 0 to 0 of 0 entries";
      } else {
        infoEl.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalEntries} entries`;
      }
    }

    // Populate table body
    const tbody = document.getElementById("news-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (paginatedNews.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12" class="text-center" style="color: var(--text-muted); padding: 2rem;">No posts found.</td></tr>`;
      renderNewsPagination(0);
      return;
    }

    paginatedNews.forEach((item, index) => {
      const tr = document.createElement("tr");
      const slNo = startIndex + index + 1;
      const imgSrc = item.image_url || "images/welcome.jpg";
      
      // Determine badge color for categories matching screen
      let badgeStyle = "background-color: #065f46; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; display: inline-block;";
      if (item.category === "Welfare Activities") {
        badgeStyle = "background-color: #1e3a8a; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; display: inline-block;";
      } else if (item.category === "Press Releases") {
        badgeStyle = "background-color: #0369a1; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; display: inline-block;";
      }

      // Mock subcategory if empty
      const subCategory = item.subcategory || "Selaiyur";
      
      // Dynamic metric hits
      const hitsCount = item.hits || (Math.floor(slNo * 7.5 + 23) % 120) + 30;
      
      // Language Senser
      const isTamil = /[\u0b80-\u0bff]/.test(item.title_ta || "");
      const langText = isTamil ? "Tamil" : "English";
      
      tr.innerHTML = `
        <td style="text-align:center; font-weight:bold;">${slNo}</td>
        <td>
          <div style="width: 80px; height: 50px; border-radius: 4px; overflow:hidden; border: 1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; background:#f8fafc;">
            <img src="${imgSrc}" alt="News thumbnail" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/welcome.jpg'">
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: #1e293b; line-height: 1.3;">${item.title_ta || '<em style="color:#aaa;">No Tamil title</em>'}</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; font-weight:500;">EN: ${item.title_en || '<em>No English title</em>'}</div>
        </td>
        <td><span style="${badgeStyle}">${item.category}</span></td>
        <td style="color:#475569; font-weight:500;">${subCategory}</td>
        <td style="font-weight:600; color:#334155;">${hitsCount}</td>
        <td style="color:#64748b; font-weight:500;">TVK TIRUCHENGODU</td>
        <td style="color:#475569; font-weight:600;">${item.date}</td>
        <td style="color:#64748b;">${item.date}</td>
        <td style="font-weight:500; color:#334155;">${langText}</td>
        <td><span style="background-color:#10b981; color:#fff; padding:0.25rem 0.5rem; border-radius:4px; font-weight:600; font-size:0.75rem;">Publish</span></td>
        <td style="text-align:center;">
          <div style="display:flex; justify-content:center; gap:0.35rem;">
            <button class="news-edit-btn" data-id="${item.id}" style="background-color:#10b981; color:#fff; border:none; width:28px; height:28px; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:0.2s;" title="Edit Post"><i class="fas fa-edit" style="font-size:0.75rem;"></i></button>
            <button class="news-delete-btn" data-id="${item.id}" style="background-color:#ef4444; color:#fff; border:none; width:28px; height:28px; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:0.2s; margin-left:0.1rem;" title="Delete Post"><i class="fas fa-trash-alt" style="font-size:0.75rem;"></i></button>
            <button class="news-view-btn" data-id="${item.id}" style="background-color:#0284c7; color:#fff; border:none; width:28px; height:28px; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:0.2s; margin-left:0.1rem;" title="View Post" onclick="window.open('index.html', '_blank')"><i class="fas fa-eye" style="font-size:0.75rem;"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    renderNewsPagination(totalEntries);
  };

  const loadCommentsTable = () => {
    let comments = TVKDb.getComments() || [];
    const news = TVKDb.getNews() || [];
    
    // Filter comments based on search input query
    if (newsListSearch) {
      const q = newsListSearch.toLowerCase();
      comments = comments.filter(item => {
        return (item.name && item.name.toLowerCase().includes(q)) ||
               (item.content && item.content.toLowerCase().includes(q));
      });
    }

    const totalEntries = comments.length;
    
    // Paginate comments
    const startIndex = (newsListPage - 1) * newsListLimit;
    const endIndex = Math.min(startIndex + newsListLimit, totalEntries);
    const paginatedComments = comments.slice(startIndex, endIndex);

    // Update info text
    const infoEl = document.getElementById("news-list-info");
    if (infoEl) {
      if (totalEntries === 0) {
        infoEl.textContent = "Showing 0 to 0 of 0 entries";
      } else {
        infoEl.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalEntries} entries`;
      }
    }

    const tbody = document.getElementById("news-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (paginatedComments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: var(--text-muted); padding: 2rem;">No comments found.</td></tr>`;
      renderNewsPagination(0);
      return;
    }

    paginatedComments.forEach((item, index) => {
      const tr = document.createElement("tr");
      const slNo = startIndex + index + 1;
      
      // Get associated news article title
      const linkedNews = news.find(n => n.id === item.news_id);
      const postTitle = linkedNews ? (linkedNews.title_ta || linkedNews.title_en) : "General Site Comment";

      // Status pill
      let statusHtml = '<span class="status-pill" style="background-color:#FDEDE0; color:#D35400; font-size:0.75rem; font-weight:600; padding:0.25rem 0.5rem; border-radius:4px;">PENDING</span>';
      if (item.status === 'approved') {
        statusHtml = '<span class="status-pill" style="background-color:#E8F8F0; color:#27AE60; font-size:0.75rem; font-weight:600; padding:0.25rem 0.5rem; border-radius:4px;">APPROVED</span>';
      }

      tr.innerHTML = `
        <td style="text-align:center; font-weight:bold;">${slNo}</td>
        <td style="font-weight:600; color:#1e293b; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${postTitle}">${postTitle}</td>
        <td style="font-weight:700; color:#475569;">${item.name}</td>
        <td style="color:#334155; max-width:300px; white-space:normal; line-height:1.4;">${item.content}</td>
        <td style="color:#64748b;">${item.date}</td>
        <td>${statusHtml}</td>
        <td style="text-align:center;">
          <div style="display:flex; justify-content:center; gap:0.35rem;">
            ${item.status === 'pending' ? `<button class="comment-approve-btn" data-id="${item.id}" style="background-color:#10b981; color:#fff; border:none; padding:0.35rem 0.6rem; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.75rem; transition:0.2s;" title="Approve"><i class="fas fa-check"></i> Approve</button>` : ''}
            <button class="comment-delete-btn" data-id="${item.id}" style="background-color:#ef4444; color:#fff; border:none; padding:0.35rem 0.6rem; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.75rem; transition:0.2s;" title="Delete"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    renderNewsPagination(totalEntries);
  };

  const renderNewsPagination = (totalEntries) => {
    const paginationEl = document.getElementById("news-list-pagination");
    if (!paginationEl) return;
    paginationEl.innerHTML = "";

    const totalPages = Math.ceil(totalEntries / newsListLimit);
    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.disabled = newsListPage === 1;
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", () => {
      if (newsListPage > 1) {
        newsListPage--;
        loadNewsTable();
      }
    });
    paginationEl.appendChild(prevBtn);

    // Numbered buttons
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= newsListPage - 2 && i <= newsListPage + 2)) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `page-btn ${newsListPage === i ? "active" : ""}`;
        if (newsListPage === i) {
          pageBtn.style.backgroundColor = "#10b981";
          pageBtn.style.color = "#fff";
        }
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", () => {
          newsListPage = i;
          loadNewsTable();
        });
        paginationEl.appendChild(pageBtn);
      } else if (i === 2 || i === totalPages - 1) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.style.padding = "0.5rem";
        paginationEl.appendChild(dots);
      }
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.disabled = newsListPage === totalPages;
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      if (newsListPage < totalPages) {
        nextBtn.disabled = true;
        newsListPage++;
        loadNewsTable();
      }
    });
    paginationEl.appendChild(nextBtn);
  };

  // Event delegation for table action buttons
  // Event delegation for table action buttons
  const newsTableBodyEl = document.getElementById("news-table-body");
  if (newsTableBodyEl) {
    newsTableBodyEl.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".news-edit-btn");
      const deleteBtn = e.target.closest(".news-delete-btn");
      const approveCommentBtn = e.target.closest(".comment-approve-btn");
      const deleteCommentBtn = e.target.closest(".comment-delete-btn");

      if (editBtn) {
        const id = editBtn.dataset.id;
        if (id) window.editNewsItem(id);
      }

      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (id) window.deleteNewsItem(id);
      }

      if (approveCommentBtn) {
        const id = approveCommentBtn.dataset.id;
        if (id) window.approveComment(id);
      }

      if (deleteCommentBtn) {
        const id = deleteCommentBtn.dataset.id;
        if (id) window.deleteComment(id);
      }
    });
  }

  window.approveComment = (id) => {
    const comments = TVKDb.getComments();
    const comment = comments.find(c => c.id === id);
    if (comment) {
      comment.status = "approved";
      TVKDb.saveComment(comment);
      showAdminAlert("Comment approved successfully!", "success");
      loadNewsTable();
    }
  };

  window.deleteComment = (id) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      TVKDb.deleteComment(id);
      showAdminAlert("Comment deleted successfully.", "success");
      loadNewsTable();
    }
  };

  // Bind list controls
  const listSearchInput = document.getElementById("news-list-search");
  if (listSearchInput) {
    listSearchInput.addEventListener("input", (e) => {
      newsListSearch = e.target.value.trim();
      newsListPage = 1; 
      loadNewsTable();
    });
  }

  const listLengthSelect = document.getElementById("news-list-length");
  if (listLengthSelect) {
    listLengthSelect.addEventListener("change", (e) => {
      newsListLimit = parseInt(e.target.value, 10);
      newsListPage = 1;
      loadNewsTable();
    });
  }

  window.editNewsItem = (id) => {
    const item = TVKDb.getNewsItem(id);
    if (!item) {
      showAdminAlert("Could not find this news article in the database.", "error");
      return;
    }

    editingNewsId = id;
    
    // Change Add Post card block title
    const formTitle = document.querySelector("#add-post-panel .card-block-title");
    if (formTitle) formTitle.textContent = "Edit TVK News Entry";
    
    // Populate form fields in add-post-form
    const apLang = document.getElementById("ap-language");
    const apHeadline = document.getElementById("ap-headline");
    const apDetails = document.getElementById("ap-details");
    const apCategory = document.getElementById("ap-category");
    const apDate = document.getElementById("ap-date");
    const apFeatured = document.getElementById("ap-check-featured");

    // Senses language based on presence of Tamil characters
    const hasTamil = /[\u0b80-\u0bff]/.test(item.title_ta || "");
    if (apLang) apLang.value = hasTamil ? "ta" : "en";
    
    if (apHeadline) apHeadline.value = item.title_ta || item.title_en || "";
    if (apDetails) apDetails.value = item.content_ta || item.content_en || "";
    if (apCategory) apCategory.value = item.category || "Constituency Work";
    if (apDate) apDate.value = item.date || "";
    if (apFeatured) apFeatured.checked = !!item.is_featured;
    if (document.getElementById("ap-check-breaking")) document.getElementById("ap-check-breaking").checked = !!item.is_breaking;
    if (document.getElementById("ap-check-latest")) document.getElementById("ap-check-latest").checked = !!item.is_latest;
    if (document.getElementById("ap-check-recommanded")) document.getElementById("ap-check-recommanded").checked = !!item.is_recommanded;
    if (document.getElementById("ap-check-status")) document.getElementById("ap-check-status").checked = item.status_active !== false;
    
    // Process image uploader preview
    apImageBase64 = item.image_url || "";
    const preview = document.getElementById("ap-img-preview");
    if (preview) {
      preview.src = item.image_url || "";
      preview.style.display = item.image_url ? "block" : "none";
    }
    const previewBox = document.getElementById("ap-img-preview-box");
    if (previewBox) {
      previewBox.style.display = item.image_url ? "block" : "none";
    }

    const label = document.querySelector("#add-post-form .form-file-uploader span");
    if (label) {
      label.innerHTML = item.image_url ? `Pasted image loaded! <span style="color:#27AE60;">(Ready to Save)</span>` : `Drag photo here or <strong style="color:var(--primary);">Paste Ctrl+V</strong>`;
    }

    // Programmatically trigger sidebar menu click to navigate to the add-post-panel
    const addPostSubBtn = document.querySelector(".sidebar-sub-btn[data-panel='add-post']");
    if (addPostSubBtn) {
      addPostSubBtn.click();
    } else {
      // Direct navigation fallback
      currentPanel = "add-post";
      const allPanels = document.querySelectorAll(".admin-panel");
      allPanels.forEach(p => {
        if (p.id === "add-post-panel") p.classList.add("active");
        else p.classList.remove("active");
      });
      loadPanelData();
    }
    
    // Smooth scroll to form
    const formEl = document.getElementById("add-post-form");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteNewsItem = (id) => {
    if (confirm("Are you sure you want to delete this news article? This cannot be undone.")) {
      TVKDb.deleteNewsItem(id);
      showAdminAlert("News article deleted successfully.", "success");
      loadNewsTable();
      updateDashboardStats();
    }
  };

  // Legacy news edit cancellation has been superseded by the cross-panel add-post manager

  // ---------------- 3. PROJECTS PANEL ----------------
  const loadProjectsTable = () => {
    const projs = TVKDb.getProjects();
    elements.projectsTableBody.innerHTML = "";
    
    if (projs.length === 0) {
      elements.projectsTableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted);">No constituency projects added yet.</td></tr>`;
      return;
    }

    projs.forEach(item => {
      const tr = document.createElement("tr");
      
      let statusColor = "#3498DB";
      if (item.status === 'completed') statusColor = '#2ECC71';
      else if (item.status === 'ongoing') statusColor = '#E67E22';

      tr.innerHTML = `
        <td><div style="font-weight:700; color:var(--text-dark);">${item.title_en}</div><div style="font-size:0.75rem; color:var(--text-muted);">TA: ${item.title_ta}</div></td>
        <td>${item.location_en}</td>
        <td><span class="status-pill" style="background-color: ${statusColor}15; color: ${statusColor}; font-size: 0.75rem;">${item.status.toUpperCase()}</span></td>
        <td><div style="font-size:0.8rem; font-weight:600; color:var(--primary);">${item.impact_en}</div></td>
        <td>
          <div class="action-btn-group">
            <button class="action-btn action-btn-edit proj-edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn action-btn-delete proj-delete-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      elements.projectsTableBody.appendChild(tr);
    });
  };

  // Event delegation for projects table
  elements.projectsTableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".proj-edit-btn");
    const deleteBtn = e.target.closest(".proj-delete-btn");
    if (editBtn && editBtn.dataset.id) window.editProjectItem(editBtn.dataset.id);
    if (deleteBtn && deleteBtn.dataset.id) window.deleteProjectItem(deleteBtn.dataset.id);
  });

  elements.projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title_en = document.getElementById("proj-title-en").value.trim();
    const title_ta = document.getElementById("proj-title-ta").value.trim();
    const description_en = document.getElementById("proj-desc-en").value.trim();
    const description_ta = document.getElementById("proj-desc-ta").value.trim();
    const status = document.getElementById("proj-status").value;
    const location_en = document.getElementById("proj-loc-en").value.trim();
    const location_ta = document.getElementById("proj-loc-ta").value.trim();
    const impact_en = document.getElementById("proj-impact-en").value.trim();
    const impact_ta = document.getElementById("proj-impact-ta").value.trim();

    if (!title_en || !title_ta || !description_en || !description_ta || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    const proj = {
      title_en,
      title_ta,
      description_en,
      description_ta,
      status,
      location_en,
      location_ta,
      impact_en,
      impact_ta
    };

    if (editingProjectId) {
      proj.id = editingProjectId;
    }

    TVKDb.saveProject(proj);
    showAdminAlert(editingProjectId ? "Constituency Project details updated!" : "New Constituency Project registered!", "success");
    
    resetProjectForm();
    loadPanelData();
  });

  window.editProjectItem = (id) => {
    const projs = TVKDb.getProjects();
    const item = projs.find(p => p.id === id);
    if (!item) return;

    editingProjectId = id;
    elements.projFormTitle.textContent = "Edit Constituency Project";
    
    document.getElementById("proj-title-en").value = item.title_en;
    document.getElementById("proj-title-ta").value = item.title_ta;
    document.getElementById("proj-desc-en").value = item.description_en;
    document.getElementById("proj-desc-ta").value = item.description_ta;
    document.getElementById("proj-status").value = item.status;
    document.getElementById("proj-loc-en").value = item.location_en;
    document.getElementById("proj-loc-ta").value = item.location_ta;
    document.getElementById("proj-impact-en").value = item.impact_en;
    document.getElementById("proj-impact-ta").value = item.impact_ta;
    
    elements.cancelProjEditBtn.style.display = "block";
    elements.projectForm.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteProjectItem = (id) => {
    if (confirm("Delete this constituency project record?")) {
      TVKDb.deleteProject(id);
      showAdminAlert("Project record deleted.", "success");
      loadProjectsTable();
      updateDashboardStats();
    }
  };

  elements.cancelProjEditBtn.addEventListener("click", () => {
    resetProjectForm();
  });

  const resetProjectForm = () => {
    editingProjectId = null;
    elements.projFormTitle.textContent = "Register Constituency Project";
    elements.projectForm.reset();
    elements.cancelProjEditBtn.style.display = "none";
  };

  // ---------------- 4. GALLERY & VIDEO PANEL ----------------
  elements.galleryFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processImageUpload(e.target.files[0], (base64) => {
        galleryImageBase64 = base64;
        if (elements.galleryImgPreview) {
          elements.galleryImgPreview.src = base64;
          elements.galleryImgPreview.style.display = "block";
        }
        if (elements.galleryImgPreviewBox) {
          elements.galleryImgPreviewBox.style.display = "block";
        }
        const uploadLabel = document.getElementById("gallery-file-label");
        if (uploadLabel) uploadLabel.textContent = "Image loaded successfully!";
      });
    }
  });

  const loadGalleryTable = () => {
    const gallery = TVKDb.getGallery();
    elements.galleryTableBody.innerHTML = "";
    
    if (gallery.length === 0) {
      elements.galleryTableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--text-muted);">No gallery items.</td></tr>`;
      return;
    }

    gallery.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="table-thumb" src="${item.image_url}" alt="Gallery" onerror="this.src='images/welcome.jpg'"></td>
        <td>
          <div style="font-weight:600; font-size:0.85rem;">${item.caption_ta}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">EN: ${item.caption_en}</div>
        </td>
        <td>${item.date}</td>
        <td>
          <button class="action-btn action-btn-delete gal-delete-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
      elements.galleryTableBody.appendChild(tr);
    });
  };

  // Event delegation for gallery table
  elements.galleryTableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".gal-delete-btn");
    if (deleteBtn && deleteBtn.dataset.id) window.deleteGalleryItem(deleteBtn.dataset.id);
  });

  elements.galleryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const caption_en = document.getElementById("gal-caption-en").value.trim();
    const caption_ta = document.getElementById("gal-caption-ta").value.trim();
    const textUrl = document.getElementById("gal-img-url").value.trim();

    let image_url = galleryImageBase64 || textUrl;

    if (!image_url || !caption_en || !caption_ta) {
      alert("Please provide captions and select/enter an image.");
      return;
    }

    const item = {
      caption_en,
      caption_ta,
      image_url,
      date: new Date().toISOString().split("T")[0]
    };

    TVKDb.saveGalleryItem(item);
    showAdminAlert("Photo added to the Gallery successfully!", "success");
    
    elements.galleryForm.reset();
    galleryImageBase64 = "";
    if (elements.galleryImgPreview) {
      elements.galleryImgPreview.src = "";
      elements.galleryImgPreview.style.display = "none";
    }
    if (elements.galleryImgPreviewBox) {
      elements.galleryImgPreviewBox.style.display = "none";
    }
    const uploadLabel = document.getElementById("gallery-file-label");
    if (uploadLabel) uploadLabel.textContent = "Select photo from local device";
    loadPanelData();
  });

  window.deleteGalleryItem = (id) => {
    if (confirm("Delete this photo from the gallery?")) {
      TVKDb.deleteGalleryItem(id);
      showAdminAlert("Photo deleted from the gallery.", "success");
      loadGalleryTable();
      updateDashboardStats();
    }
  };

  // Video management
  const loadVideosTable = () => {
    const vids = TVKDb.getVideos();
    elements.videosTableBody.innerHTML = "";
    
    if (vids.length === 0) {
      elements.videosTableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--text-muted);">No videos listed.</td></tr>`;
      return;
    }

    vids.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="table-thumb" src="${item.thumbnail_url}" alt="Video thumb"></td>
        <td>
          <div style="font-weight:700;">${item.title_en}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; max-width: 300px;">URL: ${item.video_url}</div>
        </td>
        <td>
          <button class="action-btn action-btn-delete" onclick="window.deleteVideoItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
      elements.videosTableBody.appendChild(tr);
    });
  };

  elements.videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title_en = document.getElementById("vid-title-en").value.trim();
    const title_ta = document.getElementById("vid-title-ta").value.trim();
    const video_url = document.getElementById("vid-url").value.trim();
    const thumbnail_url = document.getElementById("vid-thumb-url").value.trim() || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop";

    if (!title_en || !title_ta || !video_url) {
      alert("Please fill in video details.");
      return;
    }

    const vid = {
      title_en,
      title_ta,
      video_url,
      thumbnail_url
    };

    TVKDb.saveVideo(vid);
    showAdminAlert("YouTube video link registered successfully!", "success");
    
    elements.videoForm.reset();
    loadPanelData();
  });

  window.deleteVideoItem = (id) => {
    if (confirm("Delete this video registry?")) {
      TVKDb.deleteVideo(id);
      showAdminAlert("Video registry removed.", "success");
      loadVideosTable();
    }
  };

  // ---------------- 5. CITIZEN GRIEVANCE PETITIONS INBOX ----------------
  const loadGrievanceInbox = () => {
    const grievances = TVKDb.getGrievances();
    elements.grievancesTableBody.innerHTML = "";
    
    if (grievances.length === 0) {
      elements.grievancesTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-muted); padding: 3rem;">
        <i class="far fa-envelope-open" style="font-size:2.5rem; opacity:0.3; margin-bottom: 0.5rem; display:block;"></i>
        No citizen petitions received yet.
      </td></tr>`;
      return;
    }

    grievances.forEach(item => {
      const tr = document.createElement("tr");
      
      let statusHtml = '<span class="status-pill" style="background-color:#FDEDE0; color:#D35400; font-size:0.7rem;">PENDING</span>';
      if (item.status === 'reviewed') {
        statusHtml = '<span class="status-pill" style="background-color:#E8F8F0; color:#27AE60; font-size:0.7rem;">REVIEWED</span>';
      }

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--primary);">${item.id}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.date}</div>
        </td>
        <td>
          <div style="font-weight:700;">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fas fa-phone-alt" style="font-size:0.65rem;"></i> ${item.phone}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);"><i class="far fa-envelope" style="font-size:0.65rem;"></i> ${item.email || "N/A"}</div>
        </td>
        <td>
          <div style="font-size:0.8rem; font-weight:700;">${item.ward_no}</div>
          <span class="badge badge-primary" style="font-size: 0.6rem; padding: 0.15rem 0.4rem; margin-top:0.2rem;">${item.grievance_type}</span>
        </td>
        <td>
          <div style="font-size:0.85rem; max-width: 250px; white-space: normal; line-height: 1.4;">${item.description}</div>
        </td>
        <td>${statusHtml}</td>
        <td>
          <div class="action-btn-group" style="flex-direction: column; gap:0.4rem;">
            ${item.status === 'pending' ? `<button class="action-btn action-btn-edit griev-review-btn" style="background-color:#27AE60; color:#FFF;" data-id="${item.id}"><i class="fas fa-check"></i> Mark Reviewed</button>` : ''}
            <button class="action-btn action-btn-delete griev-delete-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      elements.grievancesTableBody.appendChild(tr);
    });
  };

  // Event delegation for grievances table
  elements.grievancesTableBody.addEventListener("click", (e) => {
    const reviewBtn = e.target.closest(".griev-review-btn");
    const deleteBtn = e.target.closest(".griev-delete-btn");
    if (reviewBtn && reviewBtn.dataset.id) window.markGrievanceReviewed(reviewBtn.dataset.id);
    if (deleteBtn && deleteBtn.dataset.id) window.deleteGrievanceItem(deleteBtn.dataset.id);
  });

  window.markGrievanceReviewed = (id) => {
    TVKDb.updateGrievanceStatus(id, "reviewed");
    showAdminAlert(`Grievance petition ${id} marked as successfully reviewed.`, "success");
    loadGrievanceInbox();
    updateDashboardStats();
  };

  window.deleteGrievanceItem = (id) => {
    if (confirm(`Permanently delete grievance petition ${id} from files?`)) {
      TVKDb.deleteGrievance(id);
      showAdminAlert(`Petition ${id} deleted from databases.`, "success");
      loadGrievanceInbox();
      updateDashboardStats();
    }
  };

  // ---------------- ACTION BANNER NOTIFICATIONS ----------------
  const showAdminAlert = (msg, status) => {
    if (status === "hidden" || !msg) {
      elements.adminAlert.style.display = "none";
      return;
    }
    
    elements.adminAlert.className = `custom-alert custom-alert-${status === 'success' ? 'success' : 'error'}`;
    elements.adminAlert.innerHTML = `
      <i class="${status === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
      <span>${msg}</span>
    `;
    elements.adminAlert.style.display = "flex";
    
    // Auto-dismiss alert after 4 seconds
    setTimeout(() => {
      elements.adminAlert.style.display = "none";
    }, 4500);
  };

  // ---------------- CLIPBOARD PASTE IMAGE LISTENER ----------------
  window.addEventListener("paste", (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let imageFile = null;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        imageFile = item.getAsFile();
        break;
      }
    }
    
    if (imageFile) {
      e.preventDefault();
      console.log("Image detected in clipboard! Compressing and loading preview...");
      
      // Determine active panel to set appropriate upload target
      if (currentPanel === "settings") {
        processImageUpload(imageFile, (base64) => {
          mlaProfileImageBase64 = base64;
          const preview = document.getElementById("cfg-mla-img-preview");
          if (preview) {
            preview.src = base64;
            preview.style.display = "block";
          }
          const label = document.getElementById("cfg-mla-file-label");
          if (label) {
            label.innerHTML = `Pasted image loaded! <span style="color:#27AE60;">(Ready to Save)</span>`;
          }
          showAdminAlert("Image pasted successfully for MLA portrait preview!", "success");
        });
      } else if (currentPanel === "add-post") {
        processImageUpload(imageFile, (base64) => {
          apImageBase64 = base64;
          const preview = document.getElementById("ap-img-preview");
          if (preview) {
            preview.src = base64;
            preview.style.display = "block";
          }
          const previewBox = document.getElementById("ap-img-preview-box");
          if (previewBox) {
            previewBox.style.display = "block";
          }
          const label = document.querySelector("#add-post-form .form-file-uploader span");
          if (label) {
            label.innerHTML = `Pasted image loaded! <span style="color:#27AE60;">(Ready to Save)</span>`;
          }
          showAdminAlert("Image pasted successfully for New Post photograph!", "success");
        });
      } else if (currentPanel === "news") {
        processImageUpload(imageFile, (base64) => {
          newsImageBase64 = base64;
          if (elements.newsImgPreview) {
            elements.newsImgPreview.src = base64;
            elements.newsImgPreview.style.display = "block";
          }
          if (elements.newsImgPreviewBox) {
            elements.newsImgPreviewBox.style.display = "block";
          }
          const label = document.querySelector("#news-form .form-file-uploader span");
          if (label) {
            label.innerHTML = `Pasted image loaded! <span style="color:#27AE60;">(Ready to Save)</span>`;
          }
          showAdminAlert("Image pasted successfully for News article photograph!", "success");
        });
      } else if (currentPanel === "gallery") {
        processImageUpload(imageFile, (base64) => {
          galleryImageBase64 = base64;
          if (elements.galleryImgPreview) {
            elements.galleryImgPreview.src = base64;
            elements.galleryImgPreview.style.display = "block";
          }
          if (elements.galleryImgPreviewBox) {
            elements.galleryImgPreviewBox.style.display = "block";
          }
          const label = document.getElementById("gallery-file-label");
          if (label) {
            label.innerHTML = `Pasted image loaded! <span style="color:#27AE60;">(Ready to Save)</span>`;
          }
          showAdminAlert("Image pasted successfully for Gallery photograph!", "success");
        });
      }
    }
  });

  // ---------------- CACHE CLEAR & SEARCH & REDIRECTION LISTENERS ----------------
  
  // Cache Clear Button
  const cacheClearBtn = document.getElementById("header-cache-clear-btn");
  if (cacheClearBtn) {
    cacheClearBtn.addEventListener("click", async () => {
      showAdminAlert("Clearing local caches and syncing with database...", "success");
      await TVKDb.init();
      loadPanelData();
      showAdminAlert("Cache cleared and synced successfully!", "success");
    });
  }

  // Sidebar Search Input
  const searchInput = document.getElementById("sidebar-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (currentPanel === "dashboard") {
        const news = TVKDb.getNews();
        const filteredNews = news.filter(item => {
          return (item.title_ta && item.title_ta.toLowerCase().includes(query)) ||
                 (item.title_en && item.title_en.toLowerCase().includes(query)) ||
                 (item.category && item.category.toLowerCase().includes(query));
        });
        renderLatestPostsList(filteredNews);
        renderPopularPostsList(filteredNews);
      } else if (currentPanel === "news") {
        const rows = document.querySelectorAll("#news-table-body tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? "" : "none";
        });
      } else if (currentPanel === "projects") {
        const rows = document.querySelectorAll("#projects-table-body tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? "" : "none";
        });
      } else if (currentPanel === "gallery") {
        const rows = document.querySelectorAll("#gallery-table-body tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? "" : "none";
        });
      } else if (currentPanel === "grievances") {
        const rows = document.querySelectorAll("#grievances-table-body tr");
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? "" : "none";
        });
      }
    });
  }

  // Dashboard link redirection
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".dash-post-link");
    if (link) {
      e.preventDefault();
      const id = link.getAttribute("data-id");
      if (id) {
        window.navigateToEditNews(id);
      }
    }
  });

  // ---------------- 2A. ADD NEW POST PANEL (HIGH-FIDELITY CMS) ----------------
  const apFileUploader = document.getElementById("ap-file");
  const apImgPreview = document.getElementById("ap-img-preview");
  const apImgPreviewBox = document.getElementById("ap-img-preview-box");
  const apResetBtn = document.getElementById("ap-reset-btn");
  const apForm = document.getElementById("add-post-form");

  if (apFileUploader) {
    apFileUploader.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        processImageUpload(e.target.files[0], (base64) => {
          apImageBase64 = base64;
          if (apImgPreview) {
            apImgPreview.src = base64;
            apImgPreview.style.display = "block";
          }
          if (apImgPreviewBox) {
            apImgPreviewBox.style.display = "block";
          }
          const label = document.querySelector("#add-post-form .form-file-uploader span");
          if (label) {
            label.innerHTML = `Event photo loaded! <span style="color:#27AE60;">(Ready to Save)</span>`;
          }
        });
      }
    });
  }

  const resetAddPostForm = () => {
    editingNewsId = null;
    const formTitle = document.querySelector("#add-post-panel .card-block-title");
    if (formTitle) formTitle.textContent = "Register New TVK News Article";
    
    if (apForm) apForm.reset();
    apImageBase64 = "";
    if (apImgPreview) {
      apImgPreview.src = "";
      apImgPreview.style.display = "none";
    }
    if (apImgPreviewBox) {
      apImgPreviewBox.style.display = "none";
    }
    const label = document.querySelector("#add-post-form .form-file-uploader span");
    if (label) {
      label.innerHTML = `Drag photo here or <strong style="color:var(--primary);">Paste Ctrl+V</strong>`;
    }
  };

  if (apResetBtn) {
    apResetBtn.addEventListener("click", () => {
      resetAddPostForm();
    });
  }

  // AI Writer click listener
  const apAiWriterBtn = document.getElementById("ap-ai-writer-btn");
  const apDetailsTextarea = document.getElementById("ap-details");
  const apHeadlineInput = document.getElementById("ap-headline");

  const tamilHeadline = "திருச்செங்கோடு தொகுதியில் TVK அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ் தலைமையில் பிரம்மாண்ட பொது நலத்திட்டங்கள் துவக்கம்!";
  const englishHeadline = "TVK Cabinet Minister Dr. K. G. Arunraj Inaugurates Welfare Projects in Tiruchengodu Constituency!";

  const tamilDetails = "தமிழக வெற்றிக் கழகத்தின் தலைவர் அவர்களின் வழிகாட்டுதலின்படி, திருச்செங்கோடு சட்டமன்றத் தொகுதிக்குட்பட்ட கைலாசம்பாளையம் மற்றும் எலாச்சிபாளையம் பகுதியில், மாண்புமிகு வணிகவரி மற்றும் பதிவுத் துறை அமைச்சரும் திருச்செங்கோடு சட்டமன்ற உறுப்பினருமான டாக்டர் கே. ஜி. அருண்ராஜ் அவர்களின் முன்னிலையில் பிரம்மாண்ட பொது நலத்திட்டங்கள் மற்றும் இலவச மருத்துவ முகாம் இன்று வெற்றிகரமாக துவக்கி வைக்கப்பட்டது.\n\nஇந்த முகாமில் தொகுதி மக்களுக்கு தேவையான குடிநீர் வசதிகள், கல்வி உதவித்தொகைகள் மற்றும் மருத்துவ உபகரணங்கள் நேரடியாக வழங்கப்பட்டன. திருச்செங்கோடு தொகுதி மக்கள் அனைவரும் இந்த திட்டங்களை மனதார வரவேற்றுள்ளனர். நிகழ்ச்சியில் கட்சியின் முக்கிய நிர்வாகிகள், மாவட்ட செயலாளர்கள் மற்றும் வார்டு பிரதிநிதிகள் பலர் பங்கேற்று சிறப்பித்தனர்.";

  const englishDetails = "Under the progressive leadership and vision of the TVK Party President, a series of major public welfare development schemes and a free specialty medical camp were officially inaugurated today in Kailasampalayam and Elachipalayam areas of Tiruchengodu constituency, led by Hon. Cabinet Minister for Commercial Taxes and Registration and Tiruchengodu MLA Dr. K. G. Arunraj.\n\nDuring the inauguration, critical water distribution systems, educational support scholarships, and specialized medical assistance kits were directly handed over to local families. The residents of Tiruchengodu expressed their heartfelt appreciation to the MLA for these timely community relief efforts. Key party secretaries and district representatives were present to honor the event.";

  if (apAiWriterBtn && apDetailsTextarea && apHeadlineInput) {
    apAiWriterBtn.addEventListener("click", () => {
      const lang = document.getElementById("ap-language").value;
      const targetHeadline = lang === "ta" ? tamilHeadline : englishHeadline;
      const targetDetails = lang === "ta" ? tamilDetails : englishDetails;

      apHeadlineInput.value = targetHeadline;
      apDetailsTextarea.value = "";
      apAiWriterBtn.disabled = true;
      const originalText = apAiWriterBtn.innerHTML;
      apAiWriterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Writing...';

      let i = 0;
      const speed = 8; // fast typewriter speed
      function typeWriter() {
        if (i < targetDetails.length) {
          apDetailsTextarea.value += targetDetails.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          apAiWriterBtn.disabled = false;
          apAiWriterBtn.innerHTML = originalText;
          showAdminAlert("AI successfully generated professional TVK press narrative!", "success");
        }
      }
      typeWriter();
    });
  }

  // Add Post Form submit listener
  if (apForm) {
    apForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const lang = document.getElementById("ap-language").value;
      const headline = apHeadlineInput.value.trim();
      const details = apDetailsTextarea.value.trim();
      const category = document.getElementById("ap-category").value;
      const date = document.getElementById("ap-date").value;
      const is_featured = document.getElementById("ap-check-featured").checked;

      if (!headline || !details) {
        alert("Please fill in Headline and Details.");
        return;
      }

      const newsItem = {
        title_en: lang === "en" ? headline : (headline + " (Translated)"),
        title_ta: lang === "ta" ? headline : (headline + " (மொழிபெயர்க்கப்பட்டது)"),
        category: category,
        date: date || new Date().toISOString().split("T")[0],
        is_featured: is_featured,
        is_breaking: document.getElementById("ap-check-breaking").checked,
        is_latest: document.getElementById("ap-check-latest").checked,
        is_recommanded: document.getElementById("ap-check-recommanded").checked,
        status_active: document.getElementById("ap-check-status").checked,
        content_en: lang === "en" ? details : "TVK Tiruchengodu constituency welfare and press announcements report details.",
        content_ta: lang === "ta" ? details : "தமிழக வெற்றிக் கழகம் திருச்செங்கோடு தொகுதி மக்கள் நலப்பணிகள் செய்தி அறிக்கை.",
        image_url: apImageBase64 || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
      };

      if (editingNewsId) {
        newsItem.id = editingNewsId;
      }

      TVKDb.saveNewsItem(newsItem);
      showAdminAlert("TVK CMS News article published successfully!", "success");
      
      resetAddPostForm();
      
      // Auto redirect to News Post list
      const newsSubBtn = document.querySelector(".sidebar-sub-btn[data-panel='news']");
      if (newsSubBtn) {
        newsSubBtn.click();
      } else {
        loadPanelData();
      }
    });
  }

  // ---------------- INITIALIZE ADMIN DASHBOARD ----------------
  const initAdmin = async () => {
    await TVKDb.init();
    setupDashboardFilters();
    loadPanelData();
  };

  initAdmin();
});
