import { useState, useEffect } from 'react';
import { 
    MessageSquare, Users, Wrench, Building2, Send, X, 
    CheckCircle, XCircle, Clock, Search, Paperclip, Trash2, CheckSquare, Square, Plus, FileText
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import ConfirmDialog from '../../components/ConfirmDialog';

const Requests = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [studentRequests, setStudentRequests] = useState([]);
    const [proctorRequests, setProctorRequests] = useState([]);
    const [maintainerRequests, setMaintainerRequests] = useState([]);
    const [allProctors, setAllProctors] = useState([]);
    const [allMaintainers, setAllMaintainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [showNewOrderForm, setShowNewOrderForm] = useState(false);
    const [newOrderForm, setNewOrderForm] = useState({
        toWhom: '',
        title: '',
        issue: ''
    });
    const [submittingOrder, setSubmittingOrder] = useState(false);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchRequests();
        fetchProctorsAndMaintainers();
    }, []);

    const fetchProctorsAndMaintainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch proctors
            const proctorsResponse = await axios.get(`${API_URL}/api/user-management/proctors`, config);
            setAllProctors(proctorsResponse.data.filter(p => p.status === 'Active'));
            
            // Fetch maintainers
            const maintainersResponse = await axios.get(`${API_URL}/api/user-management/maintainers`, config);
            setAllMaintainers(maintainersResponse.data.filter(m => m.status === 'Active'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

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
        let requests = [];
        let activeUsers = [];
        
        switch (activeTab) {
            case 'students': 
                return studentRequests;
            case 'proctors': 
                requests = proctorRequests;
                activeUsers = allProctors;
                break;
            case 'maintainers': 
                requests = maintainerRequests;
                activeUsers = allMaintainers;
                break;
            default: 
                return [];
        }
        
        // Merge requests with active users
        // Create a map of existing requests by user ID
        const requestMap = new Map();
        requests.forEach(req => {
            if (req.fromUserId) {
                requestMap.set(req.fromUserId.toString(), req);
            }
        });
        
        // Add active users who don't have requests yet
        const mergedList = [...requests];
        activeUsers.forEach(user => {
            if (!requestMap.has(user._id.toString())) {
                // Create a placeholder for users without requests
                mergedList.push({
                    _id: `user-${user._id}`,
                    fromUserId: user._id,
                    fromUserModel: activeTab === 'proctors' ? 'Proctor' : 'Maintainer',
                    fromUserName: user.username,
                    proctorName: activeTab === 'proctors' ? user.username : undefined,
                    maintainerName: activeTab === 'maintainers' ? user.username : undefined,
                    blockId: user.blockId,
                    specialization: user.specialization,
                    subject: 'No conversation yet',
                    message: 'Start a conversation',
                    status: 'active',
                    priority: 'medium',
                    type: activeTab === 'proctors' ? 'proctor' : 'maintainer',
                    isNewConversation: true,
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        return mergedList;
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

    const handleToggleSelection = (requestId) => {
        setSelectedItems(prev => 
            prev.includes(requestId) 
                ? prev.filter(id => id !== requestId)
                : [...prev, requestId]
        );
    };

    const handleSelectAll = () => {
        const filteredRequests = getFilteredRequests();
        const allIds = filteredRequests.map(req => req._id);
        if (selectedItems.length === allIds.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(allIds);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) return;
        
        setConfirmDialog({
            title: 'Delete Requests',
            message: `Are you sure you want to delete ${selectedItems.length} ${selectedItems.length === 1 ? 'request' : 'requests'}?\n\nThis action cannot be undone and will permanently remove the ${selectedItems.length === 1 ? 'request' : 'requests'} and all associated messages from the database.`,
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    
                    // Use bulk delete endpoint for better performance
                    const response = await axios.post(
                        `${API_URL}/api/requests/bulk-delete`,
                        { requestIds: selectedItems },
                        config
                    );
                    
                    // Refresh the requests list
                    await fetchRequests();
                    
                    // Clear selection
                    setSelectedItems([]);
                    setIsSelectionMode(false);
                    
                    // Close detail panel if selected request was deleted
                    if (selectedRequest && selectedItems.includes(selectedRequest._id)) {
                        setSelectedRequest(null);
                    }
                    
                    showNotification(response.data.message || `Successfully deleted ${selectedItems.length} ${selectedItems.length === 1 ? 'request' : 'requests'}`, 'success');
                } catch (error) {
                    console.error('Error deleting requests:', error);
                    showNotification(error.response?.data?.message || 'Failed to delete some requests', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSelectedRequest(null);
        setSelectedItems([]);
        setIsSelectionMode(false);
        setShowNewOrderForm(false);
        setNewOrderForm({ toWhom: '', title: '', issue: '' });
    };

    const handleNewOrderChange = (e) => {
        setNewOrderForm({
            ...newOrderForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitNewOrder = async () => {
        if (!newOrderForm.toWhom || !newOrderForm.title.trim() || !newOrderForm.issue.trim()) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setSubmittingOrder(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Find the selected user details
            const userList = activeTab === 'proctors' ? allProctors : allMaintainers;
            const selectedUser = userList.find(u => u._id === newOrderForm.toWhom);
            
            if (!selectedUser) {
                showNotification('Selected user not found', 'error');
                setSubmittingOrder(false);
                return;
            }

            const requestData = {
                fromUserId: null, // Admin doesn't have a user ID in the system
                fromUserModel: 'Admin',
                fromUserName: 'Admin',
                toUserId: selectedUser._id,
                toUserModel: activeTab === 'proctors' ? 'Proctor' : 'Maintainer',
                requestType: 'Order',
                subject: newOrderForm.title,
                message: newOrderForm.issue,
                priority: 'high',
                status: 'pending',
                blockId: selectedUser.blockId,
                specialization: selectedUser.specialization
            };

            await axios.post(`${API_URL}/api/requests`, requestData, config);
            
            showNotification('Order sent successfully!', 'success');
            setShowNewOrderForm(false);
            setNewOrderForm({ toWhom: '', title: '', issue: '' });
            
            // Refresh requests
            await fetchRequests();
        } catch (error) {
            console.error('Error sending order:', error);
            showNotification(error.response?.data?.message || 'Failed to send order', 'error');
        } finally {
            setSubmittingOrder(false);
        }
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

    const handleSendMessage = async () => {
        if (!chatMessage.trim() || !selectedRequest) return;
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            let requestId = selectedRequest._id;
            
            // If this is a new conversation, create a request first
            if (selectedRequest.isNewConversation) {
                const requestData = {
                    fromUserId: selectedRequest.fromUserId,
                    fromUserModel: selectedRequest.fromUserModel,
                    fromUserName: selectedRequest.fromUserName,
                    toUserModel: 'Admin',
                    requestType: 'Message',
                    subject: `Message from Admin`,
                    message: chatMessage,
                    priority: 'medium',
                    status: 'pending',
                    blockId: selectedRequest.blockId,
                    specialization: selectedRequest.specialization
                };
                
                const requestResponse = await axios.post(`${API_URL}/api/requests`, requestData, config);
                requestId = requestResponse.data._id;
                
                // Update the selected request to no longer be new
                setSelectedRequest({
                    ...selectedRequest,
                    _id: requestId,
                    isNewConversation: false
                });
                
                // Refresh requests to show the new one
                fetchRequests();
            }
            
            // Send the message
            const messageData = {
                requestId: requestId,
                message: chatMessage,
                senderModel: 'Admin'
            };
            
            const response = await axios.post(`${API_URL}/api/messages`, messageData, config);
            
            setMessages([...messages, response.data]);
            setChatMessage('');
            showNotification('Message sent successfully', 'success');
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message', 'error');
        }
    };

    const fetchMessages = async (requestId) => {
        setLoadingMessages(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const response = await axios.get(`${API_URL}/api/messages/${requestId}`, config);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        setConfirmDialog({
            title: 'Delete Message',
            message: 'Are you sure you want to delete this message?\n\nThis action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    
                    await axios.delete(`${API_URL}/api/messages/${messageId}`, config);
                    
                    setMessages(messages.filter(msg => msg._id !== messageId));
                    showNotification('Message deleted successfully', 'success');
                } catch (error) {
                    console.error('Error deleting message:', error);
                    showNotification('Failed to delete message', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        if (request.type !== 'student') {
            if (request.isNewConversation) {
                // New conversation - no messages yet
                setMessages([]);
                setLoadingMessages(false);
            } else {
                // Existing conversation - fetch messages
                fetchMessages(request._id);
            }
        }
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
            {/* Confirmation Dialog */}
            {confirmDialog && (
                <ConfirmDialog
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    type={confirmDialog.type}
                    confirmText={confirmDialog.confirmText}
                    cancelText={confirmDialog.cancelText}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />
            )}
            
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
                            <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{ flex: 1, padding: '0.875rem 1.25rem', background: isActive ? 'white' : 'transparent', border: isActive ? `2px solid ${tab.color}` : '2px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
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
                    {/* Search Bar & Selection Controls */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ position: 'relative', marginBottom: isSelectionMode ? '0.75rem' : '0' }}>
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
                        
                        {/* Selection Mode Controls */}
                        {isSelectionMode ? (
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem', 
                                alignItems: 'center',
                                padding: '0.75rem',
                                background: `${getTabColor()}08`,
                                borderRadius: '10px',
                                border: `1px solid ${getTabColor()}20`,
                                animation: 'slideDown 0.3s ease-out'
                            }}>
                                <button
                                    onClick={handleSelectAll}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 1rem',
                                        background: 'white',
                                        border: `1px solid ${getTabColor()}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        color: getTabColor(),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = getTabColor();
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = getTabColor();
                                    }}
                                >
                                    {selectedItems.length === getFilteredRequests().length ? <CheckSquare size={16} /> : <Square size={16} />}
                                    {selectedItems.length === getFilteredRequests().length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={selectedItems.length === 0}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 1rem',
                                        background: selectedItems.length > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e2e8f0',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        color: selectedItems.length > 0 ? 'white' : '#94a3b8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s',
                                        boxShadow: selectedItems.length > 0 ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedItems.length > 0) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedItems.length > 0) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                        }
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(false);
                                        setSelectedItems([]);
                                    }}
                                    style={{
                                        padding: '0.625rem',
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#e2e8f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f1f5f9';
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem 1rem',
                                    background: 'white',
                                    border: `1px solid ${getTabColor()}30`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    color: getTabColor(),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    marginTop: '0.75rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `${getTabColor()}08`;
                                    e.currentTarget.style.borderColor = getTabColor();
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.borderColor = `${getTabColor()}30`;
                                }}
                            >
                                <CheckSquare size={16} />
                                Select Items
                            </button>
                        )}
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
                                const isChecked = selectedItems.includes(request._id);
                                const name = request.studentName || request.proctorName || request.maintainerName || 'Unknown';
                                return (
                                    <div
                                        key={request._id}
                                        style={{
                                            padding: '1rem 1.25rem',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: isSelected ? '#f8fafc' : isChecked ? `${getTabColor()}08` : 'white',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            gap: '0.875rem',
                                            alignItems: 'start',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => !isSelected && !isChecked && (e.currentTarget.style.background = '#fafbfc')}
                                        onMouseLeave={(e) => !isSelected && !isChecked && (e.currentTarget.style.background = 'white')}
                                    >
                                        {/* Selection Checkbox */}
                                        {isSelectionMode && (
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleSelection(request._id);
                                                }}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    border: `2px solid ${isChecked ? getTabColor() : '#cbd5e1'}`,
                                                    background: isChecked ? getTabColor() : 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    flexShrink: 0,
                                                    marginTop: '0.75rem',
                                                    animation: 'scaleIn 0.2s ease-out'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isChecked) {
                                                        e.currentTarget.style.borderColor = getTabColor();
                                                        e.currentTarget.style.background = `${getTabColor()}10`;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isChecked) {
                                                        e.currentTarget.style.borderColor = '#cbd5e1';
                                                        e.currentTarget.style.background = 'white';
                                                    }
                                                }}
                                            >
                                                {isChecked && <CheckCircle size={14} color="white" strokeWidth={3} />}
                                            </div>
                                        )}
                                        
                                        <div 
                                            onClick={() => !isSelectionMode && handleSelectRequest(request)}
                                            style={{ display: 'flex', gap: '0.875rem', flex: 1, alignItems: 'start' }}
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
                                                    {request.isNewConversation ? (
                                                        <span style={{ padding: '0.125rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                            New
                                                        </span>
                                                    ) : (
                                                        <span style={{ padding: '0.125rem 0.5rem', background: request.status === 'pending' ? '#fef3c7' : request.status === 'approved' ? '#dcfce7' : request.status === 'active' ? '#e0e7ff' : '#fee2e2', color: request.status === 'pending' ? '#92400e' : request.status === 'approved' ? '#166534' : request.status === 'active' ? '#3730a3' : '#991b1b', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                            {request.status}
                                                        </span>
                                                    )}
                                                    <span style={{ padding: '0.125rem 0.5rem', background: `${getTabColor()}15`, color: getTabColor(), borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                                                        {request.priority}
                                                    </span>
                                                </div>
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
                            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                                {/* Student Info */}
                                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Student Information</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Full Name</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{selectedRequest.studentName || selectedRequest.fromUserName}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Student ID</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{selectedRequest.studentId}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Room</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{selectedRequest.currentRoom || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Submitted On</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} color="#64748b" />
                                                {selectedRequest.submittedOn}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Details */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Report Details</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b', marginBottom: '1rem' }}>{selectedRequest.subject}</div>
                                    <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.7', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                        {selectedRequest.message}
                                    </div>
                                </div>

                                {/* Status & Type */}
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <span style={{ padding: '0.5rem 1rem', background: `${getTabColor()}10`, color: getTabColor(), borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        {selectedRequest.requestType}
                                    </span>
                                    <span style={{ 
                                        padding: '0.5rem 1rem', 
                                        background: selectedRequest.status === 'pending' ? '#fef3c7' : selectedRequest.status === 'approved' ? '#dcfce7' : '#fee2e2', 
                                        color: selectedRequest.status === 'pending' ? '#92400e' : selectedRequest.status === 'approved' ? '#166534' : '#991b1b', 
                                        borderRadius: '8px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 700, 
                                        textTransform: 'uppercase',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem'
                                    }}>
                                        {selectedRequest.status === 'pending' && <Clock size={14} />}
                                        {selectedRequest.status === 'approved' && <CheckCircle size={14} />}
                                        {selectedRequest.status === 'rejected' && <XCircle size={14} />}
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            {/* Admin Response Section - Only for Proctor/Maintainer */}
                            {selectedRequest.type !== 'student' && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1rem' }}>Chat History</div>
                                    
                                    {loadingMessages ? (
                                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                                            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: getTabColor(), borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                            No messages yet. Start the conversation!
                                        </div>
                                    ) : (
                                        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {messages.map((msg) => {
                                                const isAdmin = msg.senderModel === 'Admin';
                                                return (
                                                    <div key={msg._id} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', marginBottom: '0.5rem' }}>
                                                        <div style={{ maxWidth: '70%', position: 'relative', group: true }}>
                                                            <div style={{ 
                                                                background: isAdmin ? getTabColor() : '#f1f5f9', 
                                                                color: isAdmin ? 'white' : '#1e293b', 
                                                                padding: '0.75rem 1rem', 
                                                                borderRadius: isAdmin ? '12px 12px 2px 12px' : '12px 12px 12px 2px', 
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                                                            }}>
                                                                {!isAdmin && (
                                                                    <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem', opacity: 0.7 }}>
                                                                        {msg.senderName}
                                                                    </div>
                                                                )}
                                                                <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.message}</div>
                                                                <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <span>{formatTime(msg.createdAt)}</span>
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={() => handleDeleteMessage(msg._id)}
                                                                            style={{
                                                                                background: 'rgba(255,255,255,0.2)',
                                                                                border: 'none',
                                                                                color: 'white',
                                                                                padding: '0.25rem 0.5rem',
                                                                                borderRadius: '4px',
                                                                                cursor: 'pointer',
                                                                                fontSize: '0.7rem',
                                                                                marginLeft: '0.5rem'
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                            {selectedRequest.type === 'student' ? (
                                <div>
                                    {selectedRequest.status === 'pending' ? (
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button 
                                                onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} 
                                                style={{ 
                                                    flex: 1, 
                                                    padding: '1rem', 
                                                    background: 'white', 
                                                    color: '#ef4444', 
                                                    border: '2px solid #ef4444', 
                                                    borderRadius: '12px', 
                                                    cursor: 'pointer', 
                                                    fontWeight: 700, 
                                                    fontSize: '1rem', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    gap: '0.5rem', 
                                                    transition: 'all 0.2s' 
                                                }} 
                                                onMouseEnter={(e) => { 
                                                    e.currentTarget.style.background = '#ef4444'; 
                                                    e.currentTarget.style.color = 'white'; 
                                                }} 
                                                onMouseLeave={(e) => { 
                                                    e.currentTarget.style.background = 'white'; 
                                                    e.currentTarget.style.color = '#ef4444'; 
                                                }}
                                            >
                                                <XCircle size={20} />
                                                Reject Report
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(selectedRequest._id, 'approved')} 
                                                style={{ 
                                                    flex: 1, 
                                                    padding: '1rem', 
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '12px', 
                                                    cursor: 'pointer', 
                                                    fontWeight: 700, 
                                                    fontSize: '1rem', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    gap: '0.5rem', 
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                }} 
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                                }} 
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                                }}
                                            >
                                                <CheckCircle size={20} />
                                                Approve Report
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ 
                                            padding: '1rem', 
                                            background: selectedRequest.status === 'approved' ? '#dcfce7' : '#fee2e2', 
                                            borderRadius: '12px', 
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 700,
                                            color: selectedRequest.status === 'approved' ? '#166534' : '#991b1b'
                                        }}>
                                            {selectedRequest.status === 'approved' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                            Report {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'}
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
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Requests;
