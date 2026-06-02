const fs = require('fs');

const updateLinks = (file) => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Update Facebook
        content = content.replace(/href="https:\/\/facebook\.com\/drarunrajtvk"/g, 'href="https://www.facebook.com/people/Arunraaj-TVK/61579221207463/#"');
        
        // Update Twitter / X
        content = content.replace(/href="https:\/\/twitter\.com\/drarunrajtvk"/g, 'href="https://x.com/arunraajkg"');
        
        // Update Instagram
        content = content.replace(/href="https:\/\/instagram\.com\/drarunrajtvk"/g, 'href="https://www.instagram.com/arunraajkg/?hl=en"');
        
        // Update YouTube
        content = content.replace(/href="https:\/\/youtube\.com\/@drarunrajtvk"/g, 'href="https://www.youtube.com/results?search_query=arunraj+tvk"');

        fs.writeFileSync(file, content);
        console.log(`Updated social links in ${file}`);
    } catch (e) {
        console.error(`Error updating ${file}:`, e.message);
    }
};

updateLinks('index.html');
updateLinks('news.html');
