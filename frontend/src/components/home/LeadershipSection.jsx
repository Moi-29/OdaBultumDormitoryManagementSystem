import { useTheme } from "../../context/ThemeContext";
import oneImg from "../../assets/one.jpg";
import twoImg from "../../assets/two.jpg";
import threeImg from "../../assets/three.jpg";
import fourImg from "../../assets/four.jpg";
import fiveImg from "../../assets/five.jpg";
import sixImg from "../../assets/six.jpg";
import sevenImg from "../../assets/seven.jpg";

const LeadershipSection = () => {
  const { isDarkMode } = useTheme();

  const leaders = {
    president: {
      name: "Prof. Muktar Mohammed",
      position: "President",
      image: oneImg,
      description: "Prof. Muktar Mohammed serves as the President of Oda Bultum University, bringing visionary leadership and academic excellence to the institution. With extensive experience in higher education administration, he has been instrumental in advancing the university's mission of providing quality education and fostering innovation. Under his leadership, the university continues to grow and excel in academic programs, research initiatives, and community engagement."
    },
    vicePresidents: [
      {
        name: "Mr. Ibsa Ahmed",
        position: "Vice President for Administration and Development",
        image: twoImg,
        description: "Mr. Ibsa Ahmed oversees the administrative operations and development initiatives of the university. His strategic approach to resource management and infrastructure development has significantly enhanced the university's operational efficiency. He is committed to creating a conducive environment for learning and ensuring sustainable growth across all university facilities and services."
      },
      {
        name: "Alemayehu Bayene (Assist. Professor)",
        position: "Vice President for Academic, Research, Technology Transfer and Community",
        image: threeImg,
        description: "Assist. Professor Alemayehu Bayene leads the academic, research, and community engagement portfolios of the university. His dedication to academic excellence and innovation has strengthened the university's research capacity and community partnerships. He works tirelessly to ensure that academic programs meet international standards while addressing local community needs through technology transfer and collaborative initiatives."
      }
    ],
    directors: [
      {
        name: "Mr. Lelisa Shamsedin",
        position: "Student Service Directorate",
        image: fourImg,
        description: "Mr. Lelisa Shamsedin heads the Student Service Directorate, dedicated to enhancing student life and welfare. His leadership ensures that students receive comprehensive support services, from accommodation to counseling. He is passionate about creating a vibrant campus environment where students can thrive academically and personally, fostering a sense of community and belonging."
      },
      {
        name: "Mr. Ararsa Gudisa",
        position: "Director, University Registrar",
        image: sevenImg,
        description: "Mr. Ararsa Gudisa serves as the Director of the University Registrar, managing all academic records and registration processes. His meticulous attention to detail and commitment to efficiency ensures smooth academic operations. He oversees student admissions, course registrations, and maintains the integrity of academic records, providing essential support to students throughout their academic journey."
      }
    ],
    seniorDirectors: [
      {
        name: "Ahmedin Abdurahman (PhD)",
        position: "Director, Quality Assurance Directorate",
        image: sixImg,
        description: "Dr. Ahmedin Abdurahman leads the Quality Assurance Directorate, ensuring that the university maintains the highest standards of academic excellence. His expertise in quality management systems has been crucial in achieving accreditation and continuous improvement. He works closely with all departments to implement best practices and foster a culture of quality across the institution."
      },
      {
        name: "Getachew Gashaw (Assist. Professor)",
        position: "Director, Academic Program and Staff Development Directorate",
        image: fiveImg,
        description: "Assist. Professor Getachew Gashaw directs the Academic Program and Staff Development Directorate, focusing on curriculum development and faculty enhancement. His innovative approach to academic program design and staff training has elevated the quality of education. He is committed to professional development and ensuring that faculty members have the resources and support needed to excel in teaching and research."
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
            University Leadership
          </h2>
          <div 
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: '#d4af37' }}
          />
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
          >
            Meet the dedicated leaders who guide Oda Bultum University towards excellence in education, research, and community service.
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
                Leadership Message
              </div>
              <p 
                className="text-base leading-relaxed"
                style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}
              >
                {leaders.president.description.substring(0, leaders.president.description.length / 2)}
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
                Vision & Excellence
              </div>
              <p 
                className="text-base leading-relaxed"
                style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}
              >
                {leaders.president.description.substring(leaders.president.description.length / 2)}
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
                  {vp.description}
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
                  {director.description}
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
                  {director.description}
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
