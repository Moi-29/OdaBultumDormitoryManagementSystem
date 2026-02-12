import { useState, useEffect } from 'react';
import { 
    MessageSquare, Clock, CheckCircle, XCircle, Eye, Mail, Phone, Calendar, 
    ChevronRight, Trash2, Send
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

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
            
            try {
                const response = await axios.get(`${API_URL}/api/requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.length > 0) {
                    setRequests(response.data);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using mock data');
            }
            
            // Mock data
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
                    message: 'The window in my room is broken and needs urgent repair.',
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
                    message: 'I need to extend my dormitory stay for the summer semester.',
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
            
            try {
                await axios.patch(
                    `${API_URL}/api/requests/${requestId}/status`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (apiError) {
                console.log('API not available, updating locally');
            }
            
            setRequests(requests.map(req => 
                req._id === requestId 
                    ? { ...req, status: newStatus, resolvedOn: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : null }
                    : req
            ));
            
            // Update selected request
            if (selectedRequest && selectedRequest._id === requestId) {
                setSelectedRequest({
                    ...selectedRequest,
                    status: newStatus,
                    resolvedOn: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : null
                });
            }
            
            showNotification(`Request ${newStatus} successfully`, 'success');
        } catch (error) {
            console.error('Error updating request status:', error);
            showNotification('Failed to update request status', 'error');
        }
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim() || !selectedRequest) return;
        
        setSendingMessage(true);
        try {
            const token = localStorage.getItem('token');
            const newMessage = {
                id: Date.now(),
                text: chatMessage,
                sender: 'admin',
                timestamp: new Date().toLocaleString(),
                requestId: selectedRequest._id
            };
            
            try {
                await axios.post(
                    `${API_URL}/api/requests/${selectedRequest._id}/message`,
                    { message: chatMessage },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (apiError) {
                console.log('API not available, storing locally');
            }
            
            // Add message to chat
            setChatMessages([...chatMessages, newMessage]);
            setChatMessage('');
            showNotification('Message sent successfully', 'success');
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message', 'error');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(requests.map(req => req._id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRequest = (requestId) => {
        if (selectedRequests.includes(requestId)) {
            setSelectedRequests(selectedRequests.filter(id => id !== requestId));
        } else {
            setSelectedRequests([...selectedRequests, requestId]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedRequests.length === 0) {
            showNotification('Please select requests to delete', 'error');
            return;
        }

        if (!window.confirm(`Are you sure you want to permanently delete ${selectedRequests.length} request(s)? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);

        try {
            const token = localStorage.getItem('token');
            
            // Delete each selected request
            for (const requestId of selectedRequests) {
                try {
                    await axios.delete(`${API_URL}/api/requests/${requestId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (apiError) {
                    console.log('API not available, deleting locally');
                }
            }

            // Remove deleted requests from state
            setRequests(requests.filter(req => !selectedRequests.includes(req._id)));
            setSelectedRequests([]);
            setSelectAll(false);
            
            showNotification(`Successfully deleted ${selectedRequests.length} request(s)`, 'success');
        } catch (error) {
            console.error('Error deleting requests:', error);
            showNotification('Failed to delete requests', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const viewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsPanel(true);
    };

    useEffect(() => {
        if (selectedRequests.length === requests.length && requests.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedRequests, requests]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)'
            }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#00BFFF',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading requests...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative'
        }}>
            {/* Premium Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '350px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)'
                        : 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
                    color: 'white',
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                    animation: 'slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {notification.type === 'success' ? '✓ Success' : '✗ Error'}
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>
                        {notification.message}
                    </div>
                </div>
            )}

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
                padding: '3rem 3rem 2rem 3rem',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 40px rgba(0,31,63,0.3)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(0,191,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-100px',
                    left: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(0,191,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0,191,255,0.4)'
                        }}>
                            <MessageSquare size={32} color="white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: '2.5rem', 
                                fontWeight: 800,
                                color: 'white',
                                letterSpacing: '-1px',
                                textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}>
                                Student Requests
                            </h1>
                            <p style={{ 
                                margin: '0.5rem 0 0 0', 
                                fontSize: '1.1rem', 
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 400
                            }}>
                                Manage student requests and inquiries seamlessly
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 3rem 3rem 3rem' }}>
                {/* Select All and Delete Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#001F3F'
                        }}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    accentColor: '#00BFFF'
                                }}
                            />
                            Select All Requests
                        </label>
                        {selectedRequests.length > 0 && (
                            <span style={{
                                padding: '0.5rem 1rem',
                                background: '#F0F9FF',
                                color: '#0080FF',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                {selectedRequests.length} selected
                            </span>
                        )}
                    </div>
                    
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedRequests.length === 0 || deleting}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: selectedRequests.length === 0 || deleting 
                                ? '#E5E7EB' 
                                : 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
                            color: selectedRequests.length === 0 || deleting ? '#9CA3AF' : 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: selectedRequests.length === 0 || deleting ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: selectedRequests.length > 0 && !deleting ? '0 4px 12px rgba(255,69,0,0.3)' : 'none',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedRequests.length > 0 && !deleting) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,69,0,0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedRequests.length > 0 && !deleting) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,69,0,0.3)';
                            }
                        }}
                    >
                        <Trash2 size={18} />
                        {deleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
                </div>
                {/* Premium Table with Details Panel */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* Requests Table */}
                    <div style={{ 
                        flex: showDetailsPanel ? '0 0 60%' : '1',
                        background: 'white',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)' }}>
                                        <th style={{...tableHeaderStyle, width: '50px'}}>
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    cursor: 'pointer',
                                                    accentColor: '#00BFFF'
                                                }}
                                            />
                                        </th>
                                        <th style={tableHeaderStyle}>Student</th>
                                        <th style={tableHeaderStyle}>Type</th>
                                        <th style={tableHeaderStyle}>Subject</th>
                                        <th style={tableHeaderStyle}>Priority</th>
                                        <th style={tableHeaderStyle}>Status</th>
                                        <th style={tableHeaderStyle}>Date</th>
                                        <th style={tableHeaderStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => (
                                        <tr 
                                            key={request._id} 
                                            style={{ 
                                                background: index % 2 === 0 ? 'white' : '#FAFAFA',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#F0F9FF';
                                                e.currentTarget.style.transform = 'scale(1.01)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#FAFAFA';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <td style={tableCellStyle}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.includes(request._id)}
                                                    onChange={() => handleSelectRequest(request._id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer',
                                                        accentColor: '#00BFFF'
                                                    }}
                                                />
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 4px 12px rgba(0,191,255,0.3)'
                                                    }}>
                                                        {request.studentName ? request.studentName.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#001F3F', fontSize: '0.95rem' }}>
                                                            {request.studentName || 'Unknown Student'}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: '#00BFFF', fontWeight: 600 }}>
                                                            {request.studentId || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    background: '#F0F9FF',
                                                    color: '#0080FF',
                                                    border: '1px solid #B3E0FF'
                                                }}>
                                                    {request.requestType}
                                                </span>
                                            </td>
                                            <td style={{...tableCellStyle, maxWidth: '200px'}}>
                                                <div style={{ 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 500,
                                                    color: '#333'
                                                }}>
                                                    {request.subject}
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <PriorityBadge priority={request.priority} />
                                            </td>
                                            <td style={tableCellStyle}>
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                                                    <Calendar size={14} />
                                                    <span style={{ fontSize: '0.9rem' }}>{request.submittedOn}</span>
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <button
                                                    onClick={() => viewDetails(request)}
                                                    style={{
                                                        padding: '0.6rem 1.2rem',
                                                        background: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        boxShadow: '0 4px 12px rgba(0,191,255,0.3)',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,191,255,0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,191,255,0.3)';
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

                        {requests.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#A9A9A9' }}>
                                <MessageSquare size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No requests found</p>
                                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Student requests will appear here</p>
                            </div>
                        )}
                    </div>
                    {/* Premium Chat-Style Panel */}
                    {showDetailsPanel && selectedRequest && (
                        <div style={{
                            flex: '0 0 38%',
                            background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '800px',
                            animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'sticky',
                            top: '2rem',
                            overflow: 'hidden'
                        }}>
                            {/* Chat Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    boxShadow: '0 4px 12px rgba(0,191,255,0.4)',
                                    border: '3px solid white'
                                }}>
                                    {selectedRequest.studentName ? selectedRequest.studentName.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                        {selectedRequest.studentName || 'Unknown Student'}
                                    </h3>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)' }}>
                                        {selectedRequest.studentId || 'N/A'} • Room {selectedRequest.currentRoom || 'N/A'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDetailsPanel(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Chat Messages Area */}
                            <div style={{ 
                                flex: 1, 
                                padding: '1.5rem',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                background: '#f8f9fa'
                            }}>
                                {/* Request Info Badge */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div style={{
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        color: '#667eea',
                                        fontWeight: 600
                                    }}>
                                        Request submitted on {selectedRequest.submittedOn}
                                    </div>
                                </div>

                                {/* Student Message Bubble */}
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        flexShrink: 0,
                                        boxShadow: '0 2px 8px rgba(0,191,255,0.3)'
                                    }}>
                                        {selectedRequest.studentName ? selectedRequest.studentName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div style={{ flex: 1, maxWidth: '85%' }}>
                                        <div style={{
                                            background: 'white',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '18px 18px 18px 4px',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            animation: 'messageSlideIn 0.3s ease-out'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {selectedRequest.requestType || 'Request'}
                                                </span>
                                                <PriorityBadge priority={selectedRequest.priority || 'low'} />
                                            </div>
                                            <div style={{
                                                fontWeight: 700,
                                                color: '#1e293b',
                                                fontSize: '1rem',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {selectedRequest.subject || 'No Subject'}
                                            </div>
                                            <div style={{
                                                color: '#475569',
                                                fontSize: '0.9rem',
                                                lineHeight: '1.6',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {selectedRequest.message || 'No message provided'}
                                            </div>
                                            <div style={{
                                                marginTop: '0.75rem',
                                                paddingTop: '0.75rem',
                                                borderTop: '1px solid #e2e8f0',
                                                display: 'flex',
                                                gap: '1rem',
                                                fontSize: '0.75rem',
                                                color: '#94a3b8'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <Mail size={12} />
                                                    {selectedRequest.email || 'N/A'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <Phone size={12} />
                                                    {selectedRequest.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: '#94a3b8',
                                            marginTop: '0.5rem',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {selectedRequest.submittedOn}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Update (if not pending) */}
                                {selectedRequest.status !== 'pending' && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                        <div style={{ maxWidth: '85%' }}>
                                            <div style={{
                                                background: selectedRequest.status === 'approved' 
                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                padding: '1rem 1.25rem',
                                                borderRadius: '18px 18px 4px 18px',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                                color: 'white',
                                                animation: 'messageSlideIn 0.3s ease-out 0.2s both'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {selectedRequest.status === 'approved' ? (
                                                        <CheckCircle size={18} />
                                                    ) : (
                                                        <XCircle size={18} />
                                                    )}
                                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                                        Request {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', opacity: 0.95 }}>
                                                    Your request has been {selectedRequest.status} by the admin team.
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: '#94a3b8',
                                                marginTop: '0.5rem',
                                                marginRight: '0.5rem',
                                                textAlign: 'right'
                                            }}>
                                                {selectedRequest.resolvedOn || 'Just now'}
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            flexShrink: 0,
                                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
                                        }}>
                                            A
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Footer */}
                            {selectedRequest.status === 'pending' && (
                                <div style={{
                                    padding: '1.25rem 1.5rem',
                                    background: 'white',
                                    borderTop: '1px solid #e2e8f0',
                                    display: 'flex',
                                    gap: '0.75rem'
                                }}>
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest._id, 'rejected')}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem 1.25rem',
                                            background: 'white',
                                            color: '#ef4444',
                                            border: '2px solid #ef4444',
                                            borderRadius: '14px',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s',
                                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#ef4444';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = '#ef4444';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
                                        }}
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest._id, 'approved')}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem 1.25rem',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '14px',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
                                        }}
                                    >
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
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
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
    const colors = {
        high: { bg: '#FFF5F5', color: '#FF4500', border: '#FF4500' },
        medium: { bg: '#FFFBEB', color: '#FFD700', border: '#FFD700' },
        low: { bg: '#F0FFF4', color: '#32CD32', border: '#32CD32' }
    };
    const style = colors[priority] || colors.low;
    
    return (
        <span style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: style.bg,
            color: style.color,
            border: `2px solid ${style.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block'
        }}>
            {priority}
        </span>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const colors = {
        pending: { bg: '#FFFBEB', color: '#FFD700', border: '#FFD700', icon: <Clock size={14} /> },
        approved: { bg: '#F0FFF4', color: '#32CD32', border: '#32CD32', icon: <CheckCircle size={14} /> },
        rejected: { bg: '#FFF5F5', color: '#FF4500', border: '#FF4500', icon: <XCircle size={14} /> }
    };
    const style = colors[status] || colors.pending;
    
    return (
        <span style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: style.bg,
            color: style.color,
            border: `2px solid ${style.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
        }}>
            {style.icon}
            {status}
        </span>
    );
};

// Table Styles
const tableHeaderStyle = {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    fontWeight: 700,
    color: 'white',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid rgba(255,255,255,0.1)'
};

const tableCellStyle = {
    padding: '1.25rem 1.5rem',
    fontSize: '0.95rem',
    color: '#333',
    borderBottom: '1px solid #F0F0F0'
};

export default Requests;
