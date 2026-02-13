import { useState, useEffect } from 'react';
import { 
    Megaphone, Plus, Edit, Trash2, Calendar, MapPin, 
    X, Search, CheckSquare, Upload, Link as LinkIcon
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
        imageFile: null,
        eventDate: '',
        eventLocation: ''
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
                imageFile: null,
                eventDate: announcement.eventDate ? new Date(announcement.eventDate).toISOString().split('T')[0] : '',
                eventLocation: announcement.eventLocation || ''
            });
            setSelectedAnnouncement(announcement);
        } else {
            setFormData({
                title: '',
                content: '',
                imageUrl: '',
                imageFile: null,
                eventDate: '',
                eventLocation: ''
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
            
            if (modalMode === 'create') {
                await axios.post(`${API_URL}/api/announcements`, formData, config);
                showNotification('Announcement created successfully', 'success');
            } else {
                await axios.put(`${API_URL}/api/announcements/${selectedAnnouncement._id}`, formData, config);
                showNotification('Announcement updated successfully', 'success');
            }
            
            handleCloseModal();
            fetchAnnouncements();
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {filteredAnnouncements.map(announcement => (
                            <div
                                key={announcement._id}
                                style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', transition: 'all 0.2s', cursor: isSelectionMode ? 'pointer' : 'default', boxShadow: selectedItems.includes(announcement._id) ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none', borderColor: selectedItems.includes(announcement._id) ? '#3b82f6' : '#e2e8f0' }}
                                onClick={() => isSelectionMode && setSelectedItems(prev => prev.includes(announcement._id) ? prev.filter(id => id !== announcement._id) : [...prev, announcement._id])}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ padding: '0.25rem 0.75rem', background: announcement.type === 'event' ? '#dbeafe' : '#f1f5f9', color: announcement.type === 'event' ? '#1e40af' : '#475569', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {announcement.type}
                                            </span>
                                            <span style={{ padding: '0.25rem 0.75rem', background: `${getPriorityColor(announcement.priority)}15`, color: getPriorityColor(announcement.priority), borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {announcement.priority}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>
                                            {announcement.title}
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {announcement.content}
                                        </p>
                                    </div>
                                    {isSelectionMode && (
                                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${selectedItems.includes(announcement._id) ? '#3b82f6' : '#cbd5e1'}`, background: selectedItems.includes(announcement._id) ? '#3b82f6' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1rem', flexShrink: 0 }}>
                                            {selectedItems.includes(announcement._id) && <CheckSquare size={16} color="white" />}
                                        </div>
                                    )}
                                </div>

                                {announcement.type === 'event' && (announcement.eventDate || announcement.eventLocation) && (
                                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                                        {announcement.eventDate && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: announcement.eventLocation ? '0.5rem' : 0 }}>
                                                <Calendar size={14} />
                                                {new Date(announcement.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        )}
                                        {announcement.eventLocation && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                <MapPin size={14} />
                                                {announcement.eventLocation}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                                            {getStatusIcon(announcement.status)}
                                            {announcement.status}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                            <Users size={14} />
                                            {announcement.targetAudience.join(', ')}
                                        </div>
                                    </div>
                                    {!isSelectionMode && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', announcement); }}
                                                style={{ padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(announcement); }}
                                                style={{ padding: '0.5rem', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
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
                                            onClick={() => setImageUploadType('url')}
                                            style={{ flex: 1, padding: '0.625rem 1rem', background: imageUploadType === 'url' ? '#3b82f6' : 'white', border: `2px solid ${imageUploadType === 'url' ? '#3b82f6' : '#e5e7eb'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: imageUploadType === 'url' ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                                        >
                                            <LinkIcon size={16} />
                                            Image URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setImageUploadType('upload')}
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

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                            Event Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem 1.125rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                                            Event Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.eventLocation}
                                            onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                                            placeholder="Enter event location"
                                            style={{ width: '100%', padding: '0.875rem 1.125rem', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
                                        />
                                    </div>
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

export default Announcements;
