const fs = require('fs');
const videoObj = { 
  id: 'vid_1', 
  title_en: 'Dr. K. G. Arunraj Latest Interview', 
  title_ta: 'டாக்டர் கே. ஜி. அருண்ராஜ் பேட்டி', 
  video_url: 'https://www.youtube.com/embed/s4a47eu-SIE', 
  thumbnail_url: 'images/arunraj.png', 
  date: '2026-06-01' 
}; 

// Update json files
['db.json', 'db_seed.json'].forEach(f => { 
  if (!fs.existsSync(f)) return; 
  let d = JSON.parse(fs.readFileSync(f, 'utf8')); 
  d.videos = [videoObj]; 
  fs.writeFileSync(f, JSON.stringify(d, null, 2)); 
}); 

// Update js/db.js
let js = fs.readFileSync('js/db.js', 'utf8'); 
js = js.replace(/"videos":\s*\[[\s\S]*?\]/, '"videos": ' + JSON.stringify([videoObj], null, 4)); 
fs.writeFileSync('js/db.js', js); 

console.log('Updated databases with new video');
