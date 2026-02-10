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
        priority: 'medium',
        requestType: 'Tool Request'
    });
    const [submitting, setSubmitting] = useState(false);

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

            const [statsRes, requestsRes, workOrdersRes] = await Promise.all([
                axios.get(`${API_URL}/api/maintainer/stats`, config),
                axios.get(`${API_URL}/api/maintainer/requests`, config),
                axios.get(`${API_URL}/api/maintainer/work-orders`, config)
            ]);

            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (requestsRes.data.success) setRequests(requestsRes.data.requests);
            if (workOrdersRes.data.success) setWorkOrders(workOrdersRes.data.workOrders);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data', 'error');
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
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/maintainer/requests`,
                requestForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                showNotification('Request submitted successfully', 'success');
                setShowRequestModal(false);
                setRequestForm({ subject: '', message: '', priority: 'medium', requestType: 'Tool Request' });
                fetchData();
            }
        } catch (error) {
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
                        { id: 'requests', label: 'My Requests', icon: FileText },
                        { id: 'workOrders', label: 'Work Orders', icon: MessageSquare }
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
                                transition: 'all 0.3s', textAlign: 'left'
                            }}>
                                <Icon size={20} />
                                {item.label}
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
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                                                    {request.message}
                                                </p>
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
                                            <span>Priority: <strong>{request.priority}</strong></span>
                                            <span>•</span>
                                            <span>Submitted: {request.submittedOn}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Work Orders Tab */}
                {activeTab === 'workOrders' && (
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#1e293b' }}>
                            Assigned Work Orders
                        </h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {workOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
                                    <MessageSquare size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>No work orders yet</p>
                                    <p style={{ color: '#94a3b8' }}>Work orders from admin will appear here</p>
                                </div>
                            ) : (
                                workOrders.map(workOrder => (
                                    <div key={workOrder._id} style={{
                                        background: 'white', padding: '1.5rem', borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>
                                                    {workOrder.subject}
                                                </h3>
                                                <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                                                    {workOrder.message}
                                                </p>
                                                {workOrder.adminResponse && (
                                                    <div style={{
                                                        background: '#f1f5f9', padding: '1rem', borderRadius: '8px',
                                                        borderLeft: '4px solid #3b82f6', marginTop: '1rem'
                                                    }}>
                                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6' }}>
                                                            Admin Response:
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
                                                            {workOrder.adminResponse}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <span style={{
                                                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem',
                                                fontWeight: 600, textTransform: 'uppercase', marginLeft: '1rem',
                                                background: workOrder.status === 'resolved' ? '#dcfce7' : 
                                                           workOrder.status === 'in-progress' ? '#dbeafe' : '#fef3c7',
                                                color: workOrder.status === 'resolved' ? '#166534' : 
                                                       workOrder.status === 'in-progress' ? '#1e40af' : '#92400e'
                                            }}>
                                                {workOrder.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                                            <span>Priority: <strong>{workOrder.priority}</strong></span>
                                            <span>•</span>
                                            <span>Assigned: {workOrder.submittedOn}</span>
                                            {workOrder.blockId && (
                                                <>
                                                    <span>•</span>
                                                    <span>Block: <strong>{workOrder.blockId}</strong></span>
                                                </>
                                            )}
                                        </div>
                                        {workOrder.status !== 'resolved' && (
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                {workOrder.status === 'pending' && (
                                                    <button onClick={() => handleUpdateWorkOrder(workOrder._id, 'in-progress')} style={{
                                                        padding: '0.5rem 1rem', background: '#3b82f6', color: 'white',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                        fontSize: '0.875rem', fontWeight: 600
                                                    }}>
                                                        Start Work
                                                    </button>
                                                )}
                                                {workOrder.status === 'in-progress' && (
                                                    <button onClick={() => handleUpdateWorkOrder(workOrder._id, 'resolved')} style={{
                                                        padding: '0.5rem 1rem', background: '#10b981', color: 'white',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                        fontSize: '0.875rem', fontWeight: 600
                                                    }}>
                                                        Mark as Resolved
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
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
                                    Priority
                                </label>
                                <select
                                    value={requestForm.priority}
                                    onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
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

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MaintainerDashboard;
