import { useState, useEffect } from 'react';
import { AlertCircle, Send, CheckCircle, X, Trash2, Clock, FileText } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const ReportIssue = () => {
    const { user } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [step, setStep] = useState('id-verification'); // 'id-verification', 'form'
    const [studentId, setStudentId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        block: '',
        dormNumber: '',
        title: '',
        issue: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [myReports, setMyReports] = useState([]);
    const [hasPendingReport, setHasPendingReport] = useState(false);
    
    // Sidebar state
    const [sidebarStudentId, setSidebarStudentId] = useState('');
    const [loadingSidebarReports, setLoadingSidebarReports] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleIdVerification = async (e) => {
        e.preventDefault();
        
        if (!studentId.trim()) {
            showNotification('Please enter your Student ID', 'error');
            return;
        }

        setVerifying(true);
        try {
            // Fetch student's reports using public endpoint
            try {
                const response = await axios.get(`${API_URL}/api/requests/student/${studentId}`);
                const studentReports = response.data;
                
                // Check if there's a pending report
                const pending = studentReports.some(r => r.status === 'pending');
                setHasPendingReport(pending);
                
                // Also load in sidebar
                setSidebarStudentId(studentId);
                setMyReports(studentReports);
            } catch (fetchError) {
                console.log('Could not fetch existing reports:', fetchError.message);
                // Continue anyway - student can still submit
            }
            
            setVerified(true);
            setStep('form');
            
            // Pre-fill student ID in form
            setFormData(prev => ({ ...prev, studentId: studentId }));
            
            showNotification('ID verified successfully!', 'success');
        } catch (error) {
            console.error('Error verifying ID:', error);
            showNotification('Failed to verify ID. Please try again.', 'error');
        } finally {
            setVerifying(false);
        }
    };

    const handleLoadSidebarReports = async (e) => {
        e.preventDefault();
        
        if (!sidebarStudentId.trim()) {
            showNotification('Please enter your Student ID', 'error');
            return;
        }

        setLoadingSidebarReports(true);
        try {
            console.log('Fetching reports for Student ID:', sidebarStudentId);
            console.log('API URL:', `${API_URL}/api/requests/student/${sidebarStudentId}`);
            
            // Use public endpoint to fetch reports by student ID
            const response = await axios.get(`${API_URL}/api/requests/student/${sidebarStudentId}`);
            
            console.log('Response:', response.data);
            
            const studentReports = response.data;
            
            setMyReports(studentReports);
            
            if (studentReports.length === 0) {
                showNotification('No reports found for this Student ID', 'info');
            } else {
                showNotification(`Found ${studentReports.length} report(s)`, 'success');
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);
            
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load reports. Please try again.';
            showNotification(errorMessage, 'error');
        } finally {
            setLoadingSidebarReports(false);
        }
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
            !formData.title.trim() || !formData.issue.trim()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (hasPendingReport) {
            showNotification('You have a pending report. Please wait for admin response before submitting a new one.', 'error');
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
                priority: 'medium',
                currentRoom: `${formData.block}-${formData.dormNumber}`,
                status: 'pending'
            };

            console.log('Submitting report:', requestData);
            
            const response = await axios.post(`${API_URL}/api/requests`, requestData);
            
            console.log('Response:', response.data);
            
            showNotification('Report submitted successfully! Admin will review it soon.', 'success');
            
            // Add to my reports
            setMyReports([response.data, ...myReports]);
            setHasPendingReport(true);
            
            // Reset form except student info
            setFormData({
                fullName: formData.fullName,
                studentId: formData.studentId,
                block: '',
                dormNumber: '',
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

    const handleDeleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                showNotification('Please log in to delete reports', 'error');
                return;
            }
            
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await axios.delete(`${API_URL}/api/requests/${reportId}`, config);
            
            // Remove from local state
            const updatedReports = myReports.filter(r => r._id !== reportId);
            setMyReports(updatedReports);
            
            // Check if there's still a pending report
            const pending = updatedReports.some(r => r.status === 'pending');
            setHasPendingReport(pending);
            
            showNotification('Report deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting report:', error);
            showNotification('Failed to delete report. Please log in first.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fef3c7', color: '#92400e' };
            case 'approved': return { bg: '#dcfce7', color: '#166534' };
            case 'rejected': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
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
                padding: isMobile ? '1rem' : '2rem',
                gap: '2rem',
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                {/* Left Side - Form Section */}
                <div style={{ flex: '0 0 60%' }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: isMobile ? '20px' : '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                        padding: isMobile ? '2rem 1.5rem' : '3rem',
                        height: '100%'
                    }}>
                        {/* ID Verification Step */}
                        {step === 'id-verification' && (
                            <>
                                <div style={{
                                    width: isMobile ? '64px' : '80px',
                                    height: isMobile ? '64px' : '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
                                }}>
                                    <FileText size={isMobile ? 32 : 40} color="white" strokeWidth={2.5} />
                                </div>
                                <h2 style={{
                                    fontSize: isMobile ? '1.5rem' : '2rem',
                                    fontWeight: 800,
                                    color: '#1f2937',
                                    marginBottom: '0.5rem',
                                    textAlign: 'center'
                                }}>
                                    Student ID Verification
                                </h2>
                                <p style={{
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    color: '#6b7280',
                                    lineHeight: 1.6,
                                    textAlign: 'center',
                                    marginBottom: '2rem'
                                }}>
                                    Please enter your Student ID to access the report form
                                </p>

                                <form onSubmit={handleIdVerification}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                            Student ID <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            placeholder="e.g., RU/1270/18"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1.25rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '12px',
                                                fontSize: '1.1rem',
                                                outline: 'none',
                                                transition: 'all 0.3s',
                                                textAlign: 'center',
                                                fontWeight: 600
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={verifying}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2rem',
                                            background: verifying 
                                                ? '#e5e7eb' 
                                                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: verifying ? '#9ca3af' : 'white',
                                            border: 'none',
                                            borderRadius: '14px',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            cursor: verifying ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            boxShadow: verifying ? 'none' : '0 8px 24px rgba(59, 130, 246, 0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {verifying ? 'Verifying...' : 'Verify & Continue'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Report Form Step */}
                        {step === 'form' && verified && (
                            <>
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
                                    Submit Report
                                </h2>
                                <p style={{
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    color: '#6b7280',
                                    lineHeight: 1.6,
                                    textAlign: 'center',
                                    marginBottom: '2rem'
                                }}>
                                    Fill in all required fields to submit your report
                                </p>

                                {hasPendingReport && (
                                    <div style={{
                                        padding: '1rem',
                                        background: '#fef3c7',
                                        border: '2px solid #f59e0b',
                                        borderRadius: '12px',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ margin: 0, color: '#92400e', fontWeight: 600, fontSize: '0.9rem' }}>
                                            ⚠️ You have a pending report. Wait for admin response before submitting a new one.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Student Information Section */}
                                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                                            Student Information
                                        </h3>
                                        
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
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

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                                Student ID <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="studentId"
                                                value={formData.studentId}
                                                readOnly
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '10px',
                                                    fontSize: '0.95rem',
                                                    outline: 'none',
                                                    background: '#f1f5f9',
                                                    color: '#64748b',
                                                    cursor: 'not-allowed'
                                                }}
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
                                        disabled={submitting || hasPendingReport}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2rem',
                                            background: (submitting || hasPendingReport)
                                                ? '#e5e7eb' 
                                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: (submitting || hasPendingReport) ? '#9ca3af' : 'white',
                                            border: 'none',
                                            borderRadius: '14px',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            cursor: (submitting || hasPendingReport) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            boxShadow: (submitting || hasPendingReport) ? 'none' : '0 8px 24px rgba(239, 68, 68, 0.3)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Send size={20} />
                                        {submitting ? 'Submitting...' : hasPendingReport ? 'Pending Report Exists' : 'Submit Report'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side - My Reports (Always Visible) */}
                <div style={{ flex: '0 0 38%' }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: isMobile ? '20px' : '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                        padding: isMobile ? '1.5rem' : '2rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={24} color="#3b82f6" />
                            My Reports
                        </h3>

                        {/* Student ID Input for Sidebar */}
                        <form onSubmit={handleLoadSidebarReports} style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Enter Student ID to view reports
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={sidebarStudentId}
                                    onChange={(e) => setSidebarStudentId(e.target.value)}
                                    placeholder="e.g., RU/1270/18"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <button
                                    type="submit"
                                    disabled={loadingSidebarReports}
                                    style={{
                                        padding: '0.75rem 1.25rem',
                                        background: loadingSidebarReports 
                                            ? '#e5e7eb' 
                                            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: loadingSidebarReports ? '#9ca3af' : 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        cursor: loadingSidebarReports ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {loadingSidebarReports ? 'Loading...' : 'Load'}
                                </button>
                            </div>
                        </form>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {myReports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: '#94a3b8' }} />
                                    <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>No reports yet</p>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.5rem 0 0 0' }}>Enter your Student ID above to view your reports</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myReports.map(report => {
                                        const statusStyle = getStatusColor(report.status);
                                        return (
                                            <div key={report._id} style={{
                                                padding: '1.25rem',
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                transition: 'all 0.2s'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                                                            {report.subject}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <Clock size={12} />
                                                            {report.submittedOn}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        padding: '0.375rem 0.75rem',
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                
                                                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.5' }}>
                                                    {report.message}
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                                                    <span style={{ padding: '0.25rem 0.5rem', background: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontWeight: 600 }}>
                                                        {report.currentRoom}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteReport(report._id)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.625rem',
                                                        background: 'white',
                                                        color: '#ef4444',
                                                        border: '1px solid #ef4444',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
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
                                                    <Trash2 size={16} />
                                                    Delete Report
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
