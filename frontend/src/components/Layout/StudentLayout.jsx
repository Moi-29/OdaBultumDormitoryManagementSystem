import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, Building2, FileText, AlertCircle } from 'lucide-react';
import '../../styles/premiumAnimations.css';

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
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

    const navItems = [
        { path: '/student/home', label: 'Home', icon: HomeIcon, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { path: '/student/dormitory', label: 'Dormitory View', icon: Building2, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { path: '/student/application', label: 'Application Form', icon: FileText, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { path: '/student/report', label: 'Report Issue', icon: AlertCircle, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f3f4f6',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Blue/Purple Gradient Top Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: isDesktop ? '280px' : 0,
                right: 0,
                height: '70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: 'none',
                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.2)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 2rem',
                gap: '1.5rem',
                zIndex: 999,
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Hamburger Menu - Only visible on mobile */}
                {!isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}

                {/* Spacer */}
                <div style={{ flex: 1 }} />
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

            {/* Blue/Purple Gradient Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '280px',
                    maxWidth: isDesktop ? '280px' : '85vw',
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: isDesktop ? '4px 0 20px rgba(102, 126, 234, 0.15)' : '4px 0 32px rgba(0, 0, 0, 0.2)',
                    transform: isDesktop ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    borderRight: 'none'
                }}
            >
                {/* Sidebar Header */}
                <div style={{
                    height: '70px',
                    padding: '0 1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Building2 size={26} color="white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'white',
                            lineHeight: 1.2
                        }}>
                            Student Portal
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.2,
                            fontWeight: 500
                        }}>
                            Oda Bultum University
                        </p>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav style={{ 
                    flex: 1, 
                    padding: '1.5rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
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
                                    padding: '1rem 1.5rem',
                                    margin: '0 1rem',
                                    background: isActive ? 'white' : 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'left',
                                    color: isActive ? '#667eea' : 'white',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.95rem',
                                    width: 'calc(100% - 2rem)',
                                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textAlign: 'center',
                        fontWeight: 500
                    }}>
                        © 2026 Oda Bultum University
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginTop: '70px',
                marginLeft: isDesktop ? '280px' : 0,
                minHeight: 'calc(100vh - 70px)',
                position: 'relative',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: '#f3f4f6'
            }}>
                <Outlet />
            </main>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default StudentLayout;
