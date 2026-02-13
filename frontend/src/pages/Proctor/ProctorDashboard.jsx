import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, FileText, MessageSquare, LogOut, User, Building2,
    AlertCircle, CheckCircle, Clock, Send, X, Plus, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const ProctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportForm, setReportForm] = useState({
        subject: '',
        message: '',
        currentRoom: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'proctor') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            console.log('Proctor Dashboard - Current user:', user);
            console.log('Proctor Dashboard - User ID:', user?.id);

            // Fetch all requests
            const requestsRes = await axios.get(`${API_URL}/api/requests`, config);
            
            if (requestsRes.data) {
                const allRequests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
                console.log('Proctor Dashboard - All requests:', allRequests);
                
                // Filter requests FROM this proctor (reports sent by proctor to admin)
                const proctorRequests = allRequests.filter(req => 
                    req.fromUserModel === 'Proctor' && req.fromUserId === user?.id
                );
                console.log('Proctor Dashboard - Requests FROM proctor:', proctorRequests);
                
                // Filter requests TO this proctor (orders from admin to proctor)
                const ordersToProctor = allRequests.filter(req => {
                    const isToProctor = req.toUserModel === 'Proctor';
                    const userIdMatch = req.toUserId && user?.id && (req.toUserId.toString() === user.id.toString());
                    console.log(`Checking request ${req._id}:`, {
                        toUserModel: req.toUserModel,
                        toUserId: req.toUserId,
                        currentUserId: user?.id,
                        isToProctor,
                        userIdMatch
                    });
                    return isToProctor && userIdMatch;
                });
                console.log('Proctor Dashboard - Orders TO proctor:', ordersToProctor);
                
                setReports(proctorRequests);
                setMessages(ordersToProctor); // Messages are orders from admin TO this proctor
                
                // Calculate stats
                const stats = {
                    totalReports: proctorRequests.length,
                    pendingReports: proctorRequests.filter(r => r.status === 'pending').length,
                    resolvedReports: proctorRequests.filter(r => r.status === 'approved' || r.status === 'resolved').length,
                    unreadMessages: ordersToProctor.filter(r => r.status === 'pending').length
                };
                setStats(stats);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data', 'error');
            
            // Set empty data on error
            setStats({
                totalReports: 0,
                pendingReports: 0,
                resolvedReports: 0,
                unreadMessages: 0
            });
            setReports([]);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmitReport = async () => {
        if (!reportForm.subject || !reportForm.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                fromUserId: user?.id || null,
                fromUserModel: 'Proctor',
                fromUserName: user?.fullName || user?.name || user?.username || 'Proctor',
                blockId: user?.blockId || 'N/A',
                email: user?.email || '',
                phone: user?.phone || '',
                requestType: 'Maintenance',
                subject: reportForm.subject,
                message: reportForm.message,
                currentRoom: reportForm.currentRoom || '',
                status: 'pending'
            };

            console.log('Submitting request:', requestData);
            
            const response = await axios.post(`${API_URL}/api/requests`, requestData);
            
            console.log('Response:', response.data);
            
            showNotification('Report submitted successfully', 'success');
            setShowReportModal(false);
            setReportForm({ subject: '', message: '', currentRoom: '' });
            fetchData();
        } catch (error) {
            console.error('Error submitting report:', error);
            console.error('Error response:', error.response?.data);
            showNotification(error.response?.data?.message || 'Failed to submit report', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleMessageSelection = (messageId) => {
        setSelectedMessages(prev =>
            prev.includes(messageId)
                ? prev.filter(id => id !== messageId)
                : [...prev, messageId]
        );
    };

    const handleSelectAllMessages = () => {
        if (selectedMessages.length === messages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.map(msg => msg._id));
        }
    };

    const handleDeleteSelectedMessages = async () => {
        if (selectedMessages.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedMessages.length} ${selectedMessages.length === 1 ? 'message' : 'messages'}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Delete each selected message
            await Promise.all(
                selectedMessages.map(id =>
                    axios.delete(`${API_URL}/api/requests/${id}`, config)
                )
            );

            showNotification(`Successfully deleted ${selectedMessages.length} ${selectedMessages.length === 1 ? 'message' : 'messages'}`, 'success');
            setSelectedMessages([]);
            setIsSelectionMode(false);
            await fetchData();
        } catch (error) {
            console.error('Error deleting messages:', error);
            showNotification('Failed to delete some messages', 'error');
        }
    };

    const handleViewDetail = (item) => {
        setSelectedDetail(item);
        setShowDetailModal(true);
        
        // Mark as read when viewing
        markAsRead(item._id);
    };

    const markAsRead = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_URL}/api/requests/${requestId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update local state to reflect the read status
            setMessages(prev => prev.map(msg => 
                msg._id === requestId ? { ...msg, isRead: true } : msg
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '60px', height: '60px', border: '4px solid #e2e8f0',
                        borderTopColor: '#3b82f6', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed', top: '2rem', right: '2rem', zIndex: 10001,
                    minWidth: '320px', background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white', padding: '1.25rem 1.5rem', borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, fontWeight: 600 }}>{notification.message}</div>
                        <button onClick={() => setNotification(null)} style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                            width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer'
                        }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div style={{
                width: '280px', background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
                color: 'white', padding: '2rem 0', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)', position: 'fixed', height: '100vh'
            }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 size={28} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Proctor</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Dashboard</p>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', opacity: 0.9 }}>Assigned Block</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{user?.blockId || 'N/A'}</p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '0 1rem' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: Home },
                        { id: 'reports', label: 'My Reports', icon: FileText, badge: reports.filter(r => r.status === 'pending').length },
                        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages.filter(m => !m.isRead).length }
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                                width: '100%', padding: '0.875rem 1.25rem', marginBottom: '0.5rem',
                                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                border: 'none', borderRadius: '12px', color: 'white',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                fontSize: '0.95rem', fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.3s', textAlign: 'left', position: 'relative'
                            }}>
                                <Icon size={20} />
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge > 0 && (
                                    <span style={{
                                        minWidth: '20px',
                                        height: '20px',
                                        padding: '0 6px',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '0 1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <User size={20} />
                            <span style={{ fontWeight: 600 }}>{user?.fullName}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>@{user?.username}</p>
                    </div>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '0.875rem', background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.5)', borderRadius: '12px',
                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '0.5rem', fontWeight: 600
                    }}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#1e293b' }}>
                            Dashboard Overview
                        </h1>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Total Reports', value: stats.totalReports, icon: FileText, color: '#3b82f6' },
                                { label: 'Pending', value: stats.pendingReports, icon: Clock, color: '#f59e0b' },
                                { label: 'Resolved', value: stats.resolvedReports, icon: CheckCircle, color: '#10b981' },
                                { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: '#8b5cf6' }
                            ].map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={idx} style={{
                                        background: 'white', padding: '1.5rem', borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '12px',
                                                background: `${stat.color}15`, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Icon size={24} color={stat.color} />
                                            </div>
                                        </div>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>{stat.label}</p>
                                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>{stat.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <button onClick={() => setShowReportModal(true)} style={{
                            padding: '1rem 2rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem',
                            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '0.5rem', boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                        }}>
                            <Plus size={20} />
                            Submit New Report
                        </button>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>My Reports</h1>
                            <button onClick={() => setShowReportModal(true)} style={{
                                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                            }}>
                                <Plus size={18} />
                                New Report
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
                                    <FileText size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>No reports yet</p>
                                    <p style={{ color: '#94a3b8' }}>Submit your first report to get started</p>
                                </div>
                            ) : (
                                reports.map(report => (
                                    <div key={report._id} style={{
                                        background: 'white', padding: '1.5rem', borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                                                    {report.subject}
                                                </h3>
                                                <p style={{
                                                    margin: '0 0 1rem 0',
                                                    color: '#64748b',
                                                    fontSize: '0.875rem',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {report.message}
                                                </p>
                                                <button
                                                    onClick={() => handleViewDetail(report)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s',
                                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                >
                                                    View Full Details
                                                </button>
                                            </div>
                                            <span style={{
                                                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem',
                                                fontWeight: 600, textTransform: 'uppercase',
                                                background: report.status === 'resolved' ? '#dcfce7' : '#fef3c7',
                                                color: report.status === 'resolved' ? '#166534' : '#92400e'
                                            }}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                                            <span>Submitted: {report.submittedOn}</span>
                                            {report.currentRoom && (
                                                <>
                                                    <span>•</span>
                                                    <span>Room: {report.currentRoom}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Messages Tab - Orders from Admin */}
                {activeTab === 'messages' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                                Orders from Admin
                            </h1>
                            {messages.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {!isSelectionMode ? (
                                        <button
                                            onClick={() => setIsSelectionMode(true)}
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Select Items
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSelectAllMessages}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: 'white',
                                                    color: '#3b82f6',
                                                    border: '2px solid #3b82f6',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                {selectedMessages.length === messages.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            {selectedMessages.length > 0 && (
                                                <button
                                                    onClick={handleDeleteSelectedMessages}
                                                    style={{
                                                        padding: '0.75rem 1.5rem',
                                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                                        transition: 'all 0.3s'
                                                    }}
                                                >
                                                    Delete ({selectedMessages.length})
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsSelectionMode(false);
                                                    setSelectedMessages([]);
                                                }}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: '#f1f5f9',
                                                    color: '#64748b',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading orders...</div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '4rem 2rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <MessageSquare size={40} color="#6366f1" />
                                </div>
                                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    No orders yet
                                </p>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                                    Orders from admin will appear here
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {messages.map((order, index) => (
                                    <div
                                        key={order._id}
                                        style={{
                                            background: selectedMessages.includes(order._id) ? '#eff6ff' : 'white',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            border: selectedMessages.includes(order._id) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                            transition: 'all 0.3s',
                                            position: 'relative'
                                        }}
                                    >
                                        {isSelectionMode && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                zIndex: 10
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMessages.includes(order._id)}
                                                    onChange={() => handleToggleMessageSelection(order._id)}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                        accentColor: '#3b82f6'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '1rem',
                                            paddingBottom: '1rem',
                                            borderBottom: '1px solid #e5e7eb'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '1rem'
                                                }}>
                                                    A
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                                                        Admin Team
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                        {order.submittedOn || new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '0.5rem 1rem',
                                                background: order.status === 'pending' ? '#fef3c7' : order.status === 'resolved' ? '#d1fae5' : '#e0e7ff',
                                                color: order.status === 'pending' ? '#92400e' : order.status === 'resolved' ? '#065f46' : '#3730a3',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {order.status}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: '0 0 0.75rem 0',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: '#1e293b'
                                            }}>
                                                {order.subject}
                                            </h3>
                                            <p style={{
                                                margin: '0 0 1rem 0',
                                                color: '#475569',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.6',
                                                whiteSpace: 'pre-wrap',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {order.message}
                                            </p>
                                            <button
                                                onClick={() => handleViewDetail(order)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.3s',
                                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                View Full Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', maxWidth: '600px',
                        width: '100%', maxHeight: '90vh', overflow: 'auto', margin: '1rem'
                    }}>
                        <div style={{
                            padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Submit Report</h2>
                            <button onClick={() => setShowReportModal(false)} style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'
                            }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Subject <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={reportForm.subject}
                                    onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                                    placeholder="Brief description of the issue"
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    value={reportForm.currentRoom}
                                    onChange={(e) => setReportForm({ ...reportForm, currentRoom: e.target.value })}
                                    placeholder="e.g., 101, 205"
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Priority
                                </label>
                                <select
                                    value={reportForm.priority}
                                    onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Description <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <textarea
                                    value={reportForm.message}
                                    onChange={(e) => setReportForm({ ...reportForm, message: e.target.value })}
                                    placeholder="Detailed description of the issue..."
                                    rows={5}
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem', resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb',
                            display: 'flex', gap: '1rem', justifyContent: 'flex-end'
                        }}>
                            <button onClick={() => setShowReportModal(false)} disabled={submitting} style={{
                                padding: '0.75rem 1.5rem', background: 'white', color: '#64748b',
                                border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSubmitReport} disabled={submitting} style={{
                                padding: '0.75rem 1.5rem',
                                background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                {submitting ? 'Submitting...' : (
                                    <>
                                        <Send size={18} />
                                        Submit Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail View Modal - Premium */}
            {showDetailModal && selectedDetail && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', maxWidth: '700px',
                        width: '90%', maxHeight: '85vh', overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        animation: 'slideUp 0.4s ease-out'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-10%',
                                width: '300px',
                                height: '300px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                filter: 'blur(40px)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '1.2rem',
                                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                            }}>
                                                A
                                            </div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                                                    Admin Team
                                                </div>
                                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                                    Official Communication
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            transition: 'all 0.3s',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                            e.currentTarget.style.transform = 'rotate(90deg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                            e.currentTarget.style.transform = 'rotate(0deg)';
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <h2 style={{
                                    margin: 0,
                                    color: 'white',
                                    fontSize: '1.75rem',
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px'
                                }}>
                                    {selectedDetail.subject}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '2rem', maxHeight: 'calc(85vh - 250px)', overflowY: 'auto' }}>
                            {/* Status and Date */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{
                                    padding: '0.75rem 1.25rem',
                                    background: selectedDetail.status === 'pending' ? '#fef3c7' : selectedDetail.status === 'resolved' ? '#d1fae5' : '#e0e7ff',
                                    color: selectedDetail.status === 'pending' ? '#92400e' : selectedDetail.status === 'resolved' ? '#065f46' : '#3730a3',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Clock size={16} />
                                    {selectedDetail.status}
                                </div>
                                <div style={{
                                    padding: '0.75rem 1.25rem',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    {selectedDetail.submittedOn || new Date(selectedDetail.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div style={{
                                background: '#f8f9fa',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <h3 style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Message Details
                                </h3>
                                <p style={{
                                    margin: 0,
                                    color: '#1e293b',
                                    fontSize: '1rem',
                                    lineHeight: '1.8',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedDetail.message}
                                </p>
                            </div>

                            {/* Additional Info */}
                            {(selectedDetail.blockId || selectedDetail.currentRoom) && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1.5rem',
                                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                    borderRadius: '16px',
                                    border: '1px solid #bfdbfe'
                                }}>
                                    <h3 style={{
                                        margin: '0 0 1rem 0',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#1e40af',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Location Information
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {selectedDetail.blockId && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Building2 size={18} color="#3b82f6" />
                                                <span style={{ color: '#1e40af', fontWeight: 600 }}>
                                                    Block: {selectedDetail.blockId}
                                                </span>
                                            </div>
                                        )}
                                        {selectedDetail.currentRoom && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Home size={18} color="#3b82f6" />
                                                <span style={{ color: '#1e40af', fontWeight: 600 }}>
                                                    Room: {selectedDetail.currentRoom}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e2e8f0',
                            background: '#f8f9fa',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    padding: '0.875rem 2rem',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
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
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProctorDashboard;
