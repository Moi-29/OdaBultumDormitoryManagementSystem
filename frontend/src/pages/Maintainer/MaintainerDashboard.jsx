import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, FileText, MessageSquare, LogOut, User, Wrench,
    AlertCircle, CheckCircle, Clock, Send, X, Plus, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const MaintainerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        subject: '',
        message: '',
        requestType: 'Tool Request'
    });
    const [submitting, setSubmitting] = useState(false);
    const [selectedWorkOrders, setSelectedWorkOrders] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'maintainer') {
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

            console.log('Maintainer Dashboard - Current user:', user);
            console.log('Maintainer Dashboard - User ID:', user?.id);

            // Fetch all requests
            const requestsRes = await axios.get(`${API_URL}/api/requests`, config);
            
            if (requestsRes.data) {
                const allRequests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
                console.log('Maintainer Dashboard - All requests:', allRequests);
                
                // Filter requests FROM this maintainer (requests sent by maintainer to admin)
                const maintainerRequests = allRequests.filter(req => 
                    req.fromUserModel === 'Maintainer' && req.fromUserId === user?.id
                );
                console.log('Maintainer Dashboard - Requests FROM maintainer:', maintainerRequests);
                
                // Filter requests TO this maintainer (orders from admin to maintainer)
                const ordersToMaintainer = allRequests.filter(req => {
                    const isToMaintainer = req.toUserModel === 'Maintainer';
                    const userIdMatch = req.toUserId && user?.id && (req.toUserId.toString() === user.id.toString());
                    console.log(`Checking request ${req._id}:`, {
                        toUserModel: req.toUserModel,
                        toUserId: req.toUserId,
                        currentUserId: user?.id,
                        isToMaintainer,
                        userIdMatch
                    });
                    return isToMaintainer && userIdMatch;
                });
                console.log('Maintainer Dashboard - Orders TO maintainer:', ordersToMaintainer);
                
                setRequests(maintainerRequests);
                setWorkOrders(ordersToMaintainer); // Work orders are orders from admin TO this maintainer
                
                // Calculate stats
                const stats = {
                    totalRequests: maintainerRequests.length,
                    pendingRequests: maintainerRequests.filter(r => r.status === 'pending').length,
                    assignedWorkOrders: ordersToMaintainer.length,
                    completedWorkOrders: ordersToMaintainer.filter(r => r.status === 'approved' || r.status === 'resolved').length,
                    pendingWorkOrders: ordersToMaintainer.filter(r => r.status === 'pending').length
                };
                setStats(stats);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data', 'error');
            
            // Set empty data on error
            setStats({
                totalRequests: 0,
                pendingRequests: 0,
                assignedWorkOrders: 0,
                completedWorkOrders: 0,
                pendingWorkOrders: 0
            });
            setRequests([]);
            setWorkOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmitRequest = async () => {
        if (!requestForm.subject || !requestForm.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                fromUserId: user?.id || null,
                fromUserModel: 'Maintainer',
                fromUserName: user?.fullName || user?.name || user?.username || 'Maintainer',
                specialization: user?.specialization || 'General',
                email: user?.email || '',
                phone: user?.phone || '',
                requestType: requestForm.requestType,
                subject: requestForm.subject,
                message: requestForm.message,
                status: 'pending'
            };

            console.log('Submitting request:', requestData);
            
            const response = await axios.post(`${API_URL}/api/requests`, requestData);
            
            console.log('Response:', response.data);
            
            showNotification('Request submitted successfully', 'success');
            setShowRequestModal(false);
            setRequestForm({ subject: '', message: '', requestType: 'Tool Request' });
            fetchData();
        } catch (error) {
            console.error('Error submitting request:', error);
            console.error('Error response:', error.response?.data);
            showNotification(error.response?.data?.message || 'Failed to submit request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateWorkOrder = async (workOrderId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}/api/maintainer/work-orders/${workOrderId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                showNotification('Work order updated successfully', 'success');
                fetchData();
            }
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to update work order', 'error');
        }
    };

    const handleToggleWorkOrderSelection = (workOrderId) => {
        setSelectedWorkOrders(prev =>
            prev.includes(workOrderId)
                ? prev.filter(id => id !== workOrderId)
                : [...prev, workOrderId]
        );
    };

    const handleSelectAllWorkOrders = () => {
        if (selectedWorkOrders.length === workOrders.length) {
            setSelectedWorkOrders([]);
        } else {
            setSelectedWorkOrders(workOrders.map(wo => wo._id));
        }
    };

    const handleDeleteSelectedWorkOrders = async () => {
        if (selectedWorkOrders.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedWorkOrders.length} ${selectedWorkOrders.length === 1 ? 'work order' : 'work orders'}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Delete each selected work order
            await Promise.all(
                selectedWorkOrders.map(id =>
                    axios.delete(`${API_URL}/api/requests/${id}`, config)
                )
            );

            showNotification(`Successfully deleted ${selectedWorkOrders.length} ${selectedWorkOrders.length === 1 ? 'work order' : 'work orders'}`, 'success');
            setSelectedWorkOrders([]);
            setIsSelectionMode(false);
            await fetchData();
        } catch (error) {
            console.error('Error deleting work orders:', error);
            showNotification('Failed to delete some work orders', 'error');
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
            setWorkOrders(prev => prev.map(wo => 
                wo._id === requestId ? { ...wo, isRead: true } : wo
            ));
            setRequests(prev => prev.map(req => 
                req._id === requestId ? { ...req, isRead: true } : req
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
                        borderTopColor: '#f97316', borderRadius: '50%',
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
                width: '280px', background: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
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
                            <Wrench size={28} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Maintainer</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Dashboard</p>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', opacity: 0.9 }}>Specialization</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {user?.specialization || 'General'}
                        </p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '0 1rem' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: Home },
                        { id: 'requests', label: 'My Requests', icon: FileText, badge: requests.filter(r => r.status === 'pending').length },
                        { id: 'workOrders', label: 'Work Orders', icon: MessageSquare, badge: workOrders.filter(w => !w.isRead).length }
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
                                { label: 'Total Requests', value: stats.totalRequests, icon: FileText, color: '#f97316' },
                                { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: '#f59e0b' },
                                { label: 'Assigned Work Orders', value: stats.assignedWorkOrders, icon: MessageSquare, color: '#3b82f6' },
                                { label: 'Completed Work', value: stats.completedWorkOrders, icon: CheckCircle, color: '#10b981' },
                                { label: 'Pending Work', value: stats.pendingWorkOrders, icon: AlertCircle, color: '#ef4444' }
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

                        <button onClick={() => setShowRequestModal(true)} style={{
                            padding: '1rem 2rem', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem',
                            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '0.5rem', boxShadow: '0 4px 12px rgba(249,115,22,0.3)'
                        }}>
                            <Plus size={20} />
                            Submit New Request
                        </button>
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>My Requests</h1>
                            <button onClick={() => setShowRequestModal(true)} style={{
                                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                            }}>
                                <Plus size={18} />
                                New Request
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {requests.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
                                    <FileText size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>No requests yet</p>
                                    <p style={{ color: '#94a3b8' }}>Submit your first request to get started</p>
                                </div>
                            ) : (
                                requests.map(request => (
                                    <div key={request._id} style={{
                                        background: 'white', padding: '1.5rem', borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                                                        {request.subject}
                                                    </h3>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem',
                                                        fontWeight: 600, textTransform: 'uppercase',
                                                        background: '#fef3c7', color: '#92400e'
                                                    }}>
                                                        {request.requestType}
                                                    </span>
                                                </div>
                                                <p style={{
                                                    margin: '0 0 1rem 0',
                                                    color: '#64748b',
                                                    fontSize: '0.875rem',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {request.message}
                                                </p>
                                                <button
                                                    onClick={() => handleViewDetail(request)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s',
                                                        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
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
                                                background: request.status === 'resolved' ? '#dcfce7' : '#fef3c7',
                                                color: request.status === 'resolved' ? '#166534' : '#92400e'
                                            }}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                                            <span>Submitted: {request.submittedOn}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Work Orders Tab - Premium Chat Interface */}
                {activeTab === 'workOrders' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                                Assigned Work Orders
                            </h1>
                            {workOrders.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {!isSelectionMode ? (
                                        <button
                                            onClick={() => setIsSelectionMode(true)}
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
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
                                                onClick={handleSelectAllWorkOrders}
                                                style={{
                                                    padding: '0.75rem 1.5rem',
                                                    background: 'white',
                                                    color: '#ea580c',
                                                    border: '2px solid #ea580c',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                {selectedWorkOrders.length === workOrders.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            {selectedWorkOrders.length > 0 && (
                                                <button
                                                    onClick={handleDeleteSelectedWorkOrders}
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
                                                    Delete ({selectedWorkOrders.length})
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsSelectionMode(false);
                                                    setSelectedWorkOrders([]);
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

                        <div style={{
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {/* Chat Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                                    border: '3px solid white'
                                }}>
                                    A
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                        Admin Team
                                    </h3>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)' }}>
                                        Work Order Assignments
                                    </p>
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    color: 'white',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {workOrders.length} {workOrders.length === 1 ? 'Order' : 'Orders'}
                                </div>
                            </div>

                            {/* Chat Messages Area */}
                            <div style={{ 
                                padding: '2rem 1.5rem',
                                minHeight: '400px',
                                maxHeight: '600px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                background: '#f8f9fa'
                            }}>
                                {workOrders.length === 0 ? (
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '4rem 2rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <MessageSquare size={40} color="#ea580c" />
                                        </div>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                            No work orders yet
                                        </p>
                                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                                            Work orders from admin will appear here
                                        </p>
                                    </div>
                                ) : (
                                    workOrders.map((workOrder, index) => (
                                        <div key={workOrder._id} style={{
                                            animation: `messageSlideIn 0.3s ease-out ${index * 0.1}s both`,
                                            position: 'relative'
                                        }}>
                                            {isSelectionMode && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '1rem',
                                                    right: '1rem',
                                                    zIndex: 10
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedWorkOrders.includes(workOrder._id)}
                                                        onChange={() => handleToggleWorkOrderSelection(workOrder._id)}
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            cursor: 'pointer',
                                                            accentColor: '#ea580c'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {/* Date Separator */}
                                            {(index === 0 || workOrders[index - 1].submittedOn !== workOrder.submittedOn) && (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    marginBottom: '1rem'
                                                }}>
                                                    <div style={{
                                                        background: 'rgba(234, 88, 12, 0.1)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        color: '#ea580c',
                                                        fontWeight: 600
                                                    }}>
                                                        {workOrder.submittedOn}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Admin Work Order Bubble */}
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem',
                                                    flexShrink: 0,
                                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                                                }}>
                                                    A
                                                </div>
                                                <div style={{ flex: 1, maxWidth: '85%' }}>
                                                    <div style={{
                                                        background: 'white',
                                                        padding: '1rem 1.25rem',
                                                        borderRadius: '18px 18px 18px 4px',
                                                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                                        border: '1px solid rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            marginBottom: '0.75rem',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            <span style={{
                                                                padding: '0.25rem 0.75rem',
                                                                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                                                color: 'white',
                                                                borderRadius: '12px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                Work Order
                                                            </span>
                                                            <span style={{
                                                                padding: '0.25rem 0.75rem',
                                                                background: workOrder.status === 'resolved' ? '#dcfce7' : 
                                                                           workOrder.status === 'in-progress' ? '#dbeafe' : '#fef3c7',
                                                                color: workOrder.status === 'resolved' ? '#166534' : 
                                                                       workOrder.status === 'in-progress' ? '#1e40af' : '#92400e',
                                                                borderRadius: '12px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {workOrder.status}
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            fontWeight: 700,
                                                            color: '#1e293b',
                                                            fontSize: '1rem',
                                                            marginBottom: '0.75rem'
                                                        }}>
                                                            {workOrder.subject}
                                                        </div>
                                                        <div style={{
                                                            color: '#475569',
                                                            fontSize: '0.9rem',
                                                            lineHeight: '1.6',
                                                            whiteSpace: 'pre-wrap',
                                                            marginBottom: '0.75rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {workOrder.message}
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewDetail(workOrder)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 600,
                                                                transition: 'all 0.3s',
                                                                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
                                                                marginBottom: '0.75rem'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            View Full Details
                                                        </button>
                                                        {workOrder.blockId && (
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.5rem 0.75rem',
                                                                background: '#f1f5f9',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem',
                                                                color: '#475569',
                                                                marginBottom: '0.75rem'
                                                            }}>
                                                                <Building2 size={14} />
                                                                <span>Block: <strong>{workOrder.blockId}</strong></span>
                                                            </div>
                                                        )}
                                                        {workOrder.adminResponse && (
                                                            <div style={{
                                                                background: '#eff6ff',
                                                                padding: '0.75rem 1rem',
                                                                borderRadius: '8px',
                                                                borderLeft: '3px solid #3b82f6',
                                                                marginTop: '0.75rem'
                                                            }}>
                                                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                                                                    Admin Note
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                                                                    {workOrder.adminResponse}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {workOrder.status !== 'resolved' && (
                                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                                {workOrder.status === 'pending' && (
                                                                    <button onClick={() => handleUpdateWorkOrder(workOrder._id, 'in-progress')} style={{
                                                                        padding: '0.625rem 1rem',
                                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '10px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 700,
                                                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                                                                        transition: 'all 0.3s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                                    >
                                                                        Start Work
                                                                    </button>
                                                                )}
                                                                {workOrder.status === 'in-progress' && (
                                                                    <button onClick={() => handleUpdateWorkOrder(workOrder._id, 'resolved')} style={{
                                                                        padding: '0.625rem 1rem',
                                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '10px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 700,
                                                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                                                                        transition: 'all 0.3s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                                    >
                                                                        <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                                                        Mark as Resolved
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.7rem',
                                                        color: '#94a3b8',
                                                        marginTop: '0.5rem',
                                                        marginLeft: '0.5rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <Clock size={12} />
                                                        Assigned: {workOrder.submittedOn}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Chat Footer */}
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: 'white',
                                borderTop: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    flex: 1,
                                    padding: '0.875rem 1.25rem',
                                    background: '#f1f5f9',
                                    borderRadius: '14px',
                                    color: '#94a3b8',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic'
                                }}>
                                    Work orders assigned by admin team
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94a3b8'
                                }}>
                                    <Wrench size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Request Modal */}
            {showRequestModal && (
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
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Submit Request</h2>
                            <button onClick={() => setShowRequestModal(false)} style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'
                            }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Request Type
                                </label>
                                <select
                                    value={requestForm.requestType}
                                    onChange={(e) => setRequestForm({ ...requestForm, requestType: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    <option value="Tool Request">Tool Request</option>
                                    <option value="Material Request">Material Request</option>
                                    <option value="Support Request">Support Request</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Subject <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={requestForm.subject}
                                    onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                                    placeholder="Brief description of your request"
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Description <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <textarea
                                    value={requestForm.message}
                                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                                    placeholder="Detailed description of your request..."
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
                            <button onClick={() => setShowRequestModal(false)} disabled={submitting} style={{
                                padding: '0.75rem 1.5rem', background: 'white', color: '#64748b',
                                border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSubmitRequest} disabled={submitting} style={{
                                padding: '0.75rem 1.5rem',
                                background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                {submitting ? 'Submitting...' : (
                                    <>
                                        <Send size={18} />
                                        Submit Request
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
                            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
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
                                                background: selectedDetail.fromUserModel === 'Admin' 
                                                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '1.2rem',
                                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                            }}>
                                                {selectedDetail.fromUserModel === 'Admin' ? 'A' : 'M'}
                                            </div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                                                    {selectedDetail.fromUserModel === 'Admin' ? 'Admin Team' : selectedDetail.fromUserName || 'Maintainer'}
                                                </div>
                                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                                    {selectedDetail.fromUserModel === 'Admin' ? 'Work Order' : selectedDetail.requestType}
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
                                    background: selectedDetail.status === 'pending' ? '#fef3c7' : 
                                               selectedDetail.status === 'resolved' ? '#d1fae5' : 
                                               selectedDetail.status === 'in-progress' ? '#dbeafe' : '#e0e7ff',
                                    color: selectedDetail.status === 'pending' ? '#92400e' : 
                                           selectedDetail.status === 'resolved' ? '#065f46' : 
                                           selectedDetail.status === 'in-progress' ? '#1e40af' : '#3730a3',
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
                                    {selectedDetail.fromUserModel === 'Admin' ? 'Work Order Details' : 'Request Details'}
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
                            {(selectedDetail.blockId || selectedDetail.specialization) && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1.5rem',
                                    background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                                    borderRadius: '16px',
                                    border: '1px solid #fdba74'
                                }}>
                                    <h3 style={{
                                        margin: '0 0 1rem 0',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#c2410c',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Additional Information
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {selectedDetail.blockId && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Building2 size={18} color="#ea580c" />
                                                <span style={{ color: '#c2410c', fontWeight: 600 }}>
                                                    Block: {selectedDetail.blockId}
                                                </span>
                                            </div>
                                        )}
                                        {selectedDetail.specialization && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Wrench size={18} color="#ea580c" />
                                                <span style={{ color: '#c2410c', fontWeight: 600 }}>
                                                    Specialization: {selectedDetail.specialization}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin Response if exists */}
                            {selectedDetail.adminResponse && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1.5rem',
                                    background: '#eff6ff',
                                    borderRadius: '16px',
                                    borderLeft: '4px solid #3b82f6'
                                }}>
                                    <h3 style={{
                                        margin: '0 0 0.75rem 0',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#3b82f6',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Admin Response
                                    </h3>
                                    <p style={{
                                        margin: 0,
                                        color: '#1e40af',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.7',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {selectedDetail.adminResponse}
                                    </p>
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
                                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
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

export default MaintainerDashboard;
