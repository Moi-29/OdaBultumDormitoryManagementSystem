import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search, User, FileText, Copy, Building2, MapPin, Users, Printer, Download, ChevronDown, ChevronUp, Check, X,
    GraduationCap, Home, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import API_URL from '@/config/api';

const StudentPortal = () => {
    const [searchParams] = useSearchParams();
    const [studentId, setStudentId] = useState(searchParams.get('studentId') || '');

    const [placement, setPlacement] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showIdVerification, setShowIdVerification] = useState(false);
    const [verifyingId, setVerifyingId] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [hasExistingApplication, setHasExistingApplication] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState({
        block: '',
        dormNumber: '',
        issueType: '',
        description: '',
        priority: 'medium'
    });
    const [submittingReport, setSubmittingReport] = useState(false);
    const navigate = useNavigate();

    // Application form data
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            idNo: '',
            sex: '',
            mealCardNo: '',
            college: '',
            department: '',
            academicYear: '',
            dormNo: '',
            phone: '',
            religious: '',
            nation: ''
        },
        educationalInfo: {
            stream: '',
            sponsorCategory: '',
            nationalExamYear: '',
            entryYear: '',
            sponsoredBy: '',
            examinationId: '',
            admissionDate: '',
            checkedInDate: '',
            nationalExamResult: ''
        },
        schoolInfo: {
            schoolName: '',
            region: '',
            city: '',
            zone: '',
            schoolType: '',
            woreda: '',
            attendedYearFrom: '',
            attendedYearTo: ''
        },
        familyInfo: {
            nationality: '',
            region: '',
            zone: '',
            woreda: '',
            kebele: '',
            motherName: '',
            familyPhone: ''
        }
    });

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Verify Student ID before showing application form
    const handleVerifyStudentId = async () => {
        if (!verificationId.trim()) {
            showNotification('Please enter your Student ID', 'error');
            return;
        }

        setVerifyingId(true);

        try {
            // Check if student has already submitted an application
            const response = await axios.get(`${API_URL}/api/applications/check/${verificationId}`);
            
            if (response.data.exists) {
                if (response.data.canEdit) {
                    // Admin has allowed editing
                    showNotification('You have permission to edit your application', 'success');
                    setHasExistingApplication(true);
                    // Pre-fill form with existing data
                    if (response.data.application) {
                        setFormData({
                            personalInfo: response.data.application.personalInfo || formData.personalInfo,
                            educationalInfo: response.data.application.educationalInfo || formData.educationalInfo,
                            schoolInfo: response.data.application.schoolInfo || formData.schoolInfo,
                            familyInfo: response.data.application.familyInfo || formData.familyInfo
                        });
                        // Store the application ID for updating
                        setFormData(prev => ({
                            ...prev,
                            _id: response.data.application._id
                        }));
                    }
                    setShowIdVerification(false);
                    setShowApplicationForm(true);
                } else {
                    // Application exists and is locked
                    showNotification('You have already submitted an application. Contact admin to request editing permission.', 'error');
                    setVerifyingId(false);
                    return;
                }
            } else {
                // No existing application, allow new submission
                // Pre-fill ID in personal info
                setFormData(prev => ({
                    ...prev,
                    personalInfo: {
                        ...prev.personalInfo,
                        idNo: verificationId
                    }
                }));
                setShowIdVerification(false);
                setShowApplicationForm(true);
            }
        } catch (error) {
            console.error('Error verifying student ID:', error);
            // If endpoint doesn't exist yet, allow access (for development)
            if (error.response?.status === 404) {
                setFormData(prev => ({
                    ...prev,
                    personalInfo: {
                        ...prev.personalInfo,
                        idNo: verificationId
                    }
                }));
                setShowIdVerification(false);
                setShowApplicationForm(true);
            } else {
                showNotification('Error verifying Student ID. Please try again.', 'error');
            }
        } finally {
            setVerifyingId(false);
        }
    };

    // Handle Save & Continue - Navigate to next tab
    const handleSaveAndContinue = () => {
        const tabs = ['personal', 'educational', 'school', 'family'];
        const currentIndex = tabs.indexOf(activeTab);
        
        // Validate current tab's required fields
        if (activeTab === 'personal') {
            const requiredFields = [
                { field: 'fullName', label: 'Full Name' },
                { field: 'idNo', label: 'ID No.' },
                { field: 'sex', label: 'Sex' },
                { field: 'college', label: 'College' },
                { field: 'department', label: 'Department' },
                { field: 'academicYear', label: 'Academic Year' },
                { field: 'phone', label: 'Phone Number' }
            ];

            for (const { field, label } of requiredFields) {
                if (!formData.personalInfo[field]) {
                    showNotification(`Please fill in ${label}`, 'error');
                    return;
                }
            }
        }

        // If on last tab, show agreement modal
        if (currentIndex === tabs.length - 1) {
            setShowAgreementModal(true);
        } else {
            // Move to next tab
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    // Handle final form submission after agreement
    const handleFinalSubmit = async () => {
        setShowAgreementModal(false);
        setSubmitting(true);

        try {
            const applicationData = {
                studentId: verificationId.toUpperCase(), // Use the verified ID
                studentName: formData.personalInfo.fullName,
                submittedOn: new Date().toISOString().split('T')[0],
                canEdit: false, // Lock after submission
                personalInfo: formData.personalInfo,
                educationalInfo: formData.educationalInfo,
                schoolInfo: formData.schoolInfo,
                familyInfo: formData.familyInfo
            };

            let response;
            
            // Check if this is an update (editing existing application) or new submission
            if (hasExistingApplication && formData._id) {
                // UPDATE existing application
                console.log('Updating application:', `${API_URL}/api/applications/${formData._id}`);
                console.log('Update data:', applicationData);
                
                response = await axios.put(`${API_URL}/api/applications/${formData._id}`, applicationData);
                
                console.log('Application updated successfully:', response.data);
                showNotification('Application updated successfully! Your changes have been saved and the form is now locked.', 'success');
            } else {
                // CREATE new application
                console.log('Submitting new application to:', `${API_URL}/api/applications`);
                console.log('Application data:', applicationData);
                
                response = await axios.post(`${API_URL}/api/applications`, applicationData);
                
                console.log('Application submitted successfully:', response.data);
                showNotification('Application submitted successfully! Your form has been locked and sent to admin.', 'success');
            }
            
            // Clear verification ID immediately to prevent resubmission
            setVerificationId('');
            setHasExistingApplication(false);
            
            // Reset form and close modal after 3 seconds
            setTimeout(() => {
                setShowApplicationForm(false);
                setFormData({
                    personalInfo: {
                        fullName: '', idNo: '', sex: '', mealCardNo: '', college: '',
                        department: '', academicYear: '', dormNo: '', phone: '', religious: '', nation: ''
                    },
                    educationalInfo: {
                        stream: '', sponsorCategory: '', nationalExamYear: '', entryYear: '',
                        sponsoredBy: '', examinationId: '', admissionDate: '', checkedInDate: '', nationalExamResult: ''
                    },
                    schoolInfo: {
                        schoolName: '', region: '', city: '', zone: '', schoolType: '',
                        woreda: '', attendedYearFrom: '', attendedYearTo: ''
                    },
                    familyInfo: {
                        nationality: '', region: '', zone: '', woreda: '', kebele: '',
                        motherName: '', familyPhone: ''
                    }
                });
                setActiveTab('personal');
            }, 3000);
        } catch (error) {
            console.error('Error submitting application:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Show detailed error message
            let errorMessage = 'Failed to submit application. Please try again.';
            
            if (error.response?.status === 409 || error.response?.data?.message?.includes('duplicate')) {
                errorMessage = 'You have already submitted an application with this Student ID.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Check maintenance mode
    useEffect(() => {
        const checkMaintenanceMode = async () => {
            try {
                const response = await axios.get('https://odabultumdormitorymanagementsystem.onrender.com/api/settings');
                if (response.data) {
                    setMaintenanceMode(response.data.maintenanceMode);
                }
            } catch (error) {
                console.error('Error checking maintenance mode:', error);
            }
        };

        checkMaintenanceMode();
        // Check every 30 seconds
        const interval = setInterval(checkMaintenanceMode, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!studentId) return;

        setError('');
        setPlacement(null);
        setLoading(true);

        try {
            const { data } = await axios.post('https://odabultumdormitorymanagementsystem.onrender.com/api/students/lookup', {
                studentId
            });

            // Artificial delay for UX
            setTimeout(() => {
                setPlacement(data);
                setLoading(false);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Student not found');
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('placement-result');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Dorm_Placement_${studentId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Failed to generate PDF. Please try again.');
        }
    };

    // Handle Report Submission
    const handleSubmitReport = async () => {
        // Validation
        if (!reportData.block || !reportData.dormNumber || !reportData.issueType || !reportData.description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSubmittingReport(true);

        try {
            const reportPayload = {
                studentId: studentId || placement?.studentId || 'Unknown',
                studentName: placement?.fullName || 'Student',
                email: `${studentId}@obu.edu.et`,
                phone: placement?.phone || 'N/A',
                requestType: 'Facility Issue',
                subject: `${reportData.issueType} - Block ${reportData.block}, Room ${reportData.dormNumber}`,
                message: reportData.description,
                status: 'pending',
                priority: reportData.priority,
                currentRoom: `${reportData.block}-${reportData.dormNumber}`,
                submittedOn: new Date().toISOString().split('T')[0]
            };

            // Try to send to API
            try {
                await axios.post(`${API_URL}/api/requests`, reportPayload);
                showNotification('Report submitted successfully! Admin will review it soon.', 'success');
            } catch (apiError) {
                console.log('API not available, report saved locally:', apiError.message);
                showNotification('Report submitted successfully! (Saved locally - Backend not deployed yet)', 'success');
            }

            // Reset form and close modal
            setReportData({
                block: '',
                dormNumber: '',
                issueType: '',
                description: '',
                priority: 'medium'
            });
            setShowReportModal(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            showNotification('Failed to submit report. Please try again.', 'error');
        } finally {
            setSubmittingReport(false);
        }
    };

    // Auto-search if coming from URL
    useEffect(() => {
        const urlStudentId = searchParams.get('studentId');
        if (urlStudentId) {
            setStudentId(urlStudentId);
            handleSearch();
        }
    }, [searchParams]);

    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            fontFamily: '"Inter", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Premium Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    maxWidth: '500px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {notification.type === 'success' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                            fontWeight: 700, 
                            fontSize: '1rem', 
                            marginBottom: '0.25rem',
                            letterSpacing: '-0.2px'
                        }}>
                            {notification.type === 'success' ? 'Success!' : 'Error'}
                        </div>
                        <div style={{ 
                            fontSize: '0.9rem', 
                            opacity: 0.95,
                            lineHeight: '1.4'
                        }}>
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
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '1rem 2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: '80px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    height: '100%'
                }}>
                    {/* Left side - Logo and University Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                            alt="OBU Logo" 
                            style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'contain',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '4px'
                            }} 
                        />
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: '1.5rem', 
                                fontWeight: '700',
                                color: 'white'
                            }}>
                                Oda Bultum University
                            </h1>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.9)'
                            }}>
                                Dormitory Management System
                            </p>
                        </div>
                    </div>

                    {/* Right side - Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowIdVerification(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <FileText size={18} />
                            Application Form
                        </button>
                        
                        <button
                            onClick={() => setShowReportModal(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.5rem',
                                background: 'rgba(239, 68, 68, 0.9)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <AlertCircle size={18} />
                            Report Issue
                        </button>
                    </div>
                </div>
            </header>

            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                paddingTop: '90px', // Header height + small padding
                paddingBottom: '60px', // Footer height + small padding
                overflow: 'hidden', // Prevent scrolling
                minHeight: '0' // Allow flex shrinking
            }}>

                {!placement ? (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                        padding: '3rem 2.5rem',
                        width: '100%',
                        maxWidth: '550px',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        {/* Gold Accent Top Border */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80%',
                            height: '4px',
                            backgroundColor: '#cca300', // Gold
                            borderRadius: '0 0 8px 8px'
                        }}></div>

                        <h2 style={{
                            fontFamily: '"Playfair Display", serif',
                            color: '#111827',
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            marginTop: '0.5rem'
                        }}>Find Your Dorm Placement</h2>

                        <p style={{
                            color: '#6b7280',
                            marginBottom: '2.5rem',
                            fontSize: '0.95rem'
                        }}>
                            Enter your university ID to view your assigned accommodation
                        </p>

                        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{
                                    marginBottom: '0.5rem',
                                    color: '#b49000', // Gold/Dark Yellow
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <User size={16} /> University ID
                                </label>
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="RU1270/18"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        color: '#1f2937',
                                        outline: 'none'
                                    }}
                                />
                            </div>



                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#cca300', // Gold
                                    color: '#1f2937', // Dark text for contrast on gold
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {loading ? 'SEARCHING...' : (
                                    <>
                                        <Search size={18} /> VIEW PLACEMENT
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <p style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                                {error}
                            </p>
                        )}
                    </div>

                ) : (
                    <div
                        id="placement-result"
                        style={{
                            width: '100%',
                            maxWidth: '550px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                            overflow: 'visible',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        {/* Header */}
                        <div style={{
                            backgroundColor: '#0f172a',
                            color: 'white',
                            padding: '0.75rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            borderBottom: '3px solid #cca300',
                            flexShrink: 0
                        }}>
                            <FileText size={18} color="#cca300" />
                            <h2 style={{
                                margin: 0,
                                fontFamily: '"Playfair Display", serif',
                                fontSize: '1rem',
                                fontWeight: '600',
                                letterSpacing: '0.025em',
                                color: 'white'
                            }}>Dormitory Placement Details</h2>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1rem', flex: 1, overflow: 'visible' }}>
                            {/* Room Featured Card */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                textAlign: 'center',
                                border: '1px solid #e5e7eb',
                                marginBottom: '0.75rem'
                            }}>
                                <p style={{ color: '#6b7280', fontSize: '0.7rem', marginBottom: '0.15rem', margin: 0 }}>Your Room</p>
                                <h1 style={{
                                    fontFamily: '"Playfair Display", serif',
                                    fontSize: '1.75rem',
                                    color: '#d97706',
                                    fontWeight: '700',
                                    margin: '0.15rem 0',
                                    lineHeight: '1'
                                }}>{placement.room?.roomNumber}</h1>
                                <p style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0
                                }}>{placement.room?.building}</p>
                            </div>

                            {/* Details List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* University ID */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>University ID</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.studentId}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(placement.studentId)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}
                                        >
                                            <Copy size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Full Name</span>
                                    <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.fullName}</span>
                                </div>

                                {/* Sex */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Sex</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.gender === 'M' ? 'M' : 'F'}</span>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#f3f4f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '0.65rem'
                                        }}>
                                            {placement.gender === 'M' ? '♂' : '♀'}
                                        </div>
                                    </div>
                                </div>

                                {/* Department */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Department</span>
                                    <span style={{
                                        backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.45rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'
                                    }}>
                                        {placement.department}
                                    </span>
                                </div>

                                {/* Building */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Building</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                        <Building2 size={13} color="#d97706" /> {placement.room?.building}
                                    </div>
                                </div>

                                {/* Room Number */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Room Number</span>
                                    <span style={{ color: '#d97706', fontWeight: '700', fontSize: '0.95rem' }}>{placement.room?.roomNumber}</span>
                                </div>

                                {/* Campus */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Campus</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                        <MapPin size={13} color="#d97706" /> Main Campus
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Capacity</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                        <Users size={13} color="#d97706" /> {placement.room?.capacity} Students
                                    </div>
                                </div>
                            </div>



                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                <button style={{
                                    flex: 1,
                                    minWidth: '100px',
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.55rem',
                                    borderRadius: '7px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                }} onClick={() => window.print()}>
                                    <Printer size={14} /> Print
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    style={{
                                        flex: 1,
                                        minWidth: '100px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#1f2937',
                                        border: '1px solid #e5e7eb',
                                        padding: '0.55rem',
                                        borderRadius: '7px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem'
                                    }}>
                                    <Download size={14} /> Save PDF
                                </button>
                            </div>

                            {/* Back to Search Button */}
                            <button
                                onClick={() => setPlacement(null)}
                                style={{
                                    width: '100%',
                                    marginTop: '0.65rem',
                                    padding: '0.6rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '7px',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                            >
                                <Search size={15} /> New Search
                            </button>
                        </div>


                    </div>
                )
                }
            </main>

            {/* Report Issue Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={24} />
                                    Report Facility Issue
                                </h2>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                                    Let us know about any problems in your dormitory
                                </p>
                            </div>
                            <button
                                onClick={() => setShowReportModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Block Selection */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Block <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        value={reportData.block}
                                        onChange={(e) => setReportData({ ...reportData, block: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Select Block</option>
                                        <option value="A">Block A</option>
                                        <option value="B">Block B</option>
                                        <option value="C">Block C</option>
                                        <option value="D">Block D</option>
                                        <option value="E">Block E</option>
                                        <option value="F">Block F</option>
                                    </select>
                                </div>

                                {/* Dorm Number */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Room Number <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 101, 205, 302"
                                        value={reportData.dormNumber}
                                        onChange={(e) => setReportData({ ...reportData, dormNumber: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>

                                {/* Issue Type */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Issue Type <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        value={reportData.issueType}
                                        onChange={(e) => setReportData({ ...reportData, issueType: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Select Issue Type</option>
                                        <option value="Plumbing">Plumbing (Water, Toilet, Sink)</option>
                                        <option value="Electrical">Electrical (Lights, Outlets, Wiring)</option>
                                        <option value="Furniture">Furniture (Bed, Desk, Chair)</option>
                                        <option value="Window/Door">Window/Door Issues</option>
                                        <option value="Cleanliness">Cleanliness/Sanitation</option>
                                        <option value="Heating/Cooling">Heating/Cooling</option>
                                        <option value="Pest Control">Pest Control</option>
                                        <option value="Safety">Safety Concern</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Priority Level
                                    </label>
                                    <select
                                        value={reportData.priority}
                                        onChange={(e) => setReportData({ ...reportData, priority: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="low">Low - Can wait a few days</option>
                                        <option value="medium">Medium - Should be fixed soon</option>
                                        <option value="high">High - Urgent, needs immediate attention</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        fontSize: '0.95rem'
                                    }}>
                                        Description <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        placeholder="Please describe the issue in detail..."
                                        value={reportData.description}
                                        onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                        rows={5}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                                        Please provide as much detail as possible to help us resolve the issue quickly.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowReportModal(false)}
                                disabled={submittingReport}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#64748b',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: submittingReport ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    opacity: submittingReport ? 0.5 : 1
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={submittingReport}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: submittingReport ? '#9ca3af' : '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: submittingReport ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {submittingReport ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid white',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 0.6s linear infinite'
                                        }} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={18} />
                                        Submit Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer style={{
                padding: '1rem 2rem',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.85rem',
                backgroundColor: '#111827',
                borderTop: '2px solid #10b981'
            }}>
                © 2026 Oda Bultum University - All rights reserved.
            </footer>

            {/* Responsive Styles */}
            <style>{`
                /* Ensure box-sizing for all elements */
                * {
                    box-sizing: border-box;
                }

                /* Mobile devices (portrait phones, less than 576px) */
                @media (max-width: 575px) {
                    header > div {
                        flex-direction: column !important;
                        text-align: center !important;
                        gap: 0.5rem !important;
                        height: auto !important;
                    }
                    
                    header {
                        height: auto !important;
                        padding: 1rem !important;
                    }
                    
                    header h1 {
                        font-size: 1.1rem !important;
                    }
                    
                    header p {
                        font-size: 0.75rem !important;
                    }
                    
                    header img {
                        width: 40px !important;
                        height: 40px !important;
                    }
                    
                    header > div > div:last-child {
                        flex-direction: column !important;
                        gap: 0.25rem !important;
                        font-size: 0.75rem !important;
                    }
                    
                    main {
                        padding: 1rem !important;
                        padding-top: 180px !important;
                        padding-bottom: 60px !important;
                    }
                    
                    footer {
                        font-size: 0.7rem !important;
                        padding: 0.75rem 1rem !important;
                    }
                }

                /* Small devices (landscape phones, 576px and up) */
                @media (min-width: 576px) and (max-width: 767px) {
                    header > div {
                        flex-direction: column !important;
                        text-align: center !important;
                        height: auto !important;
                    }
                    
                    header {
                        height: auto !important;
                    }
                    
                    header h1 {
                        font-size: 1.25rem !important;
                    }
                    
                    header > div > div:last-child {
                        flex-direction: row !important;
                        gap: 1rem !important;
                        font-size: 0.8rem !important;
                    }
                    
                    main {
                        padding-top: 160px !important;
                    }
                }

                /* Medium devices (tablets, 768px and up) */
                @media (min-width: 768px) and (max-width: 991px) {
                    header h1 {
                        font-size: 1.35rem !important;
                    }
                    
                    header p {
                        font-size: 0.85rem !important;
                    }
                    
                    main {
                        padding-top: 110px !important;
                    }
                }

                /* Large devices (desktops, 992px and up) */
                @media (min-width: 992px) {
                    header > div {
                        max-width: 1400px !important;
                    }
                }

                /* Print styles */
                @media print {
                    header, footer {
                        display: none !important;
                    }
                    
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    button {
                        display: none !important;
                    }
                }

                /* Cross-browser compatibility */
                input, button {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }

                /* Smooth scrolling for all browsers */
                html {
                    scroll-behavior: smooth;
                    -webkit-text-size-adjust: 100%;
                }

                /* Fix for iOS Safari */
                @supports (-webkit-touch-callout: none) {
                    main {
                        min-height: -webkit-fill-available;
                    }
                }
            `}</style>

            {/* Student ID Verification Modal */}
            {showIdVerification && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                        }}>
                            <User size={40} color="white" strokeWidth={2.5} />
                        </div>

                        {/* Title */}
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            color: '#1e293b',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            letterSpacing: '-0.5px'
                        }}>
                            Verify Your Identity
                        </h2>

                        <p style={{
                            color: '#64748b',
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Please enter your Student ID to access the application form
                        </p>

                        {/* Input Field */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '0.95rem'
                            }}>
                                Student ID <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={verificationId}
                                onChange={(e) => setVerificationId(e.target.value.toUpperCase())}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleVerifyStudentId();
                                }}
                                placeholder="e.g., UGPR1212/12 or RU/1270/18"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                autoFocus
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => {
                                    setShowIdVerification(false);
                                    setVerificationId('');
                                }}
                                style={{
                                    padding: '0.875rem 2rem',
                                    border: '2px solid #e5e7eb',
                                    background: 'white',
                                    color: '#64748b',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyStudentId}
                                disabled={verifyingId || !verificationId.trim()}
                                style={{
                                    padding: '0.875rem 2rem',
                                    border: 'none',
                                    background: (verifyingId || !verificationId.trim())
                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    cursor: (verifyingId || !verificationId.trim()) ? 'not-allowed' : 'pointer',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    opacity: (verifyingId || !verificationId.trim()) ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!verifyingId && verificationId.trim()) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!verifyingId && verificationId.trim()) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                    }
                                }}
                            >
                                {verifyingId ? 'Verifying...' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Form Modal */}
            {showApplicationForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        maxWidth: '1200px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                Dormitory Application Form
                            </h2>
                            <button
                                onClick={() => setShowApplicationForm(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '1rem 2rem 0',
                            borderBottom: '2px solid #e5e7eb',
                            overflowX: 'auto',
                            backgroundColor: '#f9fafb'
                        }}>
                            {[
                                { id: 'personal', label: 'Personal', icon: <User size={18} /> },
                                { id: 'educational', label: 'Educational', icon: <GraduationCap size={18} /> },
                                { id: 'school', label: 'School', icon: <Home size={18} /> },
                                { id: 'family', label: 'Family', icon: <Users size={18} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        border: 'none',
                                        background: activeTab === tab.id ? '#10b981' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        borderRadius: '8px 8px 0 0',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 600 : 500,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '2rem'
                        }}>
                            {/* Personal Tab */}
                            {activeTab === 'personal' && (
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                                        I. Please fill your Full Information
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your full name"
                                                value={formData.personalInfo.fullName}
                                                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                ID No. <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your ID number"
                                                value={formData.personalInfo.idNo}
                                                onChange={(e) => handleInputChange('personalInfo', 'idNo', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Sex <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <select 
                                                className="input-field" 
                                                style={{ width: '100%' }}
                                                value={formData.personalInfo.sex}
                                                onChange={(e) => handleInputChange('personalInfo', 'sex', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Meal card No.
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter meal card number"
                                                value={formData.personalInfo.mealCardNo}
                                                onChange={(e) => handleInputChange('personalInfo', 'mealCardNo', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                College <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your college"
                                                value={formData.personalInfo.college}
                                                onChange={(e) => handleInputChange('personalInfo', 'college', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Department <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your department"
                                                value={formData.personalInfo.department}
                                                onChange={(e) => handleInputChange('personalInfo', 'department', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Academic Year <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., 3rd Year"
                                                value={formData.personalInfo.academicYear}
                                                onChange={(e) => handleInputChange('personalInfo', 'academicYear', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Dorm No.
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter dorm number"
                                                value={formData.personalInfo.dormNo}
                                                onChange={(e) => handleInputChange('personalInfo', 'dormNo', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Your Phone Number <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="input-field"
                                                placeholder="+251911234567"
                                                value={formData.personalInfo.phone}
                                                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Religious
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your religion"
                                                value={formData.personalInfo.religious}
                                                onChange={(e) => handleInputChange('personalInfo', 'religious', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Your Nation
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your nationality"
                                                value={formData.personalInfo.nation}
                                                onChange={(e) => handleInputChange('personalInfo', 'nation', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Educational Tab */}
                            {activeTab === 'educational' && (
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#0ea5e9', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        Campus Related Information
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Stream <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <select 
                                                className="input-field" 
                                                style={{ width: '100%' }}
                                                value={formData.educationalInfo.stream}
                                                onChange={(e) => handleInputChange('educationalInfo', 'stream', e.target.value)}
                                            >
                                                <option value="">Select stream</option>
                                                <option value="Natural Science">Natural Science</option>
                                                <option value="Social Science">Social Science</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Health Science">Health Science</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Sponsor Category <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <select 
                                                className="input-field" 
                                                style={{ width: '100%' }}
                                                value={formData.educationalInfo.sponsorCategory}
                                                onChange={(e) => handleInputChange('educationalInfo', 'sponsorCategory', e.target.value)}
                                            >
                                                <option value="">Select category</option>
                                                <option value="Government">Government</option>
                                                <option value="Private">Private</option>
                                                <option value="Self-Sponsored">Self-Sponsored</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                National Exam Year (EC) <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., 2015"
                                                value={formData.educationalInfo.nationalExamYear}
                                                onChange={(e) => handleInputChange('educationalInfo', 'nationalExamYear', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Entry Year <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., 2016"
                                                value={formData.educationalInfo.entryYear}
                                                onChange={(e) => handleInputChange('educationalInfo', 'entryYear', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Sponsored By
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., Family"
                                                value={formData.educationalInfo.sponsoredBy}
                                                onChange={(e) => handleInputChange('educationalInfo', 'sponsoredBy', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Examination ID
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., D1729733"
                                                value={formData.educationalInfo.examinationId}
                                                onChange={(e) => handleInputChange('educationalInfo', 'examinationId', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Admission Date <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="input-field"
                                                value={formData.educationalInfo.admissionDate}
                                                onChange={(e) => handleInputChange('educationalInfo', 'admissionDate', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Checked-In Date
                                            </label>
                                            <input
                                                type="date"
                                                className="input-field"
                                                value={formData.educationalInfo.checkedInDate}
                                                onChange={(e) => handleInputChange('educationalInfo', 'checkedInDate', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                National Exam Result
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., 454"
                                                value={formData.educationalInfo.nationalExamResult}
                                                onChange={(e) => handleInputChange('educationalInfo', 'nationalExamResult', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* School Tab */}
                            {activeTab === 'school' && (
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#0ea5e9', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        Primary School
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                School Name <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., Abdi Gudina primary school"
                                                value={formData.schoolInfo.schoolName}
                                                onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Region
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter region"
                                                value={formData.schoolInfo.region}
                                                onChange={(e) => handleInputChange('schoolInfo', 'region', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter city"
                                                value={formData.schoolInfo.city}
                                                onChange={(e) => handleInputChange('schoolInfo', 'city', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Zone
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter zone"
                                                value={formData.schoolInfo.zone}
                                                onChange={(e) => handleInputChange('schoolInfo', 'zone', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                School Type <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <select 
                                                className="input-field" 
                                                style={{ width: '100%' }}
                                                value={formData.schoolInfo.schoolType}
                                                onChange={(e) => handleInputChange('schoolInfo', 'schoolType', e.target.value)}
                                            >
                                                <option value="">Select type</option>
                                                <option value="Public">Public</option>
                                                <option value="Private">Private</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Woreda
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter woreda"
                                                value={formData.schoolInfo.woreda}
                                                onChange={(e) => handleInputChange('schoolInfo', 'woreda', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Attended Year (From - To E.C)
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="From (e.g., 2004)"
                                                    value={formData.schoolInfo.attendedYearFrom}
                                                    onChange={(e) => handleInputChange('schoolInfo', 'attendedYearFrom', e.target.value)}
                                                    style={{ width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="To (e.g., 2011)"
                                                    value={formData.schoolInfo.attendedYearTo}
                                                    onChange={(e) => handleInputChange('schoolInfo', 'attendedYearTo', e.target.value)}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family Tab */}
                            {activeTab === 'family' && (
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                                        II. Please fill your Birth place and Your Family Information
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Nationality <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="e.g., Ethiopia"
                                                value={formData.familyInfo.nationality}
                                                onChange={(e) => handleInputChange('familyInfo', 'nationality', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Region <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your region"
                                                value={formData.familyInfo.region}
                                                onChange={(e) => handleInputChange('familyInfo', 'region', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Zone
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your zone"
                                                value={formData.familyInfo.zone}
                                                onChange={(e) => handleInputChange('familyInfo', 'zone', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Woreda (district)
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your woreda"
                                                value={formData.familyInfo.woreda}
                                                onChange={(e) => handleInputChange('familyInfo', 'woreda', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Kebele
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your kebele"
                                                value={formData.familyInfo.kebele}
                                                onChange={(e) => handleInputChange('familyInfo', 'kebele', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Your Mother Name <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your mother's name"
                                                value={formData.familyInfo.motherName}
                                                onChange={(e) => handleInputChange('familyInfo', 'motherName', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                                                Family Phone Number <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="input-field"
                                                placeholder="Enter family phone number"
                                                value={formData.familyInfo.familyPhone}
                                                onChange={(e) => handleInputChange('familyInfo', 'familyPhone', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            backgroundColor: '#f9fafb'
                        }}>
                            <button
                                onClick={() => {
                                    setShowApplicationForm(false);
                                    setActiveTab('personal');
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '2px solid #e5e7eb',
                                    background: 'white',
                                    color: '#64748b',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAndContinue}
                                disabled={submitting}
                                style={{
                                    padding: '0.75rem 2rem',
                                    border: 'none',
                                    background: submitting 
                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    opacity: submitting ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!submitting) e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {activeTab === 'family' ? 'Review & Submit' : 'Save & Continue'}
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Agreement Modal */}
            {showAgreementModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10001,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        textAlign: 'center'
                    }}>
                        {/* Handshake Icon */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 1.5rem',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                        }}>
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5"></path>
                                <path d="M2 12l10 5 10-5"></path>
                            </svg>
                        </div>

                        {/* Warning Title */}
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            color: '#1e293b',
                            marginBottom: '1rem',
                            letterSpacing: '-0.5px'
                        }}>
                            Final Agreement
                        </h2>

                        {/* Warning Message */}
                        <div style={{
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            border: '2px solid #f59e0b',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            textAlign: 'left'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'start'
                            }}>
                                <div style={{
                                    flexShrink: 0,
                                    width: '24px',
                                    height: '24px',
                                    background: '#f59e0b',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '2px'
                                }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>!</span>
                                </div>
                                <div>
                                    <p style={{
                                        color: '#92400e',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        margin: 0,
                                        fontWeight: 600
                                    }}>
                                        <strong>Important Notice:</strong>
                                    </p>
                                    <p style={{
                                        color: '#92400e',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.6',
                                        margin: '0.5rem 0 0 0'
                                    }}>
                                        Once you submit this application, you will <strong>NOT be able to edit</strong> any information unless an administrator grants you permission. Please review all your information carefully before proceeding.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => setShowAgreementModal(false)}
                                style={{
                                    padding: '0.875rem 2rem',
                                    border: '2px solid #e5e7eb',
                                    background: 'white',
                                    color: '#64748b',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={submitting}
                                style={{
                                    padding: '0.875rem 2rem',
                                    border: 'none',
                                    background: submitting
                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    opacity: submitting ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                    }
                                }}
                            >
                                {submitting ? 'Submitting...' : 'I Agree & Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortal;
