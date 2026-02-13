import { useState, useEffect } from 'react';
import { Newspaper, ArrowRight, X, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/api';

const NewsSection = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/announcements`);
            setAnnouncements(response.data.announcements || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        navigate('/student/news');
    };

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const handleCloseModal = () => {
        setSelectedAnnouncement(null);
    };

    // Don't render if no announcements
    if (!loading && announcements.length === 0) {
        return null;
    }

    if (loading) {
        return null;
    }

    // Show only first 2 announcements
    const displayedAnnouncements = announcements.slice(0, 2);
    const hasMore = announcements.length > 2;

    return (
        <>
            <section style={{
                padding: '4rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    filter: 'blur(50px)',
                    animation: 'float 15s ease-in-out infinite reverse'
                }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {/* Section Header */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '3rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Newspaper size={32} color="white" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 900,
                                    color: 'white',
                                    margin: 0,
                                    letterSpacing: '-1px',
                                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)'
                                }}>
                                    News
                                </h2>
                                <p style={{
                                    fontSize: '1rem',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    margin: '0.25rem 0 0 0'
                                }}>
                                    Stay updated with latest announcements
                                </p>
                            </div>
                        </div>

                        {hasMore && (
                            <button
                                onClick={handleViewAll}
                                style={{
                                    padding: '0.875rem 2rem',
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
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                                }}
                            >
                                View All
                                <ArrowRight size={20} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    {/* Announcement Cards */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        {displayedAnnouncements.map((announcement, index) => (
                            <div
                                key={announcement._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                                    display: 'grid',
                                    gridTemplateColumns: announcement.imageUrl ? '45% 55%' : '1fr',
                                    minHeight: '320px'
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
                                {/* Image Section */}
                                {announcement.imageUrl && (
                                    <div style={{
                                        position: 'relative',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        overflow: 'hidden',
                                        minHeight: '320px'
                                    }}>
                                        <img
                                            src={announcement.imageUrl}
                                            alt={announcement.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.4s ease',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                                        }} />
                                    </div>
                                )}

                                {/* Content Section */}
                                <div style={{ 
                                    padding: '2.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    {/* Date Badge */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1.5rem',
                                        padding: '0.625rem 1.25rem',
                                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                                        borderRadius: '12px',
                                        width: 'fit-content',
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
                                        fontSize: '2rem',
                                        fontWeight: 900,
                                        color: '#0f172a',
                                        margin: '0 0 1.25rem 0',
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
                                        margin: '0 0 2rem 0',
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
                                            width: 'fit-content',
                                            letterSpacing: '0.3px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateX(0)';
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

                    @media (max-width: 1024px) {
                        section > div > div:first-child {
                            flex-direction: column;
                            align-items: flex-start !important;
                        }
                        
                        /* Make cards stack vertically on tablets */
                        section > div > div:last-of-type > div {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 768px) {
                        /* Stack image and content vertically on mobile */
                        section > div > div:last-of-type > div > div:first-child {
                            min-height: 250px !important;
                        }
                        
                        section > div > div:last-of-type > div > div:last-child {
                            padding: 1.5rem !important;
                        }
                        
                        section > div > div:last-of-type > div > div:last-child h3 {
                            font-size: 1.5rem !important;
                        }
                        
                        section > div > div:last-of-type > div > div:last-child p {
                            font-size: 0.95rem !important;
                        }
                    }
                `}</style>
            </section>

            {/* Detail Modal */}
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
                        {/* Close Button */}
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

                        {/* Image */}
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

                        {/* Content */}
                        <div style={{ padding: '3rem' }}>
                            {/* Date */}
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

                            {/* Title */}
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

                            {/* Full Content */}
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

export default NewsSection;
