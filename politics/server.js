const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname));

const DB_PATH = path.join(__dirname, 'db.json');
const SEED_PATH = path.join(__dirname, 'db_seed.json');

// Read DB Helper
function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error("Error reading db.json, falling back to seed", e);
  }
  
  // Try fallback to seed
  try {
    if (fs.existsSync(SEED_PATH)) {
      const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
      return seed;
    }
  } catch (err) {
    console.error("Critical error reading db_seed.json", err);
  }
  
  return { config: {}, news: [], projects: [], gallery: [], videos: [], grievances: [] };
}

// Write DB Helper
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error("Error writing db.json", e);
    return false;
  }
}

// Helper to fetch XML/HTML content from URL recursively following HTTP 301/302 redirects
function fetchUrlString(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'ta-IN,ta;q=0.9,en-US;q=0.8,en;q=0.7'
    };
    
    const req = client.get(url, {
      headers: { ...defaultHeaders, ...options.headers },
      timeout: 5000
    }, (res) => {
      // Follow redirection
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        fetchUrlString(redirectUrl, options).then(resolve).catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

// Parse Google News XML RSS Feed
function parseRss(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    
    if (titleMatch && linkMatch) {
      items.push({
        title: unescapeXml(titleMatch[1]),
        link: unescapeXml(linkMatch[1]),
        date: dateMatch ? unescapeXml(dateMatch[1]) : new Date().toUTCString(),
        description: descMatch ? unescapeXml(descMatch[1]) : ""
      });
    }
  }
  return items;
}

function unescapeXml(str) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// Strip news publication suffix from title (e.g. " - Times of India")
function cleanTitle(title, lang) {
  const tamilSources = /\s+-\s+(Vikatan|Daily Thanthi|Dinamalar|Dinakaran|The Hindu|Zee News|Samayam Tamil|BBC News Tamil|Puthiyathalaimurai|Polimer News|News18 Tamil|Oneindia Tamil|Webdunia|Malai Malar|Samayam|ABP Nadu|News7 Tamil|Tamil Samayam|Hindutamil|Indian Express|மாலை மலர்|தினத்தந்தி|தினமலர்|தினகரன்|ஒன்இந்தியா|விகடன்|ஏபிபி நாடு|செய்திகள்|சமயம்)/i;
  const englishSources = /\s+-\s+(The Hindu|Indian Express|Times of India|NDTV|Hindustan Times|News18|India Today|Deccan Herald|Business Standard|Economic Times|Moneycontrol|Oneindia|Zee News|Mirror Now|Republic World|Times Now|The News Minute|Scroll|Wire|PIB|Tamil Nadu Government)/i;
  
  let clean = title;
  if (lang === 'ta') {
    clean = clean.replace(tamilSources, '');
  } else {
    clean = clean.replace(englishSources, '');
  }
  return clean.trim();
}

// Fetch article og:image and og:description
async function extractArticleMeta(url) {
  try {
    const html = await fetchUrlString(url);
    
    // Find og:image content
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["']/i) && html.match(/<meta[^>]*property=["']og:image["']/i);
    
    // Find description
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    
    let imageUrl = null;
    if (ogImageMatch) {
      // Clean up match if needed
      const rawMatch = ogImageMatch[0];
      const valMatch = rawMatch.match(/content=["']([^"']+)["']/i);
      imageUrl = valMatch ? valMatch[1] : null;
    }
    
    let description = null;
    if (ogDescMatch) {
      const rawMatch = ogDescMatch[0];
      const valMatch = rawMatch.match(/content=["']([^"']+)["']/i);
      description = valMatch ? valMatch[1] : null;
    }
    
    return { imageUrl, description };
  } catch (e) {
    console.error("Failed to extract meta for", url, e.message);
    return { imageUrl: null, description: null };
  }
}

// Validate if image URL exists, is accessible, and returns image content-type
function validateImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      resolve(false);
      return;
    }
    const client = url.startsWith('https') ? https : http;
    try {
      const parsedUrl = new URL(url);
      const req = client.request({
        method: 'HEAD',
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 3000
      }, (res) => {
        const contentType = res.headers['content-type'] || '';
        if (res.statusCode >= 200 && res.statusCode < 300 && contentType.startsWith('image/')) {
          resolve(true);
        } else {
          // Fallback to GET for servers that block HEAD
          const getReq = client.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 3000
          }, (getRes) => {
            const getContentType = getRes.headers['content-type'] || '';
            resolve(getRes.statusCode === 200 && getContentType.startsWith('image/'));
            getRes.resume();
          });
          getReq.on('error', () => resolve(false));
        }
      });
      
      req.on('error', () => resolve(false));
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

// Get complete database
app.get('/api/db', (req, res) => {
  res.json(readDb());
});

// Update portal configuration
app.post('/api/db/config', (req, res) => {
  const dbData = readDb();
  dbData.config = { ...dbData.config, ...req.body };
  writeDb(dbData);
  res.json({ success: true });
});

// Create/Update news article
app.post('/api/db/news', (req, res) => {
  const dbData = readDb();
  const article = req.body;
  
  if (!article.id) {
    article.id = `news_${Date.now()}`;
    dbData.news.unshift(article);
  } else {
    const idx = dbData.news.findIndex(n => n.id === article.id);
    if (idx !== -1) {
      dbData.news[idx] = { ...dbData.news[idx], ...article };
    } else {
      dbData.news.unshift(article);
    }
  }
  writeDb(dbData);
  res.json({ success: true });
});

// Delete news article
app.delete('/api/db/news/:id', (req, res) => {
  const dbData = readDb();
  dbData.news = dbData.news.filter(n => n.id !== req.params.id);
  writeDb(dbData);
  res.json({ success: true });
});

// Create/Update welfare project
app.post('/api/db/projects', (req, res) => {
  const dbData = readDb();
  const project = req.body;
  
  if (!project.id) {
    project.id = `proj_${Date.now()}`;
    dbData.projects.unshift(project);
  } else {
    const idx = dbData.projects.findIndex(p => p.id === project.id);
    if (idx !== -1) {
      dbData.projects[idx] = { ...dbData.projects[idx], ...project };
    } else {
      dbData.projects.unshift(project);
    }
  }
  writeDb(dbData);
  res.json({ success: true });
});

// Delete welfare project
app.delete('/api/db/projects/:id', (req, res) => {
  const dbData = readDb();
  dbData.projects = dbData.projects.filter(p => p.id !== req.params.id);
  writeDb(dbData);
  res.json({ success: true });
});

// Create/Update gallery item
app.post('/api/db/gallery', (req, res) => {
  const dbData = readDb();
  const item = req.body;
  
  if (!item.id) {
    item.id = `gal_${Date.now()}`;
    dbData.gallery.unshift(item);
  } else {
    const idx = dbData.gallery.findIndex(g => g.id === item.id);
    if (idx !== -1) {
      dbData.gallery[idx] = { ...dbData.gallery[idx], ...item };
    } else {
      dbData.gallery.unshift(item);
    }
  }
  writeDb(dbData);
  res.json({ success: true });
});

// Delete gallery item
app.delete('/api/db/gallery/:id', (req, res) => {
  const dbData = readDb();
  dbData.gallery = dbData.gallery.filter(g => g.id !== req.params.id);
  writeDb(dbData);
  res.json({ success: true });
});

// Create/Update video item
app.post('/api/db/videos', (req, res) => {
  const dbData = readDb();
  const video = req.body;
  
  if (!video.id) {
    video.id = `vid_${Date.now()}`;
    dbData.videos.push(video);
  } else {
    const idx = dbData.videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      dbData.videos[idx] = { ...dbData.videos[idx], ...video };
    } else {
      dbData.videos.push(video);
    }
  }
  writeDb(dbData);
  res.json({ success: true });
});

// Delete video item
app.delete('/api/db/videos/:id', (req, res) => {
  const dbData = readDb();
  dbData.videos = dbData.videos.filter(v => v.id !== req.params.id);
  writeDb(dbData);
  res.json({ success: true });
});

// Submit grievance petition
app.post('/api/db/grievances', (req, res) => {
  const dbData = readDb();
  const petition = req.body;
  petition.id = `griev_${Date.now()}`;
  petition.date = new Date().toISOString().split('T')[0];
  petition.status = "pending";
  
  dbData.grievances.unshift(petition);
  writeDb(dbData);
  res.json({ success: true, trackingId: petition.id });
});

// Reset database to seed backup
app.post('/api/db/reset', (req, res) => {
  try {
    if (fs.existsSync(SEED_PATH)) {
      const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
      writeDb(seed);
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Seed file not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Crawl latest news from internet
app.post('/api/db/news/fetch', async (req, res) => {
  try {
    const dbData = readDb();
    
    // Prepare sets for duplicate checks
    const existingTitles = new Set();
    dbData.news.forEach(n => {
      if (n.title_ta) existingTitles.add(n.title_ta.toLowerCase().trim());
      if (n.title_en) existingTitles.add(n.title_en.toLowerCase().trim());
    });
    const existingLinks = new Set(dbData.news.map(n => n.original_link || ""));
    
    // Feeds to query
    const feeds = [
      { url: 'https://news.google.com/rss/search?q=TVK+Vijay+OR+Tamilaga+Vettri+Kazhagam&hl=ta&gl=IN&ceid=IN:ta', lang: 'ta' },
      { url: 'https://news.google.com/rss/search?q=TVK+Vijay+OR+Tamilaga+Vettri+Kazhagam&hl=en-IN&gl=IN&ceid=IN:en', lang: 'en' }
    ];
    
    let addedCount = 0;
    const fetchLimit = 6; // Max 6 new articles per fetch call to avoid timeouts
    
    for (const feed of feeds) {
      try {
        console.log(`Aggregating news from feed: ${feed.url}`);
        const xml = await fetchUrlString(feed.url);
        const feedItems = parseRss(xml);
        
        for (const item of feedItems) {
          if (addedCount >= fetchLimit) break;
          
          const cleanRawTitle = cleanTitle(item.title, feed.lang);
          
          // Verify duplicates
          if (existingTitles.has(cleanRawTitle.toLowerCase().trim()) || existingLinks.has(item.link)) {
            continue;
          }
          
          console.log(`Found new news: ${cleanRawTitle}. Parsing details...`);
          const meta = await extractArticleMeta(item.link);
          
          let imgUrl = meta.imageUrl;
          let isValidImg = false;
          if (imgUrl) {
            isValidImg = await validateImageUrl(imgUrl);
          }
          
          // Use authentic fallback image if og:image fails
          if (!isValidImg) {
            imgUrl = "images/welcome.jpg"; 
          }
          
          const pubDate = new Date(item.date);
          const formattedDate = !isNaN(pubDate.getTime()) ? pubDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          
          const newArticle = {
            id: `fetched_news_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            category: "Press Releases",
            date: formattedDate,
            image_url: imgUrl,
            original_link: item.link,
            is_featured: false
          };
          
          const cleanDesc = stripHtml(meta.description || item.description || "");
          
          if (feed.lang === 'ta') {
            newArticle.title_ta = cleanRawTitle;
            newArticle.content_ta = cleanDesc || "செய்தியின் முழு விவரம் தவெக தலைமை அலுவலக ஊடகப் பிரிவில் விரைவில் வெளியிடப்படும்.";
            // English fields: leave blank so admin can fill them in correctly
            newArticle.title_en = "";
            newArticle.content_en = "Please add English translation of this article.";
          } else {
            newArticle.title_en = cleanRawTitle;
            newArticle.content_en = cleanDesc || "Press release details and official transcript will be published shortly by TVK Media Cell.";
            // Tamil fields: leave blank so admin can fill them in correctly
            newArticle.title_ta = "";
            newArticle.content_ta = "இந்தக் கட்டுரையின் தமிழ் மொழிபெயர்ப்பை சேர்க்கவும்.";
          }
          
          dbData.news.unshift(newArticle); // Insert at top
          existingTitles.add(cleanRawTitle.toLowerCase().trim());
          existingLinks.add(item.link);
          addedCount++;
        }
      } catch (err) {
        console.error(`Error processing feed ${feed.url}:`, err.message);
      }
    }
    
    if (addedCount > 0) {
      writeDb(dbData);
    }
    
    res.json({ success: true, addedCount });
  } catch (error) {
    console.error("News aggregator API failure:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback to index.html for undefined frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
