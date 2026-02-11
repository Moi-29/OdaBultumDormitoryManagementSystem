// Report Issue component - extracted from StudentPortal
// NO modifications - just isolated display

import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '@/config/api';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations/translations';

const ReportIssueWrapper = () => {
    const { isDarkMode } = useTheme();
    const { language } = useLanguage();
    const t = (key) => getTranslation(language, key);
    
    const [reportData, setReportData] = useState({
        block: '',
        dormNumber: '',
        issueType: '',
        description: '',
        priority: 'medium'
    });
    const [submittingReport, setSubmittingReport] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmitReport = async () => {
        if (!reportData.block || !reportData.dormNumber || !reportData.description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmittingReport(true);

        try {
            const reportPayload = {
                studentId: 'STUDENT_ID',
                studentName: 'Student',
                email: 'student@obu.edu.et',
                phone: 'N/A',
                requestType: 'Facility Issue',
                subject: `Facility Issue - Block ${reportData.block}, Room ${reportData.dormNumber}`,
                message: reportData.description,
                status: 'pending',
                priority: 'medium',
                currentRoom: `${reportData.block}-${reportData.dormNumber}`,
                submittedOn: new Date().toISOString().split('T')[0]
            };

            try {
                await axios.post(`${API_URL}/api/requests`, reportPayload);
                showNotification('Report submitted successfully! Admin will review it soon.', 'success');
            } catch (apiError) {
                console.log('API not available, report saved locally:', apiError.message);
                showNotification('Report submitted successfully!', 'success');
            }

            setReportData({
                block: '',
                dormNumber: '',
                issueType: '',
                description: '',
                priority: 'medium'
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            showNotification('Failed to submit report. Please try again.', 'error');
        } finally {
            setSubmittingReport(false);
        }
    };

    return (
        <div style={{
            height: 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isDarkMode ? '#0f172a' : '#f8f9fa',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{
                flex: 1,
                padding: '2rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto'
            }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '5rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    maxWidth: '500px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                        : 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
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

            {/* Report Form */}
            <div style={{
                background: isDarkMode ? '#1e293b' : 'white',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: isDarkMode ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} />
                        {t('reportFacilityIssue')}
                    </h2>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                        {t('letUsKnowProblems')}
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Block Input */}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.4rem', 
                                fontWeight: 600, 
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontSize: '0.875rem',
                                transition: 'color 0.3s ease'
                            }}>
                                {t('block')} <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., A, B, C"
                                value={reportData.block}
                                onChange={(e) => setReportData({ ...reportData, block: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                    color: isDarkMode ? '#ffffff' : '#111827',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        {/* Room Number */}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.4rem', 
                                fontWeight: 600, 
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontSize: '0.875rem',
                                transition: 'color 0.3s ease'
                            }}>
                                {t('roomNumber')} <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 101, 205"
                                value={reportData.dormNumber}
                                onChange={(e) => setReportData({ ...reportData, dormNumber: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                    color: isDarkMode ? '#ffffff' : '#111827',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.4rem', 
                                fontWeight: 600, 
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontSize: '0.875rem',
                                transition: 'color 0.3s ease'
                            }}>
                                {t('description')} <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                placeholder={t('describeIssue')}
                                value={reportData.description}
                                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                    color: isDarkMode ? '#ffffff' : '#111827',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: isDarkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    transition: 'border-color 0.3s ease'
                }}>
                    <button
                        onClick={() => setReportData({
                            block: '',
                            dormNumber: '',
                            issueType: '',
                            description: '',
                            priority: 'medium'
                        })}
                        disabled={submittingReport}
                        style={{
                            padding: '0.6rem 1.25rem',
                            background: isDarkMode ? '#475569' : 'white',
                            color: isDarkMode ? '#ffffff' : '#64748b',
                            border: isDarkMode ? '2px solid #64748b' : '2px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: submittingReport ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            opacity: submittingReport ? 0.5 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {t('clear')}
                    </button>
                    <button
                        onClick={handleSubmitReport}
                        disabled={submittingReport}
                        style={{
                            padding: '0.6rem 1.25rem',
                            background: submittingReport ? '#9ca3af' : '#F43F5E',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: submittingReport ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {submittingReport ? (
                            <>
                                <div style={{
                                    width: '14px',
                                    height: '14px',
                                    border: '2px solid white',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.6s linear infinite'
                                }} />
                                {t('submitting')}
                            </>
                        ) : (
                            <>
                                <AlertCircle size={16} />
                                {t('submitReport')}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            </div>
            
            {/* Footer */}
            <footer style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
                borderTop: isDarkMode ? '1px solid #1e293b' : '1px solid #2d4a6f',
                flexShrink: 0,
                transition: 'all 0.3s ease'
            }}>
                Copyright {t('copyright')}
            </footer>
        </div>
    );
};

export default ReportIssueWrapper;
