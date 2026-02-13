import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Eye, X, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';

const NewsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/announcements/public`);
            setAnnouncements(response.data.announcements || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/student/home');
    };

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const handleCloseModal = () => {
        setSelectedAnnouncement(null);
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        border: '4px solid rgba(255,255,255,0.3)', 
                        borderTopColor: 'white', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite', 
                        margin: '0 auto 1rem' 
                    }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'float 20s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                    animation: 'float 15s ease-in-out infinite reverse'
                }} />

                <div style={{ 
                    maxWidth: '1400px', 
                    margin: '0 auto', 
                    padding: '3rem 2rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '3rem' }}>
                        <button
                            onClick={handleBack}
                            style={{
                                padding: '0.875rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#667eea',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                marginBottom: '2rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                            Back to Home
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Newspaper size={36} color="white" strokeWidth={2} />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '3rem',
                                    fontWeight: 900,
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-1px',
                                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                                }}>
                                    All News & Announcements
                                </h1>
                                <p style={{
                                    fontSize: '1.1rem',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    margin: '0.5rem 0 0 0'
                                }}>
                                    {announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'} available
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Announcements Grid */}
                    {announcements.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
                        }}>
                            <Newspaper size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.3, color: '#667eea' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                                No announcements yet
                            </h2>
                            <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                                Check back later for updates
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                            gap: '2rem'
                        }}>
                            {announcements.map((announcement, index) => (
                                <div
                                    key={announcement._id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        animation: `slideUp 0.6s ease-out ${index * 0.05}s both`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
                                    }}
                                >
                                    {/* Image Section - AT THE TOP */}
                                    {announcement.imageUrl && (
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '280px',
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
                                                height: '120px',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                                            }} />
                                        </div>
                                    )}

                                    {/* Content Section - BELOW IMAGE */}
                                    <div style={{ padding: '2rem' }}>
                                        {/* Date Badge */}
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1.25rem',
                                            padding: '0.625rem 1.25rem',
                                            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                                            borderRadius: '12px',
                                            border: '1px solid #667eea30'
                                        }}>
                                            <Calendar size={18} color="#667eea" strokeWidth={2.5} />
                                            <span style={{
                                                fontSize: '0.9rem',
                                                color: '#667eea',
                                                fontWeight: 700
                                            }}>
                                                {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 style={{
                                            fontSize: '1.75rem',
                                            fontWeight: 900,
                                            color: '#0f172a',
                                            margin: '0 0 1rem 0',
                                            lineHeight: '1.2',
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
                                            fontSize: '1.05rem',
                                            color: '#64748b',
                                            lineHeight: '1.8',
                                            margin: '0 0 1.75rem 0',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {announcement.content}
                                        </p>

                                        {/* Detail Button */}
                                        <button
                                            onClick={() => handleViewDetails(announcement)}
                                            style={{
                                                padding: '1rem 2.5rem',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '14px',
                                                color: 'white',
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                                                width: '100%',
                                                justifyContent: 'center',
                                                letterSpacing: '0.3px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                                            }}
                                        >
                                            <Eye size={20} strokeWidth={2.5} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
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

            {/* Detail Modal - Same as NewsSection */}
            {selectedAnnouncement && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '2rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.3)',
                        animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                width: '48px',
                                height: '48px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.2s',
                                zIndex: 1
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                e.currentTarget.style.background = '#ef4444';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'rotate(0) scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                            }}
                        >
                            <X size={24} color="#1e293b" />
                        </button>

                        {selectedAnnouncement.imageUrl && (
                            <div style={{
                                position: 'relative',
                                paddingTop: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '24px 24px 0 0',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={selectedAnnouncement.imageUrl}
                                    alt={selectedAnnouncement.title}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        )}

                        <div style={{ padding: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <Calendar size={18} color="#667eea" />
                                <span style={{
                                    fontSize: '0.95rem',
                                    color: '#667eea',
                                    fontWeight: 600
                                }}>
                                    {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: 900,
                                color: '#1e293b',
                                margin: '0 0 1.5rem 0',
                                lineHeight: '1.2',
                                letterSpacing: '-0.5px'
                            }}>
                                {selectedAnnouncement.title}
                            </h2>

                            <div style={{
                                fontSize: '1.125rem',
                                color: '#475569',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {selectedAnnouncement.content}
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }

                        @keyframes modalSlideUp {
                            from {
                                opacity: 0;
                                transform: translateY(50px) scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default NewsPage;
