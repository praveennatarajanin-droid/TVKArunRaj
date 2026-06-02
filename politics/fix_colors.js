const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Fix invisible text in stats-banner
html = html.replace(/color: #fff; margin-bottom: 0.5rem;">தொகுதி வளர்ச்சிப் புள்ளிவிபரங்கள்/g, 'color: var(--primary); margin-bottom: 0.5rem;">தொகுதி வளர்ச்சிப் புள்ளிவிபரங்கள்');
html = html.replace(/color: rgba\(255,255,255,0.7\); font-weight: 500;">தொகுதி/g, 'color: var(--text-muted); font-weight: 500;">தொகுதி');

fs.writeFileSync('index.html', html);
console.log("Fixed invisible text colors in stats-banner");
