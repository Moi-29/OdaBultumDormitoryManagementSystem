import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { homeTranslations } from "../../translations/translations";
import API_URL from "../../config/api";
import oneImg from "../../assets/one.jpg";

const LeadershipSection = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => homeTranslations[language]?.[key] || homeTranslations.en[key] || key;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    leadershipTitle: t('leadershipTitle'),
    leadershipDescription: '',
    leaders: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/home-content`);
        
        // Sort leaders by order field
        const sortedLeaders = (data.leaders || []).sort((a, b) => a.order - b.order);
        
        setContent({
          leadershipTitle: data.leadershipTitle || t('leadershipTitle'),
          leadershipDescription: data.leadershipDescription || '',
          leaders: sortedLeaders
        });
      } catch (error) {
        console.error('Error fetching leadership content:', error);
        // Keep default content if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Separate first leader as president, rest as other leaders
  const president = content.leaders.length > 0 ? content.leaders[0] : null;
  const otherLeaders = content.leaders.slice(1);

  if (loading) {
    return (
      <section 
        className="py-20 px-4"
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderColor: '#d4af37' }}></div>
        </div>
      </section>
    );
  }

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
            {content.leadershipTitle}
          </h2>
          <div 
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: '#d4af37' }}
          />
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
          >
            {content.leadershipDescription || (language === 'en' && "Meet the dedicated leaders who guide Oda Bultum University towards excellence in education, research, and community service.")}
            {!content.leadershipDescription && language === 'am' && "በትምህርት፣ በምርምር እና በማህበረሰብ አገልግሎት ውስጥ ኦዳ ቡልቱም ዩኒቨርሲቲን ወደ ብቃት የሚመሩ ራሳቸውን የሰጡ መሪዎችን ያግኙ።"}
            {!content.leadershipDescription && language === 'om' && "Hoggantoota of kennee Yuunivarsiitii Odaa Bultum gara olaantummaa barnootaa, qorannoo fi tajaajila hawaasaa qajeelchan waliin wal qunnamaa."}
            {!content.leadershipDescription && language === 'so' && "La kulanka hogaamiyeyaasha dadaalka badan ee Jaamacadda Oda Bultum u hagaya fiicnaanta waxbarashada, cilmi-baarista, iyo adeegga bulshada."}
            {!content.leadershipDescription && language === 'ti' && "ንዩኒቨርሲቲ ኦዳ ቡልቱም ናብ ብቕዓት ትምህርቲ፣ ምርምር፣ ከምኡ'ውን ኣገልግሎት ሕብረተሰብ ዘመርሑ ተወፋይ መራሕቲ ተራኸቡ።"}
          </p>
        </div>

        {/* President Section - Only show if president exists */}
        {president && (
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
                  {president.description.substring(0, president.description.length / 2)}
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
                    src={president.image || oneImg} 
                    alt={president.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 
                  className="text-2xl font-bold text-center mb-2"
                  style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                >
                  {president.name}
                </h3>
                <p 
                  className="text-lg font-semibold text-center px-4 py-2 rounded-lg"
                  style={{ 
                    color: '#d4af37',
                    backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                  }}
                >
                  {president.position}
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
                  {president.description.substring(president.description.length / 2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other Leaders Grid - Display all other leaders in a grid */}
        {otherLeaders.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {otherLeaders.map((leader, index) => (
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
                        src={leader.image || oneImg} 
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 
                    className="text-xl font-bold text-center mb-2"
                    style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                  >
                    {leader.name}
                  </h3>
                  <p 
                    className="text-sm font-semibold text-center mb-4 px-3 py-2 rounded-lg mx-auto inline-block w-full"
                    style={{ 
                      color: '#d4af37',
                      backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7'
                    }}
                  >
                    {leader.position}
                  </p>
                  <p 
                    className="text-sm leading-relaxed text-justify"
                    style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                  >
                    {leader.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadershipSection;
