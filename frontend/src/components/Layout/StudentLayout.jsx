import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { X, Home, Building2, FileText, AlertCircle, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations/translations';

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const t = (key) => getTranslation(language, key);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
        { code: 'om', name: 'Afaan Oromo', flag: '🇪🇹' }
    ];

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { path: '/student/home', label: t('home'), icon: Home },
        { path: '/student/dormitory', label: t('dormitoryView'), icon: Building2 },
        { path: '/student/application', label: t('applicationForm'), icon: FileText },
        { path: '/student/report', label: t('reportIssue'), icon: AlertCircle }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (!isDesktop) {
            setSidebarOpen(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: isDarkMode ? '#0f172a' : '#f5f5f5',
            display: 'flex',
            transition: 'background-color 0.3s ease'
        }}>
            {/* White Top Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: isDesktop ? '260px' : 0,
                right: 0,
                height: '81px',
                background: isDarkMode ? '#1f2937' : 'white',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                zIndex: 1000,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25), 0 20px 60px rgba(0, 0, 0, 0.2)',
                transition: 'left 0.3s ease, background 0.3s ease'
            }}>
                {/* Left side - Theme Toggle & Language Selector */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: isDarkMode ? '#374151' : '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            color: isDarkMode ? '#fbbf24' : '#f59e0b'
                        }}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Language Selector */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            style={{
                                background: isDarkMode ? '#374151' : '#f3f4f6',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem',
                                transition: 'all 0.3s ease',
                                color: isDarkMode ? '#60a5fa' : '#3b82f6'
                            }}
                            title="Change Language"
                        >
                            <Languages size={20} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                {languages.find(l => l.code === language)?.flag}
                            </span>
                        </button>

                        {/* Language Dropdown */}
                        {showLanguageMenu && (
                            <>
                                <div
                                    onClick={() => setShowLanguageMenu(false)}
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    left: 0,
                                    backgroundColor: isDarkMode ? '#1f2937' : 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                    overflow: 'hidden',
                                    zIndex: 1000,
                                    minWidth: '180px'
                                }}>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setShowLanguageMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: 'none',
                                                background: language === lang.code 
                                                    ? (isDarkMode ? '#374151' : '#f3f4f6')
                                                    : 'transparent',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                fontSize: '0.875rem',
                                                fontWeight: language === lang.code ? 600 : 400,
                                                transition: 'all 0.2s ease',
                                                textAlign: 'left'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (language !== lang.code) {
                                                    e.currentTarget.style.background = isDarkMode ? '#374151' : '#f9fafb';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (language !== lang.code) {
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            <span style={{ fontSize: '1.25rem' }}>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                            {language === lang.code && (
                                                <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Center - University Name */}
                <div style={{
                    position: isDesktop ? 'absolute' : 'relative',
                    left: isDesktop ? '50%' : 'auto',
                    transform: isDesktop ? 'translateX(-50%)' : 'none',
                    fontSize: isDesktop ? '1.25rem' : '0.875rem',
                    fontWeight: 700,
                    color: isDarkMode ? '#f3f4f6' : '#111',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: isDesktop ? 'none' : '50%',
                    transition: 'color 0.3s ease'
                }}>
                    {t('universityName')}
                </div>

                {/* Right side - Logo and User Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-dYS7xdf-tgxWKo0y5i_CyKO0g_tyreDHqg&s"
                        alt="OBU Logo"
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid #e5e7eb'
                        }}
                    />
                    {isDesktop && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: isDarkMode ? '#ffffff' : '#111',
                                lineHeight: 1.3,
                                transition: 'color 0.3s ease'
                            }}>
                                Student Service
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                lineHeight: 1.3,
                                transition: 'color 0.3s ease'
                            }}>
                                student@example.com
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Sidebar Overlay - Only on mobile */}
            {!isDesktop && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1001,
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                />
            )}

            {/* Hamburger Menu Button - Mobile Only */}
            {!isDesktop && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        background: '#1e3a5f',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        zIndex: 1003,
                        width: '48px',
                        height: '48px'
                    }}
                >
                    {sidebarOpen ? (
                        <X size={24} color="white" />
                    ) : (
                        <>
                            <div style={{ width: '28px', height: '4px', backgroundColor: '#4ade80', borderRadius: '2px' }}></div>
                            <div style={{ width: '28px', height: '4px', backgroundColor: '#4ade80', borderRadius: '2px' }}></div>
                            <div style={{ width: '28px', height: '4px', backgroundColor: '#4ade80', borderRadius: '2px' }}></div>
                        </>
                    )}
                </button>
            )}

            {/* Dark Blue Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '260px',
                    maxWidth: isDesktop ? '260px' : '85vw',
                    background: '#1e3a5f',
                    boxShadow: '10px 0 40px rgba(0, 0, 0, 0.25), 20px 0 80px rgba(0, 0, 0, 0.2)',
                    transform: isDesktop ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: 'transform 0.3s ease',
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
                className="hide-scrollbar"
            >
                {/* Sidebar Header */}
                <div style={{
                    padding: '1.75rem 1.25rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        background: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-dYS7xdf-tgxWKo0y5i_CyKO0g_tyreDHqg&s"
                            alt="OBU Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            Student Service
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            Oda Bultum University
                        </p>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav style={{ 
                    flex: 1, 
                    padding: '1rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem'
                }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.875rem 1.25rem',
                                    background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left',
                                    color: isActive ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '1rem',
                                    width: '100%',
                                    letterSpacing: '0.01em'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                    }
                                }}
                            >
                                <Icon size={20} strokeWidth={2.5} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{
                    padding: '0.875rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textAlign: 'center',
                        lineHeight: 1.4
                    }}>
                        © 2026 Oda Bultum University
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: isDesktop ? '260px' : 0,
                marginTop: '81px',
                minHeight: 'calc(100vh - 81px)',
                width: isDesktop ? 'calc(100% - 260px)' : '100%',
                position: 'relative',
                transition: 'margin-left 0.3s ease, background-color 0.3s ease',
                background: isDarkMode ? '#0f172a' : '#f5f5f5'
            }}>
                <Outlet />
            </main>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Hide scrollbar for Chrome, Safari and Opera */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                /* Hide scrollbar globally */
                body::-webkit-scrollbar {
                    display: none;
                }
                
                body {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                * {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                
                *::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default StudentLayout;
