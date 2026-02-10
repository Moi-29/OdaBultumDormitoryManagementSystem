import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, Building2, FileText, AlertCircle } from 'lucide-react';

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
        { path: '/student/dormitory', label: 'Dormitory View', icon: Building2, color: '#10b981' },
        { path: '/student/application', label: 'Application Form', icon: FileText, color: '#3b82f6' },
        { path: '/student/report', label: 'Report Issue', icon: AlertCircle, color: '#ef4444' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Top Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: isDesktop ? '280px' : 0,
                right: 0,
                height: '64px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.5rem',
                gap: '1rem',
                zIndex: 999,
                transition: 'left 0.3s ease'
            }}>
                {/* Hamburger Menu - Only visible on mobile */}
                {!isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}

                {/* Home Link */}
                <button
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <HomeIcon size={18} />
                    Home
                </button>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* University Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                        alt="OBU Logo" 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'contain',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }} 
                    />
                    {isDesktop && (
                        <div>
                            <div style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: 700,
                                color: 'white',
                                lineHeight: 1.2
                            }}>
                                OBU
                            </div>
                            <div style={{ 
                                fontSize: '0.7rem',
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}>
                                Student Portal
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

            {/* Sidebar Drawer */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '280px',
                    maxWidth: isDesktop ? '280px' : '85vw',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
                    boxShadow: isDesktop ? '2px 0 8px rgba(0, 0, 0, 0.05)' : '4px 0 24px rgba(0, 0, 0, 0.12)',
                    transform: isDesktop ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}
            >
                {/* Sidebar Header */}
                <div style={{
                    height: '64px',
                    padding: '0 1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexShrink: 0
                }}>
                    <Building2 size={24} color="white" />
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'white',
                            lineHeight: 1.2
                        }}>
                            Student Portal
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.2
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
                                    margin: '0 0.75rem',
                                    background: isActive ? `${item.color}15` : 'transparent',
                                    border: 'none',
                                    borderLeft: isActive ? `4px solid ${item.color}` : '4px solid transparent',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    color: isActive ? item.color : '#4b5563',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.95rem',
                                    width: 'calc(100% - 1.5rem)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#f3f4f6';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    background: '#f9fafb'
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        textAlign: 'center'
                    }}>
                        © 2026 Oda Bultum University
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginTop: '64px',
                marginLeft: isDesktop ? '280px' : 0,
                minHeight: 'calc(100vh - 64px)',
                position: 'relative',
                transition: 'margin-left 0.3s ease'
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
