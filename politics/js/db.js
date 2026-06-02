/**
 * TVK Tambaram MLA - LocalStorage Database Engine (db.js)
 * Implements a unified client-side data layer to enable a fully dynamic website 
 * with a comprehensive administrative backend and local photo upload support.
 */

const TVKDb = (() => {
  const STORAGE_KEY = "tvk_tambaram_database";

  // Initial Seed Data to make the website look highly authentic and rich on first load
  const seedData = {
    config: {
      site_title_en: "TVK Tambaram MLA | D. Sarathkumar Constituency Portal",
      site_title_ta: "தவெக தாம்பரம் சட்டமன்ற உறுப்பினர் | டி. சரத்குமார் இணையதள முகப்பு",
      party_name_en: "Tamilaga Vettri Kazhagam (TVK) - Tambaram",
      party_name_ta: "தமிழக வெற்றி கழகம் (தவெக) - தாம்பரம்",
      mla_name_en: "D. Sarathkumar",
      mla_name_ta: "டி. சரத்குமார்",
      mla_title_en: "Cabinet Minister for Human Resources Management & Tambaram MLA",
      mla_title_ta: "மனிதவள மேலாண்மைத் துறை அமைச்சர் & தாம்பரம் சட்டமன்ற உறுப்பினர்",
      marquee_news_en: "🏆 Tambaram MLA D. Sarathkumar inspects Selaiyur and Mudichur lake desilting projects • TVK Membership camp registered 50,000+ members in Tambaram • MLA Grievance cell resolves 1,200+ municipal complaints this month • Free coaching classes launched for TNPSC aspirants at East Tambaram.",
      marquee_news_ta: "🏆 தாம்பரம் சட்டமன்ற உறுப்பினர் டி. சரத்குமார் சேலையூர் மற்றும் முடிச்சூர் ஏரிகளை நேரில் ஆய்வு செய்தார்! • தாம்பரத்தில் தவெக உறுப்பினர் சேர்க்கை 50,000-ஐ கடந்தது • சட்டமன்ற உறுப்பினர் குறைதீர்ப்பு முகாமில் இம்மாதம் 1,200+ மனுக்களுக்கு தீர்வு • கிழக்கு தாம்பரத்தில் TNPSC போட்டித் தேர்வுகளுக்கான இலவச பயிலகம் துவக்கம்.",
      phone: "+91 44 2239 5555",
      email: "tambaram.mla@tvk.org.in",
      office_address_en: "TVK Constituency Office, No. 12, Duraisamy Reddy Street, East Tambaram, Chennai - 600059",
      office_address_ta: "தவெக தொகுதி அலுவலகம், எண். 12, துரைசாமி ரெட்டி தெரு, கிழக்கு தாம்பரம், சென்னை - 600059",
      facebook: "https://facebook.com/tvkofficial",
      twitter: "https://twitter.com/tvkofficial",
      instagram: "https://instagram.com/tvkofficial",
      youtube: "https://youtube.com/c/TVKOfficial",
      mla_image_url: "images/sarathkumar.png",
      leader_image_url: "images/tvklogo.png",
      admin_password: "tvk2026"
    },
    news: [
      {
        id: "news_1",
        category: "Press Releases",
        date: "2026-06-01",
        image_url: "images/secretariat.jpg",
        is_featured: true,
        title_en: "Graft-free administration is our prime goal: CM Joseph Vijay at first State Cabinet briefing",
        title_ta: "ஊழலற்ற நிர்வாகமே எங்கள் முதன்மை இலக்கு: முதல் அமைச்சரவைக் கூட்டத்தில் முதல்வர் விஜய் உறுதி",
        content_en: "In the first cabinet briefing after taking oath, Chief Minister Thalapathy Vijay announced a series of administrative reforms, emphasizing a graft-free, secular, and transparent government model. TVK cabinet has approved the digitization of all files and automated civic grievance redressal. The CM assured that welfare schemes will reach every citizen without intermediary leakages.",
        content_ta: "பதவியேற்புக்குப் பிந்தைய முதல் அமைச்சரவைக் கூட்டத்தில் பேசிய மாண்புமிகு முதல்வர் தளபதி விஜய், நேர்மையான, மதச்சார்பற்ற மற்றும் ஊழலற்ற வெளிப்படையான நிர்வாகத்தை மக்கள் நலனுக்காக தவெக அரசு வழங்கும் எனப் பிரகடனம் செய்தார். கோப்புகள் அனைத்தும் டிஜிட்டல் மயமாக்கப்பட்டு, மக்கள் குறைகளுக்கு 15 நாட்களில் தீர்வு காண அமைச்சரவை ஒப்புதல் அளித்துள்ளது."
      },
      {
        id: "news_2",
        category: "Constituency Work",
        date: "2026-05-28",
        image_url: "images/lake.jpg",
        is_featured: false,
        title_en: "Tambaram MLA D. Sarathkumar inspects storm water drain construction and desilting at Mudichur",
        title_ta: "தாம்பரம் சட்டமன்ற உறுப்பினர் டி. சரத்குமார் முடிச்சூரில் பருவமழைக்கு முன் வடிகால் பணிகளை ஆய்வு செய்தார்",
        content_en: "Tambaram Assembly constituency MLA and Minister D. Sarathkumar conducted a field inspection of desilting and storm water drain works at Mudichur, Selaiyur, and Chromepet. He directed corporation engineers to remove blockages and complete all structural works before the monsoon season to prevent water-logging in residential zones.",
        content_ta: "தாம்பரம் தொகுதி சட்டமன்ற உறுப்பினரும் அமைச்சருமான டி. சரத்குமார் இன்று முடிச்சூர் மற்றும் சேலையூர் ஏரி இணைப்புக் கால்வாய்கள் தூர்வாரும் பணிகளை நேரில் பார்வையிட்டார். மழைக்காலங்களில் குடியிருப்புப் பகுதிகளில் வெள்ளம் சூழாமல் இருக்க, மழைநீர் வடிகால் பணிகளை உடனடியாக முடிக்க மாநகராட்சி அதிகாரிகளுக்கு அறிவுறுத்தினார்."
      },
      {
        id: "news_3",
        category: "Welfare Activities",
        date: "2026-05-25",
        image_url: "images/medical.jpg",
        is_featured: false,
        title_en: "Free multi-specialty medical checkup camp organized by TVK youth wing in West Tambaram",
        title_ta: "மேற்கு தாம்பரத்தில் தவெக சார்பில் நடைபெற்ற இலவச பன்னோக்கு மருத்துவ ஆலோசனை முகாம்",
        content_en: "Under the guidance of CM Thalapathy Vijay, a massive free health camp was organized by Tambaram TVK cadres. Over 1,000 residents received free medical checks, consultations, and medicines. Tambaram MLA D. Sarathkumar inaugurated the camp and distributed healthcare aid kits to families.",
        content_ta: "தவெக தலைவர் முதல்வர் தளபதி விஜய் அவர்களின் அறிவுறுத்தலின்படி, தாம்பரம் தொகுதி தவெக சார்பில் மாபெரும் இலவச மருத்துவ முகாம் நடைபெற்றது. 1,000-க்கும் மேற்பட்ட பயனாளிகளுக்கு இலவச மருத்துவ பரிசோதனைகள் செய்யப்பட்டு மருந்துகள் வழங்கப்பட்டன. முகாமைத் தொடங்கி வைத்த அமைச்சர் டி. சரத்குமார் குடும்பங்களுக்கு நலத்திட்ட உதவிகளை வழங்கினார்."
      },
      {
        id: "news_4",
        category: "Welfare Activities",
        date: "2026-05-20",
        image_url: "images/classroom.jpg",
        is_featured: false,
        title_en: "TVK Free Competitive Exam Study Center launched in East Tambaram by MLA D. Sarathkumar",
        title_ta: "கிழக்கு தாம்பரத்தில் அரசுத் தேர்வு இலவச பயிலகத்தை திறந்து வைத்தார் சட்டமன்ற உறுப்பினர் டி. சரத்குமார்",
        content_en: "To support students from economically weaker sections, Tambaram MLA D. Sarathkumar inaugurated a TVK Free Competitive Exam Study Center. The academy provides free coaching, textbooks, and online mock tests for TNPSC, UPSC, and banking examinations, benefiting hundreds of local aspirants.",
        content_ta: "ஏழை மாணவர்களின் கல்வி நலனை மேம்படுத்தும் நோக்கில், தாம்பரம் தொகுதி தவெக சார்பில் அரசுத் தேர்வுகளுக்கான இலவச பயிலகத்தை சட்டமன்ற உறுப்பினர் டி. சரத்குமார் திறந்து வைத்தார். இதன் மூலம் குரோம்பேட்டை மற்றும் தாம்பரம் பகுதி மாணவர்கள் TNPSC, UPSC தேர்வுகளுக்கு இலவசமாக பயிற்சி பெறலாம்."
      }
    ],
    projects: [
      {
        id: "proj_1",
        title_en: "Selaiyur & Mudichur Lake Desilting & Ecological Restoration",
        title_ta: "சேலையூர் & முடிச்சூர் ஏரி தூர்வாருதல் மற்றும் சுற்றுச்சூழல் சீரமைப்பு",
        description_en: "Deepening, strengthening of bunds, and creation of walking tracks at Selaiyur and Mudichur lakes to increase water storage and recharge groundwater.",
        description_ta: "தாம்பரத்தின் முக்கிய குடிநீர் ஆதாரங்களான சேலையூர் மற்றும் முடிச்சூர் ஏரிகளை தூர்வாரி, கரைகளைப் பலப்படுத்தி, நடைபாதை அமைக்கும் சுற்றுச்சூழல் மேம்பாட்டுத் திட்டம்.",
        status: "ongoing",
        location_en: "Tambaram Constituency",
        location_ta: "தாம்பரம் சட்டமன்ற தொகுதி",
        impact_en: "Prevents flood in 20+ residential colonies and increases groundwater tables",
        impact_ta: "20-க்கும் மேற்பட்ட குடியிருப்பு பகுதிகளில் வெள்ளத்தடுப்பு மற்றும் நிலத்தடி நீர் உயர்வு"
      },
      {
        id: "proj_2",
        title_en: "Establishment of TVK Free Civil Services Coaching Center",
        title_ta: "தவெக ஐ.ஏ.எஸ் மற்றும் அரசுத் தேர்வு இலவச பயிலகம் அமைத்தல்",
        description_en: "Setting up a state-of-the-art coaching center with library resources in East Tambaram for civil services and TNPSC aspirants.",
        description_ta: "தாம்பரம் பகுதி இளைஞர்கள் போட்டித் தேர்வுகளில் வெற்றி பெற கிழக்கு தாம்பரத்தில் நவீன டிஜிட்டல் நூலகத்துடன் கூடிய இலவச பயிலகம் அமைக்கும் பணி.",
        status: "completed",
        location_en: "East Tambaram, Chennai",
        location_ta: "கிழக்கு தாம்பரம், சென்னை",
        impact_en: "Supports 500+ local students annually with professional mentoring",
        impact_ta: "ஆண்டுதோறும் 500-க்கும் மேற்பட்ட உள்ளூர் மாணவர்கள் பயன் பெறுவர்"
      },
      {
        id: "proj_3",
        title_en: "MLA Public Grievance Digital Tracking System (Tambaram Ward Offices)",
        title_ta: "சட்டமன்ற உறுப்பினர் குறைதீர்ப்பு முகாம் டிஜிட்டல் கண்காணிப்பு திட்டம்",
        description_en: "Digitizing the grievance submission process across all 5 wards in Tambaram, connecting petitions directly to the MLA table for swift action.",
        description_ta: "தாம்பரம் தொகுதியில் சமர்ப்பிக்கப்படும் மக்கள் மனுக்களை சட்டமன்ற உறுப்பினரின் நேரடி கண்காணிப்பில் டிஜிட்டல் முறையில் கண்காணிக்கும் திட்டம்.",
        status: "completed",
        location_en: "All Ward Offices, Tambaram",
        location_ta: "தாம்பரம் மாநகராட்சி வார்டு அலுவலகங்கள்",
        impact_en: "Ensures resolution of civic complaints within 15 working days",
        impact_ta: "15 நாட்களுக்குள் குடிநீர், சாலை பிரச்சனைகளுக்கு தீர்வு காணுதல்"
      }
    ],
    gallery: [
      {
        id: "gal_1",
        caption_en: "Tambaram MLA D. Sarathkumar reviewing desilting operations at Mudichur lake bunds",
        caption_ta: "முடிச்சூர் ஏரி மதகுகள் மற்றும் தூர்வாரும் பணிகளை நேரில் பார்வையிட்டு ஆய்வு செய்யும் சட்டமன்ற உறுப்பினர் டி. சரத்குமார்",
        image_url: "images/lake.jpg",
        date: "2026-05-28"
      },
      {
        id: "gal_2",
        caption_en: "Distribution of free books and coaching materials to competitive exam students",
        caption_ta: "அரசுத் தேர்வு இலவச பயிலக மாணவர்களுக்கு பாடப்புத்தகங்கள் மற்றும் பயிற்சி கையேடுகளை வழங்கிய அமைச்சர்",
        image_url: "images/classroom.jpg",
        date: "2026-05-25"
      },
      {
        id: "gal_3",
        caption_en: "Medical camp team conducting free checkups and distributing health kits in Tambaram",
        caption_ta: "தாம்பரம் தவெக சார்பில் நடைபெற்ற இலவச பன்னோக்கு மருத்துவ முகாமில் சிகிச்சை பெறும் முதியவர்கள்",
        image_url: "images/medical.jpg",
        date: "2026-05-23"
      },
      {
        id: "gal_4",
        caption_en: "MLA D. Sarathkumar planting tree saplings along Selaiyur main roads",
        caption_ta: "சேலையூர் பகுதியில் மரக்கன்றுகளை நட்டு மாபெரும் பசுமை இயக்கத்தை தொடங்கி வைத்த சட்டமன்ற உறுப்பினர்",
        image_url: "images/cleanliness.jpg",
        date: "2026-05-20"
      }
    ],
    videos: [
      {
        id: "vid_1",
        title_en: "Tambaram MLA D. Sarathkumar Press Meet on Storm Water Drain Works & Flood Preparedness",
        title_ta: "தாம்பரம் தொகுதி வெள்ளத்தடுப்பு பணிகள் குறித்து சட்டமன்ற உறுப்பினர் டி. சரத்குமார் செய்தியாளர் சந்திப்பு",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "images/lake.jpg"
      },
      {
        id: "vid_2",
        title_en: "CM Thalapathy Vijay Address on State Welfare Schemes & Youth Employment Policies",
        title_ta: "தவெக அரசின் மாநில மக்கள் நலத்திட்டங்கள் குறித்து முதல்வர் தளபதி விஜயின் கொள்கை உரை",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "images/vijay.jpg"
      }
    ],
    grievances: [
      {
        id: "griev_1",
        name: "K. Ranganathan",
        email: "ranga.tambaram@gmail.com",
        phone: "+91 98400 98765",
        ward_no: "Ward 12 (East Tambaram)",
        grievance_type: "Roads & Traffic",
        description: "The main approach road near East Tambaram railway station has deep potholes. Please inspect and relay the road.",
        date: "2026-06-01",
        status: "reviewed"
      },
      {
        id: "griev_2",
        name: "Meenakshi Sundaram",
        email: "meena.selaiyur@yahoo.com",
        phone: "+91 97900 12345",
        ward_no: "Ward 14 (Selaiyur)",
        grievance_type: "Garbage Clearance",
        description: "Regular garbage collection is not happening on Kamaraj Street. Kindly address this issue.",
        date: "2026-05-30",
        status: "pending"
      }
    ]
  };

  /**
   * Safe retrieval of database from localStorage. If database is not found,
   * seeds the database with our premium sample content.
   */
  const getDb = () => {
    let db = localStorage.getItem(STORAGE_KEY);
    if (!db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    try {
      const parsed = JSON.parse(db);
      
      // Force migration if old Vijay data is found (meaning we are running the TVK Sarathkumar rebranding)
      const needsMigration = !parsed.config || 
                             (parsed.config.mla_name_en && parsed.config.mla_name_en.includes("Vijay")) || 
                             !parsed.config.facebook || 
                             parsed.config.facebook === "#" || 
                             !parsed.config.mla_image_url ||
                             parsed.config.mla_image_url.includes("vijay.jpg") ||
                             !parsed.config.leader_image_url ||
                             parsed.config.leader_image_url.includes("tvk_logo.png") ||
                             (parsed.config.mla_image_url && parsed.config.mla_image_url.includes("wikipedia.org"));
                             
      if (needsMigration) {
        console.log("Forcing re-seed for TVK D. Sarathkumar Tambaram MLA constituency portal");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
      }
      
      // Auto-validate and repair any missing collections compared to seedData
      let repaired = false;
      
      if (!parsed.config) {
        parsed.config = { ...seedData.config };
        repaired = true;
      }
      if (!parsed.news || !Array.isArray(parsed.news)) {
        parsed.news = [ ...seedData.news ];
        repaired = true;
      }
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        parsed.projects = [ ...seedData.projects ];
        repaired = true;
      }
      if (!parsed.gallery || !Array.isArray(parsed.gallery)) {
        parsed.gallery = [ ...seedData.gallery ];
        repaired = true;
      }
      if (!parsed.videos || !Array.isArray(parsed.videos)) {
        parsed.videos = [ ...seedData.videos ];
        repaired = true;
      }
      if (!parsed.grievances || !Array.isArray(parsed.grievances)) {
        parsed.grievances = [ ...seedData.grievances ];
        repaired = true;
      }

      // Preserve Wikimedia Commons images - only replace if completely blank or invalid
      let updated = false;
      if (!parsed.config.mla_image_url || parsed.config.mla_image_url === "") {
        parsed.config.mla_image_url = seedData.config.mla_image_url;
        updated = true;
      }
      if (!parsed.config.leader_image_url || parsed.config.leader_image_url === "") {
        parsed.config.leader_image_url = seedData.config.leader_image_url;
        updated = true;
      }

      if (repaired || updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error("Database corruption detected. Re-seeding database.", e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
  };

  const saveDb = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    // ---------------- INITIALIZATION METHODS ----------------
    init: async () => {
      try {
        console.log("Syncing database with backend server...");
        const res = await fetch('/api/db');
        const data = await res.json();
        saveDb(data);
        return data;
      } catch (e) {
        console.warn("Could not sync with backend server. Using client cache.", e);
        return getDb();
      }
    },

    // ---------------- CONFIG / SETTINGS METHODS ----------------
    getConfig: () => {
      return getDb().config;
    },
    updateConfig: (newConfig) => {
      const db = getDb();
      db.config = { ...db.config, ...newConfig };
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      }).catch(err => console.error("Server sync failed:", err));
      
      return db.config;
    },

    // ---------------- NEWS METHODS ----------------
    getNews: () => {
      // Sort news by date descending, featured news always first
      return getDb().news.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.date) - new Date(a.date);
      });
    },
    getNewsItem: (id) => {
      return getDb().news.find(item => item.id === id);
    },
    saveNewsItem: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.news.findIndex(n => n.id === updatedItem.id);
        if (idx !== -1) {
          if (updatedItem.is_featured) {
            db.news.forEach(n => n.is_featured = false);
          }
          db.news[idx] = { ...db.news[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "news_" + Date.now();
        updatedItem.date = updatedItem.date || new Date().toISOString().split("T")[0];
        if (updatedItem.is_featured) {
          db.news.forEach(n => n.is_featured = false);
        }
        db.news.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteNewsItem: (id) => {
      const db = getDb();
      db.news = db.news.filter(n => n.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/news/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- CONSTITUENCY PROJECTS METHODS ----------------
    getProjects: () => {
      return getDb().projects;
    },
    saveProject: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.projects.findIndex(p => p.id === updatedItem.id);
        if (idx !== -1) {
          db.projects[idx] = { ...db.projects[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "proj_" + Date.now();
        db.projects.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteProject: (id) => {
      const db = getDb();
      db.projects = db.projects.filter(p => p.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/projects/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- GALLERY METHODS ----------------
    getGallery: () => {
      return getDb().gallery.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    saveGalleryItem: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (!updatedItem.id) {
        updatedItem.id = "gal_" + Date.now();
      }
      updatedItem.date = updatedItem.date || new Date().toISOString().split("T")[0];
      db.gallery.push(updatedItem);
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteGalleryItem: (id) => {
      const db = getDb();
      db.gallery = db.gallery.filter(g => g.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/gallery/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- VIDEO GALLERY METHODS ----------------
    getVideos: () => {
      return getDb().videos;
    },
    saveVideo: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.videos.findIndex(v => v.id === updatedItem.id);
        if (idx !== -1) {
          db.videos[idx] = { ...db.videos[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "vid_" + Date.now();
        // Convert watch youtube urls into embed compatible format if needed
        if (updatedItem.video_url.includes("youtube.com/watch?v=")) {
          const videoId = updatedItem.video_url.split("v=")[1].split("&")[0];
          updatedItem.video_url = `https://www.youtube.com/embed/${videoId}`;
        } else if (updatedItem.video_url.includes("youtu.be/")) {
          const videoId = updatedItem.video_url.split("youtu.be/")[1].split("?")[0];
          updatedItem.video_url = `https://www.youtube.com/embed/${videoId}`;
        }
        db.videos.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteVideo: (id) => {
      const db = getDb();
      db.videos = db.videos.filter(v => v.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/videos/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- GRIEVANCE METHODS ----------------
    getGrievances: () => {
      return getDb().grievances.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    addGrievance: async (grievance) => {
      try {
        const res = await fetch('/api/db/grievances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(grievance)
        });
        const result = await res.json();
        
        // Also update local cache
        const db = getDb();
        const fullGrievance = {
          ...grievance,
          id: result.trackingId,
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        db.grievances.push(fullGrievance);
        saveDb(db);
        
        return fullGrievance;
      } catch (err) {
        console.error("Grievance submission to server failed, using local offline mode:", err);
        // Offline fallback
        const db = getDb();
        grievance.id = "griev_" + Date.now();
        grievance.date = new Date().toISOString().split("T")[0];
        grievance.status = "pending";
        db.grievances.push(grievance);
        saveDb(db);
        return grievance;
      }
    },
    updateGrievanceStatus: (id, status) => {
      const db = getDb();
      const idx = db.grievances.findIndex(g => g.id === id);
      if (idx !== -1) {
        db.grievances[idx].status = status;
        saveDb(db);
        
        // Sync to backend via POST
        fetch('/api/db/grievances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(db.grievances[idx])
        }).catch(err => console.error("Server sync failed:", err));
        
        return db.grievances[idx];
      }
      return null;
    },
    deleteGrievance: (id) => {
      const db = getDb();
      db.grievances = db.grievances.filter(g => g.id !== id);
      saveDb(db);
      return true;
    },
    
    // Helper to completely reset database to initial seed data
    resetDb: async () => {
      try {
        await fetch('/api/db/reset', { method: 'POST' });
        const res = await fetch('/api/db');
        const data = await res.json();
        saveDb(data);
        return data;
      } catch (e) {
        console.error("Server reset failed, reverting local only", e);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
      }
    }
  };
})();
