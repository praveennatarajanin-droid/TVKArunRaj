const fs = require('fs');

let db = fs.readFileSync('js/db.js', 'utf8');

const targetVideos = `"videos": [
    {
      "id": "vid_1",
      "title_en": "Minister Dr. K. G. Arunraj Press Meet on e-Tax registration reforms & Commercial Tax digitization",
      "title_ta": "வணிகவரி மற்றும் பத்திரப்பதிவுத் துறை புதிய டிஜிட்டல் சீர்திருத்தங்கள் குறித்து அமைச்சர் செய்தியாளர் சந்திப்பு",
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "thumbnail_url": "images/secretariat.jpg"
    },
    {
      "id": "vid_2",
      "title_en": "CM Thalapathy Vijay Address on State Welfare Schemes & Youth Employment Policies",
      "title_ta": "தவெக அரசின் மாநில மக்கள் நலத்திட்டங்கள் குறித்து முதல்வர் தளபதி விஜயின் கொள்கை உரை",
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "thumbnail_url": "images/vijay.jpg"
    }
  ]`;

const replacementVideos = `"videos": [
    {
      "id": "vid_1",
      "title_en": "Minister Dr. K. G. Arunraj Speech at TVK Conference",
      "title_ta": "தவெக மாநாட்டில் அமைச்சர் டாக்டர் கே.ஜி. அருண்ராஜ் அவர்களின் எழுச்சியுரை",
      "video_url": "https://www.youtube.com/embed/i0W7xR8WJ7A",
      "thumbnail_url": "images/interview.png",
      "date": "2026-06-01"
    },
    {
      "id": "vid_2",
      "title_en": "Dr. K. G. Arunraj Special Interview on TVK's Vision for Tamil Nadu",
      "title_ta": "தமிழகத்திற்கான தவெக-வின் தொலைநோக்கு திட்டம் குறித்து டாக்டர் அருண்ராஜ் சிறப்பு பேட்டி",
      "video_url": "https://www.youtube.com/embed/0B98p7fW0hI",
      "thumbnail_url": "images/arunraj.png",
      "date": "2026-05-25"
    },
    {
      "id": "vid_3",
      "title_en": "Thalapathy Vijay's Historic TVK State Conference Full Coverage",
      "title_ta": "தளபதி விஜயின் வரலாற்று சிறப்புமிக்க தவெக மாநில மாநாடு - முழு தொகுப்பு",
      "video_url": "https://www.youtube.com/embed/Q4Xw4O04lFk",
      "thumbnail_url": "images/tvklogo.png",
      "date": "2026-05-10"
    }
  ]`;

db = db.replace(targetVideos, replacementVideos);
fs.writeFileSync('js/db.js', db);

console.log("Updated videos in db.js");

// We also need to clear local storage so the new seed data takes effect
const clearScript = "<script>\n" +
"  localStorage.removeItem('tvk_tiruchengodu_database');\n" +
"  window.location.href = 'index.html';\n" +
"</script>";
fs.writeFileSync('clear_db.html', clearScript);
