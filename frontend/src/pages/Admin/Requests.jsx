import { useState, useEffect } from 'react';
import { 
    MessageSquare, Users, Wrench, Building2, Send, X, 
    CheckCircle, XCircle, Clock, Search, Paperclip
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Requests = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [studentRequests, setStudentRequests] = useState([]);
    const [proctorRequests, setProctorRequests] = useState([]);
    const [maintainerRequests, setMaintainerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const response = await axios.get(`${API_URL}/api/requests`, config);
            const allRequests = response.data;
            
            const students = [];
            const proctors = [];
            const maintainers = [];
            
            allRequests.forEach(request => {
                const requestWithType = {
                    ...request,
                    type: request.fromUserModel?.toLowerCase() || 'student',
                    studentName: request.studentName || request.fromUserName,
                    proctorName: request.fromUserModel === 'Proctor' ? request.fromUserName : undefined,
                    maintainerName: request.fromUserModel === 'Maintainer' ? request.fromUserName : undefined,
                    submittedOn: request.submittedOn || new Date(request.createdAt).toISOString().split('T')[0]
                };
                
                if (request.fromUserModel === 'Student') {
                    students.push(requestWithType);
                } else if (request.fromUserModel === 'Proctor') {
                    proctors.push(requestWithType);
                } else if (request.fromUserModel === 'Maintainer') {
                    maintainers.push(requestWithType);
                }
            });
            
            setStudentRequests(students);
            setProctorRequests(proctors);
            setMaintainerRequests(maintainers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            showNotification('Failed to load requests', 'error');
            setLoading(false);
        }
    };

    const getCurrentRequests = () => {
        switch (activeTab) {
            case 'students': return studentRequests;
            case 'proctors': return proctorRequests;
            case 'maintainers': return maintainerRequests;
            default: return [];
        }
    };

    const getFilteredRequests = () => {
        const requests = getCurrentRequests();
        if (!searchQuery.trim()) return requests;
        
        const query = searchQuery.toLowerCase();
        return requests.filter(req => 
            (req.studentName || req.proctorName || req.maintainerName || '').toLowerCase().includes(query) ||
            (req.subject || '').toLowerCase().includes(query) ||
            (req.message || '').toLowerCase().includes(query)
        );
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await axios.patch(`${API_URL}/api/requests/${requestId}/status`, { status: newStatus }, config);
            
            const requests = getCurrentRequests();
            const updatedRequests = requests.map(req => 
                req._id === requestId ? { ...req, status: newStatus } : req
            );
            
            if (activeTab === 'students') setStudentRequests(updatedRequests);
            else if (activeTab === 'proctors') setProctorRequests(updatedRequests);
            else setMaintainerRequests(updatedRequests);
            
            if (selectedRequest?._id === requestId) {
                setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
            
            showNotification(`Request ${newStatus} successfully`, 'success');
        } catch (error) {
            console.error('Error updating request status:', error);
            showNotification('Failed to update request status', 'error');
        }
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        showNotification('Message sent successfully', 'success');
        setChatMessage('');
    };

    const getTabColor = () => {
        switch (activeTab) {
            case 'students': return '#3b82f6';
            case 'proctors': return '#8b5cf6';
            case 'maintainers': return '#f97316';
            default: return '#3b82f6';
        }
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b' }}>Loading...</div>
                </div>
            </div>
        );
    }

    const filteredRequests = getFilteredRequests();

    return (
        <div style={{ height: '100vh', background: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Notification */}
            {notification && (
                <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10001, minWidth: '320px', background: notification.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', padding: '1rem 1.25rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'slideInRight 0.3s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem' }}>{notification.message}</div>
                        <button onClick={() => setNotification(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Top Tabs */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '1400px', margin: '0 auto' }}>
                    {[
                        { id: 'students', label: 'Student Reports', icon: Users, count: studentRequests.length, color: '#3b82f6' },
                        { id: 'proctors', label: 'Proctor Requests', icon: Building2, count: proctorRequests.length, color: '#8b5cf6' },
                        { id: 'maintainers', label: 'Maintainer Requests', icon: Wrench, count: maintainerRequests.length, color: '#f97316' }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedRequest(null); }} style={{ flex: 1, padding: '0.875rem 1.25rem', background: isActive ? 'white' : 'transparent', border: isActive ? `2px solid ${tab.color}` : '2px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${tab.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} color={tab.color} strokeWidth={2.5} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>{tab.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tab.count} {tab.count === 1 ? 'Request' : 'Requests'}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Interface */}
            <div style={{ flex: 1, display: 'flex', maxWidth: '1400px', width: '100%', margin: '0 auto', overflow: 'hidden' }}>
                {/* Conversations List */}
                <div style={{ width: selectedRequest ? '380px' : '100%', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: 'white', transition: 'width 0.3s' }}>
                    {/* Search Bar */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                                onFocus={(e) => e.target.style.borderColor = getTabColor()}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Conversations */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredRequests.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                                <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: '#94a3b8' }} />
                                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>No requests found</p>
                            </div>
                        ) : (
                            filteredRequests.map(request => {
                                const isSelected = selectedRequest?._id === request._id;
                                const name = request.studentName || request.proctorName || request.maintainerName || 'Unknown';
                                return (
                                    <div
                                        key={request._id}
                                        onClick={() => setSelectedRequest(request)}
                                        style={{
                                            padding: '1rem 1.25rem',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: isSelected ? '#f8fafc' : 'white',
                                            transition: 'background 0.2s',
                                            display: 'flex',
                                            gap: '0.875rem',
                                            alignItems: 'start'
                                        }}
                                        onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = '#fafbfc')}
                                        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'white')}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${getTabColor()} 0%, ${getTabColor()}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', flexShrink: 0, marginLeft: '0.5rem' }}>{formatTime(request.createdAt || request.submittedOn)}</div>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.375rem' }}>{request.subject}</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span style={{ padding: '0.125rem 0.5rem', background: request.status === 'pending' ? '#fef3c7' : request.status === 'approved' ? '#dcfce7' : '#fee2e2', color: request.status === 'pending' ? '#92400e' : request.status === 'approved' ? '#166534' : '#991b1b', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                    {request.status}
                                                </span>
                                                <span style={{ padding: '0.125rem 0.5rem', background: `${getTabColor()}15`, color: getTabColor(), borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                                                    {request.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                {selectedRequest && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                        {/* Chat Header */}
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', background: 'white' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${getTabColor()} 0%, ${getTabColor()}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                                {(selectedRequest.studentName || selectedRequest.proctorName || selectedRequest.maintainerName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                                    {selectedRequest.studentName || selectedRequest.proctorName || selectedRequest.maintainerName}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {selectedRequest.studentId || selectedRequest.blockId || selectedRequest.specialization}
                                </div>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f8fafc' }}>
                            {/* Request Details Card */}
                            <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <Clock size={14} color="#64748b" />
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedRequest.submittedOn}</span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', marginBottom: '0.75rem' }}>{selectedRequest.subject}</div>
                                <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>{selectedRequest.message}</div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ padding: '0.375rem 0.75rem', background: `${getTabColor()}10`, color: getTabColor(), borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {selectedRequest.requestType}
                                    </span>
                                    <span style={{ padding: '0.375rem 0.75rem', background: selectedRequest.priority === 'urgent' ? '#fee2e2' : selectedRequest.priority === 'high' ? '#fef3c7' : '#dbeafe', color: selectedRequest.priority === 'urgent' ? '#991b1b' : selectedRequest.priority === 'high' ? '#92400e' : '#1e40af', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {selectedRequest.priority}
                                    </span>
                                </div>
                            </div>

                            {/* Admin Response Section */}
                            {selectedRequest.type !== 'student' && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1rem' }}>Chat History</div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                                        <div style={{ maxWidth: '70%', background: getTabColor(), color: 'white', padding: '0.75rem 1rem', borderRadius: '12px 12px 2px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Sample admin response message</div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.25rem', textAlign: 'right' }}>2:45 PM</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                            {selectedRequest.type === 'student' ? (
                                <div>
                                    <div style={{ padding: '0.875rem', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                                        📋 Student reports are view-only. Use approve/reject actions below.
                                    </div>
                                    {selectedRequest.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}>
                                                <XCircle size={18} />
                                                Reject
                                            </button>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'approved')} style={{ flex: 1, padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#059669'} onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}>
                                                <CheckCircle size={18} />
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <button style={{ padding: '0.625rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                                            <Paperclip size={18} />
                                        </button>
                                        <input
                                            type="text"
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                                            onFocus={(e) => e.target.style.borderColor = getTabColor()}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                        <button onClick={handleSendMessage} disabled={!chatMessage.trim()} style={{ padding: '0.75rem 1.25rem', background: chatMessage.trim() ? getTabColor() : '#e2e8f0', color: chatMessage.trim() ? 'white' : '#94a3b8', border: 'none', borderRadius: '10px', cursor: chatMessage.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    {selectedRequest.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} style={{ flex: 1, padding: '0.625rem', background: 'white', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}>
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'approved')} style={{ flex: 1, padding: '0.625rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#059669'} onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}>
                                                <CheckCircle size={16} />
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

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

export default Requests;
