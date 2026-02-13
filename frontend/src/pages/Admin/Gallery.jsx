import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, Upload, Link as LinkIcon, CheckSquare, Edit } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import ConfirmDialog from '../../components/ConfirmDialog';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedImage, setSelectedImage] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [imageUploadType, setImageUploadType] = useState('url');
    const [formData, setFormData] = useState({
        imageUrl: '',
        imageFile: null
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/gallery`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setImages(response.data.images || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching images:', error);
            showNotification('Failed to load images', 'error');
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'create', image = null) => {
        setModalMode(mode);
        setImageUploadType('url');
        if (image) {
            setFormData({
                imageUrl: image.imageUrl || '',
                imageFile: null
            });
            setSelectedImage(image);
        } else {
            setFormData({
                imageUrl: '',
                imageFile: null
            });
            setSelectedImage(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
        setFormData({
            imageUrl: '',
            imageFile: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('=== GALLERY SUBMIT START ===');
        console.log('Modal mode:', modalMode);
        console.log('Image upload type:', imageUploadType);
        console.log('Form data:', formData);
        
        if (!formData.imageUrl && !formData.imageFile) {
            showNotification('Please provide an image URL or upload a file', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Handle image upload - convert file to base64 if file is selected
            if (imageUploadType === 'upload' && formData.imageFile) {
                console.log('Processing file upload...');
                // Convert file to base64
                const reader = new FileReader();
                reader.onloadend = async () => {
                    console.log('File converted to base64, length:', reader.result?.length);
                    const imageData = {
                        imageUrl: reader.result // base64 string
                    };
                    
                    try {
                        if (modalMode === 'create') {
                            console.log('Sending POST request to create image...');
                            const response = await axios.post(`${API_URL}/api/gallery`, imageData, config);
                            console.log('Create response:', response.data);
                            showNotification('Image added successfully', 'success');
                        } else if (modalMode === 'edit' && selectedImage) {
                            console.log('Sending PUT request to update image...');
                            const response = await axios.put(`${API_URL}/api/gallery/${selectedImage._id}`, imageData, config);
                            console.log('Update response:', response.data);
                            showNotification('Image updated successfully', 'success');
                        }
                        
                        handleCloseModal();
                        fetchImages();
                    } catch (error) {
                        console.error('Error saving image:', error);
                        console.error('Error response:', error.response?.data);
                        showNotification(error.response?.data?.message || 'Failed to save image', 'error');
                    }
                };
                reader.readAsDataURL(formData.imageFile);
            } else if (formData.imageUrl) {
                console.log('Using URL directly:', formData.imageUrl);
                // Use URL directly
                const imageData = {
                    imageUrl: formData.imageUrl
                };
                
                if (modalMode === 'create') {
                    console.log('Sending POST request to create image...');
                    const response = await axios.post(`${API_URL}/api/gallery`, imageData, config);
                    console.log('Create response:', response.data);
                    showNotification('Image added successfully', 'success');
                } else if (modalMode === 'edit' && selectedImage) {
                    console.log('Sending PUT request to update image...');
                    const response = await axios.put(`${API_URL}/api/gallery/${selectedImage._id}`, imageData, config);
                    console.log('Update response:', response.data);
                    showNotification('Image updated successfully', 'success');
                }
                
                handleCloseModal();
                fetchImages();
            } else {
                console.log('No valid image data to submit');
            }
        } catch (error) {
            console.error('Error saving image:', error);
            console.error('Error response:', error.response?.data);
            showNotification(error.response?.data?.message || 'Failed to save image', 'error');
        }
        
        console.log('=== GALLERY SUBMIT END ===');
    };

    const handleDelete = (image) => {
        setConfirmDialog({
            title: 'Delete Image',
            message: 'Are you sure you want to delete this image?\n\nThis action cannot be undone and will permanently remove the image from the database.',
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    console.log('Deleting image:', image._id);
                    
                    const response = await axios.delete(`${API_URL}/api/gallery/${image._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    console.log('Delete response:', response.data);
                    showNotification('Image deleted successfully from database', 'success');
                    fetchImages();
                } catch (error) {
                    console.error('Error deleting image:', error);
                    console.error('Error response:', error.response?.data);
                    showNotification('Failed to delete image from database', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        
        setConfirmDialog({
            title: 'Delete Images',
            message: `Are you sure you want to delete ${selectedItems.length} ${selectedItems.length === 1 ? 'image' : 'images'}?\n\nThis action cannot be undone and will permanently remove the images from the database.`,
            type: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const token = localStorage.getItem('token');
                    console.log('Bulk deleting images:', selectedItems);
                    
                    const response = await axios.post(`${API_URL}/api/gallery/bulk-delete`, 
                        { imageIds: selectedItems },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    console.log('Bulk delete response:', response.data);
                    showNotification(`Successfully deleted ${response.data.deletedCount || selectedItems.length} images from database`, 'success');
                    setSelectedItems([]);
                    setIsSelectionMode(false);
                    fetchImages();
                } catch (error) {
                    console.error('Error deleting images:', error);
                    console.error('Error response:', error.response?.data);
                    showNotification('Failed to delete images from database', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={24} color="white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Gallery</h1>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                                    {images.length} total images
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
                            Add Image
                        </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                                        const allIds = images.map(img => img._id);
                                        setSelectedItems(selectedItems.length === allIds.length ? [] : allIds);
                                    }}
                                    style={{ padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #3b82f6', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#3b82f6' }}
                                >
                                    {selectedItems.length === images.length ? 'Deselect All' : 'Select All'}
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

                {images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <ImageIcon size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.2, color: '#94a3b8' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                            No images yet
                        </h2>
                        <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                            Add your first image to get started
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {images.map(image => (
                            <div
                                key={image._id}
                                style={{ position: 'relative', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s', cursor: isSelectionMode ? 'pointer' : 'default', boxShadow: selectedItems.includes(image._id) ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none', borderColor: selectedItems.includes(image._id) ? '#3b82f6' : '#e2e8f0' }}
                                onClick={() => isSelectionMode && setSelectedItems(prev => prev.includes(image._id) ? prev.filter(id => id !== image._id) : [...prev, image._id])}
                            >
                                <div style={{ position: 'relative', paddingTop: '75%', background: '#f8fafc' }}>
                                    <img
                                        src={image.imageUrl}
                                        alt="Gallery"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #94a3b8;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><p style="margin: 0.5rem 0 0 0; font-size: 0.8rem;">Image not found</p></div>';
                                        }}
                                    />
                                </div>
                                
                                {isSelectionMode && (
                                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', width: '28px', height: '28px', borderRadius: '8px', border: `2px solid ${selectedItems.includes(image._id) ? '#3b82f6' : 'white'}`, background: selectedItems.includes(image._id) ? '#3b82f6' : 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        {selectedItems.includes(image._id) && <CheckSquare size={18} color="white" />}
                                    </div>
                                )}
                                
                                {!isSelectionMode && (
                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', image); }}
                                            style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.95)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.95)'}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(image); }}
                                            style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.95)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.95)'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10002, padding: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ background: 'white', borderRadius: '20px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                                    {modalMode === 'create' ? 'Add Image' : 'Edit Image'}
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                                    {modalMode === 'create' ? 'Upload an image or provide a URL' : 'Update the image URL'}
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
                                <div>
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
                                    {modalMode === 'create' ? 'Add Image' : 'Update Image'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
