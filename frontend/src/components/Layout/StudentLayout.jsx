import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Building2, FileText, AlertCircle, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (!isDesktop && sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen, isDesktop]);

    const navItems = [
        { path: '/student/home', label: 'Home', icon: Home },
        { path: '/student/dormitory', label: 'Dormitory View', icon: Building2 },
        { path: '/student/application', label: 'Application Form', icon: FileText },
        { path: '/student/report', label: 'Report Issue', icon: AlertCircle }
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
            {/* Responsive Top Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: isDesktop ? (sidebarVisible ? '260px' : 0) : 0,
                right: 0,
                height: isDesktop ? '81px' : '64px',
                background: isDarkMode ? '#1f2937' : 'white',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isDesktop ? '0 2rem' : '0 1rem 0 5rem',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
            }}>
                {/* Left side - Theme Toggle & Language Selector (Desktop also has Hamburger) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {/* Desktop Hamburger Menu */}
                    {isDesktop && (
                        <button
                            onClick={() => setSidebarVisible(!sidebarVisible)}
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
                                color: isDarkMode ? '#60a5fa' : '#3b82f6',
                                minWidth: '44px',
                                minHeight: '44px'
                            }}
                            title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    
                    {/* Theme Toggle - Always visible on both mobile and desktop */}
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
                            color: isDarkMode ? '#fbbf24' : '#f59e0b',
                            minWidth: '44px',
                            minHeight: '44px',
                            flexShrink: 0
                        }}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Google Translate Widget */}
                    <div id="google_translate_element" style={{ flexShrink: 0 }}></div>
                </div>

                {/* Center - University Name (Hidden on small mobile) */}
                {isDesktop && (
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: isDarkMode ? '#f3f4f6' : '#111',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'color 0.3s ease'
                    }}>
                        {t('universityName')}
                    </div>
                )}

                {/* Right side - Logo and User Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isDesktop ? '1rem' : '0.5rem'
                }}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-dYS7xdf-tgxWKo0y5i_CyKO0g_tyreDHqg&s"
                        alt="OBU Logo"
                        style={{
                            width: isDesktop ? '50px' : '40px',
                            height: isDesktop ? '50px' : '40px',
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
                        top: '0.75rem',
                        left: sidebarOpen ? 'calc(60vw - 60px)' : '0.75rem',
                        background: '#2d9f6e',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.625rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1003,
                        width: '48px',
                        height: '48px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ 
                        width: '24px', 
                        height: '3px', 
                        backgroundColor: 'white', 
                        borderRadius: '2px',
                        transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{ 
                        width: '24px', 
                        height: '3px', 
                        backgroundColor: 'white', 
                        borderRadius: '2px',
                        transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{ 
                        width: '24px', 
                        height: '3px', 
                        backgroundColor: 'white', 
                        borderRadius: '2px',
                        transition: 'all 0.3s ease'
                    }}></div>
                </button>
            )}

            {/* Responsive Green Gradient Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: isDesktop ? '260px' : '60vw',
                    background: isDarkMode 
                        ? 'linear-gradient(180deg, #2d9f6e 0%, #27916a 50%, #238360 100%)'
                        : 'linear-gradient(180deg, #2d9f6e 0%, #27916a 50%, #238360 100%)',
                    boxShadow: isDesktop 
                        ? '2px 0 12px rgba(0, 0, 0, 0.1)'
                        : '4px 0 24px rgba(0, 0, 0, 0.3)',
                    transform: isDesktop 
                        ? (sidebarVisible ? 'translateX(0)' : 'translateX(-100%)')
                        : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                }}
                className="custom-scrollbar"
            >
                {/* Sidebar Header */}
                <div style={{
                    padding: isDesktop ? '1.75rem 1.25rem' : '1.5rem 1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: isDesktop ? '32px' : '40px',
                        height: isDesktop ? '32px' : '40px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
                            fontSize: isDesktop ? '1.05rem' : '1.125rem',
                            fontWeight: 700,
                            color: 'white',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                            Student Service
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: isDesktop ? '0.8rem' : '0.8125rem',
                            color: 'rgba(255, 255, 255, 0.95)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                            Oda Bultum University
                        </p>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav style={{ 
                    flex: 1, 
                    padding: isDesktop ? '1rem 0.75rem' : '1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isDesktop ? '0.375rem' : '0.5rem'
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
                                    padding: isDesktop ? '0.875rem 1.25rem' : '1rem 1.25rem',
                                    background: isActive 
                                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.25))' 
                                        : 'transparent',
                                    border: isActive ? '2px solid rgba(255, 215, 0, 0.8)' : 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textAlign: 'left',
                                    color: 'white',
                                    fontWeight: isActive ? 700 : 600,
                                    fontSize: isDesktop ? '1.05rem' : '1.0625rem',
                                    width: '100%',
                                    letterSpacing: '0.01em',
                                    boxShadow: isActive 
                                        ? '0 8px 32px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                                        : 'none',
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: isDesktop ? '48px' : '52px',
                                    WebkitTapHighlightColor: 'transparent'
                                }}
                                onTouchStart={(e) => {
                                    if (!isActive && !isDesktop) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.transform = 'scale(0.98)';
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    if (!isActive && !isDesktop) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive && isDesktop) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.15))';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive && isDesktop) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <Icon size={isDesktop ? 20 : 22} strokeWidth={2.5} />
                                <span style={{ flex: 1 }}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{
                    padding: isDesktop ? '0.875rem' : '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    flexShrink: 0
                }}>
                    <div style={{
                        fontSize: isDesktop ? '0.7rem' : '0.75rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        textAlign: 'center',
                        lineHeight: 1.5,
                        fontWeight: 600,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                        © 2026 Oda Bultum University
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: isDesktop ? (sidebarVisible ? '260px' : 0) : 0,
                marginTop: isDesktop ? '81px' : '64px',
                minHeight: `calc(100vh - ${isDesktop ? '81px' : '64px'})`,
                width: isDesktop ? (sidebarVisible ? 'calc(100% - 260px)' : '100%') : '100%',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isDarkMode ? '#0f172a' : '#f5f5f5'
            }}>
                <Outlet />
            </main>

            {/* Animations & Responsive Styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Custom Scrollbar for Sidebar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                /* Prevent text selection on buttons */
                button {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                /* Optimize touch interactions */
                * {
                    -webkit-tap-highlight-color: transparent;
                }
                
                /* Ensure proper box-sizing */
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                
                /* Mobile viewport fix */
                @media (max-width: 767px) {
                    body {
                        overflow-x: hidden;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentLayout;
