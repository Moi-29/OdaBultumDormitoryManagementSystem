import { useState, useEffect } from 'react';
import { FileCheck, Send, CheckCircle, X, Calendar, Clock, AlertCircle, Eye, Download } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations/translations';

const Permission = () => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const { language } = useLanguage();
    const t = (key) => getTranslation(language, key);

    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        department: '',
        year: '',
        sex: '',
        date: ''
    });

    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showAgreement, setShowAgreement] = useState(false);

    // Fetch student's permissions
    useEffect(() => {
        if (formData.studentId) {
            fetchPermissions();
        }
    }, [formData.studentId]);

    const fetchPermissions = async () => {
        if (!formData.studentId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/permissions/student/${formData.studentId}`);
            setPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.fullName || !formData.studentId || !formData.department || 
            !formData.year || !formData.sex || !formData.date) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setShowAgreement(true);
    };

    const handleFinalSubmit = async () => {
        setShowAgreement(false);
        setSubmitting(true);

        try {
            await axios.post(`${API_URL}/api/permissions`, formData);
            showNotification('Permission request submitted successfully!', 'success');
            
            // Reset form
            setFormData({
                fullName: '',
                studentId: '',
                department: '',
                year: '',
                sex: '',
                date: ''
            });
            
            // Refresh permissions list
            fetchPermissions();
        } catch (error) {
            console.error('Error submitting permission:', error);
            showNotification(error.response?.data?.message || 'Failed to submit permission request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={20} />;
            case 'rejected': return <X size={20} />;
            default: return <Clock size={20} />;
        }
    };

    const handleDownloadPDF = async (permissionId) => {
        try {
            const response = await axios.get(`${API_URL}/api/permissions/student-pdf/${permissionId}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `permission-${permissionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showNotification('PDF downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            showNotification('Failed to download PDF', 'error');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: isDarkMode ? '#0f172a' : '#f5f5f5'
        }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {notification.type === 'success' ? <CheckCircle size={24} /> : <X size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                            {notification.type === 'success' ? 'Success!' : 'Error'}
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                            {notification.message}
                        </div>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Agreement Modal */}
            {showAgreement && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: isDarkMode ? '#1e293b' : 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{
                            color: isDarkMode ? '#f3f4f6' : '#111827',
                            marginBottom: '1.5rem',
                            fontSize: '1.5rem',
                            fontWeight: 700
                        }}>
                            Permission Agreement
                        </h2>
                        
                        <div style={{
                            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`
                        }}>
                            <p style={{
                                color: isDarkMode ? '#e5e7eb' : '#374151',
                                lineHeight: 1.8,
                                marginBottom: '1rem'
                            }}>
                                I, <strong>{formData.fullName}</strong>, hereby request permission to leave the campus for religious purposes. 
                                I understand and agree to the following terms and conditions:
                            </p>
                            
                            <ol style={{
                                color: isDarkMode ? '#e5e7eb' : '#374151',
                                lineHeight: 1.8,
                                paddingLeft: '1.5rem'
                            }}>
                                <li>I will leave the campus for religious purposes only.</li>
                                <li>I will return to the dormitory no later than <strong>9:00 PM</strong> on the same day.</li>
                                <li>I take full responsibility for my safety and well-being while off campus.</li>
                                <li>I understand that any incidents, accidents, or issues that occur while I am off campus are my sole responsibility.</li>
                                <li>I will comply with all university rules and regulations during my absence.</li>
                                <li>I will inform the dormitory administration immediately if I am unable to return by the specified time.</li>
                            </ol>
                            
                            <p style={{
                                color: isDarkMode ? '#e5e7eb' : '#374151',
                                lineHeight: 1.8,
                                marginTop: '1rem',
                                fontWeight: 600
                            }}>
                                I acknowledge that I have read, understood, and agree to abide by all the terms stated above.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowAgreement(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                    backgroundColor: 'transparent',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={submitting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    opacity: submitting ? 0.6 : 1,
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {submitting ? 'Submitting...' : 'I Agree & Submit'}
                                {!submitting && <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <FileCheck size={32} />
                    Permission Request
                </h1>
                <p style={{
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    marginBottom: '2rem'
                }}>
                    Request permission to leave campus for religious purposes
                </p>

                {/* Permission Form */}
                <div style={{
                    backgroundColor: isDarkMode ? '#1e293b' : 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Student ID *
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Year *
                                </label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="5th Year">5th Year</option>
                                </select>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Sex *
                                </label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: isDarkMode ? '#f3f4f6' : '#374151',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                        color: isDarkMode ? '#f3f4f6' : '#111827',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.875rem 2rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1,
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Send size={20} />
                            Submit Permission Request
                        </button>
                    </form>
                </div>

                {/* My Permissions */}
                <div style={{
                    backgroundColor: isDarkMode ? '#1e293b' : 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Eye size={24} />
                        My Permission Requests
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                            Loading...
                        </div>
                    ) : permissions.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: isDarkMode ? '#9ca3af' : '#6b7280'
                        }}>
                            <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No permission requests yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {permissions.map((permission) => (
                                <div
                                    key={permission._id}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: `2px solid ${getStatusColor(permission.status)}`,
                                        backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: isDarkMode ? '#f3f4f6' : '#111827',
                                                fontSize: '1.125rem',
                                                fontWeight: 600,
                                                marginBottom: '0.5rem'
                                            }}>
                                                {permission.fullName}
                                            </h3>
                                            <p style={{
                                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                                fontSize: '0.875rem'
                                            }}>
                                                {permission.department} • {permission.year}
                                            </p>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            backgroundColor: getStatusColor(permission.status),
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {getStatusIcon(permission.status)}
                                            {permission.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1rem',
                                        color: isDarkMode ? '#e5e7eb' : '#374151'
                                    }}>
                                        <div>
                                            <strong>Date:</strong> {new Date(permission.date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <strong>Submitted:</strong> {new Date(permission.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {permission.adminNotes && (
                                        <div style={{
                                            marginTop: '1rem',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            backgroundColor: isDarkMode ? '#1e293b' : '#e5e7eb',
                                            color: isDarkMode ? '#e5e7eb' : '#374151'
                                        }}>
                                            <strong>Admin Notes:</strong> {permission.adminNotes}
                                        </div>
                                    )}
                                    <div style={{
                                        marginTop: '1rem',
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <button
                                            onClick={() => handleDownloadPDF(permission._id)}
                                            style={{
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(0, 0, 0, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            }}
                                        >
                                            <Download size={20} />
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Permission;
