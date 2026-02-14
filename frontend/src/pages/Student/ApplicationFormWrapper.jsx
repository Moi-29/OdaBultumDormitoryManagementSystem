// Comprehensive Application Form with all sections matching the design
import { useState } from 'react';
import { X, User, GraduationCap, Home, Users, AlertCircle, HelpCircle, CheckSquare } from 'lucide-react';
import axios from 'axios';
import API_URL from '@/config/api';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../translations/translations';

const ApplicationFormWrapper = () => {
    const { isDarkMode } = useTheme();
    const { language } = useLanguage();
    const t = (key) => getTranslation(language, key);
    
    const [activeTab, setActiveTab] = useState('personal');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    // Comprehensive form data structure
    const [formData, setFormData] = useState({
        // Personal Tab - Basic Information
        personalInfo: {
            name: '',
            fatherName: '',
            gFatherName: '',
            nameAm: '',
            fatherNameAm: '',
            gFatherNameAm: '',
            gender: '',
            dob: '',
            placeOfBirth: '',
            placeOfBirthAm: '',
            motherTongue: '',
            nationalId: '',
            healthStatus: '',
            maritalStatus: '',
            religion: '',
            // Location & Address
            citizenship: '',
            country: '',
            woreda: '',
            cityEn: '',
            cityAm: '',
            kebeleEn: '',
            kebeleAm: '',
            phone: '',
            email: '',
            poBox: '',
            // Others
            economicalStatus: '',
            areaType: '',
            tinNumber: '',
            accountNumber: ''
        },
        // Educational Tab
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
        // School Tab - Three sections
        schoolInfo: {
            // Primary School
            primary: {
                schoolName: '',
                schoolNameAm: '',
                woreda: '',
                attendedYearFrom: '',
                attendedYearTo: '',
                schoolType: ''
            },
            // Secondary School
            secondary: {
                schoolName: '',
                schoolNameAm: '',
                woreda: '',
                attendedYearFrom: '',
                attendedYearTo: '',
                schoolType: ''
            },
            // Preparatory School
            preparatory: {
                schoolName: '',
                schoolNameAm: '',
                woreda: '',
                attendedYearFrom: '',
                attendedYearTo: '',
                schoolType: ''
            }
        },
        // Family Tab
        familyInfo: {
            nationality: '',
            region: '',
            zone: '',
            woreda: '',
            kebele: '',
            motherName: '',
            familyPhone: ''
        },
        // Emergency Tab
        emergencyInfo: {
            fullName: '',
            relationship: '',
            phone: '',
            email: '',
            job: '',
            woreda: '',
            homeTown: '',
            kebele: ''
        },
        // Agreement
        agreement: {
            accepted: false
        }
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleInputChange = (section, field, value, subsection = null) => {
        if (subsection) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subsection]: {
                        ...prev[section][subsection],
                        [field]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSaveAndContinue = () => {
        const tabs = ['personal', 'educational', 'school', 'family', 'emergency', 'agreement', 'help'];
        const currentIndex = tabs.indexOf(activeTab);
        
        if (activeTab === 'agreement') {
            // Don't auto-navigate from agreement tab
            return;
        }

        // Validate current tab before proceeding
        if (activeTab === 'personal') {
            const required = ['name', 'fatherName', 'gFatherName', 'gender', 'dob', 'placeOfBirth', 
                            'motherTongue', 'nationalId', 'healthStatus', 'maritalStatus',
                            'citizenship', 'country', 'woreda', 'cityEn', 'kebeleEn', 
                            'phone', 'email', 'economicalStatus', 'areaType'];
            for (const field of required) {
                if (!formData.personalInfo[field]) {
                    showNotification(`Please fill in all required fields in Personal tab`, 'error');
                    return;
                }
            }
        }

        if (activeTab === 'educational') {
            const required = ['stream', 'sponsorCategory', 'nationalExamYear', 'entryYear', 
                            'examinationId', 'admissionDate', 'nationalExamResult'];
            for (const field of required) {
                if (!formData.educationalInfo[field]) {
                    showNotification(`Please fill in all required fields in Educational tab`, 'error');
                    return;
                }
            }
        }

        if (activeTab === 'school') {
            // Validate Primary School
            const primaryRequired = ['schoolName', 'woreda', 'schoolType', 'attendedYearFrom', 'attendedYearTo'];
            for (const field of primaryRequired) {
                if (!formData.schoolInfo.primary[field]) {
                    showNotification(`Please fill in all required fields in Primary School section`, 'error');
                    return;
                }
            }
            // Validate Secondary School
            const secondaryRequired = ['schoolName', 'woreda', 'schoolType', 'attendedYearFrom', 'attendedYearTo'];
            for (const field of secondaryRequired) {
                if (!formData.schoolInfo.secondary[field]) {
                    showNotification(`Please fill in all required fields in Secondary School section`, 'error');
                    return;
                }
            }
        }

        if (activeTab === 'family') {
            const required = ['nationality', 'region', 'zone', 'woreda', 'kebele', 'motherName', 'familyPhone'];
            for (const field of required) {
                if (!formData.familyInfo[field]) {
                    showNotification(`Please fill in all required fields in Family tab`, 'error');
                    return;
                }
            }
        }

        if (activeTab === 'emergency') {
            const required = ['fullName', 'relationship', 'phone', 'job', 'woreda', 'homeTown', 'kebele'];
            for (const field of required) {
                if (!formData.emergencyInfo[field]) {
                    showNotification(`Please fill in all required fields in Emergency tab`, 'error');
                    return;
                }
            }
        }
        
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handleFinalSubmit = async () => {
        if (!formData.agreement.accepted) {
            showNotification('Please accept the agreement to submit your application', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const applicationData = {
                studentId: formData.personalInfo.nationalId,
                studentName: formData.personalInfo.name,
                submittedOn: new Date().toISOString().split('T')[0],
                canEdit: false, // Lock editing after submission
                ...formData
            };

            await axios.post(`${API_URL}/api/applications`, applicationData);
            showNotification('Application submitted successfully! Your application is now under review.', 'success');
            
            setTimeout(() => {
                setActiveTab('personal');
                // Optionally redirect or disable form
            }, 3000);
        } catch (error) {
            console.error('Error submitting application:', error);
            showNotification('Failed to submit application. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            height: 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isDarkMode ? '#0f172a' : '#f8f9fa',
            overflow: 'hidden'
        }}>
            <div style={{ flex: 1, padding: '2rem 1rem', overflow: 'auto' }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '5rem',
                    right: '2rem',
                    zIndex: 10001,
                    minWidth: '320px',
                    background: notification.type === 'success' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
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
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                            {notification.type === 'success' ? t('success') : t('error')}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>{notification.message}</div>
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
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '1.5rem 2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                        {t('applicationForm')}
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.95 }}>
                        {t('completeAllSections')}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    padding: '0.5rem 1rem',
                    borderBottom: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                    overflowX: 'auto',
                    backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { id: 'personal', label: t('personal'), icon: <User size={16} /> },
                        { id: 'educational', label: t('educational'), icon: <GraduationCap size={16} /> },
                        { id: 'school', label: t('school'), icon: <Home size={16} /> },
                        { id: 'family', label: t('family'), icon: <Users size={16} /> },
                        { id: 'emergency', label: t('emergency'), icon: <AlertCircle size={16} /> },
                        { id: 'agreement', label: t('agreement'), icon: <CheckSquare size={16} /> },
                        { id: 'help', label: t('help'), icon: <HelpCircle size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.6rem 1rem',
                                border: 'none',
                                background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                                color: activeTab === tab.id ? 'white' : (isDarkMode ? '#ffffff' : '#64748b'),
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                fontSize: '0.85rem',
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
                    padding: '2rem',
                    maxHeight: 'calc(100vh - 400px)',
                    overflowY: 'auto'
                }}>
                    {/* Personal Tab */}
                    {activeTab === 'personal' && (
                        <div>
                            {/* Basic Information Section */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <User size={20} />
                                    {t('basicInformation')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('name')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Fikadu"
                                            value={formData.personalInfo.name}
                                            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('fatherName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Girma"
                                            value={formData.personalInfo.fatherName}
                                            onChange={(e) => handleInputChange('personalInfo', 'fatherName', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('gFatherName')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Wakjira"
                                            value={formData.personalInfo.gFatherName}
                                            onChange={(e) => handleInputChange('personalInfo', 'gFatherName', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('religious')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('enterReligion')}
                                            value={formData.personalInfo.religion}
                                            onChange={(e) => handleInputChange('personalInfo', 'religion', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('gender')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.gender}
                                            onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">M</option>
                                            <option value="Male">{t('male')}</option>
                                            <option value="Female">{t('female')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('dob')}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.personalInfo.dob}
                                            onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('placeOfBirth')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.placeOfBirth}
                                            onChange={(e) => handleInputChange('personalInfo', 'placeOfBirth', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('motherTongue')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.personalInfo.motherTongue}
                                            onChange={(e) => handleInputChange('personalInfo', 'motherTongue', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('nationalId')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.nationalId}
                                            onChange={(e) => handleInputChange('personalInfo', 'nationalId', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('healthStatus')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.healthStatus}
                                            onChange={(e) => handleInputChange('personalInfo', 'healthStatus', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Normal">{t('normal')}</option>
                                            <option value="Chronic">{t('chronic')}</option>
                                            <option value="Disabled">{t('disabled')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('maritalStatus')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.maritalStatus}
                                            onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Single">{t('single')}</option>
                                            <option value="Married">{t('married')}</option>
                                            <option value="Divorced">{t('divorced')}</option>
                                            <option value="Widowed">{t('widowed')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Location & Address Section */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    📍 {t('locationAddress')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('citizenship')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('ethiopian')}
                                            value={formData.personalInfo.citizenship}
                                            onChange={(e) => handleInputChange('personalInfo', 'citizenship', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('country')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('ethiopia')}
                                            value={formData.personalInfo.country}
                                            onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('woreda')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.woreda}
                                            onChange={(e) => handleInputChange('personalInfo', 'woreda', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">{t('selectWoreda')}</option>
                                            <option value="Woreda1">Woreda 1</option>
                                            <option value="Woreda2">Woreda 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('cityEn')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.cityEn}
                                            onChange={(e) => handleInputChange('personalInfo', 'cityEn', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('kebeleEn')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.kebeleEn}
                                            onChange={(e) => handleInputChange('personalInfo', 'kebeleEn', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('phone')}
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.phone}
                                            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('email')}
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.email}
                                            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('poBox')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.personalInfo.poBox}
                                            onChange={(e) => handleInputChange('personalInfo', 'poBox', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
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

                            {/* Others Section */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    ••• {t('others')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('economicalStatus')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.economicalStatus}
                                            onChange={(e) => handleInputChange('personalInfo', 'economicalStatus', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Unspecified">{t('unspecified')}</option>
                                            <option value="Low">{t('low')}</option>
                                            <option value="Medium">{t('medium')}</option>
                                            <option value="High">{t('high')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('areaType')}
                                        </label>
                                        <select
                                            value={formData.personalInfo.areaType}
                                            onChange={(e) => handleInputChange('personalInfo', 'areaType', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">{t('selectAreaType')}</option>
                                            <option value="Urban">{t('urban')}</option>
                                            <option value="Rural">{t('rural')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('tinNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.tinNumber}
                                            onChange={(e) => handleInputChange('personalInfo', 'tinNumber', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('accountNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('unspecified')}
                                            value={formData.personalInfo.accountNumber}
                                            onChange={(e) => handleInputChange('personalInfo', 'accountNumber', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Educational Tab */}
                    {activeTab === 'educational' && (
                        <div>
                            {/* Campus Related Information */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem'
                                }}>
                                    {t('campusRelatedInformation')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('stream')}
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
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Not Applicable">{t('notApplicable')}</option>
                                            <option value="Natural Science">{t('naturalScience')}</option>
                                            <option value="Social Science">{t('socialScience')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('sponsorCategory')}
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
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Government">{t('government')}</option>
                                            <option value="Private">{t('private')}</option>
                                            <option value="Self">{t('self')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('nationalExamYear')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="2017"
                                            value={formData.educationalInfo.nationalExamYear}
                                            onChange={(e) => handleInputChange('educationalInfo', 'nationalExamYear', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('entryYear')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="2017"
                                            value={formData.educationalInfo.entryYear}
                                            onChange={(e) => handleInputChange('educationalInfo', 'entryYear', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('sponsoredBy')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.educationalInfo.sponsoredBy}
                                            onChange={(e) => handleInputChange('educationalInfo', 'sponsoredBy', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('examinationId')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="DHAC1574"
                                            value={formData.educationalInfo.examinationId}
                                            onChange={(e) => handleInputChange('educationalInfo', 'examinationId', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('admissionDate')}
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
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Cheked-In Date
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
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('nationalExamResult')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="0"
                                            value={formData.educationalInfo.nationalExamResult}
                                            onChange={(e) => handleInputChange('educationalInfo', 'nationalExamResult', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
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
                        </div>
                    )}

                    {/* School Tab */}
                    {activeTab === 'school' && (
                        <div>
                            {/* Primary School */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem'
                                }}>
                                    {t('primarySchool')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            School Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Unspecified"
                                            value={formData.schoolInfo.primary.schoolName}
                                            onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value, 'primary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Woreda
                                        </label>
                                        <select
                                            value={formData.schoolInfo.primary.woreda}
                                            onChange={(e) => handleInputChange('schoolInfo', 'woreda', e.target.value, 'primary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">~Select Woreda~</option>
                                            <option value="Woreda1">Woreda 1</option>
                                            <option value="Woreda2">Woreda 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Attended Year (From-To(E.C))
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Unspecified"
                                                value={formData.schoolInfo.primary.attendedYearFrom}
                                                onChange={(e) => handleInputChange('schoolInfo', 'attendedYearFrom', e.target.value, 'primary')}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#991b1b',
                                                    border: '2px solid #fecaca',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Unspecified"
                                                value={formData.schoolInfo.primary.attendedYearTo}
                                                onChange={(e) => handleInputChange('schoolInfo', 'attendedYearTo', e.target.value, 'primary')}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#991b1b',
                                                    border: '2px solid #fecaca',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            School Type
                                        </label>
                                        <select
                                            value={formData.schoolInfo.primary.schoolType}
                                            onChange={(e) => handleInputChange('schoolInfo', 'schoolType', e.target.value, 'primary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Unspecified">Unspecified</option>
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary School */}
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem'
                                }}>
                                    {t('secondarySchool')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            School Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Unspecified"
                                            value={formData.schoolInfo.secondary.schoolName}
                                            onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value, 'secondary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                border: '2px solid #fecaca',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Woreda
                                        </label>
                                        <select
                                            value={formData.schoolInfo.secondary.woreda}
                                            onChange={(e) => handleInputChange('schoolInfo', 'woreda', e.target.value, 'secondary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">~Select Woreda~</option>
                                            <option value="Woreda1">Woreda 1</option>
                                            <option value="Woreda2">Woreda 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Attended Year (From-To(E.C))
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Unspecified"
                                                value={formData.schoolInfo.secondary.attendedYearFrom}
                                                onChange={(e) => handleInputChange('schoolInfo', 'attendedYearFrom', e.target.value, 'secondary')}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#991b1b',
                                                    border: '2px solid #fecaca',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Unspecified"
                                                value={formData.schoolInfo.secondary.attendedYearTo}
                                                onChange={(e) => handleInputChange('schoolInfo', 'attendedYearTo', e.target.value, 'secondary')}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#991b1b',
                                                    border: '2px solid #fecaca',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            School Type
                                        </label>
                                        <select
                                            value={formData.schoolInfo.secondary.schoolType}
                                            onChange={(e) => handleInputChange('schoolInfo', 'schoolType', e.target.value, 'secondary')}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="Unspecified">Unspecified</option>
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Family Tab */}
                    {activeTab === 'family' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151' }}>
                                        {t('nationality')} <span style={{ color: '#F43F5E' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t('enterNationality')}
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
                                        placeholder={t('enterPhone')}
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

                    {/* Emergency Tab */}
                    {activeTab === 'emergency' && (
                        <div>
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#3b82f6',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem'
                                }}>
                                    {t('emergencyContactInformation')}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('fullName')} <span style={{ color: '#F43F5E' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyInfo.fullName}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'fullName', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('relationship')} <span style={{ color: '#F43F5E' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyInfo.relationship}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'relationship', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('phone')} <span style={{ color: '#F43F5E' }}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder={t('enterPhone')}
                                            value={formData.emergencyInfo.phone}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'phone', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.emergencyInfo.email}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'email', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('job')} <span style={{ color: '#F43F5E' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyInfo.job}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'job', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Woreda
                                        </label>
                                        <select
                                            value={formData.emergencyInfo.woreda}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'woreda', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="">~Select Woreda~</option>
                                            <option value="Woreda1">Woreda 1</option>
                                            <option value="Woreda2">Woreda 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            {t('homeTown')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyInfo.homeTown}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'homeTown', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: isDarkMode ? '#0f172a' : 'white',
                                                color: isDarkMode ? '#ffffff' : '#111827',
                                                border: isDarkMode ? '2px solid #475569' : '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.875rem' }}>
                                            Kebele
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergencyInfo.kebele}
                                            onChange={(e) => handleInputChange('emergencyInfo', 'kebele', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
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
                        </div>
                    )}

                    {/* Agreement Tab */}
                    {activeTab === 'agreement' && (
                        <div>
                            <div style={{
                                border: '3px solid #f59e0b',
                                borderRadius: '12px',
                                padding: '2rem',
                                backgroundColor: '#fffbeb'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <AlertCircle size={48} color="#f59e0b" style={{ flexShrink: 0 }} />
                                    <div>
                                        <h3 style={{
                                            color: '#92400e',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            marginBottom: '1rem'
                                        }}>
                                            {t('importantNotice')}
                                        </h3>
                                        <p style={{ 
                                            fontSize: '1.05rem', 
                                            color: '#78350f', 
                                            marginBottom: '1rem',
                                            lineHeight: '1.6'
                                        }}>
                                            <strong>{t('cannotEditWarning')}</strong>
                                        </p>
                                        <p style={{ 
                                            fontSize: '0.95rem', 
                                            color: '#92400e',
                                            lineHeight: '1.6'
                                        }}>
                                            {t('reviewCarefully')}
                                        </p>
                                    </div>
                                </div>

                                <div style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #fbbf24',
                                    borderRadius: '10px',
                                    padding: '1.5rem',
                                    marginTop: '1.5rem'
                                }}>
                                    <h4 style={{
                                        color: '#1e293b',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        marginBottom: '1rem'
                                    }}>
                                        {t('applicationAgreement')}
                                    </h4>
                                    <p style={{ 
                                        fontSize: '0.95rem', 
                                        color: '#475569',
                                        marginBottom: '1.5rem',
                                        lineHeight: '1.6'
                                    }}>
                                        {t('agreementText')}
                                    </p>

                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        backgroundColor: '#f8fafc',
                                        border: '2px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.agreement.accepted}
                                            onChange={(e) => handleInputChange('agreement', 'accepted', e.target.checked)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{ 
                                            fontSize: '0.95rem', 
                                            fontWeight: 600,
                                            color: '#1e293b'
                                        }}>
                                            {t('agreeToTerms')}
                                        </span>
                                    </label>

                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={!formData.agreement.accepted || submitting}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 2rem',
                                            background: formData.agreement.accepted && !submitting
                                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                : '#94a3b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            cursor: formData.agreement.accepted && !submitting ? 'pointer' : 'not-allowed',
                                            boxShadow: formData.agreement.accepted && !submitting 
                                                ? '0 4px 12px rgba(16, 185, 129, 0.4)' 
                                                : 'none',
                                            transition: 'all 0.3s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <span>⏳</span>
                                                <span>{t('submittingApplication')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>📤</span>
                                                <span>{t('submitApplication')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Help Tab */}
                    {activeTab === 'help' && (
                        <div>
                            <div style={{
                                border: isDarkMode ? '2px solid #3b82f6' : '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center'
                            }}>
                                <HelpCircle size={64} color="#3b82f6" style={{ margin: '0 auto 1.5rem' }} />
                                <h3 style={{
                                    color: isDarkMode ? '#ffffff' : '#1e293b',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem'
                                }}>
                                    {t('needHelp')}
                                </h3>
                                <p style={{ fontSize: '1rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                    {t('helpDescription')}
                                </p>
                                
                                <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '12px',
                                        border: isDarkMode ? '1px solid #475569' : '1px solid #e5e7eb'
                                    }}>
                                        <h4 style={{ color: '#3b82f6', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>
                                            {t('phoneSupport')}
                                        </h4>
                                        <p style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.95rem' }}>
                                            +251 11 XXX XXXX
                                        </p>
                                    </div>
                                    
                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '12px',
                                        border: isDarkMode ? '1px solid #475569' : '1px solid #e5e7eb'
                                    }}>
                                        <h4 style={{ color: '#3b82f6', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>
                                            {t('emailSupport')}
                                        </h4>
                                        <p style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.95rem' }}>
                                            studentservices@university.edu.et
                                        </p>
                                    </div>
                                    
                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                                        borderRadius: '12px',
                                        border: isDarkMode ? '1px solid #475569' : '1px solid #e5e7eb'
                                    }}>
                                        <h4 style={{ color: '#3b82f6', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>
                                            {t('officeHours')}
                                        </h4>
                                        <p style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#374151', fontSize: '0.95rem' }}>
                                            {t('mondayToFriday')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Save Button - Only show on non-agreement tabs */}
                {activeTab !== 'agreement' && activeTab !== 'help' && (
                    <div style={{
                        padding: '1.5rem 2rem',
                        borderTop: isDarkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb'
                    }}>
                        <button
                            onClick={handleSaveAndContinue}
                            disabled={submitting}
                            style={{
                                padding: '0.875rem 2.5rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1,
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {submitting ? t('saving') : t('saveAndContinue')}
                        </button>
                    </div>
                )}
            </div>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
                borderTop: '1px solid #2d4a6f',
                marginTop: 'auto'
            }}>
                Copyright @ 2026 Oda Bultum University. All rights reserved.
            </footer>
        </div>
    );
};

export default ApplicationFormWrapper;
