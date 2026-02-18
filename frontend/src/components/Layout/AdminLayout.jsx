import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, FileText, LogOut, Settings, Shield, AlertTriangle, Menu, X, ClipboardList, MessageSquare, UserCog, Megaphone, Image, FileCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const AdminLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requestCount, setRequestCount] = useState(0);

    // Get user permissions
    const userPermissions = user?.permissions || [];
    const hasPermission = (permission) => {
        return userPermissions.includes('*') || userPermissions.includes(permission);
    };

    // Fetch request count
    useEffect(() => {
        const fetchRequestCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }
                
                const response = await axios.get(`${API_URL}/api/requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data) {
                    const requests = Array.isArray(response.data) ? response.data : [];
                    // Count unread requests
                    const unreadCount = requests.filter(req => req.isRead === false).length;
                    setRequestCount(unreadCount);
                } else {
                    setRequestCount(0);
                }
            } catch (error) {
                console.error('Error fetching request count:', error);
                setRequestCount(0);
            }
        };

        fetchRequestCount();
        
        // Listen for request marked as read events
        const handleRequestMarkedAsRead = () => {
            fetchRequestCount();
        };
        window.addEventListener('requestMarkedAsRead', handleRequestMarkedAsRead);
        
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchRequestCount, 30000);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('requestMarkedAsRead', handleRequestMarkedAsRead);
        };
    }, []);

    useEffect(() => {
        const checkMaintenanceMode = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${API_URL}/api/settings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data) {
                    // Only update state if the value actually changed to prevent unnecessary re-renders
                    setMaintenanceMode(prevMode => {
                        if (prevMode !== response.data.maintenanceMode) {
                            return response.data.maintenanceMode;
                        }
                        return prevMode;
                    });
                }
            } catch (error) {
                // Silently handle errors to avoid console spam
                if (error.response?.status !== 401) {
                    console.error('Error checking maintenance mode:', error);
                }
            }
        };

        checkMaintenanceMode();
        
        // Listen for maintenance mode changes
        const handleMaintenanceModeChange = (event) => {
            setMaintenanceMode(event.detail.maintenanceMode);
        };
        window.addEventListener('maintenanceModeChanged', handleMaintenanceModeChange);
        
        // Check every 30 seconds silently in the background
        const interval = setInterval(checkMaintenanceMode, 30000);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('maintenanceModeChanged', handleMaintenanceModeChange);
        };
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/login'; // Force full page redirect
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1001,
                    display: 'none',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                className="mobile-menu-btn"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                        display: 'none'
                    }}
                    className="mobile-backdrop"
                />
            )}

            {/* Sidebar */}
            <aside 
                style={{ 
                    width: '260px', 
                    backgroundColor: 'var(--surface-color)', 
                    borderRight: '1px solid var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: 1000
                }}
                className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
            >
                <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                        alt="OBU Logo" 
                        style={{ 
                            width: '45px', 
                            height: '45px', 
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }} 
                    />
                    <div>
                        <h3 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.1rem' }}>OBU DMS</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin Portal</span>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: 'var(--spacing-md)', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('dashboard')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('students.view') && (
                            <NavItem to="/admin/students" icon={<Users size={20} />} label="Students" active={isActive('students')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dorms.view') && (
                            <NavItem to="/admin/dorms" icon={<Building size={20} />} label="Dormitories" active={isActive('dorms')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('reports.view') && (
                            <NavItem to="/admin/reports" icon={<FileText size={20} />} label="Reports" active={isActive('reports')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/applications" icon={<ClipboardList size={20} />} label="Applications" active={isActive('applications')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem 
                                to="/admin/requests" 
                                icon={<MessageSquare size={20} />} 
                                label="Requests" 
                                active={isActive('requests')} 
                                onClick={() => setSidebarOpen(false)}
                                badge={requestCount}
                            />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/permissions" icon={<FileCheck size={20} />} label="Permissions" active={isActive('permissions')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/announcements" icon={<Megaphone size={20} />} label="Announcements/Events" active={isActive('announcements')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/gallery" icon={<Image size={20} />} label="Gallery" active={isActive('gallery')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('admins.view') && (
                            <NavItem to="/admin/admin-management" icon={<Shield size={20} />} label="Admin Management" active={isActive('admin-management')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('admins.view') && (
                            <NavItem to="/admin/user-management" icon={<UserCog size={20} />} label="User Management" active={isActive('user-management')} onClick={() => setSidebarOpen(false)} />
                        )}
                        {hasPermission('dashboard.view') && (
                            <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" active={isActive('settings')} onClick={() => setSidebarOpen(false)} />
                        )}
                    </ul>
                </nav>

                <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)' }}>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem', color: 'var(--color-danger)', borderColor: 'transparent' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
                {/* Maintenance Mode Banner */}
                {maintenanceMode && (
                    <div style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        color: 'white',
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        animation: 'slideDown 0.3s ease-out',
                        flexWrap: 'wrap'
                    }}
                    className="maintenance-banner"
                    >
                        <AlertTriangle size={24} />
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <strong style={{ fontSize: '1rem' }}>⚠️ MAINTENANCE MODE ACTIVE</strong>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.95 }}>
                                The system is in maintenance mode. Only administrators can access the system.
                            </p>
                        </div>
                        <Link 
                            to="/admin/settings"
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '6px',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            Disable
                        </Link>
                    </div>
                )}
                
                <div style={{ flex: 1, padding: 'var(--spacing-xl)' }} className="main-content">
                    <Outlet />
                </div>

                <style>{`
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.05);
                            opacity: 0.9;
                        }
                    }

                    /* Responsive Styles */
                    @media (max-width: 768px) {
                        .mobile-menu-btn {
                            display: flex !important;
                            align-items: center;
                            justify-content: center;
                        }

                        .mobile-backdrop {
                            display: block !important;
                        }

                        .sidebar {
                            position: fixed;
                            top: 0;
                            left: 0;
                            bottom: 0;
                            transform: translateX(-100%);
                        }

                        .sidebar-open {
                            transform: translateX(0);
                        }

                        .main-content {
                            padding: 1rem !important;
                            padding-top: 4rem !important;
                        }

                        .maintenance-banner {
                            padding: 0.75rem 1rem !important;
                            font-size: 0.85rem !important;
                        }

                        .maintenance-banner strong {
                            font-size: 0.9rem !important;
                        }

                        .maintenance-banner p {
                            font-size: 0.8rem !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .main-content {
                            padding: 0.75rem !important;
                            padding-top: 4rem !important;
                        }
                    }
                `}</style>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active, onClick, badge }) => {
    return (
        <li>
            <Link
                to={to}
                onClick={onClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                    color: active ? 'var(--color-primary)' : 'var(--text-main)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    position: 'relative'
                }}
            >
                {icon}
                <span style={{ fontWeight: 500, flex: 1 }}>{label}</span>
                {badge !== null && badge !== undefined && badge > 0 && (
                    <span style={{
                        minWidth: '24px',
                        height: '24px',
                        padding: '0 8px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                        animation: badge > 0 ? 'pulse 2s infinite' : 'none'
                    }}>
                        {badge > 99 ? '99+' : badge}
                    </span>
                )}
            </Link>
        </li>
    );
};

export default AdminLayout;
