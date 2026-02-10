import { useState, useEffect, useRef } from 'react';
import { HeroSection, WelcomeStats, DisciplineSection } from './HomeComponents';
import { StudentUnionSection, CafeteriaSchedule, CafeteriaQuality } from './HomeComponents2';
import { ToleranceSection } from './HomeComponents3';
import { HealthCenterSection, WaterSection } from './HomeComponents4';
import { DormitoryAvailability, MealCardSection } from './HomeComponents5';

const Home = () => {
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());
    const sectionsRef = useRef([]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionsRef.current.forEach(ref => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ 
            width: '100%',
            overflowX: 'hidden',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Hero Section */}
            <HeroSection scrollY={scrollY} />
            
            {/* Content Sections */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <WelcomeStats ref={el => sectionsRef.current[0] = el} visible={visibleSections.has('stats')} />
                <DisciplineSection ref={el => sectionsRef.current[1] = el} visible={visibleSections.has('discipline')} />
                <StudentUnionSection ref={el => sectionsRef.current[2] = el} visible={visibleSections.has('union')} />
                <CafeteriaSchedule ref={el => sectionsRef.current[3] = el} visible={visibleSections.has('schedule')} />
                <CafeteriaQuality ref={el => sectionsRef.current[4] = el} visible={visibleSections.has('quality')} />
                <ToleranceSection ref={el => sectionsRef.current[5] = el} visible={visibleSections.has('tolerance')} />
                <HealthCenterSection ref={el => sectionsRef.current[6] = el} visible={visibleSections.has('health')} />
                <WaterSection ref={el => sectionsRef.current[7] = el} visible={visibleSections.has('water')} />
                <DormitoryAvailability ref={el => sectionsRef.current[8] = el} visible={visibleSections.has('dorm')} />
                <MealCardSection ref={el => sectionsRef.current[9] = el} visible={visibleSections.has('meal')} />
            </div>
        </div>
    );
};

export default Home;
