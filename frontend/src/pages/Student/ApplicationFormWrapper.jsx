// This component extracts ONLY the Application Form functionality from StudentPortal
// NO modifications - just isolated display

import { useState } from 'react';
import { X, User, GraduationCap, Home, Users, Check } from 'lucide-react';
import axios from 'axios';
import API_URL from '@/config/api';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations, getTranslation } from '../../translations/translations';

const ApplicationFormWrapper = () => {
    const { isDarkMode } = useTheme();
    const { language } = useLanguage();
    const t = (key) => getTranslation(language, key);
    
    const [activeTab, setActiveTab] = useState('personal');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [hasExistingApplication, setHasExistingApplication] = useState(false);

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
                studentId: formData.personalInfo.idNo.toUpperCase(),
                studentName: formData.personalInfo.fullName,
                submittedOn: new Date().toISOString().split('T')[0],
                canEdit: false,
                personalInfo: formData.personalInfo,
                educationalInfo: formData.educationalInfo,
                schoolInfo: formData.schoolInfo,
                familyInfo: formData.familyInfo
            };

            let response;
            
            if (hasExistingApplication && formData._id) {
                response = await axios.put(`${API_URL}/api/applications/${formData._id}`, applicationData);
                showNotification('Application updated successfully!', 'success');
            } else {
                response = await axios.post(`${API_URL}/api/applications`, applicationData);
                showNotification('Application submitted successfully!', 'success');
            }
            
            setVerificationId('');
            setHasExistingApplication(false);
            
            setTimeout(() => {
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
                            {notification.type === 'success' ? t('success') : t('error')}
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

            {/* Application Form */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                borderRadius: '16px',
                boxShadow: isDarkMode ? '0 4px 24px rgba(0, 0, 0, 0.5)' : '0 4px 24px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    color: 'white',
                    padding: '1.5rem 2rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                        {t('dormitoryApplicationForm')}
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                        {t('completeAllSections')}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '1rem 2rem 0',
                    borderBottom: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                    overflowX: 'auto',
                    backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
                    transition: 'all 0.3s ease'
                }}>
                    {[
                        { id: 'personal', label: t('personal'), icon: <User size={18} /> },
                        { id: 'educational', label: t('educational'), icon: <GraduationCap size={18} /> },
                        { id: 'school', label: t('school'), icon: <Home size={18} /> },
                        { id: 'family', label: t('family'), icon: <Users size={18} /> }
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
                                background: activeTab === tab.id ? '#4F46E5' : 'transparent',
                                color: activeTab === tab.id ? 'white' : (isDarkMode ? '#ffffff' : '#64748b'),
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
                    padding: '1.5rem',
                    maxHeight: 'calc(100vh - 320px)',
                    overflowY: 'auto'
                }}>
                    {/* Personal Tab */}
                    {activeTab === 'personal' && (
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: isDarkMode ? '#ffffff' : '#1e293b', fontSize: '1.1rem', fontWeight: 600, transition: 'color 0.3s ease' }}>
                                {t('fillFullInformation')}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem', transition: 'color 0.3s ease' }}>
                                        {t('fullName')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterFullName')}
                                        value={formData.personalInfo.fullName}
                                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('idNo')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterIdNumber')}
                                        value={formData.personalInfo.idNo}
                                        onChange={(e) => handleInputChange('personalInfo', 'idNo', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('sex')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.personalInfo.sex}
                                        onChange={(e) => handleInputChange('personalInfo', 'sex', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="">{t('select')}</option>
                                        <option value="Male">{t('male')}</option>
                                        <option value="Female">{t('female')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('mealCardNo')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterMealCard')}
                                        value={formData.personalInfo.mealCardNo}
                                        onChange={(e) => handleInputChange('personalInfo', 'mealCardNo', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('college')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterCollege')}
                                        value={formData.personalInfo.college}
                                        onChange={(e) => handleInputChange('personalInfo', 'college', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('department')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterDepartment')}
                                        value={formData.personalInfo.department}
                                        onChange={(e) => handleInputChange('personalInfo', 'department', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('academicYear')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterYear')}
                                        value={formData.personalInfo.academicYear}
                                        onChange={(e) => handleInputChange('personalInfo', 'academicYear', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('dormNo')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterDormNo')}
                                        value={formData.personalInfo.dormNo}
                                        onChange={(e) => handleInputChange('personalInfo', 'dormNo', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('yourPhoneNumber')} <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder={t('enterPhone')}
                                        value={formData.personalInfo.phone}
                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('religious')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterReligion')}
                                        value={formData.personalInfo.religious}
                                        onChange={(e) => handleInputChange('personalInfo', 'religious', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                        {t('yourNation')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterNationality')}
                                        value={formData.personalInfo.nation}
                                        onChange={(e) => handleInputChange('personalInfo', 'nation', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Educational Tab */}
                    {activeTab === 'educational' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: '#4F46E5', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                {t('campusRelatedInfo')}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('stream')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.educationalInfo.stream}
                                        onChange={(e) => handleInputChange('educationalInfo', 'stream', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">{t('selectStream')}</option>
                                        <option value="Natural Science">{t('naturalScience')}</option>
                                        <option value="Social Science">{t('socialScience')}</option>
                                        <option value="Engineering">{t('engineering')}</option>
                                        <option value="Health Science">{t('healthScience')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('sponsorCategory')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.educationalInfo.sponsorCategory}
                                        onChange={(e) => handleInputChange('educationalInfo', 'sponsorCategory', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">{t('selectCategory')}</option>
                                        <option value="Government">{t('government')}</option>
                                        <option value="Private">{t('private')}</option>
                                        <option value="Self-Sponsored">{t('selfSponsored')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationalExamYear')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2015"
                                        value={formData.educationalInfo.nationalExamYear}
                                        onChange={(e) => handleInputChange('educationalInfo', 'nationalExamYear', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('entryYear')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2016"
                                        value={formData.educationalInfo.entryYear}
                                        onChange={(e) => handleInputChange('educationalInfo', 'entryYear', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('sponsoredBy')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Family"
                                        value={formData.educationalInfo.sponsoredBy}
                                        onChange={(e) => handleInputChange('educationalInfo', 'sponsoredBy', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('examinationId')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., D1729733"
                                        value={formData.educationalInfo.examinationId}
                                        onChange={(e) => handleInputChange('educationalInfo', 'examinationId', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('admissionDate')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.educationalInfo.admissionDate}
                                        onChange={(e) => handleInputChange('educationalInfo', 'admissionDate', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('checkedInDate')}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.educationalInfo.checkedInDate}
                                        onChange={(e) => handleInputChange('educationalInfo', 'checkedInDate', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationalExamResult')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 454"
                                        value={formData.educationalInfo.nationalExamResult}
                                        onChange={(e) => handleInputChange('educationalInfo', 'nationalExamResult', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* School Tab */}
                    {activeTab === 'school' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: '#4F46E5', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                {t('primarySchool')}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('schoolName')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterSchoolName')}
                                        value={formData.schoolInfo.schoolName}
                                        onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('region')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterRegion')}
                                        value={formData.schoolInfo.region}
                                        onChange={(e) => handleInputChange('schoolInfo', 'region', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('city')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterCity')}
                                        value={formData.schoolInfo.city}
                                        onChange={(e) => handleInputChange('schoolInfo', 'city', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('zone')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterZone')}
                                        value={formData.schoolInfo.zone}
                                        onChange={(e) => handleInputChange('schoolInfo', 'zone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('schoolType')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.schoolInfo.schoolType}
                                        onChange={(e) => handleInputChange('schoolInfo', 'schoolType', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">{t('selectType')}</option>
                                        <option value="Public">{t('public')}</option>
                                        <option value="Private">{t('private')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('woreda')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterWoreda')}
                                        value={formData.schoolInfo.woreda}
                                        onChange={(e) => handleInputChange('schoolInfo', 'woreda', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('attendedYear')}
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder={`${t('from')} (e.g., 2004)`}
                                            value={formData.schoolInfo.attendedYearFrom}
                                            onChange={(e) => handleInputChange('schoolInfo', 'attendedYearFrom', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder={`${t('to')} (e.g., 2011)`}
                                            value={formData.schoolInfo.attendedYearTo}
                                            onChange={(e) => handleInputChange('schoolInfo', 'attendedYearTo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Family Tab */}
                    {activeTab === 'family' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: isDarkMode ? '#ffffff' : '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                                {t('birthplaceFamily')}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationality')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Ethiopia"
                                        value={formData.familyInfo.nationality}
                                        onChange={(e) => handleInputChange('familyInfo', 'nationality', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('region')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterYourRegion')}
                                        value={formData.familyInfo.region}
                                        onChange={(e) => handleInputChange('familyInfo', 'region', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('zone')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterYourZone')}
                                        value={formData.familyInfo.zone}
                                        onChange={(e) => handleInputChange('familyInfo', 'zone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('woreda')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterYourWoreda')}
                                        value={formData.familyInfo.woreda}
                                        onChange={(e) => handleInputChange('familyInfo', 'woreda', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('kebele')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterKebele')}
                                        value={formData.familyInfo.kebele}
                                        onChange={(e) => handleInputChange('familyInfo', 'kebele', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('motherName')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterMotherName')}
                                        value={formData.familyInfo.motherName}
                                        onChange={(e) => handleInputChange('familyInfo', 'motherName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('familyPhone')}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder={t('enterFamilyPhone')}
                                        value={formData.familyInfo.familyPhone}
                                        onChange={(e) => handleInputChange('familyInfo', 'familyPhone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: isDarkMode ? '#ffffff' : '#4F46E5', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', transition: 'color 0.3s ease' }}>
                                {t('campusRelatedInfo')}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('stream')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.educationalInfo.stream}
                                        onChange={(e) => handleInputChange('educationalInfo', 'stream', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">{t('selectStream')}</option>
                                        <option value="Natural Science">{t('naturalScience')}</option>
                                        <option value="Social Science">{t('socialScience')}</option>
                                        <option value="Engineering">{t('engineering')}</option>
                                        <option value="Health Science">{t('healthScience')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('sponsorCategory')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.educationalInfo.sponsorCategory}
                                        onChange={(e) => handleInputChange('educationalInfo', 'sponsorCategory', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">{t('selectCategory')}</option>
                                        <option value="Government">{t('government')}</option>
                                        <option value="Private">{t('private')}</option>
                                        <option value="Self-Sponsored">{t('selfSponsored')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationalExamYear')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2015"
                                        value={formData.educationalInfo.nationalExamYear}
                                        onChange={(e) => handleInputChange('educationalInfo', 'nationalExamYear', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('entryYear')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2016"
                                        value={formData.educationalInfo.entryYear}
                                        onChange={(e) => handleInputChange('educationalInfo', 'entryYear', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('sponsoredBy')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Family"
                                        value={formData.educationalInfo.sponsoredBy}
                                        onChange={(e) => handleInputChange('educationalInfo', 'sponsoredBy', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('examinationId')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., D1729733"
                                        value={formData.educationalInfo.examinationId}
                                        onChange={(e) => handleInputChange('educationalInfo', 'examinationId', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('admissionDate')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.educationalInfo.admissionDate}
                                        onChange={(e) => handleInputChange('educationalInfo', 'admissionDate', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('checkedInDate')}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.educationalInfo.checkedInDate}
                                        onChange={(e) => handleInputChange('educationalInfo', 'checkedInDate', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationalExamResult')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 454"
                                        value={formData.educationalInfo.nationalExamResult}
                                        onChange={(e) => handleInputChange('educationalInfo', 'nationalExamResult', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* School Tab */}
                    {activeTab === 'school' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: '#4F46E5', fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                Primary School
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        School Name <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Abdi Gudina primary school"
                                        value={formData.schoolInfo.schoolName}
                                        onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Region
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter region"
                                        value={formData.schoolInfo.region}
                                        onChange={(e) => handleInputChange('schoolInfo', 'region', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter city"
                                        value={formData.schoolInfo.city}
                                        onChange={(e) => handleInputChange('schoolInfo', 'city', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Zone
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter zone"
                                        value={formData.schoolInfo.zone}
                                        onChange={(e) => handleInputChange('schoolInfo', 'zone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        School Type <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <select 
                                        value={formData.schoolInfo.schoolType}
                                        onChange={(e) => handleInputChange('schoolInfo', 'schoolType', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="">Select type</option>
                                        <option value="Public">Public</option>
                                        <option value="Private">Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Woreda
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter woreda"
                                        value={formData.schoolInfo.woreda}
                                        onChange={(e) => handleInputChange('schoolInfo', 'woreda', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Attended Year (From - To E.C)
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="From (e.g., 2004)"
                                            value={formData.schoolInfo.attendedYearFrom}
                                            onChange={(e) => handleInputChange('schoolInfo', 'attendedYearFrom', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="To (e.g., 2011)"
                                            value={formData.schoolInfo.attendedYearTo}
                                            onChange={(e) => handleInputChange('schoolInfo', 'attendedYearTo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem'
                                            }}
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
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Nationality <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Ethiopia"
                                        value={formData.familyInfo.nationality}
                                        onChange={(e) => handleInputChange('familyInfo', 'nationality', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Region <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your region"
                                        value={formData.familyInfo.region}
                                        onChange={(e) => handleInputChange('familyInfo', 'region', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Zone
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your zone"
                                        value={formData.familyInfo.zone}
                                        onChange={(e) => handleInputChange('familyInfo', 'zone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Woreda (district)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your woreda"
                                        value={formData.familyInfo.woreda}
                                        onChange={(e) => handleInputChange('familyInfo', 'woreda', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Kebele
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your kebele"
                                        value={formData.familyInfo.kebele}
                                        onChange={(e) => handleInputChange('familyInfo', 'kebele', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Mother Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter mother's name"
                                        value={formData.familyInfo.motherName}
                                        onChange={(e) => handleInputChange('familyInfo', 'motherName', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        Family Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+251911234567"
                                        value={formData.familyInfo.familyPhone}
                                        onChange={(e) => handleInputChange('familyInfo', 'familyPhone', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                            color: isDarkMode ? '#ffffff' : '#111827',
                                            border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Save & Continue Button */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem'
                }}>
                    <button
                        onClick={handleSaveAndContinue}
                        disabled={submitting}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.6 : 1
                        }}
                    >
                        {activeTab === 'family' ? t('submitApplication') : t('saveAndContinue')}
                    </button>
                </div>
            </div>

            {/* Agreement Modal */}
            {showAgreementModal && (
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
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2rem'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Check size={32} color="white" strokeWidth={3} />
                        </div>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>
                            Confirm Submission
                        </h3>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
                            By submitting this application, you confirm that all information provided is accurate and complete.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowAgreementModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'white',
                                    color: '#64748b',
                                    border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.6 : 1
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Confirm & Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
            
            {/* Footer */}
            <footer style={{
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
                borderTop: '1px solid #2d4a6f',
                flexShrink: 0
            }}>
                {t('copyright')}
            </footer>
        </div>
    );
};

export default ApplicationFormWrapper;

