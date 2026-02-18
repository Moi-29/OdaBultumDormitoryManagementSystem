import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import oneImg from "../../assets/one.jpg";
import twoImg from "../../assets/two.jpg";
import threeImg from "../../assets/threes.jpg";
import fourImg from "../../assets/four.jpg";
import fiveImg from "../../assets/fives.jpg";
import sixImg from "../../assets/sixs.jpg";
import sevenImg from "../../assets/sevens.jpg";

const LeadershipSection = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;

  const leaders = {
    president: {
      name: "Prof. Muktar Mohammed",
      position: "President",
      image: oneImg,
      descriptionKey: "leaderCard1Desc"
    },
    vicePresidents: [
      {
        name: "Mr. Ibsa Ahmed",
        position: "Vice President for Administration and Development",
        image: twoImg,
        descriptionKey: "leaderCard2Desc"
      },
      {
        name: "Alemayehu Bayene (Assist. Professor)",
        position: "Vice President for Academic, Research, Technology Transfer and Community",
        image: threeImg,
        descriptionKey: "leaderCard3Desc"
      }
    ],
    directors: [
      {
        name: "Mr. Lelisa Shamsedin",
        position: "Student Service Directorate",
        image: fourImg,
        descriptionKey: "leaderCard4Desc"
      },
      {
        name: "Mr. Ararsa Gudisa",
        position: "Director, University Registrar",
        image: sevenImg,
        descriptionKey: "leaderCard7Desc"
      }
    ],
    seniorDirectors: [
      {
        name: "Ahmedin Abdurahman (PhD)",
        position: "Director, Quality Assurance Directorate",
        image: sixImg,
        descriptionKey: "leaderCard6Desc"
      },
      {
        name: "Getachew Gashaw (Assist. Professor)",
        position: "Director, Academic Program and Staff Development Directorate",
        image: fiveImg,
        descriptionKey: "leaderCard5Desc"
      }
    ]
  };

  return (
    <section 
      className="py-20 px-4"
      style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
          >
            {t('leadershipTitle')}
          </h2>
          <div 
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: '#d4af37' }}
          />
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
          >
            {language === 'en' && "Meet the dedicated leaders who guide Oda Bultum University towards excellence in education, research, and community service."}
            {language === 'am' && "በትምህርት፣ በምርምር እና በማህበረሰብ አገልግሎት ውስጥ ኦዳ ቡልቱም ዩኒቨርሲቲን ወደ ብቃት የሚመሩ ራሳቸውን የሰጡ መሪዎችን ያግኙ።"}
            {language === 'om' && "Hoggantoota of kennee Yuunivarsiitii Odaa Bultum gara olaantummaa barnootaa, qorannoo fi tajaajila hawaasaa qajeelchan waliin wal qunnamaa."}
            {language === 'so' && "La kulanka hogaamiyeyaasha dadaalka badan ee Jaamacadda Oda Bultum u hagaya fiicnaanta waxbarashada, cilmi-baarista, iyo adeegga bulshada."}
            {language === 'ti' && "ንዩኒቨርሲቲ ኦዳ ቡልቱም ናብ ብቕዓት ትምህርቲ፣ ምርምር፣ ከምኡ'ውን ኣገልግሎት ሕብረተሰብ ዘመርሑ ተወፋይ መራሕቲ ተራኸቡ።"}
          </p>
        </div>

        {/* President Section */}
        <div 
          className="mb-20 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
            border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
          }}
        >
          <div className="grid md:grid-cols-3 gap-8 p-8 md:p-12 items-center">
            {/* Left Description */}
            <div className="order-2 md:order-1">
              <div 
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: '#d4af37' }}
              >
                {language === 'en' && "Leadership Message"}
                {language === 'am' && "የአመራር መልእክት"}
                {language === 'om' && "Ergaa Hogganaa"}
                {language === 'so' && "Fariinta Hogaanka"}
                {language === 'ti' && "መልእኽቲ መሪሕነት"}
              </div>
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  textAlign: 'justify',
                  hyphens: 'auto'
                }}
              >
                {language === 'en' && "Prof. Muktar Mohammed serves as the President of Oda Bultum University, bringing visionary leadership and transformative academic excellence to the institution. With extensive experience in higher education administration and a deep commitment to educational innovation, he orchestrates strategic governance that positions the university as a beacon of knowledge and community development. His leadership philosophy centers on fostering academic excellence, promoting research innovation, and ensuring equitable access to quality education."}
                {language === 'am' && "ፕሮፌሰር ሙክታር መሐመድ የኦዳ ቡልቱም ዩኒቨርሲቲ ፕሬዝዳንት ሆነው ያገለግላሉ፣ ራዕይ ያለው አመራር እና ለውጥ ያመጣ የአካዳሚክ ብቃት ወደ ተቋሙ ያመጣሉ። በከፍተኛ ትምህርት አስተዳደር ውስጥ ሰፊ ልምድ እና ለትምህርታዊ ፈጠራ ጥልቅ ቁርጠኝነት ያላቸው፣ ዩኒቨርሲቲውን እንደ እውቀት እና የማህበረሰብ ልማት መብራት የሚያስቀምጥ ስትራቴጂያዊ አስተዳደር ያስተባብራሉ።"}
                {language === 'om' && "Pirofeesar Muktar Mohammed Pirezidaantii Yuunivarsiitii Odaa Bultum ta'uun tajaajilu, hogganaa mul'ataa fi olaantummaa barnootaa jijjiirraa gara dhaabbataatti fidu. Muuxannoo bal'aa bulchiinsa barnootaa olaanaa fi kutannoo gadi fagoo kalaqaa barnootaa qabaachuun, bulchiinsa tarsiimoo yuunivarsiitichaa akka ibsaa beekumsaa fi guddina hawaasaatti kan ramadu walitti qindeessa."}
                {language === 'so' && "Prof. Muktar Mohammed wuxuu u adeegaa Madaxweynaha Jaamacadda Oda Bultum, isagoo keenaya hogaan aragti leh iyo fiicnaan waxbarasho oo isbeddel leh ee hay'adda. Khibrad ballaaran oo maamulka waxbarashada sare iyo go'aan qoto dheer oo ku saabsan hal-abuurka waxbarasho, wuxuu isku dubaridaa maamulka istiraatiijiyadeed kaas oo jaamacadda u dhiga sidii laambad aqoon iyo horumarinta bulshada."}
                {language === 'ti' && "ፕሮፌሰር ሙክታር መሐመድ ናይ ዩኒቨርሲቲ ኦዳ ቡልቱም ፕሬዚደንት ኮይኖም የገልግሉ፣ ራእይ ዘለዎ መሪሕነትን ለውጢ ዘምጽእ ኣካዳሚያዊ ብቕዓትን ናብቲ ትካል የምጽኡ። ኣብ ላዕለዋይ ትምህርቲ ምምሕዳር ሰፊሕ ተመኩሮን ንትምህርታዊ ምህዞን ዓሚቕ ተወፋይነትን ዘለዎም፣ ነታ ዩኒቨርሲቲ ከም መብራህቲ ፍልጠትን ምዕባለ ሕብረተሰብን ዘቐምጥ ስትራተጂያዊ ኣስተዳደር የስምምዑ።"}
              </p>
            </div>

            {/* Center Image */}
            <div className="order-1 md:order-2 flex flex-col items-center">
              <div 
                className="w-64 h-64 rounded-full overflow-hidden shadow-xl mb-6"
                style={{
                  border: '4px solid #d4af37',
                  boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)'
                }}
              >
                <img 
                  src={leaders.president.image} 
                  alt={leaders.president.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 
                className="text-2xl font-bold text-center mb-2"
                style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
              >
                {leaders.president.name}
              </h3>
              <p 
                className="text-lg font-semibold text-center px-4 py-2 rounded-lg"
                style={{ 
                  color: '#d4af37',
                  backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                }}
              >
                {leaders.president.position}
              </p>
            </div>

            {/* Right Description */}
            <div className="order-3">
              <div 
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: '#d4af37' }}
              >
                {language === 'en' && "Vision & Excellence"}
                {language === 'am' && "ራዕይ እና ብቃት"}
                {language === 'om' && "Mul'ata fi Olaantummaa"}
                {language === 'so' && "Aragtida & Fiicnaanta"}
                {language === 'ti' && "ራእይን ብቕዓትን"}
              </div>
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  textAlign: 'justify',
                  hyphens: 'auto'
                }}
              >
                {language === 'en' && "Under his stewardship, the university has expanded its academic programs, strengthened research capacity, and deepened community partnerships. His mission is to cultivate a learning environment that empowers students to become ethical leaders and change-makers. With unwavering dedication to institutional integrity and student success, he guides the university toward achieving international recognition while remaining deeply rooted in serving local and regional development needs. His vision encompasses building a world-class institution that combines academic rigor with social responsibility."}
                {language === 'am' && "በእሳቸው አስተዳደር ስር ዩኒቨርሲቲው የአካዳሚክ ፕሮግራሞቹን አስፋፍቷል፣ የምርምር አቅሙን አጠናክሯል እና የማህበረሰብ ሽርክናዎችን አጠናክሯል። ተልእኳቸው ተማሪዎች ሥነ ምግባራዊ መሪዎች እና ለውጥ አምጪዎች እንዲሆኑ የሚያበረታታ የመማሪያ አካባቢ መፍጠር ነው። ለተቋማዊ ታማኝነት እና ለተማሪዎች ስኬት ያለማቋረጥ በመሰጠት፣ ዩኒቨርሲቲውን ወደ ዓለም አቀፍ እውቅና ለማግኘት በሚመራበት ጊዜ በአካባቢያዊ እና በክልላዊ የልማት ፍላጎቶች አገልግሎት ላይ ጥልቅ ሥር ይዞ ይቆያል።"}
                {language === 'om' && "Bulchiinsa isaa jalatti, yuunivarsiitichi sagantaalee barnootaa isaa bal'isee, dandeettii qorannoo cimsee fi michummaa hawaasaa gadi fageeessee jira. Ergaan isaa naannoo barumsaa barattoonni akka hoggantoota naamusa qabeessaa fi jijjiirraa fiddaniitti humneessu uumuudha. Amanamummaa dhaabbataa fi milkaa'ina barattootaaf kutannoo hin jijjiiramne qabaachuun, yuunivarsiitichaa gara beekamtii addunyaa argachuutti kan qajeelchu yoo ta'u, fedhii guddina naannoo fi naannichaa tajaajiluu keessatti hundee gadi fagoo ta'ee hafa."}
                {language === 'so' && "Maamulkiisa hoostiisa, jaamacaddu waxay balaadhisay barnaamijyadeeda tacliinta, xoojisay awoodda cilmi-baarista, iyo qotondheerisay iskaashiga bulshada. Hadafkiisu waa in la abuuro jawi waxbarasho oo ardayda u awood siya inay noqdaan hogaamiye anshax leh iyo isbeddel keenayaal. Dadaal aan kala go'in ah oo daacadnimada hay'adda iyo guusha ardayda, wuxuu jaamacadda u hagaa xagga helitaanka aqoonsiga caalamiga ah halka uu ku sii xidhan yahay adeegida baahiyaha horumarinta maxalliga iyo gobolka."}
                {language === 'ti' && "ኣብ ትሕቲ ኣስተዳደሩ፣ እታ ዩኒቨርሲቲ ናይ ትምህርቲ ፕሮግራማታ ኣስፊሓ፣ ናይ ምርምር ዓቕሚ ኣጠናኺራ፣ ከምኡ'ውን ናይ ሕብረተሰብ ሽርክነታት ኣዕሚቓ። ተልእኾኡ ተምሃሮ ስነ-ምግባራዊ መራሕቲን ለውጢ ኣምጽእትን ክኾኑ ዘበርታትዕ ናይ ትምህርቲ ሃዋሁ ምፍጣር እዩ። ንትካላዊ ታማኒነትን ዓወት ተምሃሮን ዘይተቐያየር ተወፋይነት ብምሃብ፣ ነታ ዩኒቨርሲቲ ናብ ዓለምለኻዊ ኣፍልጦ ምብጻሕ እናመርሐ፣ ንናይ ከባቢን ዞባውን ምዕባለ ፍላጎታት ኣገልግሎት ኣብ ምሃብ ዓሚቕ ሱር ዘለዎ ይቕጽል።"}
              </p>
            </div>
          </div>
        </div>

        {/* Vice Presidents Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {leaders.vicePresidents.map((vp, index) => (
            <div 
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
              }}
            >
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div 
                    className="w-48 h-48 rounded-lg overflow-hidden shadow-lg"
                    style={{
                      border: '3px solid #d4af37'
                    }}
                  >
                    <img 
                      src={vp.image} 
                      alt={vp.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 
                  className="text-xl font-bold text-center mb-2"
                  style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                >
                  {vp.name}
                </h3>
                <p 
                  className="text-sm font-semibold text-center mb-4 px-3 py-2 rounded-lg mx-auto inline-block w-full"
                  style={{ 
                    color: '#d4af37',
                    backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                  }}
                >
                  {vp.position}
                </p>
                <p 
                  className="text-sm leading-relaxed text-justify"
                  style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                >
                  {t(vp.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Directors Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {leaders.directors.map((director, index) => (
            <div 
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
              }}
            >
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div 
                    className="w-48 h-48 rounded-lg overflow-hidden shadow-lg"
                    style={{
                      border: '3px solid #d4af37'
                    }}
                  >
                    <img 
                      src={director.image} 
                      alt={director.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 
                  className="text-xl font-bold text-center mb-2"
                  style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                >
                  {director.name}
                </h3>
                <p 
                  className="text-sm font-semibold text-center mb-4 px-3 py-2 rounded-lg mx-auto inline-block w-full"
                  style={{ 
                    color: '#d4af37',
                    backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                  }}
                >
                  {director.position}
                </p>
                <p 
                  className="text-sm leading-relaxed text-justify"
                  style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                >
                  {t(director.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Senior Directors Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {leaders.seniorDirectors.map((director, index) => (
            <div 
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
              }}
            >
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div 
                    className="w-48 h-48 rounded-lg overflow-hidden shadow-lg"
                    style={{
                      border: '3px solid #d4af37'
                    }}
                  >
                    <img 
                      src={director.image} 
                      alt={director.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 
                  className="text-xl font-bold text-center mb-2"
                  style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                >
                  {director.name}
                </h3>
                <p 
                  className="text-sm font-semibold text-center mb-4 px-3 py-2 rounded-lg mx-auto inline-block w-full"
                  style={{ 
                    color: '#d4af37',
                    backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                  }}
                >
                  {director.position}
                </p>
                <p 
                  className="text-sm leading-relaxed text-justify"
                  style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                >
                  {t(director.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
