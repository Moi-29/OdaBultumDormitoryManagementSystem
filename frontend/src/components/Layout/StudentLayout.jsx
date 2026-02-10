import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, Building2, FileText, AlertCircle } from 'lucide-react';
import '../styles/premiumAnimations.css';

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
        { path: '/student/dormitory', label: 'Dormitory View', icon: Building2, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
        { path: '/student/application', label: 'Application Form', icon: FileText, color: '#d97706', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { path: '/student/report', label: 'Report Issue', icon: AlertCircle, color: '#4f46e5', gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)' }
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
            {/* Glassmorphism Top Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: isDesktop ? '280px' : 0,
                right: 0,
                height: '70px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
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
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                        className="hover-lift-sm"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}

                {/* Home Link with Gold Gradient */}
                <button
                    onClick={() => navigate('/student/home')}
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        border: 'none',
                        color: 'white',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                        letterSpacing: '0.3px'
                    }}
                    className="hover-lift-sm"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 119, 6, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.3)';
                    }}
                >
                    <HomeIcon size={20} strokeWidth={2.5} />
                    Home
                </button>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* University Logo with Ethiopian Colors */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    padding: '0.5rem 1.25rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                        alt="OBU Logo" 
                        style={{ 
                            width: '45px', 
                            height: '45px', 
                            objectFit: 'contain',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '5px',
                            border: '2px solid rgba(16, 185, 129, 0.3)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }} 
                    />
                    {isDesktop && (
                        <div>
                            <div style={{ 
                                fontSize: '1rem', 
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                lineHeight: 1.2,
                                letterSpacing: '0.5px'
                            }}>
                                OBU
                            </div>
                            <div style={{ 
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                fontWeight: 600
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

            {/* Dark Emerald Sidebar Drawer */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '280px',
                    maxWidth: isDesktop ? '280px' : '85vw',
                    background: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)',
                    boxShadow: isDesktop ? '4px 0 24px rgba(0, 0, 0, 0.12)' : '4px 0 32px rgba(0, 0, 0, 0.2)',
                    transform: isDesktop ? 'translateX(0)' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    borderRight: '1px solid rgba(16, 185, 129, 0.2)'
                }}
            >
                {/* Sidebar Header with Emerald Gradient */}
                <div style={{
                    height: '70px',
                    padding: '0 1.5rem',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <Building2 size={26} color="white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.2,
                            letterSpacing: '0.5px'
                        }}>
                            Student Portal
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.2,
                            fontWeight: 600
                        }}>
                            Oda Bultum University
                        </p>
                    </div>
                </div>

                {/* Navigation Items with Color-Coded Accents */}
                <nav style={{ 
                    flex: 1, 
                    padding: '2rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
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
                                    padding: '1.1rem 1.5rem',
                                    margin: '0 1rem',
                                    background: isActive ? `${item.color}20` : 'transparent',
                                    border: 'none',
                                    borderLeft: isActive ? `4px solid ${item.color}` : '4px solid transparent',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textAlign: 'left',
                                    color: isActive ? item.color : 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: isActive ? 700 : 600,
                                    fontSize: '1rem',
                                    width: 'calc(100% - 2rem)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                        e.currentTarget.style.transform = 'translateX(6px)';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                    }
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: item.gradient,
                                        opacity: 0.15,
                                        borderRadius: '12px'
                                    }} />
                                )}
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} style={{ position: 'relative', zIndex: 1 }} />
                                <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer with Ethiopian Flag Colors */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                    background: 'rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '1rem',
                        justifyContent: 'center'
                    }}>
                        <div style={{ width: '30px', height: '4px', background: '#10b981', borderRadius: '2px' }} />
                        <div style={{ width: '30px', height: '4px', background: '#f59e0b', borderRadius: '2px' }} />
                        <div style={{ width: '30px', height: '4px', background: '#ef4444', borderRadius: '2px' }} />
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        fontWeight: 600
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
                background: '#f8f9fa'
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
