/**
 * TVK Tiruchengodu MLA - LocalStorage Database Engine (db.js)
 * Implements a unified client-side data layer to enable a fully dynamic website 
 * with a comprehensive administrative backend and local photo upload support.
 */

const TVKDb = (() => {
  const STORAGE_KEY = "tvk_tiruchengodu_database";

  // Initial Seed Data to make the website look highly authentic and rich on first load
  const seedData = {
  "config": {
    "site_title_en": "TVK Tiruchengodu MLA | Minister Dr. K. G. Arunraj Portal",
    "site_title_ta": "தவெக திருச்செங்கோடு சட்டமன்ற உறுப்பினர் | அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ் இணையதளம்",
    "party_name_en": "Tamilaga Vettri Kazhagam (TVK) - Tiruchengodu",
    "party_name_ta": "தமிழக வெற்றி கழகம் (தவெக) - திருச்செங்கோடு",
    "mla_name_en": "Dr. K. G. Arunraj",
    "mla_name_ta": "டாக்டர் கே. ஜி. அருண்ராஜ்",
    "mla_title_en": "Minister for Commercial Taxes & Registration & Tiruchengodu MLA",
    "mla_title_ta": "வணிகவரி மற்றும் பதிவுத் துறை அமைச்சர் & திருச்செங்கோடு சட்டமன்ற உறுப்பினர்",
    "marquee_news_en": "🏆 Tiruchengodu MLA Minister Dr. K. G. Arunraj inspects Tiruchengodu cooperative handloom weaver workspaces • TVK Membership camp registers 45,000+ new members in Namakkal district • Commercial Taxes & Registration department launches digital e-filing system • Tiruchengodu GH Multi-Specialty Wing building works accelerated.",
    "marquee_news_ta": "🏆 திருச்செங்கோடு சட்டமன்ற உறுப்பினர் அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ் கூட்டுறவு கைத்தறி நெசவாளர் கூடங்களை நேரில் ஆய்வு செய்தார்! • நாமக்கல் மாவட்டத்தில் தவெக உறுப்பினர் சேர்க்கை 45,000-ஐ கடந்தது • வணிகவரி மற்றும் பதிவுத் துறையில் புதிய டிஜிட்டல் e-தாக்கல் தளம் துவக்கம் • திருச்செங்கோடு அரசு மருத்துவமனை பன்னோக்கு பிரிவு கட்டுமான பணிகள் தீவிரம்.",
    "phone": "+91 4288 255555",
    "email": "tiruchengodu.mla@tvk.org.in",
    "office_address_en": "TVK Constituency Office, No. 45, Namakkal Road, Tiruchengodu, Namakkal District - 637211",
    "office_address_ta": "தவெக தொகுதி அலுவலகம், எண். 45, நாமக்கல் சாலை, திருச்செங்கோடு, நாமக்கல் மாவட்டம் - 637211",
    "facebook": "https://www.facebook.com/people/Arunraaj-TVK/61579221207463/#",
    "twitter": "https://x.com/arunraajkg",
    "instagram": "https://www.instagram.com/arunraajkg/?hl=en",
    "youtube": "https://youtube.com/c/TVKOfficial",
    "mla_image_url": "images/arunraj.png",
    "leader_image_url": "images/tvklogo.png",
    "admin_password": "tvk2026",
    "mla_father_en": "Late K. P. Ganesan",
    "mla_father_ta": "மறைந்த கே. பி. கணேசன்",
    "mla_age": "46",
    "mla_voter_en": "Tiruchengodu constituency, Serial no 651 in Part no 91",
    "mla_voter_ta": "திருச்செங்கோடு தொகுதி, பாகம் 91-ல் வரிசை எண் 651",
    "mla_prof_en": "Doctor, Ex-IRS Officer (Income Tax), Tax Consultant, Politician",
    "mla_prof_ta": "டாக்டர் (MBBS), முன்னாள் IRS அதிகாரி, வரி ஆலோசகர், அரசியல்வாதி",
    "mla_spouse_en": "Doctor, Assistant Professor at Kilpauk Medical College (KMC)",
    "mla_spouse_ta": "டாக்டர், கீழ்பாக்கம் மருத்துவக் கல்லூரியின் உதவிப் பேராசிரியர் (KMC)",
    "mla_margin_en": "28,712 votes",
    "mla_margin_ta": "28,712 வாக்குகள்"
  },
  "news": [
    {
      "id": "news_1",
      "category": "Press Releases",
      "date": "2026-06-01",
      "image_url": "images/secretariat.jpg",
      "is_featured": true,
      "title_en": "Transparent taxation is our primary goal: CM Joseph Vijay & Minister Dr. Arunraj launch e-Tax Initiative",
      "title_ta": "நேர்மையான, வெளிப்படையான வரி விதிப்பே எங்கள் இலக்கு: முதல்வர் விஜய் & அமைச்சர் டாக்டர் அருண்ராஜ் புதிய தளம் துவக்கம்",
      "content_en": "Chief Minister Thalapathy Vijay along with Commercial Taxes & Registration Minister Dr. K. G. Arunraj launched the integrated e-Tax filing system at the Secretariat. Drawing from his 15-year administrative experience in the Indian Revenue Service (IRS), Minister Dr. Arunraj announced extensive reforms to digitize deed registration and eliminate middlemen, ensuring transparent citizen-centric services.",
      "content_ta": "தலைமைச் செயலகத்தில் மாண்புமிகு முதல்வர் தளபதி விஜய் மற்றும் வணிகவரித் துறை அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ் ஆகியோர் புதிய ஒருங்கிணைந்த e-வரி தாக்கல் மற்றும் பத்திரப்பதிவு சேவையை துவக்கி வைத்தனர். 15 ஆண்டுகள் IRS அதிகாரியாகப் பணியாற்றிய அனுபவத்தின் அடிப்படையில், வணிகவரி மற்றும் பத்திரப்பதிவுத் துறையை 100% டிஜிட்டல் மயமாக்கி, இடைத்தரகர்களை முழுமையாக ஒழிக்க அமைச்சர் அருண்ராஜ் புதிய சீர்திருத்தங்களை அறிவித்தார்."
    },
    {
      "id": "news_2",
      "category": "Constituency Work",
      "date": "2026-05-28",
      "image_url": "images/lake.jpg",
      "is_featured": false,
      "title_en": "Minister Dr. Arunraj inspects Tiruchengodu lake desilting and water-channel cleaning",
      "title_ta": "திருச்செங்கோட்டில் பருவமழைக்கு முன் ஏரிகள் மற்றும் வாய்க்கால்கள் தூர்வாரும் பணிகளை அமைச்சர் ஆய்வு செய்தார்",
      "content_en": "Tiruchengodu constituency MLA and Minister Dr. K. G. Arunraj inspected municipal desilting and storm water drain renovation works near the Tiruchengodu giri valar path. He directed engineers to ensure that rainwaters channel directly into local irrigation lakes without stagnation, protecting residential zones.",
      "content_ta": "திருச்செங்கோடு சட்டமன்ற உறுப்பினரும் அமைச்சருமான டாக்டர் கே. ஜி. அருண்ராஜ் இன்று கிரிவலப் பாதை அருகே ஏரி மற்றும் வாய்க்கால்கள் தூர்வாரும் பணிகளை நேரில் ஆய்வு செய்தார். குடியிருப்பு பகுதிகளில் தண்ணீர் தேங்காமல் நேரடியாக நீர்நிலைகளுக்குச் செல்லும் வகையில் வடிகால் பணிகளை விரைந்து முடிக்க மாநகராட்சி அதிகாரிகளுக்கு உத்தரவிட்டார்."
    },
    {
      "id": "news_3",
      "category": "Welfare Activities",
      "date": "2026-05-25",
      "image_url": "images/medical.jpg",
      "is_featured": false,
      "title_en": "Free multi-specialty health camp organized by TVK medical wing in Tiruchengodu rural wards",
      "title_ta": "திருச்செங்கோடு கிராமப்புற வார்டுகளில் தவெக சார்பில் நடைபெற்ற இலவச பன்னோக்கு மருத்துவ முகாம்",
      "content_en": "Under the guidance of CM Thalapathy Vijay, a massive free health camp was organized by TVK in Tiruchengodu. Minister Dr. Arunraj (himself a medical doctor) along with a team of specialist doctors, including KMC assistant professors, provided free consultations, tests, and medicine distributions to over 1,200 local residents.",
      "content_ta": "தவெக தலைவர் மாண்புமிகு முதல்வர் தளபதி விஜய் அவர்களின் அறிவுறுத்தலின்படி, திருச்செங்கோட்டில் மாபெரும் இலவச மருத்துவ முகாம் நடைபெற்றது. மருத்துவருமான அமைச்சர் டாக்டர் அருண்ராஜ் இம்முகாமைத் தொடங்கி வைத்து, கீழ்பாக்கம் மருத்துவக் கல்லூரி சிறப்பு மருத்துவர்களுடன் இணைந்து 1,200-க்கும் மேற்பட்ட ஏழை எளிய மக்களுக்கு மருத்துவப் பரிசோதனைகள் மற்றும் இலவச மருந்துகளை வழங்கினார்."
    },
    {
      "id": "news_4",
      "category": "Welfare Activities",
      "date": "2026-05-20",
      "image_url": "images/classroom.jpg",
      "is_featured": false,
      "title_en": "TVK Free UPSC & TNPSC Study Center launched in Tiruchengodu by Minister Dr. Arunraj",
      "title_ta": "திருச்செங்கோட்டில் போட்டித் தேர்வு தவெக இலவச பயிலகத்தை துவக்கி வைத்தார் அமைச்சர் டாக்டர் அருண்ராஜ்",
      "content_en": "Drawing from his journey of clearing the UPSC exam and serving in the IRS, Minister Dr. Arunraj launched a TVK Free Competitive Exam Study Academy. The center provides free coaching, digital study rooms, and mock test materials for Namakkal district youths preparing for government services.",
      "content_ta": "தாமாகவே UPSC தேர்வெழுதி IRS அதிகாரியாக சாதித்த தனது சொந்த அனுபவத்தின் அடிப்படையில், திருச்செங்கோடு பகுதி ஏழை மாணவர்கள் அரசுப் பணிகளைப் பெற தவெக சார்பில் இலவச அரசுத் தேர்வு பயிலகத்தை அமைச்சர் டாக்டர் அருண்ராஜ் துவக்கி வைத்தார். இதன் மூலம் Namakkal மாவட்டத்தைச் சேர்ந்த நூற்றுக்கணக்கான மாணவர்கள் இலவசமாக பயிற்சி பெறலாம்."
    },
    {
      "id": "news_5",
      "category": "Constituency Work",
      "date": "2026-05-18",
      "image_url": "images/gopuram.jpg",
      "is_featured": false,
      "title_en": "Historic Tiruchengodu Arthanareeswarar Temple annual festival celebrated; Minister reviews facilities",
      "title_ta": "வரலாற்று சிறப்புமிக்க திருச்செங்கோடு அர்த்தநாரீஸ்வரர் கோவில் தேரோட்டம்; வசதிகளை ஆய்வு செய்தார் அமைச்சர்",
      "content_en": "The annual Chithirai festival of the historic Tiruchengodu Sri Arthanareeswarar Temple was celebrated with grand chariot processions. Minister Dr. K. G. Arunraj participated in special prayers and directed local authorities to arrange continuous drinking water, sanitation facilities, and transport services for lakhs of visiting devotees.",
      "content_ta": "வரலாற்றுச் சிறப்புமிக்க திருச்செங்கோடு ஸ்ரீ அர்த்தநாரீஸ்வரர் கோவில் சித்திரைத் திருவிழா தேரோட்டம் விமரிசையாக நடைபெற்றது. இதில் கலந்துகொண்டு சுவாமி தரிசனம் செய்த அமைச்சர் டாக்டர் கே. ஜி. அருண்ராஜ், பக்தர்களின் வசதிக்காக குடிநீர், தூய்மை மற்றும் போக்குவரத்துப் பணிகளை விரிவுபடுத்த அதிகாரிகளுக்கு அறிவுறுத்தினார்."
    },
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
    },
    {
      "id": "news_6",
      "category": "Constituency Work",
      "date": "2026-05-15",
      "image_url": "images/cleanliness.jpg",
      "is_featured": false,
      "title_en": "Cooperative Handloom Weaver modernization schemes launched in Tiruchengodu by Minister Dr. Arunraj",
      "title_ta": "கூட்டுறவு கைத்தறி நெசவாளர்களுக்கான புதிய நவீன உதவித் திட்டங்களை அமைச்சர் அருண்ராஜ் துவக்கினார்",
      "content_en": "Tiruchengodu constituency houses thousands of handloom weaving families. Minister Dr. Arunraj initiated the cooperative modernization drive, providing solar-powered loompads and subsidized electrical warp rollers, which will double daily production capacity and secure livelihoods for traditional weavers.",
      "content_ta": "திருச்செங்கோடு பகுதியின் முக்கிய வாழ்வாதாரமாக விளங்கும் கைத்தறி நெசவுத் தொழிலை மேம்படுத்த, கூட்டுறவு சங்கங்கள் மூலம் சூரிய ஒளி நெசவுச் சாதனங்கள் மற்றும் மானிய விலையிலான நவீன கருவிகளை நெசவாளர் குடும்பங்களுக்கு அமைச்சர் டாக்டர் அருண்ராஜ் வழங்கிப் பணிகளைத் தொடங்கி வைத்தார்."
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title_en": "Tiruchengodu Handloom Cooperative Modernization & Weaver Support Scheme",
      "title_ta": "திருச்செங்கோடு கூட்டுறவு கைத்தறி நெசவாளர் நவீனமயமாக்கல் மற்றும் உதவித் திட்டம்",
      "description_en": "Upgrading and modernizing traditional handloom units with automatic solar-assisted weavers and introducing a direct cooperative-to-consumer digital registry for local handlooms.",
      "description_ta": "திருச்செங்கோட்டின் பாரம்பரிய கைத்தறி கூடங்களை சோலார் தொழில்நுட்பத்துடன் நவீனப்படுத்தி, நெசவாளர்களுக்கு நேரடியாக விற்பனை லாபம் கிடைக்கச் செய்யும் டிஜிட்டல் கூட்டுறவுத் திட்டம்.",
      "status": "ongoing",
      "location_en": "Tiruchengodu Weaver Colonies",
      "location_ta": "திருச்செங்கோடு நெசவாளர் குடியிருப்புகள்",
      "impact_en": "Directly doubles daily earnings for 3,500+ weaving families",
      "impact_ta": "3,500-க்கும் மேற்பட்ட நெசவாளர் குடும்பங்களின் தினசரி வருவாயை இருமடங்காக உயர்த்தும்"
    },
    {
      "id": "proj_2",
      "title_en": "Establishment of TVK Free Civil Services Academy & Digital Library",
      "title_ta": "தவெக ஐ.ஏ.எஸ் மற்றும் அரசுத் தேர்வு இலவச பயிலகம் & டிஜிட்டல் நூலகம்",
      "description_en": "A state-of-the-art coaching center initiated under Ex-IRS Minister Dr. Arunraj's guidance, providing free competitive coaching and digital resource access in Tiruchengodu.",
      "description_ta": "முன்னாள் IRS அதிகாரியான அமைச்சர் டாக்டர் அருண்ராஜின் மேற்பார்வையில், அரசுப் பணித் தேர்வுகளுக்கான உயர்தர இலவசப் பயிற்சி மற்றும் டிஜிட்டல் நூலகம் அமைக்கும் பணி.",
      "status": "completed",
      "location_en": "Namakkal Road, Tiruchengodu",
      "location_ta": "நாமக்கல் சாலை, திருச்செங்கோடு",
      "impact_en": "Benefits 600+ rural competitive exam aspirants annually",
      "impact_ta": "ஆண்டுதோறும் 600-க்கும் மேற்பட்ட கிராமப்புற போட்டித் தேர்வு மாணவர்கள் பயன் பெறுவர்"
    },
    {
      "id": "proj_3",
      "title_en": "Tiruchengodu Government Hospital Multi-Specialty Wing Expansion",
      "title_ta": "திருச்செங்கோடு அரசு மருத்துவமனை பன்னோக்கு சிறப்புப் பிரிவு கட்டுமான பணி",
      "description_en": "Expanding infrastructure at the Tiruchengodu GH to include a dedicated pediatric care wing, dialysis center, and fully equipped emergency trauma wards.",
      "description_ta": "திருச்செங்கோடு அரசு தலைமை மருத்துவமனையில் பன்னோக்கு சிறப்பு சிகிச்சை வார்டு, டயாலிசிஸ் மையம் மற்றும் அவசரக்கால தீவிர சிகிச்சைப் பிரிவு கட்டுமானத் திட்டம்.",
      "status": "ongoing",
      "location_en": "Government Hospital, Tiruchengodu",
      "location_ta": "அரசு மருத்துவமனை, திருச்செங்கோடு",
      "impact_en": "Provides tertiary care locally, avoiding long journeys to Salem or Erode",
      "impact_ta": "சேலம் அல்லது ஈரோடு செல்ல வேண்டிய அவசியமின்றி உள்ளூரிலேயே உயர்தர சிகிச்சை அளித்தல்"
    }
  ],
  "gallery": [
    {
      "id": "gal_1",
      "caption_en": "Minister Dr. Arunraj interacting with cooperative weavers at Tiruchengodu handloom unit",
      "caption_ta": "திருச்செங்கோடு கைத்தறி நெசவாளர் கூடங்களில் நெசவாளர்களின் குறைகளைக் கேட்டறிந்து கலந்துரையாடும் அமைச்சர்",
      "image_url": "images/cleanliness.jpg",
      "date": "2026-05-28"
    },
    {
      "id": "gal_2",
      "caption_en": "Minister K. G. Arunraj reviewing storm water drain desilting near Giri Valar path",
      "caption_ta": "திருச்செங்கோடு கிரிவலப் பாதை அருகே மழைநீர் வடிகால் மற்றும் தூர்வாரும் பணிகளை ஆய்வு செய்யும் அமைச்சர்",
      "image_url": "images/lake.jpg",
      "date": "2026-05-25"
    },
    {
      "id": "gal_3",
      "caption_en": "Dr. Arunraj at the free medical camp consult room examining elderly patients",
      "caption_ta": "திருச்செங்கோடு இலவச பன்னோக்கு தவெக மருத்துவ முகாமில் மக்களுக்கு மருத்துவ பரிசோதனை செய்யும் அமைச்சர்",
      "image_url": "images/medical.jpg",
      "date": "2026-05-23"
    },
    {
      "id": "gal_4",
      "caption_en": "Minister inaugurating the free UPSC & TNPSC competitive exam coaching registry",
      "caption_ta": "அரசுத் தேர்வு இலவச பயிலகத்தை திறந்து வைத்து மாணவர்களின் சேர்க்கையைப் பதிவு செய்யும் அமைச்சர்",
      "image_url": "images/classroom.jpg",
      "date": "2026-05-20"
    }
  ],
  "videos": [
    {
        "id": "vid_1",
        "title_en": "Dr. K. G. Arunraj Latest Interview",
        "title_ta": "டாக்டர் கே. ஜி. அருண்ராஜ் பேட்டி",
        "video_url": "https://www.youtube.com/embed/s4a47eu-SIE",
        "thumbnail_url": "images/arunraj.png",
        "date": "2026-06-01"
    }
],
  "grievances": [],
  "comments": [
    {
      "id": "comment_1",
      "news_id": "news_2",
      "name": "Senthil Kumar",
      "content": "திருச்செங்கோடு ஏரி தூர்வாரும் பணி மிகவும் பாராட்டத்தக்கது! சட்டமன்ற உறுப்பினர் அவர்களுக்கு நன்றி.",
      "date": "2026-05-29",
      "status": "pending"
    },
    {
      "id": "comment_2",
      "news_id": "news_4",
      "name": "Priya Dharshini",
      "content": "This free competitive exam coaching center is extremely helpful for students from poor families. Thank you TVK!",
      "date": "2026-05-26",
      "status": "approved"
    },
    {
      "id": "comment_3",
      "news_id": "news_1",
      "name": "Dr. Anbarasan",
      "content": "Transparent and clean administration is exactly what Tamil Nadu needs. Great statement by CM Thalapathy Vijay.",
      "date": "2026-06-02",
      "status": "approved"
    },
    {
      "id": "comment_4",
      "news_id": "news_3",
      "name": "Rajesh Kannan",
      "content": "இலவச மருத்துவ முகாம் மூலம் பல ஏழை மக்கள் பயன்பெற்றனர். தவெக இளைஞர் அணிக்கு வாழ்த்துகள்!",
      "date": "2026-05-25",
      "status": "pending"
    }
  ]
};

  const getDb = () => {
    let db = localStorage.getItem(STORAGE_KEY);
    if (!db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    try {
      const parsed = JSON.parse(db);
      
      // Force migration if old candidate data is found (meaning we are running the TVK Arunraj rebranding)
      const needsMigration = !parsed.config || 
                             !parsed.config.mla_name_en || 
                             !parsed.config.mla_name_en.includes("Arunraj") ||
                             !parsed.config.mla_father_en;
                             
      if (needsMigration) {
        console.log("Forcing re-seed for TVK Dr. K. G. Arunraj Tiruchengodu MLA constituency portal");
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
      if (!parsed.comments || !Array.isArray(parsed.comments)) {
        parsed.comments = [ ...seedData.comments ];
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
    
    // ---------------- COMMENTS METHODS ----------------
    getComments: () => {
      return getDb().comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    saveComment: (comment) => {
      const db = getDb();
      let updatedComment = { ...comment };
      
      if (updatedComment.id) {
        const idx = db.comments.findIndex(c => c.id === updatedComment.id);
        if (idx !== -1) {
          db.comments[idx] = { ...db.comments[idx], ...updatedComment };
        }
      } else {
        updatedComment.id = "comment_" + Date.now();
        updatedComment.date = updatedComment.date || new Date().toISOString().split("T")[0];
        updatedComment.status = updatedComment.status || "pending";
        db.comments.push(updatedComment);
      }
      saveDb(db);
      return updatedComment;
    },
    deleteComment: (id) => {
      const db = getDb();
      db.comments = db.comments.filter(c => c.id !== id);
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
