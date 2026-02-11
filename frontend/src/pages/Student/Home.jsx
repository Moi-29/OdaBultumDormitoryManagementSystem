import { lazy, Suspense } from "react";
import HeroSection from "../../components/home/HeroSection";

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
  return (
    <div className="min-h-screen bg-background" style={{ marginLeft: 0 }}>
      <main>
        <HeroSection />
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
