import { useState, useEffect } from 'react';
import { 
    MessageSquare, Users, Wrench, Building2, Send, X, Eye, 
    CheckCircle, XCircle, Clock, Calendar, Mail, Phone, Trash2
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
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
            
            // Categorize requests by sender type
            const students = [];
            const proctors = [];
            const maintainers = [];
            
            allRequests.forEach(request => {
                // Determine request type based on fromUserModel
                const requestWithType = {
                    ...request,
                    type: request.fromUserModel?.toLowerCase() || 'student',
                    // Map fields for consistency
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
            showNotification('Failed to load requests. Using offline mode.', 'error');
            
            // Fallback to mock data if API fails
            const mockStudentRequests = [
                {
                    _id: '1',
                    studentId: 'RU/1270/18',
                    studentName: 'Abebech Kebede',
                    email: 'abebech.kebede@obu.edu.et',
                    phone: '+251911234567',
                    requestType: 'Room Change',
                    subject: 'Request for Room Transfer',
                    message: 'I would like to request a room change due to health issues.',
                    status: 'pending',
                    priority: 'high',
                    submittedOn: '2024-02-08',
                    currentRoom: 'B-205',
                    type: 'student'
                }
            ];

            const mockProctorRequests = [
                {
                    _id: '2',
                    proctorName: 'John Doe',
                    blockId: 'Block A',
                    email: 'john.doe@obu.edu.et',
                    phone: '+251922345678',
                    requestType: 'Maintenance',
                    subject: 'Urgent Repair Needed',
                    message: 'Multiple rooms need immediate attention.',
                    status: 'pending',
                    priority: 'urgent',
                    submittedOn: '2024-02-09',
                    type: 'proctor'
                }
            ];

            const mockMaintainerRequests = [
                {
                    _id: '3',
                    maintainerName: 'David Martinez',
                    specialization: 'Plumbing',
                    email: 'david.martinez@obu.edu.et',
                    phone: '+251933456789',
                    requestType: 'Tool Request',
                    subject: 'Need Additional Tools',
                    message: 'Requesting specialized plumbing tools for upcoming repairs.',
                    status: 'pending',
                    priority: 'medium',
                    submittedOn: '2024-02-10',
                    type: 'maintainer'
                }
            ];

            setStudentRequests(mockStudentRequests);
            setProctorRequests(mockProctorRequests);
            setMaintainerRequests(mockMaintainerRequests);
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

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Update in database
            await axios.patch(`${API_URL}/api/requests/${requestId}/status`, { status: newStatus }, config);
            
            // Update local state
            const requests = getCurrentRequests();
            const updatedRequests = requests.map(req => 
                req._id === requestId ? { ...req, status: newStatus } : req
            );
            
            if (activeTab === 'students') setStudentRequests(updatedRequests);
            else if (activeTab === 'proctors') setProctorRequests(updatedRequests);
            else setMaintainerRequests(updatedRequests);
            
            // Update selected request
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
        
        const newMessage = {
            id: Date.now(),
            sender: 'admin',
            message: chatMessage,
            timestamp: new Date().toLocaleTimeString()
        };
        
        setChatHistory([...chatHistory, newMessage]);
        setChatMessage('');
        showNotification('Message sent successfully', 'success');
    };

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        setChatHistory([]);
    };

    const getFilteredRequests = () => {
        const requests = getCurrentRequests();
        if (!searchQuery.trim()) return requests;
        
        const query = searchQuery.toLowerCase();
        return requests.filter(req => 
            (req.studentName || req.proctorName || req.maintainerName || '').toLowerCase().includes(query) ||
            (req.subject || '').toLowerCase().includes(query) ||
            (req.message || '').toLowerCase().includes(query) ||
            (req.email || '').toLowerCase().includes(query)
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>Loading requests...</div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'students', label: 'Student Reports', icon: Users, count: studentRequests.length, color: '#3b82f6' },
        { id: 'proctors', label: 'Proctor Requests', icon: Building2, count: proctorRequests.length, color: '#8b5cf6' },
        { id: 'maintainers', label: 'Maintainer Requests', icon: Wrench, count: maintainerRequests.length, color: '#f97316' }
    ];

    const currentRequests = getCurrentRequests();

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '2rem' }}>
            {/* Notification */}
            {notification && (
                <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 10001, minWidth: '350px', background: notification.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', padding: '1.25rem 1.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'slideInRight 0.5s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, fontWeight: 600 }}>{notification.message}</div>
                        <button onClick={() => setNotification(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', padding: '2.5rem 3rem', borderRadius: '24px', boxShadow: '0 20px 60px rgba(30, 64, 175, 0.3)', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
                            <MessageSquare size={36} color="white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                                Requests & Reports
                            </h1>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
                                Manage all incoming requests with real-time chat support
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedRequests([]); setSelectAll(false); }} style={{ flex: '1 1 300px', padding: '1.5rem 2rem', background: isActive ? 'white' : 'rgba(255,255,255,0.7)', border: isActive ? `3px solid ${tab.color}` : '3px solid transparent', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: isActive ? `0 12px 40px ${tab.color}40` : '0 4px 12px rgba(0,0,0,0.08)', transform: isActive ? 'translateY(-4px)' : 'translateY(0)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '56px', height: '56px', background: `${tab.color}15`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={28} color={tab.color} strokeWidth={2.5} />
                                </div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{tab.label}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{tab.count} {tab.count === 1 ? 'Request' : 'Requests'}</div>
                                </div>
                                {tab.count > 0 && (
                                    <div style={{ width: '40px', height: '40px', background: tab.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {tab.count}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Bulk Actions */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem 2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#3b82f6' }} />
                    Select All
                    {selectedRequests.length > 0 && (
                        <span style={{ padding: '0.5rem 1rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700 }}>
                            {selectedRequests.length} selected
                        </span>
                    )}
                </label>
                <button onClick={handleDeleteSelected} disabled={selectedRequests.length === 0 || deleting} style={{ padding: '0.875rem 1.5rem', background: selectedRequests.length === 0 || deleting ? '#e2e8f0' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: selectedRequests.length === 0 || deleting ? '#94a3b8' : 'white', border: 'none', borderRadius: '14px', cursor: selectedRequests.length === 0 || deleting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: selectedRequests.length > 0 && !deleting ? '0 4px 16px rgba(239, 68, 68, 0.3)' : 'none', transition: 'all 0.3s' }}>
                    <Trash2 size={18} />
                    {deleting ? 'Deleting...' : 'Delete Selected'}
                </button>
            </div>

            {/* Requests List */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: showChatPanel ? '0 0 55%' : '1', transition: 'all 0.4s' }}>
                    {currentRequests.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <MessageSquare size={80} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                            <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#64748b', margin: '0 0 0.5rem 0' }}>No requests found</p>
                            <p style={{ color: '#94a3b8', margin: 0 }}>Requests will appear here when submitted</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {currentRequests.map(request => (
                                <div key={request._id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                                        <input type="checkbox" checked={selectedRequests.includes(request._id)} onChange={() => handleSelectRequest(request._id)} onClick={(e) => e.stopPropagation()} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#3b82f6', marginTop: '0.25rem' }} />
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.3rem', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)', flexShrink: 0 }}>
                                            {(request.studentName || request.proctorName || request.maintainerName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                                                    {request.studentName || request.proctorName || request.maintainerName || 'Unknown'}
                                                </h3>
                                                <span style={{ padding: '0.35rem 0.85rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    {request.requestType}
                                                </span>
                                                <PriorityBadge priority={request.priority} />
                                                <StatusBadge status={request.status} />
                                            </div>
                                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                                                {request.studentId || request.blockId || request.specialization} • {request.email}
                                            </p>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
                                                {request.subject}
                                            </p>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
                                                {request.message}
                                            </p>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                                    <Calendar size={14} />
                                                    {request.submittedOn}
                                                </div>
                                                <button onClick={() => handleViewRequest(request)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'; }}>
                                                    <Eye size={16} />
                                                    View & Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat/View Panel */}
                {showChatPanel && selectedRequest && (
                    <div style={{ flex: '0 0 42%', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '800px', animation: 'slideInRight 0.4s ease-out', position: 'sticky', top: '2rem' }}>
                        {/* Header */}
                        <div style={{ background: selectedRequest.type === 'student' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : selectedRequest.type === 'proctor' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: '1.5rem 2rem', borderRadius: '24px 24px 0 0', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', border: '3px solid white' }}>
                                        {(selectedRequest.studentName || selectedRequest.proctorName || selectedRequest.maintainerName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                                            {selectedRequest.studentName || selectedRequest.proctorName || selectedRequest.maintainerName}
                                        </h3>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                                            {selectedRequest.studentId || selectedRequest.blockId || selectedRequest.specialization}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChatPanel(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={14} />
                                    {selectedRequest.email}
                                </div>
                                {selectedRequest.phone && (
                                    <>
                                        <span>•</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={14} />
                                            {selectedRequest.phone}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Request Details */}
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Subject</div>
                                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>{selectedRequest.subject}</div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Message</div>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', lineHeight: '1.6', color: '#475569', fontSize: '0.95rem' }}>
                                    {selectedRequest.message}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Priority</div>
                                    <PriorityBadge priority={selectedRequest.priority} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                                    <StatusBadge status={selectedRequest.status} />
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages (Only for Proctor and Maintainer) */}
                        {selectedRequest.type !== 'student' && (
                            <>
                                <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {chatHistory.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                            <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        chatHistory.map(msg => (
                                            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                                                <div style={{ maxWidth: '75%', padding: '1rem 1.25rem', borderRadius: msg.sender === 'admin' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.sender === 'admin' ? (selectedRequest.type === 'proctor' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)') : 'white', color: msg.sender === 'admin' ? 'white' : '#1e293b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                    <div style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '0.5rem' }}>{msg.message}</div>
                                                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{msg.timestamp}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Chat Input (Only for Proctor and Maintainer) */}
                                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 24px 24px' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." style={{ flex: 1, padding: '1rem 1.25rem', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderColor = selectedRequest.type === 'proctor' ? '#8b5cf6' : '#f97316'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                                        <button onClick={handleSendMessage} disabled={!chatMessage.trim()} style={{ padding: '1rem 1.5rem', background: chatMessage.trim() ? (selectedRequest.type === 'proctor' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)') : '#e2e8f0', color: chatMessage.trim() ? 'white' : '#94a3b8', border: 'none', borderRadius: '14px', cursor: chatMessage.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: chatMessage.trim() ? (selectedRequest.type === 'proctor' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 4px 12px rgba(249, 115, 22, 0.3)') : 'none', transition: 'all 0.3s' }}>
                                            <Send size={18} />
                                            Send
                                        </button>
                                    </div>
                                    {selectedRequest.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} style={{ flex: 1, padding: '0.875rem', background: 'white', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}>
                                                <XCircle size={18} />
                                                Reject
                                            </button>
                                            <button onClick={() => handleStatusChange(selectedRequest._id, 'approved')} style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'; }}>
                                                <CheckCircle size={18} />
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* View Only Footer (For Student Reports) */}
                        {selectedRequest.type === 'student' && (
                            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 24px 24px' }}>
                                {selectedRequest.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} style={{ flex: 1, padding: '0.875rem', background: 'white', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}>
                                            <XCircle size={18} />
                                            Reject
                                        </button>
                                        <button onClick={() => handleStatusChange(selectedRequest._id, 'approved')} style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'; }}>
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                    </div>
                                )}
                                <div style={{ marginTop: selectedRequest.status === 'pending' ? '1rem' : '0', padding: '1rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    📋 Student reports are view-only. Use approve/reject actions to respond.
                                </div>
                            </div>
                        )}
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

const PriorityBadge = ({ priority }) => {
    const colors = {
        urgent: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
        high: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
        medium: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
        low: { bg: '#dcfce7', color: '#166534', border: '#10b981' }
    };
    const style = colors[priority] || colors.medium;
    
    return (
        <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, background: style.bg, color: style.color, border: `2px solid ${style.border}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block' }}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        pending: { bg: '#fef3c7', color: '#92400e', icon: <Clock size={14} /> },
        approved: { bg: '#dcfce7', color: '#166534', icon: <CheckCircle size={14} /> },
        rejected: { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={14} /> }
    };
    const style = colors[status] || colors.pending;
    
    return (
        <span style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, background: style.bg, color: style.color, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {style.icon}
            {status}
        </span>
    );
};

export default Requests;
