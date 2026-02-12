import { useState, useContext, useEffect } from 'react';
import { AlertCircle, Send, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import { AuthContext } from '../../context/AuthContext';

const ReportIssue = () => {
    const { user } = useContext(AuthContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [formData, setFormData] = useState({
        requestType: 'Facility Issue',
        subject: '',
        message: '',
        priority: 'medium',
        currentRoom: ''
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
        
        if (!formData.subject.trim() || !formData.message.trim()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                fromUserId: user?._id || null,
                fromUserModel: 'Student',
                fromUserName: user?.fullName || user?.name || user?.username || 'Student',
                studentId: user?.studentId || user?.id || 'N/A',
                studentName: user?.fullName || user?.name || user?.username || 'Student',
                email: user?.email || '',
                phone: user?.phone || '',
                requestType: formData.requestType,
                subject: formData.subject,
                message: formData.message,
                priority: formData.priority,
                currentRoom: formData.currentRoom || '',
                status: 'pending'
            };

            console.log('Submitting report:', requestData);
            
            const response = await axios.post(`${API_URL}/api/requests`, requestData);
            
            console.log('Response:', response.data);
            
            showNotification('Report submitted successfully! Admin will review it soon.', 'success');
            
            // Reset form
            setFormData({
                requestType: 'Facility Issue',
                subject: '',
                message: '',
                priority: 'medium',
                currentRoom: ''
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            console.error('Error response:', error.response?.data);
            showNotification(error.response?.data?.message || 'Failed to submit report. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '1rem' : '2rem'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: isMobile ? '20px' : '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                    padding: isMobile ? '2rem 1.5rem' : '3rem',
                    maxWidth: '700px',
                    width: '100%'
                }}>
                    {/* Header */}
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
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        textAlign: 'center'
                    }}>
                        Report an Issue
                    </h2>
                    <p style={{
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        Submit facility issues, maintenance requests, or concerns. Admin will review and respond.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Issue Type <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                name="requestType"
                                value={formData.requestType}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    backgroundColor: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="Facility Issue">Facility Issue</option>
                                <option value="Maintenance">Maintenance Request</option>
                                <option value="Room Change">Room Change Request</option>
                                <option value="Report">General Report</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Priority Level <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    backgroundColor: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="low">Low - Can wait</option>
                                <option value="medium">Medium - Normal priority</option>
                                <option value="high">High - Needs attention soon</option>
                                <option value="urgent">Urgent - Immediate attention required</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Room Number (Optional)
                            </label>
                            <input
                                type="text"
                                name="currentRoom"
                                value={formData.currentRoom}
                                onChange={handleChange}
                                placeholder="e.g., B-205"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Subject <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Brief description of the issue"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Detailed Description <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Provide detailed information about the issue..."
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
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
                            onMouseEnter={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                                }
                            }}
                        >
                            <Send size={20} />
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
            
            <footer style={{
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
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
