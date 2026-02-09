import { useState, useEffect } from 'react';
import { ClipboardList, Eye, Lock, Unlock, X, User, GraduationCap, Home, Users, Search, Filter, Download, Trash2, CheckCircle2, Calendar, Phone, Mail, MapPin, Award, BookOpen, Building } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Try to fetch from API
            try {
                const response = await axios.get(`${API_URL}/api/applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    setApplications(response.data);
                    setLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using mock data:', apiError.message);
            }
            
            // Fallback to mock data if API fails or returns empty
            const mockData = [
                {
                    _id: '1',
                    studentId: 'RU/1270/18',
                    studentName: 'Abebech Kebede',
                    submittedOn: '2024-05-10',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Abebech Kebede Alemu',
                        idNo: 'RU/1270/18',
                        sex: 'Female',
                        mealCardNo: 'MC12345',
                        college: 'Natural Sciences',
                        department: 'Biology',
                        academicYear: '3rd Year',
                        dormNo: 'B-205',
                        phone: '+251911234567',
                        religious: 'Orthodox',
                        nation: 'Ethiopian'
                    },
                    educationalInfo: {
                        stream: 'Natural Science',
                        sponsorCategory: 'Government',
                        nationalExamYear: '2015',
                        entryYear: '2016',
                        sponsoredBy: 'Family',
                        examinationId: 'D1729733',
                        admissionDate: '12/14/2023 12:00 AM',
                        checkedInDate: '01/15/2024',
                        nationalExamResult: '454'
                    },
                    schoolInfo: {
                        schoolName: 'Abdi Gudina Primary School',
                        region: 'Oromia',
                        city: 'Tulu Bolo',
                        zone: 'West Shewa',
                        schoolType: 'Public',
                        woreda: 'BECHO(SHOA SOUTH WEST)',
                        attendedYearFrom: '2004',
                        attendedYearTo: '2011'
                    },
                    familyInfo: {
                        nationality: 'Ethiopia',
                        region: 'Oromia',
                        zone: 'West Shewa',
                        woreda: 'Becho',
                        kebele: 'Areda',
                        motherName: 'Almaz Tesfaye',
                        familyPhone: '+251922334455'
                    }
                },
                {
                    _id: '2',
                    studentId: 'RU/1271/18',
                    studentName: 'Addis Ketema',
                    submittedOn: '2024-05-09',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Addis Ketema Bekele',
                        idNo: 'RU/1271/18',
                        sex: 'Male',
                        mealCardNo: 'MC12346',
                        college: 'Engineering',
                        department: 'Computer Science',
                        academicYear: '2nd Year',
                        dormNo: 'A-101',
                        phone: '+251922345678',
                        religious: 'Protestant',
                        nation: 'Ethiopian'
                    },
                    educationalInfo: {
                        stream: 'Natural Science',
                        sponsorCategory: 'Government',
                        nationalExamYear: '2016',
                        entryYear: '2017',
                        sponsoredBy: 'Government',
                        examinationId: 'D1729734',
                        admissionDate: '12/15/2023 10:00 AM',
                        checkedInDate: '01/16/2024',
                        nationalExamResult: '478'
                    },
                    schoolInfo: {
                        schoolName: 'Addis Ketema Secondary School',
                        region: 'Addis Ababa',
                        city: 'Addis Ababa',
                        zone: 'Addis Ketema',
                        schoolType: 'Public',
                        woreda: 'Addis Ketema',
                        attendedYearFrom: '2005',
                        attendedYearTo: '2012'
                    },
                    familyInfo: {
                        nationality: 'Ethiopia',
                        region: 'Addis Ababa',
                        zone: 'Addis Ketema',
                        woreda: 'Addis Ketema',
                        kebele: '05',
                        motherName: 'Tigist Haile',
                        familyPhone: '+251933445566'
                    }
                }
            ];
            setApplications(mockData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    const toggleEditPermission = async (applicationId, event) => {
        // Prevent any default behavior or event bubbling
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}/api/applications/${applicationId}/edit-permission`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update local state with response data
            setApplications(applications.map(app => 
                app._id === applicationId ? { ...app, canEdit: !app.canEdit } : app
            ));
            
            // Show success notification
            const updatedApp = applications.find(app => app._id === applicationId);
            const newStatus = !updatedApp.canEdit;
            showNotification(
                `Edit permission ${newStatus ? 'enabled' : 'disabled'} for ${updatedApp.studentName}`,
                'success'
            );
        } catch (error) {
            console.error('Error toggling edit permission:', error);
            showNotification('Failed to toggle edit permission. Please try again.', 'error');
        }
    };

    const deleteSelectedApplications = async () => {
        if (selectedIds.length === 0) return;
        
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} application(s)? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // Try API call first
            try {
                const response = await axios.delete(`${API_URL}/api/applications/bulk`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: { applicationIds: selectedIds }
                });

                // Remove from local state
                setApplications(applications.filter(app => !selectedIds.includes(app._id)));
                setSelectedIds([]);
                setSelectMode(false);
                
                showNotification(response.data.message || `Successfully deleted ${selectedIds.length} application(s)`, 'success');
            } catch (apiError) {
                // If API fails (404 or 500), just remove from local state (for mock data)
                console.log('API not available, removing from local state:', apiError.message);
                
                // Remove from local state
                setApplications(applications.filter(app => !selectedIds.includes(app._id)));
                setSelectedIds([]);
                setSelectMode(false);
                
                showNotification(`Successfully deleted ${selectedIds.length} application(s) from local view`, 'success');
            }
        } catch (error) {
            console.error('Error deleting applications:', error);
            showNotification('Failed to delete applications. Please try again.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return '#10b981';
            case 'Pending': return '#f59e0b';
            case 'Rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const viewDetails = (application) => {
        setSelectedApplication(application);
        setShowDetailsModal(true);
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
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
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                            <ClipboardList size={32} /> Applications
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Manage student dormitory applications
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => {
                                setSelectMode(!selectMode);
                                if (selectMode) {
                                    setSelectedIds([]);
                                }
                            }}
                            type="button"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectMode ? '#10b981' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {selectMode ? 'Done' : 'Select'}
                        </button>
                        {selectMode && (
                            <button
                                onClick={deleteSelectedApplications}
                                disabled={selectedIds.length === 0}
                                type="button"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: selectedIds.length === 0 ? '#9ca3af' : '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    opacity: selectedIds.length === 0 ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedIds.length > 0) {
                                        e.currentTarget.style.background = '#dc2626';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedIds.length > 0) {
                                        e.currentTarget.style.background = '#ef4444';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                Delete ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    {selectMode && (
                                        <input 
                                            type="checkbox" 
                                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                            checked={selectedIds.length === applications.length && applications.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(applications.map(app => app._id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    )}
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Student Name
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Student ID
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Submitted On
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                                    Edit Permission
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} style={{ 
                                    borderBottom: '1px solid #e2e8f0',
                                    background: selectedIds.includes(app._id) ? '#f0fdf4' : 'transparent'
                                }}>
                                    <td style={{ padding: '1rem' }}>
                                        {selectMode && (
                                            <input 
                                                type="checkbox" 
                                                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                checked={selectedIds.includes(app._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds([...selectedIds, app._id]);
                                                    } else {
                                                        setSelectedIds(selectedIds.filter(id => id !== app._id));
                                                    }
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                                        {app.studentName}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#3b82f6', fontWeight: 600 }}>
                                        {app.studentId}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {app.submittedOn}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => toggleEditPermission(app._id, e)}
                                            type="button"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                transition: 'all 0.2s',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                            title={app.canEdit ? 'Disable editing' : 'Enable editing'}
                                        >
                                            {app.canEdit ? (
                                                <Unlock size={20} color="#10b981" />
                                            ) : (
                                                <Lock size={20} color="#64748b" />
                                            )}
                                        </button>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => viewDetails(app)}
                                            type="button"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {applications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <ClipboardList size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No applications submitted yet</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '24px',
                        maxWidth: '950px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            color: 'white',
                            padding: '2rem 2.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                right: '-10%',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                borderRadius: '50%'
                            }}></div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h2 style={{ 
                                    margin: 0, 
                                    fontSize: '1.75rem', 
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    Application Details
                                </h2>
                                <p style={{ 
                                    margin: '0.5rem 0 0 0', 
                                    fontSize: '0.9rem', 
                                    opacity: 0.95,
                                    fontWeight: 400
                                }}>
                                    {selectedApplication.studentName} • {selectedApplication.personalInfo.idNo}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    color: 'white',
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                <X size={22} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '1.5rem 2.5rem 0 2.5rem',
                            background: 'linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%)',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            {[
                                { id: 'personal', label: 'Personal', icon: <User size={18} />, color: '#10b981' },
                                { id: 'educational', label: 'Educational', icon: <GraduationCap size={18} />, color: '#3b82f6' },
                                { id: 'school', label: 'School', icon: <Home size={18} />, color: '#f59e0b' },
                                { id: 'family', label: 'Family', icon: <Users size={18} />, color: '#8b5cf6' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem 1.75rem',
                                        border: 'none',
                                        background: activeTab === tab.id 
                                            ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                                            : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 700 : 500,
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderRadius: '12px 12px 0 0',
                                        position: 'relative',
                                        transform: activeTab === tab.id ? 'translateY(1px)' : 'translateY(0)',
                                        boxShadow: activeTab === tab.id 
                                            ? `0 -4px 12px -2px ${tab.color}40`
                                            : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = '#f1f5f9';
                                            e.currentTarget.style.color = '#1e293b';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Content */}
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            padding: '2.5rem',
                            background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)'
                        }}>
                            {/* Personal Tab */}
                            {activeTab === 'personal' && (
                                <div>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '2rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #10b98120 0%, #10b98110 100%)',
                                        borderRadius: '12px',
                                        border: '1px solid #10b98130'
                                    }}>
                                        <User size={20} color="#10b981" />
                                        <h3 style={{ 
                                            margin: 0, 
                                            color: '#1e293b', 
                                            fontSize: '1.15rem', 
                                            fontWeight: 700,
                                            letterSpacing: '-0.3px'
                                        }}>
                                            Personal Information
                                        </h3>
                                    </div>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.75rem'
                                    }}>
                                        <FormField label="Full Name" value={selectedApplication.personalInfo.fullName} required />
                                        <FormField label="ID No." value={selectedApplication.personalInfo.idNo} required />
                                        <FormField label="Sex" value={selectedApplication.personalInfo.sex} required />
                                        <FormField label="Meal card No." value={selectedApplication.personalInfo.mealCardNo} />
                                        <FormField label="College" value={selectedApplication.personalInfo.college} required />
                                        <FormField label="Department" value={selectedApplication.personalInfo.department} required />
                                        <FormField label="Academic Year" value={selectedApplication.personalInfo.academicYear} required />
                                        <FormField label="Dorm No." value={selectedApplication.personalInfo.dormNo} />
                                        <FormField label="Your Phone Number" value={selectedApplication.personalInfo.phone} required />
                                        <FormField label="Religious" value={selectedApplication.personalInfo.religious} />
                                        <FormField label="Your Nation" value={selectedApplication.personalInfo.nation} />
                                    </div>
                                </div>
                            )}

                            {/* Educational Tab */}
                            {activeTab === 'educational' && selectedApplication.educationalInfo && (
                                <div>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '2rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #3b82f620 0%, #3b82f610 100%)',
                                        borderRadius: '12px',
                                        border: '1px solid #3b82f630'
                                    }}>
                                        <GraduationCap size={20} color="#3b82f6" />
                                        <h3 style={{ 
                                            margin: 0, 
                                            color: '#1e293b', 
                                            fontSize: '1.15rem', 
                                            fontWeight: 700,
                                            letterSpacing: '-0.3px'
                                        }}>
                                            Campus Related Information
                                        </h3>
                                    </div>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.75rem'
                                    }}>
                                        <FormField label="Stream" value={selectedApplication.educationalInfo.stream} required />
                                        <FormField label="Sponsor Category" value={selectedApplication.educationalInfo.sponsorCategory} required />
                                        <FormField label="National Exam Year (EC)" value={selectedApplication.educationalInfo.nationalExamYear} required />
                                        <FormField label="Entry Year" value={selectedApplication.educationalInfo.entryYear} required />
                                        <FormField label="Sponsored By" value={selectedApplication.educationalInfo.sponsoredBy} />
                                        <FormField label="Examination ID" value={selectedApplication.educationalInfo.examinationId} />
                                        <FormField label="Admission Date" value={selectedApplication.educationalInfo.admissionDate} required />
                                        <FormField label="Checked-In Date" value={selectedApplication.educationalInfo.checkedInDate} />
                                        <FormField label="National Exam Result" value={selectedApplication.educationalInfo.nationalExamResult} />
                                    </div>
                                </div>
                            )}

                            {/* School Tab */}
                            {activeTab === 'school' && selectedApplication.schoolInfo && (
                                <div>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '2rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #f59e0b20 0%, #f59e0b10 100%)',
                                        borderRadius: '12px',
                                        border: '1px solid #f59e0b30'
                                    }}>
                                        <Home size={20} color="#f59e0b" />
                                        <h3 style={{ 
                                            margin: 0, 
                                            color: '#1e293b', 
                                            fontSize: '1.15rem', 
                                            fontWeight: 700,
                                            letterSpacing: '-0.3px'
                                        }}>
                                            Primary School Information
                                        </h3>
                                    </div>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.75rem'
                                    }}>
                                        <FormField label="School Name" value={selectedApplication.schoolInfo.schoolName} required />
                                        <FormField label="Region" value={selectedApplication.schoolInfo.region} />
                                        <FormField label="City" value={selectedApplication.schoolInfo.city} />
                                        <FormField label="Zone" value={selectedApplication.schoolInfo.zone} />
                                        <FormField label="School Type" value={selectedApplication.schoolInfo.schoolType} required />
                                        <FormField label="Woreda" value={selectedApplication.schoolInfo.woreda} />
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.75rem', 
                                                fontWeight: 600, 
                                                color: '#1e293b', 
                                                fontSize: '0.95rem',
                                                letterSpacing: '-0.2px'
                                            }}>
                                                Attended Year (From - To E.C)
                                            </label>
                                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                                <input
                                                    type="text"
                                                    value={selectedApplication.schoolInfo.attendedYearFrom}
                                                    readOnly
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.875rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
                                                        color: '#1e293b',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 500,
                                                        transition: 'all 0.2s'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={selectedApplication.schoolInfo.attendedYearTo}
                                                    readOnly
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.875rem 1rem',
                                                        border: '2px solid #e5e7eb',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
                                                        color: '#1e293b',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 500,
                                                        transition: 'all 0.2s'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family Tab */}
                            {activeTab === 'family' && selectedApplication.familyInfo && (
                                <div>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '2rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #8b5cf620 0%, #8b5cf610 100%)',
                                        borderRadius: '12px',
                                        border: '1px solid #8b5cf630'
                                    }}>
                                        <Users size={20} color="#8b5cf6" />
                                        <h3 style={{ 
                                            margin: 0, 
                                            color: '#1e293b', 
                                            fontSize: '1.15rem', 
                                            fontWeight: 700,
                                            letterSpacing: '-0.3px'
                                        }}>
                                            Birth Place & Family Information
                                        </h3>
                                    </div>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.75rem'
                                    }}>
                                        <FormField label="Nationality" value={selectedApplication.familyInfo.nationality} required />
                                        <FormField label="Region" value={selectedApplication.familyInfo.region} required />
                                        <FormField label="Zone" value={selectedApplication.familyInfo.zone} />
                                        <FormField label="Woreda (district)" value={selectedApplication.familyInfo.woreda} />
                                        <FormField label="Kebele" value={selectedApplication.familyInfo.kebele} />
                                        <FormField label="Your Mother Name" value={selectedApplication.familyInfo.motherName} required />
                                        <FormField label="Family Phone Number" value={selectedApplication.familyInfo.familyPhone} required />
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for displaying form fields (read-only)
const FormField = ({ label, value, required }) => (
    <div>
        <label style={{ 
            display: 'block', 
            marginBottom: '0.75rem', 
            fontWeight: 600, 
            color: '#1e293b', 
            fontSize: '0.95rem',
            letterSpacing: '-0.2px'
        }}>
            {label} {required && <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>}
        </label>
        <input
            type="text"
            value={value || '-'}
            readOnly
            style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
                color: '#1e293b',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
        />
    </div>
);

// Helper component for displaying info fields
const InfoField = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
            {label}
        </div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>
            {value || '-'}
        </div>
    </div>
);

export default Applications;
