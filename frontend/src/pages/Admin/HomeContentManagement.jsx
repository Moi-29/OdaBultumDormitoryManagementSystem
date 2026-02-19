import { useState, useEffect } from 'react';
import { Home, Image, Users, Plus, Edit2, Trash2, Save, X, Upload, Sparkles, Award, Eye, Crown, UserCircle, ArrowUp, ArrowDown } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification, useConfirmDialog } from '../../hooks/useNotification';

const HomeContentManagement = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const { notification, showNotification, hideNotification } = useNotification();
    const { confirmDialog, showConfirm } = useConfirmDialog();
    
    // Hero Section State
    const [heroForm, setHeroForm] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroDescription: '',
        heroImage: ''
    });
    const [heroImagePreview, setHeroImagePreview] = useState('');
    
    // Leadership Section State
    const [leadershipForm, setLeadershipForm] = useState({
        leadershipTitle: '',
        leadershipDescription: ''
    });
    
    // Leader Modal State
    const [showLeaderModal, setShowLeaderModal] = useState(false);
    const [editingLeader, setEditingLeader] = useState(null);
    const [leaderForm, setLeaderForm] = useState({
        name: '',
        position: '',
        description: '',
        image: '',
        order: 0
    });
    const [leaderImagePreview, setLeaderImagePreview] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/home-content`);
            setContent(data);
            
            // Set hero form - preserve existing data
            setHeroForm({
                heroTitle: data.heroTitle || '',
                heroSubtitle: data.heroSubtitle || '',
                heroDescription: data.heroDescription || '',
                heroImage: data.heroImage || ''
            });
            setHeroImagePreview(data.heroImage || '');
            
            // Set leadership form - preserve existing data
            setLeadershipForm({
                leadershipTitle: data.leadershipTitle || '',
                leadershipDescription: data.leadershipDescription || ''
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching content:', error);
            showNotification('Failed to load content', 'error');
            setLoading(false);
        }
    };

    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroForm({ ...heroForm, heroImage: reader.result });
                setHeroImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveHero = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/home-content/hero`, heroForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showNotification('Hero section updated successfully!', 'success');
            fetchContent();
        } catch (error) {
            console.error('Error updating hero:', error);
            showNotification('Failed to update hero section', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveLeadership = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/home-content/leadership`, leadershipForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showNotification('Leadership section updated successfully!', 'success');
            fetchContent();
        } catch (error) {
            console.error('Error updating leadership:', error);
            showNotification('Failed to update leadership section', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAddLeader = () => {
        setEditingLeader(null);
        setLeaderForm({
            name: '',
            position: '',
            description: '',
            image: '',
            order: content?.leaders?.length || 0
        });
        setLeaderImagePreview('');
        setShowLeaderModal(true);
    };

    const handleEditLeader = (leader) => {
        setEditingLeader(leader);
        setLeaderForm({
            name: leader.name,
            position: leader.position,
            description: leader.description,
            image: leader.image,
            order: leader.order
        });
        setLeaderImagePreview(leader.image);
        setShowLeaderModal(true);
    };

    const handleLeaderImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLeaderForm({ ...leaderForm, image: reader.result });
                setLeaderImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLeader = async () => {
        if (!leaderForm.name || !leaderForm.position || !leaderForm.description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            
            if (editingLeader) {
                await axios.put(`${API_URL}/api/home-content/leaders/${editingLeader._id}`, leaderForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showNotification('Leader updated successfully!', 'success');
            } else {
                await axios.post(`${API_URL}/api/home-content/leaders`, leaderForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showNotification('Leader added successfully!', 'success');
            }
            
            setShowLeaderModal(false);
            fetchContent();
        } catch (error) {
            console.error('Error saving leader:', error);
            showNotification('Failed to save leader', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLeader = async (leaderId) => {
        const confirmed = await showConfirm({
            title: 'Delete Leader',
            message: 'Are you sure you want to delete this leader?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        
        if (!confirmed) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/home-content/leaders/${leaderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showNotification('Leader deleted successfully!', 'success');
            fetchContent();
        } catch (error) {
            console.error('Error deleting leader:', error);
            showNotification('Failed to delete leader', 'error');
        }
    };

    const handleMoveLeader = async (leaderId, direction) => {
        const leaders = [...content.leaders].sort((a, b) => a.order - b.order);
        const currentIndex = leaders.findIndex(l => l._id === leaderId);
        
        if (currentIndex === -1) return;
        if (direction === 'up' && currentIndex === 0) return;
        if (direction === 'down' && currentIndex === leaders.length - 1) return;
        
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        // Swap orders
        const currentLeader = leaders[currentIndex];
        const targetLeader = leaders[newIndex];
        
        try {
            const token = localStorage.getItem('token');
            
            // Update both leaders' orders
            await axios.put(`${API_URL}/api/home-content/leaders/${currentLeader._id}`, 
                { ...currentLeader, order: targetLeader.order },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            await axios.put(`${API_URL}/api/home-content/leaders/${targetLeader._id}`, 
                { ...targetLeader, order: currentLeader.order },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            fetchContent();
        } catch (error) {
            console.error('Error reordering leaders:', error);
            showNotification('Failed to reorder leaders', 'error');
        }
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e5e7eb',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: '#6b7280' }}>Loading content...</p>
            </div>
        );
    }

    return (
        <div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .leader-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .leader-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                
                .leader-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                }
                
                .president-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
                }
                
                .tab-button {
                    position: relative;
                    overflow: hidden;
                }
                
                .tab-button::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }
                
                .tab-button.active::after {
                    transform: scaleX(1);
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .upload-zone {
                    transition: all 0.3s ease;
                }
                
                .upload-zone:hover {
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.05);
                }
            `}</style>
            
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                    duration={notification.duration}
                />
            )}
            
            {confirmDialog && <ConfirmDialog {...confirmDialog} />}
            
            {/* Header */}
            <div style={{ 
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
                <h1 style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    margin: 0,
                    fontSize: '2rem'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Home size={32} color="white" />
                    </div>
                    <span className="gradient-text">Home Content Management</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', marginLeft: '4rem', fontSize: '1.05rem' }}>
                    Manage hero section and university leadership content displayed on student dashboard
                </p>
            </div>

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '2rem',
                background: 'var(--bg-secondary)',
                padding: '0.5rem',
                borderRadius: '12px'
            }}>
                <button
                    onClick={() => setActiveTab('hero')}
                    className={`tab-button ${activeTab === 'hero' ? 'active' : ''}`}
                    style={{
                        flex: 1,
                        padding: '1rem 1.5rem',
                        border: 'none',
                        background: activeTab === 'hero' ? 'white' : 'transparent',
                        color: activeTab === 'hero' ? '#3b82f6' : 'var(--text-main)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: activeTab === 'hero' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Sparkles size={20} />
                    Hero Section
                </button>
                <button
                    onClick={() => setActiveTab('leadership')}
                    className={`tab-button ${activeTab === 'leadership' ? 'active' : ''}`}
                    style={{
                        flex: 1,
                        padding: '1rem 1.5rem',
                        border: 'none',
                        background: activeTab === 'leadership' ? 'white' : 'transparent',
                        color: activeTab === 'leadership' ? '#3b82f6' : 'var(--text-main)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: activeTab === 'leadership' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Award size={20} />
                    Leadership Section
                </button>
            </div>

            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
                <div className="fade-in">
                    <div className="card" style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            marginBottom: '2rem',
                            paddingBottom: '1.5rem',
                            borderBottom: '3px solid #3b82f6'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                padding: '1rem',
                                borderRadius: '12px',
                                display: 'flex',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}>
                                <Sparkles size={28} color="white" />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
                                    Hero Section Content
                                </h2>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
                                    Customize the main banner displayed on student dashboard
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Left Column - Text Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div>
                                    <label style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem', 
                                        fontWeight: 700,
                                        color: '#1f2937',
                                        fontSize: '1rem'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#3b82f6'
                                        }}></div>
                                        Main Title
                                        <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={heroForm.heroTitle}
                                        onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                                        placeholder="Enter hero title"
                                        style={{
                                            fontSize: '1.1rem',
                                            padding: '1rem 1.25rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <p style={{ 
                                        margin: '0.5rem 0 0 0', 
                                        fontSize: '0.85rem', 
                                        color: '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{ 
                                            display: 'inline-block',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            background: heroForm.heroTitle ? '#10b981' : '#f59e0b',
                                            fontSize: '10px',
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '16px',
                                            fontWeight: 'bold'
                                        }}>
                                            {heroForm.heroTitle ? '✓' : '!'}
                                        </span>
                                        {heroForm.heroTitle.length} characters
                                    </p>
                                </div>

                                <div>
                                    <label style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem', 
                                        fontWeight: 700,
                                        color: '#1f2937',
                                        fontSize: '1rem'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#8b5cf6'
                                        }}></div>
                                        Subtitle
                                        <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={heroForm.heroSubtitle}
                                        onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                                        placeholder="Enter hero subtitle"
                                        style={{
                                            fontSize: '1.1rem',
                                            padding: '1rem 1.25rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8b5cf6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <p style={{ 
                                        margin: '0.5rem 0 0 0', 
                                        fontSize: '0.85rem', 
                                        color: '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{ 
                                            display: 'inline-block',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            background: heroForm.heroSubtitle ? '#10b981' : '#f59e0b',
                                            fontSize: '10px',
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '16px',
                                            fontWeight: 'bold'
                                        }}>
                                            {heroForm.heroSubtitle ? '✓' : '!'}
                                        </span>
                                        {heroForm.heroSubtitle.length} characters
                                    </p>
                                </div>

                                <div>
                                    <label style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem', 
                                        fontWeight: 700,
                                        color: '#1f2937',
                                        fontSize: '1rem'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#10b981'
                                        }}></div>
                                        Description
                                    </label>
                                    <textarea
                                        className="input-field"
                                        value={heroForm.heroDescription}
                                        onChange={(e) => setHeroForm({ ...heroForm, heroDescription: e.target.value })}
                                        placeholder="Enter hero description (optional)"
                                        rows="6"
                                        style={{
                                            fontSize: '1rem',
                                            padding: '1rem 1.25rem',
                                            lineHeight: '1.6',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s',
                                            resize: 'vertical'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#10b981';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <p style={{ 
                                        margin: '0.5rem 0 0 0', 
                                        fontSize: '0.85rem', 
                                        color: '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <span style={{ 
                                            display: 'inline-block',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            background: '#94a3b8',
                                            fontSize: '10px',
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '16px',
                                            fontWeight: 'bold'
                                        }}>
                                            i
                                        </span>
                                        {heroForm.heroDescription.length} characters • Optional field
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div>
                                <label style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem', 
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    fontSize: '1rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#f59e0b'
                                    }}></div>
                                    Background Image
                                    <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                                </label>
                                
                                <div style={{
                                    border: '3px dashed #d1d5db',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    background: 'rgba(59, 130, 246, 0.02)',
                                    transition: 'all 0.3s'
                                }}>
                                    {heroImagePreview ? (
                                        <div style={{ position: 'relative' }}>
                                            <img 
                                                src={heroImagePreview} 
                                                alt="Hero preview" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '400px', 
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }} 
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'rgba(16, 185, 129, 0.95)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }}>
                                                <Eye size={16} /> Current Image
                                            </div>
                                            <label style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: 'rgba(59, 130, 246, 0.95)',
                                                color: 'white',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.95)';
                                                e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.95)';
                                                e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
                                            }}
                                            >
                                                <Upload size={18} /> Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleHeroImageChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="upload-zone" style={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '4rem 2rem',
                                            cursor: 'pointer',
                                            minHeight: '400px'
                                        }}>
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '1.5rem',
                                                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                                            }}>
                                                <Upload size={40} color="white" />
                                            </div>
                                            <p style={{ 
                                                margin: 0, 
                                                color: '#1f2937', 
                                                fontWeight: 700, 
                                                marginBottom: '0.5rem',
                                                fontSize: '1.1rem'
                                            }}>
                                                Click to upload hero image
                                            </p>
                                            <p style={{ 
                                                margin: 0, 
                                                color: '#6b7280', 
                                                fontSize: '0.9rem',
                                                marginBottom: '0.25rem'
                                            }}>
                                                PNG, JPG, WEBP up to 10MB
                                            </p>
                                            <p style={{ 
                                                margin: 0, 
                                                color: '#9ca3af', 
                                                fontSize: '0.85rem'
                                            }}>
                                                Recommended: 1920x1080px
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleHeroImageChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    )}
                                </div>
                                
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(59, 130, 246, 0.1)'
                                }}>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '0.85rem', 
                                        color: '#475569',
                                        lineHeight: 1.6
                                    }}>
                                        <strong style={{ color: '#1f2937' }}>💡 Tip:</strong> Use a high-quality landscape image that represents your university. The image will be displayed as the main banner on the student dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            marginTop: '2.5rem',
                            paddingTop: '2rem',
                            borderTop: '2px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: (heroForm.heroTitle && heroForm.heroSubtitle && heroForm.heroImage) ? '#10b981' : '#f59e0b',
                                    boxShadow: `0 0 0 3px ${(heroForm.heroTitle && heroForm.heroSubtitle && heroForm.heroImage) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                }}></div>
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    color: '#6b7280',
                                    fontWeight: 500
                                }}>
                                    {(heroForm.heroTitle && heroForm.heroSubtitle && heroForm.heroImage) 
                                        ? '✓ All required fields completed' 
                                        : '⚠ Please fill all required fields'}
                                </span>
                            </div>
                            
                            <button 
                                onClick={handleSaveHero}
                                disabled={saving || !heroForm.heroTitle || !heroForm.heroSubtitle}
                                className="btn btn-primary"
                                style={{ 
                                    gap: '0.75rem', 
                                    padding: '1rem 2.5rem',
                                    fontSize: '1.05rem',
                                    background: saving || !heroForm.heroTitle || !heroForm.heroSubtitle 
                                        ? '#9ca3af' 
                                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    border: 'none',
                                    boxShadow: saving || !heroForm.heroTitle || !heroForm.heroSubtitle 
                                        ? 'none' 
                                        : '0 4px 12px rgba(59, 130, 246, 0.4)',
                                    cursor: saving || !heroForm.heroTitle || !heroForm.heroSubtitle 
                                        ? 'not-allowed' 
                                        : 'pointer',
                                    fontWeight: 700,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Save size={22} /> {saving ? 'Saving Changes...' : 'Save Hero Section'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leadership Section Tab */}
            {activeTab === 'leadership' && (
                <div className="fade-in">
                    <div className="card" style={{ 
                        marginBottom: '2rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            marginBottom: '2rem',
                            paddingBottom: '1.5rem',
                            borderBottom: '3px solid #8b5cf6'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                padding: '1rem',
                                borderRadius: '12px',
                                display: 'flex',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                            }}>
                                <Award size={28} color="white" />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
                                    Leadership Section Info
                                </h2>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
                                    Customize the leadership section header and description
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem', 
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    fontSize: '1rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#8b5cf6'
                                    }}></div>
                                    Section Title
                                    <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={leadershipForm.leadershipTitle}
                                    onChange={(e) => setLeadershipForm({ ...leadershipForm, leadershipTitle: e.target.value })}
                                    placeholder="e.g., University Leadership"
                                    style={{
                                        fontSize: '1.1rem',
                                        padding: '1rem 1.25rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#8b5cf6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <p style={{ 
                                    margin: '0.5rem 0 0 0', 
                                    fontSize: '0.85rem', 
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: leadershipForm.leadershipTitle ? '#10b981' : '#f59e0b',
                                        fontSize: '10px',
                                        color: 'white',
                                        textAlign: 'center',
                                        lineHeight: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                        {leadershipForm.leadershipTitle ? '✓' : '!'}
                                    </span>
                                    {leadershipForm.leadershipTitle.length} characters • This appears as the main heading
                                </p>
                            </div>

                            <div>
                                <label style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem', 
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    fontSize: '1rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#ec4899'
                                    }}></div>
                                    Section Description
                                </label>
                                <textarea
                                    className="input-field"
                                    value={leadershipForm.leadershipDescription}
                                    onChange={(e) => setLeadershipForm({ ...leadershipForm, leadershipDescription: e.target.value })}
                                    placeholder="Enter a brief description about the leadership section..."
                                    rows="4"
                                    style={{
                                        fontSize: '1rem',
                                        padding: '1rem 1.25rem',
                                        lineHeight: '1.6',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        transition: 'all 0.2s',
                                        resize: 'vertical'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#ec4899';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <p style={{ 
                                    margin: '0.5rem 0 0 0', 
                                    fontSize: '0.85rem', 
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: '#94a3b8',
                                        fontSize: '10px',
                                        color: 'white',
                                        textAlign: 'center',
                                        lineHeight: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                        i
                                    </span>
                                    {leadershipForm.leadershipDescription.length} characters • Appears below the title
                                </p>
                            </div>

                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(139, 92, 246, 0.05)',
                                borderRadius: '10px',
                                border: '1px solid rgba(139, 92, 246, 0.1)'
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '0.9rem', 
                                    color: '#475569',
                                    lineHeight: 1.6
                                }}>
                                    <strong style={{ color: '#1f2937' }}>💡 Tip:</strong> Keep the description concise and welcoming. It should introduce visitors to your university's leadership team and set the tone for the profiles below.
                                </p>
                            </div>
                        </div>

                        <div style={{ 
                            marginTop: '2rem',
                            paddingTop: '1.5rem',
                            borderTop: '2px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: leadershipForm.leadershipTitle ? '#10b981' : '#f59e0b',
                                    boxShadow: `0 0 0 3px ${leadershipForm.leadershipTitle ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                                }}></div>
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    color: '#6b7280',
                                    fontWeight: 500
                                }}>
                                    {leadershipForm.leadershipTitle 
                                        ? '✓ Section title is set' 
                                        : '⚠ Please enter a section title'}
                                </span>
                            </div>
                            
                            <button 
                                onClick={handleSaveLeadership}
                                disabled={saving || !leadershipForm.leadershipTitle}
                                className="btn btn-primary"
                                style={{ 
                                    gap: '0.75rem', 
                                    padding: '1rem 2.5rem',
                                    fontSize: '1.05rem',
                                    background: saving || !leadershipForm.leadershipTitle 
                                        ? '#9ca3af' 
                                        : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                    border: 'none',
                                    boxShadow: saving || !leadershipForm.leadershipTitle 
                                        ? 'none' 
                                        : '0 4px 12px rgba(139, 92, 246, 0.4)',
                                    cursor: saving || !leadershipForm.leadershipTitle 
                                        ? 'not-allowed' 
                                        : 'pointer',
                                    fontWeight: 700,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Save size={22} /> {saving ? 'Saving Changes...' : 'Save Leadership Info'}
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={28} color="#3b82f6" />
                                    Leadership Members
                                </h2>
                                <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    First leader will be displayed as President. Drag to reorder.
                                </p>
                            </div>
                            <button 
                                onClick={handleAddLeader}
                                className="btn btn-primary"
                                style={{ 
                                    gap: '0.5rem',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    padding: '0.75rem 1.5rem'
                                }}
                            >
                                <Plus size={20} /> Add Leader
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {content?.leaders?.sort((a, b) => a.order - b.order).map((leader, index) => (
                                <div 
                                    key={leader._id}
                                    className="card leader-card"
                                    style={{ 
                                        padding: '0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    {index === 0 && (
                                        <div className="president-badge">
                                            <Crown size={14} /> President
                                        </div>
                                    )}
                                    
                                    {/* Full-width Image */}
                                    <div style={{ 
                                        position: 'relative',
                                        width: '100%',
                                        paddingTop: '75%', // 4:3 aspect ratio
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                                    }}>
                                        <img 
                                            src={leader.image} 
                                            alt={leader.name}
                                            style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover'
                                            }}
                                        />
                                        
                                        {/* Overlay Controls */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            display: 'flex',
                                            gap: '0.5rem',
                                            zIndex: 10
                                        }}>
                                            {index > 0 && (
                                                <button
                                                    onClick={() => handleMoveLeader(leader._id, 'up')}
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Move up"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                                    }}
                                                >
                                                    <ArrowUp size={18} color="#3b82f6" />
                                                </button>
                                            )}
                                            {index < content.leaders.length - 1 && (
                                                <button
                                                    onClick={() => handleMoveLeader(leader._id, 'down')}
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Move down"
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                                    }}
                                                >
                                                    <ArrowDown size={18} color="#3b82f6" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Order Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'rgba(59, 130, 246, 0.95)',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}>
                                            #{index + 1}
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div style={{ 
                                        padding: '1.5rem',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <h3 style={{ 
                                            margin: '0 0 0.5rem 0', 
                                            fontSize: '1.15rem', 
                                            color: '#1f2937',
                                            fontWeight: 700,
                                            lineHeight: 1.3
                                        }}>
                                            {leader.name}
                                        </h3>
                                        
                                        <div style={{ 
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                                            color: '#3b82f6', 
                                            fontWeight: 600, 
                                            margin: '0 0 1rem 0', 
                                            fontSize: '0.9rem',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                        }}>
                                            <UserCircle size={16} />
                                            <span style={{ flex: 1 }}>{leader.position}</span>
                                        </div>
                                        
                                        <p style={{ 
                                            color: '#6b7280', 
                                            fontSize: '0.9rem', 
                                            marginBottom: '1.5rem', 
                                            lineHeight: 1.6,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            flex: 1
                                        }}>
                                            {leader.description}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '0.75rem',
                                            marginTop: 'auto'
                                        }}>
                                            <button 
                                                onClick={() => handleEditLeader(leader)}
                                                className="btn btn-secondary"
                                                style={{ 
                                                    flex: 1, 
                                                    gap: '0.5rem',
                                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <Edit2 size={16} /> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteLeader(leader._id)}
                                                style={{ 
                                                    padding: '0.75rem 1rem',
                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    minWidth: '50px'
                                                }}
                                                title="Delete leader"
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(!content?.leaders || content.leaders.length === 0) && (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '4rem 2rem', 
                                background: 'rgba(139, 92, 246, 0.05)',
                                borderRadius: '12px',
                                border: '2px dashed rgba(139, 92, 246, 0.2)'
                            }}>
                                <Users size={64} style={{ margin: '0 auto 1rem', opacity: 0.3, color: '#8b5cf6' }} />
                                <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    No leaders added yet
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                    Click "Add Leader" button to get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Leader Modal */}
            {showLeaderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="card" style={{ 
                        width: '90%', 
                        maxWidth: '650px', 
                        maxHeight: '90vh', 
                        overflow: 'auto',
                        animation: 'fadeIn 0.3s ease-out',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '2rem',
                            paddingBottom: '1rem',
                            borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
                        }}>
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '1.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    display: 'flex'
                                }}>
                                    {editingLeader ? <Edit2 size={24} color="white" /> : <Plus size={24} color="white" />}
                                </div>
                                {editingLeader ? 'Edit Leader' : 'Add New Leader'}
                            </h2>
                            <button 
                                onClick={() => setShowLeaderModal(false)}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            >
                                <X size={24} color="#ef4444" />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem', 
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.95rem'
                                }}>
                                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={leaderForm.name}
                                    onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                                    placeholder="e.g., Prof. John Doe"
                                    style={{
                                        fontSize: '1.05rem',
                                        padding: '0.75rem 1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem', 
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.95rem'
                                }}>
                                    Position/Title <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={leaderForm.position}
                                    onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })}
                                    placeholder="e.g., President, Vice President, Director"
                                    style={{
                                        fontSize: '1.05rem',
                                        padding: '0.75rem 1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem', 
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.95rem'
                                }}>
                                    Description/Bio <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <textarea
                                    className="input-field"
                                    value={leaderForm.description}
                                    onChange={(e) => setLeaderForm({ ...leaderForm, description: e.target.value })}
                                    placeholder="Enter a brief description about the leader's role and achievements..."
                                    rows="5"
                                    style={{
                                        fontSize: '1rem',
                                        padding: '0.75rem 1rem',
                                        lineHeight: '1.6'
                                    }}
                                />
                                <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: '#6b7280', 
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {leaderForm.description.length} characters
                                </p>
                            </div>

                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.75rem', 
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.95rem'
                                }}>
                                    Profile Photo
                                </label>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start', flexWrap: 'wrap' }}>
                                    {leaderImagePreview && (
                                        <div style={{ position: 'relative' }}>
                                            <img 
                                                src={leaderImagePreview} 
                                                alt="Leader preview" 
                                                style={{ 
                                                    width: '150px', 
                                                    height: '150px', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '12px',
                                                    border: '3px solid #3b82f6',
                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                                                }} 
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: 'rgba(59, 130, 246, 0.9)',
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600
                                            }}>
                                                Preview
                                            </div>
                                        </div>
                                    )}
                                    <label className="upload-zone" style={{ 
                                        flex: 1,
                                        minWidth: '200px',
                                        padding: '2rem',
                                        border: '3px dashed #d1d5db',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: 'rgba(59, 130, 246, 0.02)'
                                    }}>
                                        <Image size={36} style={{ margin: '0 auto 0.75rem', color: '#3b82f6' }} />
                                        <p style={{ margin: 0, color: '#374151', fontWeight: 600, marginBottom: '0.25rem' }}>
                                            Click to upload photo
                                        </p>
                                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.85rem' }}>
                                            PNG, JPG up to 5MB
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLeaderImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                gap: '0.75rem', 
                                justifyContent: 'flex-end',
                                paddingTop: '1rem',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <button 
                                    onClick={() => setShowLeaderModal(false)}
                                    className="btn btn-secondary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveLeader}
                                    disabled={saving}
                                    className="btn btn-primary"
                                    style={{ 
                                        gap: '0.5rem',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1rem',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                    }}
                                >
                                    <Save size={20} /> {saving ? 'Saving...' : (editingLeader ? 'Update Leader' : 'Add Leader')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeContentManagement;
