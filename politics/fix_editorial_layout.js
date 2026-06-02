const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Change editorial-top-block to stack vertically instead of side-by-side
css = css.replace(/\.editorial-top-block \{\s*display: grid;\s*grid-template-columns: 1\.2fr 1\.8fr;\s*gap: 1\.5rem;\s*\}/, 
`.editorial-top-block {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}`);

// Increase the size of the list item thumbnail slightly to make it "a little big one"
css = css.replace(/\.editorial-thumb-wrap \{\s*flex-shrink: 0;\s*width: 80px;\s*height: 70px;\s*border-radius: 4px;\s*overflow: hidden;\s*\}/,
`.editorial-thumb-wrap {
  flex-shrink: 0;
  width: 100px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}`);

// Increase title font size for the list items
css = css.replace(/\.editorial-list-title \{\s*font-size: 0\.8rem;\s*font-weight: 700;\s*line-height: 1\.4;\s*margin-bottom: 0\.25rem;\s*display: -webkit-box;\s*-webkit-line-clamp: 3;\s*-webkit-box-orient: vertical;\s*overflow: hidden;\s*\}/,
`.editorial-list-title {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.35rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`);

// Also adjust the featured card image wrap so it looks good when spanning full width
// Currently: .editorial-featured-img-wrap { height: 200px; ... }
// Let's make it 300px so it's a nice big banner.
css = css.replace(/\.editorial-featured-img-wrap \{\s*width: 100%;\s*height: 200px;\s*overflow: hidden;\s*\}/,
`.editorial-featured-img-wrap {
  width: 100%;
  height: 260px;
  overflow: hidden;
}`);

fs.writeFileSync('css/style.css', css);
console.log("Updated editorial block CSS to stack layout and enlarged news items");
