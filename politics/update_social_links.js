const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(/id="social-fb" href="#"/g, 'id="social-fb" href="https://facebook.com/drarunrajtvk"');
indexHtml = indexHtml.replace(/id="social-tw" href="#"/g, 'id="social-tw" href="https://twitter.com/drarunrajtvk"');
indexHtml = indexHtml.replace(/id="social-ig" href="#"/g, 'id="social-ig" href="https://instagram.com/drarunrajtvk"');
indexHtml = indexHtml.replace(/id="social-yt" href="#"/g, 'id="social-yt" href="https://youtube.com/@drarunrajtvk"');

fs.writeFileSync('index.html', indexHtml);
console.log('Successfully updated index.html social links');
