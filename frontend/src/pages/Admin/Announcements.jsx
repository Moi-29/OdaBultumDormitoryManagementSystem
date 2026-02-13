import { useState, useEffect } from 'react';
import { 
    Megaphone, Plus, Edit, Trash2, Calendar, MapPin, 
    X, Search, CheckSquare, Upload, Link as LinkIcon, Users
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import ConfirmDialog from '../../components/ConfirmDialog';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [imageUploadType, setImageUploadType] = useState('url');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        imageFile: null
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/announcements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAnnouncements(response.data.announcements || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            showNotification('Failed to load announcements', 'error');
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, announcement = null) => {
        setModalMode(mode);
        setImageUploadType('url');
        if (announcement) {
            setFormData({
                title: announcement.title,
                content: announcement.content,
                imageUrl: announcement.imageUrl || '',
                imageFile: null
            });
            setSelectedAnnouncement(announcement);
        } else {
            setFormData({
                title: '',
                content: '',
                imageUrl: '',
                imageFile: null
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            showNotification('Title and content are required', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Prepare data to send
            const dataToSend = {
                title: formData.title,
                content: formData.content
            };

            // Handle image upload - convert file to base64 if file is selected
            if (imageUploadType === 'upload' && formData.imageFile) {
                // Convert file to base64
                const reader = new FileReader();
                reader.onloadend = async () => {
                    dataToSend.imageUrl = reader.result; // base64 string
                    
                    try {
                        if (modalMode === 'create') {
                            await axios.post(`${API_URL}/api/announcements`, dataToSend, config);
                            showNotification('Announcement created successfully', 'success');
                        } else {
                            await axios.put(`${API_URL}/api/announcements/${selectedAnnouncement._id}`, dataToSend, config);
                            showNotification('Announcement updated successfully', 'success');
                        }
                        
                        handleCloseModal();
                        fetchAnnouncements();
                    } catch (error) {
                        console.error('Error saving announcement:', error);
                        showNotification(error.response?.data?.message || 'Failed to save announcement', 'error');
                    }
                };
                reader.readAsDataURL(formData.imageFile);
            } else {
                // Use URL directly
                if (formData.imageUrl) {
                    dataToSend.imageUrl = formData.imageUrl;
                }
                
                if (modalMode === 'create') {
                    await axios.post(`${API_URL}/api/announcements`, dataToSend, config);
                    showNotification('Announcement created successfully', 'success');
                } else {
                    await axios.put(`${API_URL}/api/announcements/${selectedAnnouncement._id}`, dataToSend, config);
                    showNotification('Announcement updated successfully', 'success');
                }
                
                handleCloseModal();
                fetchAnnouncements();
            }
        } catch (error) {
            console.error('Error saving announcement:', error);
            showNotification(error.response?.data?.message || 'Failed to save announcement', 'error');
        }
    };

    const handleDelete = (announcement) => {
        setConfirmDialog({
            title: 'Delete Announcement',
            message: `Are you sure you want to delete "${announcement.title}"?\n\nThis action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`${API_URL}/api/announcements/${announcement._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    showNotification('Announcement deleted successfully', 'success');
                    fetchAnnouncements();
                } catch (error) {
                    console.error('Error deleting announcement:', error);
                    showNotification('Failed to delete announcement', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;

        
        setConfirmDialog({
            title: 'Delete Announcements',
            message: `Are you sure you want to delete ${selectedItems.length} ${selectedItems.length === 1 ? 'announcement' : 'announcements'}?\n\nThis action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    await axios.post(`${API_URL}/api/announcements/bulk-delete`, 
                        { announcementIds: selectedItems },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    showNotification(`Successfully deleted ${selectedItems.length} announcements`, 'success');
                    setSelectedItems([]);
                    setIsSelectionMode(false);
                    fetchAnnouncements();
                } catch (error) {
                    console.error('Error deleting announcements:', error);
                    showNotification('Failed to delete announcements', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const getFilteredAnnouncements = () => {
        let filtered = announcements;
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a => 
                a.title.toLowerCase().includes(query) ||
                a.content.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b' }}>Loading...</div>
                </div>
            </div>
        );
    }

    const filteredAnnouncements = getFilteredAnnouncements();

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>

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

            {/* Header */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Megaphone size={24} color="white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Announcements & Events</h1>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                                    {announcements.length} total announcements
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal('create')}
                            style={{ padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            Create New
                        </button>
                    </div>

                    {/* Search & Actions */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                            />
                        </div>
                        {!isSelectionMode ? (
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                style={{ padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                            >
                                <CheckSquare size={18} />
                                Select
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        const allIds = filteredAnnouncements.map(a => a._id);
                                        setSelectedItems(selectedItems.length === allIds.length ? [] : allIds);
                                    }}
                                    style={{ padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #3b82f6', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#3b82f6' }}
                                >
                                    {selectedItems.length === filteredAnnouncements.length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={selectedItems.length === 0}
                                    style={{ padding: '0.75rem 1.25rem', background: selectedItems.length > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e2e8f0', border: 'none', borderRadius: '10px', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.9rem', color: selectedItems.length > 0 ? 'white' : '#94a3b8' }}
                                >
                                    Delete ({selectedItems.length})
                                </button>
                                <button
                                    onClick={() => { setIsSelectionMode(false); setSelectedItems([]); }}
                                    style={{ padding: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#64748b' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>

                {filteredAnnouncements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <Megaphone size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2, color: '#94a3b8' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                            {searchQuery ? 'No announcements found' : 'No announcements yet'}
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                            {searchQuery ? 'Try adjusting your search' : 'Create your first announcement to get started'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                        {filteredAnnouncements.map(announcement => (
                            <div
                                key={announcement._id}
                                style={{ 
                                    background: 'white', 
                                    borderRadius: '20px', 
                                    overflow: 'hidden',
                                    boxShadow: selectedItems.includes(announcement._id) 
                                        ? '0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 3px #3b82f6' 
                                        : '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: isSelectionMode ? 'pointer' : 'default',
                                    position: 'relative'
                                }}
                                onClick={() => isSelectionMode && setSelectedItems(prev => prev.includes(announcement._id) ? prev.filter(id => id !== announcement._id) : [...prev, announcement._id])}
                                onMouseEnter={(e) => {
                                    if (!isSelectionMode) {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelectionMode) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = selectedItems.includes(announcement._id) 
                                            ? '0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 3px #3b82f6' 
                                            : '0 4px 20px rgba(0, 0, 0, 0.08)';
                                    }
                                }}
                            >
                                {/* Selection Checkbox Overlay */}
                                {isSelectionMode && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '1rem', 
                                        right: '1rem', 
                                        zIndex: 10,
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '8px', 
                                        border: `3px solid ${selectedItems.includes(announcement._id) ? '#3b82f6' : 'white'}`, 
                                        background: selectedItems.includes(announcement._id) ? '#3b82f6' : 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                    }}>
                                        {selectedItems.includes(announcement._id) && <CheckSquare size={20} color="white" strokeWidth={3} />}
                                    </div>
                                )}

                                {/* Image Section */}
                                {announcement.imageUrl && (
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '240px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={announcement.imageUrl}
                                            alt={announcement.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.4s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '100px',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)'
                                        }} />
                                        
                                        {/* Badges on Image */}
                                        <div style={{ 
                                            position: 'absolute', 
                                            top: '1rem', 
                                            left: '1rem',
                                            display: 'flex',
                                            gap: '0.5rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{ 
                                                padding: '0.5rem 1rem', 
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                color: announcement.type === 'event' ? '#1e40af' : '#475569', 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            }}>
                                                {announcement.type}
                                            </span>
                                            <span style={{ 
                                                padding: '0.5rem 1rem', 
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                color: getPriorityColor(announcement.priority), 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            }}>
                                                {announcement.priority}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Content Section */}
                                <div style={{ padding: '1.75rem' }}>
                                    {/* Title and Badges (if no image) */}
                                    {!announcement.imageUrl && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                            <span style={{ 
                                                padding: '0.5rem 1rem', 
                                                background: announcement.type === 'event' ? '#dbeafe' : '#f1f5f9', 
                                                color: announcement.type === 'event' ? '#1e40af' : '#475569', 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {announcement.type}
                                            </span>
                                            <span style={{ 
                                                padding: '0.5rem 1rem', 
                                                background: `${getPriorityColor(announcement.priority)}15`, 
                                                color: getPriorityColor(announcement.priority), 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {announcement.priority}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 style={{ 
                                        fontSize: '1.35rem', 
                                        fontWeight: 800, 
                                        color: '#0f172a', 
                                        margin: '0 0 0.75rem 0', 
                                        lineHeight: '1.3',
                                        letterSpacing: '-0.5px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {announcement.title}
                                    </h3>

                                    {/* Content Preview */}
                                    <p style={{ 
                                        fontSize: '0.95rem', 
                                        color: '#64748b', 
                                        margin: '0 0 1.25rem 0', 
                                        lineHeight: '1.7', 
                                        display: '-webkit-box', 
                                        WebkitLineClamp: 3, 
                                        WebkitBoxOrient: 'vertical', 
                                        overflow: 'hidden' 
                                    }}>
                                        {announcement.content}
                                    </p>

                                    {/* Event Details */}
                                    {announcement.type === 'event' && (announcement.eventDate || announcement.eventLocation) && (
                                        <div style={{ 
                                            padding: '1rem', 
                                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                            borderRadius: '12px', 
                                            marginBottom: '1.25rem',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {announcement.eventDate && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.625rem', 
                                                    fontSize: '0.875rem', 
                                                    color: '#475569',
                                                    fontWeight: 600,
                                                    marginBottom: announcement.eventLocation ? '0.625rem' : 0 
                                                }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        background: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                                    }}>
                                                        <Calendar size={16} color="#3b82f6" strokeWidth={2.5} />
                                                    </div>
                                                    {new Date(announcement.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            )}
                                            {announcement.eventLocation && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.625rem', 
                                                    fontSize: '0.875rem', 
                                                    color: '#475569',
                                                    fontWeight: 600
                                                }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        background: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                                    }}>
                                                        <MapPin size={16} color="#3b82f6" strokeWidth={2.5} />
                                                    </div>
                                                    {announcement.eventLocation}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        paddingTop: '1.25rem', 
                                        borderTop: '2px solid #f1f5f9' 
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.375rem', 
                                                padding: '0.5rem 0.875rem', 
                                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                                borderRadius: '8px', 
                                                fontSize: '0.8rem', 
                                                fontWeight: 700, 
                                                color: '#475569',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <span style={{ fontSize: '1rem' }}>{getStatusIcon(announcement.status)}</span>
                                                {announcement.status}
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.375rem', 
                                                fontSize: '0.8rem', 
                                                color: '#94a3b8',
                                                fontWeight: 600
                                            }}>
                                                <Users size={14} strokeWidth={2.5} />
                                                {announcement.targetAudience.join(', ')}
                                            </div>
                                        </div>
                                        
                                        {!isSelectionMode && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', announcement); }}
                                                    style={{ 
                                                        padding: '0.625rem', 
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                                                        border: 'none', 
                                                        borderRadius: '10px', 
                                                        cursor: 'pointer', 
                                                        color: 'white', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                                    }}
                                                >
                                                    <Edit size={16} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(announcement); }}
                                                    style={{ 
                                                        padding: '0.625rem', 
                                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                                                        border: 'none', 
                                                        borderRadius: '10px', 
                                                        cursor: 'pointer', 
                                                        color: 'white', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        transition: 'all 0.2s',
                                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                                    }}
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10002, padding: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ background: 'white', borderRadius: '20px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                        <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                                    {modalMode === 'create' ? 'Create Announcement' : 'Edit Announcement'}
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                                    {modalMode === 'create' ? 'Create a new announcement or event' : 'Update announcement details'}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2rem 2.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Image Upload/URL Section */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                                        Image
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageUploadType('url');
                                                setFormData({ ...formData, imageFile: null });
                                            }}
                                            style={{ flex: 1, padding: '0.625rem 1rem', background: imageUploadType === 'url' ? '#3b82f6' : 'white', border: `2px solid ${imageUploadType === 'url' ? '#3b82f6' : '#e5e7eb'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: imageUploadType === 'url' ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                                        >
                                            <LinkIcon size={16} />
                                            Image URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageUploadType('upload');
                                                setFormData({ ...formData, imageUrl: '' });
                                            }}
                                            style={{ flex: 1, padding: '0.625rem 1rem', background: imageUploadType === 'upload' ? '#3b82f6' : 'white', border: `2px solid ${imageUploadType === 'upload' ? '#3b82f6' : '#e5e7eb'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: imageUploadType === 'upload' ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                                        >
                                            <Upload size={16} />
                                            Upload Image
                                        </button>
                                    </div>
                                    
                                    {imageUploadType === 'url' ? (
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                            style={{ width: '100%', padding: '0.875rem 1.125rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s' }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                                style={{ display: 'none' }}
                                                id="imageUpload"
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                                            >
                                                <Upload size={24} color="#64748b" />
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                                        {formData.imageFile ? formData.imageFile.name : 'Click to upload image'}
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                        Title <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter announcement title"
                                        style={{ width: '100%', padding: '0.875rem 1.125rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s' }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                        Content <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Enter announcement content"
                                        rows={6}
                                        style={{ width: '100%', padding: '0.875rem 1.125rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{ flex: 1, padding: '0.875rem', border: '2px solid #e5e7eb', background: 'white', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '0.875rem', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s' }}
                                >
                                    {modalMode === 'create' ? 'Create' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper functions
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'urgent': return '#dc2626';
        case 'high': return '#ea580c';
        case 'medium': return '#3b82f6';
        case 'low': return '#64748b';
        default: return '#64748b';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'published': return '✓';
        case 'draft': return '○';
        case 'archived': return '✕';
        default: return '○';
    }
};

export default Announcements;
