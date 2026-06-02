const fs = require('fs');

let db = fs.readFileSync('js/db.js', 'utf8');

const additionalNews = `    },
    {
      "id": "news_6",
      "category": "Press Releases",
      "date": "2026-05-15",
      "image_url": "images/classroom.jpg",
      "is_featured": false,
      "title_en": "TVK Membership Drive Reaches 1 Lakh in Namakkal District",
      "title_ta": "நாமக்கல் மாவட்டத்தில் தவெக உறுப்பினர் சேர்க்கை 1 லட்சத்தை கடந்தது",
      "content_en": "Under the dynamic leadership of CM Thalapathy Vijay and the direct supervision of Minister Dr. Arunraj, the TVK membership drive in Namakkal district achieved a historic milestone of 1 lakh members. A massive celebration was held at the Tiruchengodu constituency office.",
      "content_ta": "மாண்புமிகு முதல்வர் தளபதி விஜய் அவர்களின் வழிகாட்டுதலின்படி, அமைச்சர் டாக்டர் அருண்ராஜ் அவர்களின் நேரடி மேற்பார்வையில் நாமக்கல் மாவட்டத்தில் தவெக உறுப்பினர் சேர்க்கை 1 லட்சத்தை கடந்து சாதனை படைத்துள்ளது. இது தொடர்பான மாபெரும் கொண்டாட்டம் திருச்செங்கோடு அலுவலகத்தில் நடைபெற்றது."
    },
    {
      "id": "news_7",
      "category": "Constituency Work",
      "date": "2026-05-10",
      "image_url": "images/lake.jpg",
      "is_featured": false,
      "title_en": "Dr. Arunraj inspects Tiruchengodu Government Hospital works",
      "title_ta": "திருச்செங்கோடு அரசு மருத்துவமனை பணிகளை டாக்டர் அருண்ராஜ் ஆய்வு செய்தார்",
      "content_en": "To ensure quality healthcare for rural populations, Minister Dr. Arunraj inspected the ongoing construction of the Multi-Specialty Wing at the Tiruchengodu Government Hospital. He ordered officials to expedite the works before the monsoon.",
      "content_ta": "கிராமப்புற மக்களுக்கு தரமான மருத்துவ சேவை கிடைப்பதை உறுதி செய்ய, திருச்செங்கோடு அரசு மருத்துவமனையில் கட்டப்பட்டு வரும் பன்னோக்கு சிறப்பு சிகிச்சை பிரிவு பணிகளை அமைச்சர் டாக்டர் அருண்ராஜ் ஆய்வு செய்தார். பருவமழைக்கு முன் பணிகளை விரைந்து முடிக்க அதிகாரிகளுக்கு உத்தரவிட்டார்."
    },
    {
      "id": "news_8",
      "category": "Welfare Activities",
      "date": "2026-05-05",
      "image_url": "images/medical.jpg",
      "is_featured": false,
      "title_en": "TVK Women's Wing organizes self-employment training",
      "title_ta": "தவெக மகளிர் அணி சார்பில் சுயதொழில் பயிற்சி முகாம்",
      "content_en": "Empowering rural women, the TVK Women's Wing organized a free self-employment and tailoring training camp in Kailasampalayam. Sewing machines were distributed to 200 women by Minister Dr. Arunraj.",
      "content_ta": "கிராமப்புற பெண்களின் வாழ்வாதாரத்தை மேம்படுத்தும் நோக்கில், தவெக மகளிர் அணி சார்பில் கைலாசம்பாளையத்தில் இலவச சுயதொழில் மற்றும் தையல் பயிற்சி முகாம் நடைபெற்றது. 200 பெண்களுக்கு தையல் இயந்திரங்களை அமைச்சர் டாக்டர் அருண்ராஜ் வழங்கினார்."
    },
    {
      "id": "news_9",
      "category": "Constituency Work",
      "date": "2026-04-28",
      "image_url": "images/cleanliness.jpg",
      "is_featured": false,
      "title_en": "Drinking water pipeline extension in Elachipalayam ward completed",
      "title_ta": "எலாச்சிபாளையம் வார்டில் புதிய குடிநீர் குழாய் அமைக்கும் பணி நிறைவு",
      "content_en": "A long-pending demand of Elachipalayam ward residents was fulfilled as the new Cauvery drinking water pipeline extension was completed and inaugurated today.",
      "content_ta": "எலாச்சிபாளையம் வார்டு மக்களின் நீண்ட கால கோரிக்கையான புதிய காவிரி குடிநீர் குழாய் விரிவாக்கப் பணிகள் நிறைவடைந்து இன்று மக்கள் பயன்பாட்டிற்கு திறக்கப்பட்டது."
    },
    {
      "id": "news_10",
      "category": "Welfare Activities",
      "date": "2026-04-22",
      "image_url": "images/gopuram.jpg",
      "is_featured": false,
      "title_en": "TVK Youth Wing conducts mega blood donation camp",
      "title_ta": "தவெக இளைஞரணி சார்பில் மாபெரும் ரத்த தான முகாம்",
      "content_en": "In celebration of Thalapathy Vijay's birthday, a mega blood donation camp was organized in Tiruchengodu. Over 500 youth donated blood, which was handed over to the Government Blood Bank.",
      "content_ta": "தளபதி விஜய் அவர்களின் பிறந்தநாளை முன்னிட்டு, திருச்செங்கோட்டில் மாபெரும் ரத்த தான முகாம் நடைபெற்றது. 500-க்கும் மேற்பட்ட இளைஞர்கள் ரத்த தானம் செய்தனர்."
    },
    {
      "id": "news_11",
      "category": "Welfare Activities",
      "date": "2026-04-15",
      "image_url": "images/secretariat.jpg",
      "is_featured": false,
      "title_en": "Minister Dr. Arunraj distributes welfare schemes to 500 weavers",
      "title_ta": "500 நெசவாளர்களுக்கு நலத்திட்ட உதவிகளை வழங்கினார் அமைச்சர்",
      "content_en": "Supporting the traditional handloom industry, solar power kits and modern looms were distributed to 500 weaver families in Tiruchengodu.",
      "content_ta": "பாரம்பரிய கைத்தறி நெசவுத் தொழிலை மேம்படுத்தும் நோக்கில், திருச்செங்கோட்டை சேர்ந்த 500 நெசவாளர் குடும்பங்களுக்கு சூரிய சக்தி கருவிகள் மற்றும் நவீன தறிகள் வழங்கப்பட்டன."
    }`;

// Find the end of the news_5 object and insert the new news there.
const target = `"content_ta": "வரலாற்றுச் சிறப்புமிக்க திருச்செங்கோடு ஸ்ரீ அர்த்தநாரீஸ்வரர் கோவில் சித்திரைத் திருவிழா தேரோட்டம் விமரிசையாக நடைபெற்றது. இதில் கலந்துகொண்டு சுவாமி தரிசனம் செய்த அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ், பக்தர்களின் வசதிக்காக குடிநீர், தூய்மை மற்றும் போக்குவரத்துப் பணிகளை விரிவுபடுத்த அதிகாரிகளுக்கு அறிவுறுத்தினார்."
    }`;

db = db.replace(target, target.replace('    }', additionalNews));
fs.writeFileSync('js/db.js', db);

// Also create a script that updates db_seed.json if necessary.
// But TVKDb loads from seedData inside db.js if localstorage is empty.
const clearScript = "<script>\n" +
"  localStorage.removeItem('tvk_tiruchengodu_database');\n" +
"  window.location.href = 'index.html';\n" +
"</script>";
fs.writeFileSync('clear_db.html', clearScript);

console.log("Added 6 extra news items and created clear_db.html");
