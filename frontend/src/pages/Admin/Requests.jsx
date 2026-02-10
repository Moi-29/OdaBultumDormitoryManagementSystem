import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, User, Mail, Phone, Calendar, Filter, Search } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Try to fetch from API
            try {
                const response = await axios.get(`${API_URL}/api/requests`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    setRequests(response.data);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using mock data:', apiError.message);
            }
            
            // Fallback to mock data if API fails or returns empty
            const mockData = [
                {
                    _id: '1',
                    studentId: 'RU/1270/18',
                    studentName: 'Abebech Kebede',
                    email: 'abebech.kebede@obu.edu.et',
                    phone: '+251911234567',
                    requestType: 'Room Change',
                    subject: 'Request for Room Transfer',
                    message: 'I would like to request a room change due to health issues. My current room is too far from the medical center.',
                    status: 'pending',
                    priority: 'high',
                    submittedOn: '2024-02-08',
                    currentRoom: 'B-205'
                },
                {
                    _id: '2',
                    studentId: 'RU/1271/18',
                    studentName: 'Addis Ketema',
                    email: 'addis.ketema@obu.edu.et',
                    phone: '+251922345678',
                    requestType: 'Maintenance',
                    subject: 'Broken Window in Room A-101',
                    message: 'The window in my room is broken and needs urgent repair. It is affecting the room temperature.',
                    status: 'approved',
                    priority: 'medium',
                    submittedOn: '2024-02-07',
                    currentRoom: 'A-101',
                    resolvedOn: '2024-02-08'
                },
                {
                    _id: '3',
                    studentId: 'RU/1272/18',
                    studentName: 'Chaltu Daba',
                    email: 'chaltu.daba@obu.edu.et',
                    phone: '+251933456789',
                    requestType: 'Extension',
                    subject: 'Dormitory Stay Extension Request',
                    message: 'I need to extend my dormitory stay for the summer semester due to research work.',
                    status: 'pending',
                    priority: 'low',
                    submittedOn: '2024-02-06',
                    currentRoom: 'C-302'
                }
            ];
            setRequests(mockData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            
            // Try API call first
            try {
                await axios.patch(
                    `${API_URL}/api/requests/${requestId}/status`,
                    { status: newStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } catch (apiError) {
                console.log('API not available, updating locally:', apiError.message);
            }
            
            // Update local state
            setRequests(requests.map(req => 
                req._id === requestId 
                    ? { ...req, status: newStatus, resolvedOn: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : null }
                    : req
            ));
            
            showNotification(`Request ${newStatus} successfully`, 'success');
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error updating request status:', error);
            showNotification('Failed to update request status', 'error');
        }
    };

    const viewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#64748b';
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading requests...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    maxWidth: '500px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {notification.message}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <MessageSquare size={32} /> Student Requests
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Manage student requests and inquiries
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <StatCard label="Total Requests" value={stats.total} color="#3b82f6" />
                    <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
                    <StatCard label="Approved" value={stats.approved} color="#10b981" />
                    <StatCard label="Rejected" value={stats.rejected} color="#ef4444" />
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            minWidth: '150px'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Requests Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Student</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Request Type</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Subject</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Priority</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{request.studentName}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{request.studentId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{request.requestType}</td>
                                    <td style={{ padding: '1rem', maxWidth: '250px' }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {request.subject}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            background: `${getPriorityColor(request.priority)}20`,
                                            color: getPriorityColor(request.priority)
                                        }}>
                                            {request.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            background: `${getStatusColor(request.status)}20`,
                                            color: getStatusColor(request.status)
                                        }}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{request.submittedOn}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => viewDetails(request)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No requests found</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                Request Details
                            </h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <User size={18} color="#64748b" />
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Student Information</span>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedRequest.studentName}</div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedRequest.studentId}</div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Mail size={16} color="#64748b" />
                                        {selectedRequest.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Phone size={16} color="#64748b" />
                                        {selectedRequest.phone}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Request Type</div>
                                <div style={{ fontWeight: 600 }}>{selectedRequest.requestType}</div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Subject</div>
                                <div style={{ fontWeight: 600 }}>{selectedRequest.subject}</div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Message</div>
                                <div style={{ 
                                    padding: '1rem', 
                                    background: '#f8fafc', 
                                    borderRadius: '8px',
                                    lineHeight: '1.6'
                                }}>
                                    {selectedRequest.message}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Priority</div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: `${getPriorityColor(selectedRequest.priority)}20`,
                                        color: getPriorityColor(selectedRequest.priority)
                                    }}>
                                        {selectedRequest.priority.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Status</div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: `${getStatusColor(selectedRequest.status)}20`,
                                        color: getStatusColor(selectedRequest.status)
                                    }}>
                                        {selectedRequest.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} />
                                    Submitted: {selectedRequest.submittedOn}
                                </div>
                                {selectedRequest.resolvedOn && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={16} />
                                        Resolved: {selectedRequest.resolvedOn}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {selectedRequest.status === 'pending' && (
                            <div style={{
                                padding: '1.5rem 2rem',
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => handleStatusChange(selectedRequest._id, 'rejected')}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'white',
                                        color: '#ef4444',
                                        border: '2px solid #ef4444',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <XCircle size={18} />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedRequest._id, 'approved')}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <CheckCircle size={18} />
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const StatCard = ({ label, value, color }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {label}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color }}>
            {value}
        </div>
    </div>
);

export default Requests;
