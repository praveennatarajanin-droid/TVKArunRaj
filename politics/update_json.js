const fs = require('fs');

const updateNews = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const newsIndex = data.news.findIndex(n => n.id === 'news_2');
  if (newsIndex !== -1) {
    data.news[newsIndex].title_ta = "இந்திய யூனியன் முஸ்லிம் லீக் கட்சியின் தேசிய தலைவர் பேராசிரியர் கே.எம்.காதர் மொகிதீன் அவர்கள் தவெகவிற்கு ஆதரவு";
    data.news[newsIndex].title_en = "IUML National President Prof. K.M. Kader Mohideen extends support to TVK";
    data.news[newsIndex].content_ta = "நம் வெற்றித் தலைவர் தளபதி தலைமையில் தமிழக வெற்றிக் கழகத்தின் ஆட்சி அமைய இன்று ஆதரவு கரம் நீட்டிய இந்திய யூனியன் முஸ்லிம் லீக் இயக்கத்தின் தேசிய தலைவர் பேராசிரியர் கே.எம்.காதர் மொகிதீன் அவர்களுக்கும், நிர்வாகிகளுக்கும், சட்டமன்ற உறுப்பினர்களுக்கும், தொண்டர்களுக்கும் எமது நெஞ்சார்ந்த நன்றியை தெரிவித்து கொள்கிறோம்.\n\nதமிழ்நாட்டு பெருமக்கள் அளித்த வரலாற்றுச் சிறப்பு மிக்க தீர்ப்பின் படி, ‘பிறப்பொக்கும் எல்லா உயிர்க்கும்’ என்கிற உயரிய கோட்பாட்டோடு சாதி, மத, பாலின பாகுபாடில்லாத சமத்துவ சமுதாயம் அமைத்திடவும்... மதசார்பற்ற சமூக நீதிக் கொள்கைகளை நடைமுறையில் நிலைநாட்டவும் நாம் தொடர்ந்து இணைந்து பயணிப்போம்.\n\nஎந்த நோக்கத்திற்காக நீங்கள் ஆதரவு கரம் நீட்டுகிறீர்களோ... அந்த நோக்கத்தில் தமிழக வெற்றி கழகத்தின் ஆட்சி உறுதியாகப் பயணித்து நமது பொது இலக்குகள் தீர்க்கமாக எட்டப்படும் என்ற உறுதியையும் நம்பிக்கையையும் தெரிவித்துக் கொள்கிறோம்.";
    data.news[newsIndex].content_en = "We express our heartfelt gratitude to the National President of the Indian Union Muslim League, Prof. K.M. Kader Mohideen, executives, MLAs, and cadres who extended their support today for the formation of the Tamilaga Vettri Kazhagam government under the leadership of our victorious leader Thalapathy.";
    data.news[newsIndex].image_url = "images/iuml_support.png";
    data.news[newsIndex].category = "Party Alliance";
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`news_2 not found in ${filePath}`);
  }
};

updateNews('./db_seed.json');
