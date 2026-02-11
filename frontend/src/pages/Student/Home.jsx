import { lazy, Suspense } from "react";
import HeroSection from "../../components/home/HeroSection";
import WelcomeSection from "../../components/home/WelcomeSection";
import { useTheme } from "../../context/ThemeContext";

const GuidelinesSection = lazy(() => import("../../components/home/GuidelinesSection"));
const StudentUnionSection = lazy(() => import("../../components/home/StudentUnionSection"));
const DiversitySection = lazy(() => import("../../components/home/DiversitySection"));
const CafeteriaSection = lazy(() => import("../../components/home/CafeteriaSection"));
const CleanWaterSection = lazy(() => import("../../components/home/CleanWaterSection"));
const HealthCenterSection = lazy(() => import("../../components/home/HealthCenterSection"));
const GallerySection = lazy(() => import("../../components/home/GallerySection"));
const Footer = lazy(() => import("../../components/home/Footer"));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
  </div>
);

const Home = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="min-h-screen" style={{ marginLeft: 0, backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', transition: 'background-color 0.3s ease' }}>
      <main>
        <HeroSection />
        <WelcomeSection />
        <Suspense fallback={<SectionLoader />}>
          <GuidelinesSection />
          <StudentUnionSection />
          <DiversitySection />
          <CafeteriaSection />
          <CleanWaterSection />
          <HealthCenterSection />
          <GallerySection />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
