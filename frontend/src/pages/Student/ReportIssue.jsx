import { useState, useEffect } from 'react';
import { AlertCircle, Send, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ReportIssue = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        block: '',
        dormNumber: '',
        reportBlock: '',
        reportRoomNumber: '',
        title: '',
        issue: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        if (!formData.fullName.trim() || !formData.studentId.trim() || 
            !formData.block.trim() || !formData.dormNumber.trim() || 
            !formData.reportBlock.trim() || !formData.title.trim() || !formData.issue.trim()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                fromUserId: user?._id || null,
                fromUserModel: 'Student',
                fromUserName: formData.fullName,
                studentId: formData.studentId,
                studentName: formData.fullName,
                email: user?.email || '',
                phone: user?.phone || '',
                requestType: 'Report',
                subject: formData.title,
                message: formData.issue,
                currentRoom: formData.reportRoomNumber 
                    ? `${formData.reportBlock}-${formData.reportRoomNumber}` 
                    : formData.reportBlock,
                status: 'pending'
            };

            console.log('Submitting report:', requestData);
            
            const response = await axios.post(`${API_URL}/api/requests`, requestData);
            
            console.log('Response:', response.data);
            
            showNotification('Report submitted successfully! Admin will review it soon.', 'success');
            
            // Reset form
            setFormData({
                fullName: '',
                studentId: '',
                block: '',
                dormNumber: '',
                reportBlock: '',
                reportRoomNumber: '',
                title: '',
                issue: ''
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
            
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit report. Please try again.';
            showNotification(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            background: isDarkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            overflow: 'auto'
        }}>
            {/* Notification */}
            {notification && (
                <div style={{ 
                    position: 'fixed', 
                    top: isMobile ? '1rem' : '2rem', 
                    right: isMobile ? '1rem' : '2rem',
                    left: isMobile ? '1rem' : 'auto',
                    zIndex: 10001, 
                    minWidth: isMobile ? 'auto' : '350px', 
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                    color: 'white', 
                    padding: '1.25rem 1.5rem', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
                    animation: 'slideInRight 0.5s ease-out' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <div style={{ flex: 1, fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>{notification.message}</div>
                        <button 
                            onClick={() => setNotification(null)} 
                            style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                border: 'none', 
                                color: 'white', 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '1rem' : '2rem',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Report Form */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        backgroundColor: isDarkMode ? '#1e293b' : 'white',
                        borderRadius: isMobile ? '20px' : '24px',
                        boxShadow: isDarkMode 
                            ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                            : '0 20px 60px rgba(0, 0, 0, 0.12)',
                        padding: isMobile ? '2rem 1.5rem' : '3rem'
                    }}>
                        <div style={{
                            width: isMobile ? '64px' : '80px',
                            height: isMobile ? '64px' : '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
                        }}>
                            <AlertCircle size={isMobile ? 32 : 40} color="white" strokeWidth={2.5} />
                        </div>
                        <h2 style={{
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            fontWeight: 800,
                            color: isDarkMode ? '#f1f5f9' : '#1f2937',
                            marginBottom: '0.5rem',
                            textAlign: 'center'
                        }}>
                            Submit Report
                        </h2>
                        <p style={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            color: isDarkMode ? '#94a3b8' : '#6b7280',
                            lineHeight: 1.6,
                            textAlign: 'center',
                            marginBottom: '2rem'
                        }}>
                            Fill in all required fields to submit your report
                        </p>
                        <form onSubmit={handleSubmit}>
                                    {/* Student Information Section */}
                                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: isDarkMode ? '#334155' : '#f8fafc', borderRadius: '12px' }}>
                                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                                            Student Information
                                        </h3>
                                        
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.5rem' }}>
                                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: `2px solid ${isDarkMode ? '#475569' : '#e5e7eb'}`,
                                                    borderRadius: '10px',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s',
                                                    background: isDarkMode ? '#1e293b' : 'white',
                                                    color: isDarkMode ? '#f1f5f9' : '#1f2937'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#475569' : '#e5e7eb'}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDarkMode ? '#cbd5e1' : '#374151', marginBottom: '0.5rem' }}>
                                                Student ID <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="studentId"
                                                value={formData.studentId}
                                                onChange={handleChange}
                                                placeholder="Enter your student ID"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '10px',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                    Block <span style={{ color: '#ef4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="block"
                                                    value={formData.block}
                                                    onChange={handleChange}
                                                    placeholder="e.g., A, B, C"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                    Dorm Number <span style={{ color: '#ef4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dormNumber"
                                                    value={formData.dormNumber}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 205"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Details Section */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                                            Report Details
                                        </h3>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                    Block <span style={{ color: '#ef4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="reportBlock"
                                                    value={formData.reportBlock}
                                                    onChange={handleChange}
                                                    placeholder="e.g., A, B, C"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                    Room Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="reportRoomNumber"
                                                    value={formData.reportRoomNumber}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 205 (optional)"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                Title <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Brief title of your issue"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '10px',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                Issue Description <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <textarea
                                                name="issue"
                                                value={formData.issue}
                                                onChange={handleChange}
                                                placeholder="Describe your issue in detail..."
                                                required
                                                rows={6}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '10px',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2rem',
                                            background: submitting
                                                ? '#e5e7eb' 
                                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: submitting ? '#9ca3af' : 'white',
                                            border: 'none',
                                            borderRadius: '14px',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            boxShadow: submitting ? 'none' : '0 8px 24px rgba(239, 68, 68, 0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Send size={20} />
                                        {submitting ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </form>
                    </div>
                </div>
            </div>
            
            <footer style={{
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                borderTop: '1px solid #2d4a6f',
                flexShrink: 0
            }}>
                Copyright @ 2026 Oda Bultum University. All rights reserved.
            </footer>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default ReportIssue;
