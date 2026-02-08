import { useState, useEffect } from 'react';
import { ClipboardList, Eye, Lock, Unlock, X, User, GraduationCap, Home, Users } from 'lucide-react';
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

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            // Mock data with complete information
            const mockData = [
                {
                    _id: '1',
                    studentName: 'Abebech Kebede',
                    schoolName: 'Addis Ababa University',
                    submittedOn: '2024-05-10',
                    status: 'Approved',
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
                    studentName: 'Addis Ketema',
                    schoolName: 'Sec. School',
                    submittedOn: '2024-05-09',
                    status: 'Pending',
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

    const toggleEditPermission = async (applicationId) => {
        setApplications(applications.map(app => 
            app._id === applicationId ? { ...app, canEdit: !app.canEdit } : app
        ));
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
        <div>
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
                                onClick={() => setSelectedIds([])}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Clear ({selectedIds.length})
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
                                    School Name
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Submitted On
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    Status
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
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {app.schoolName}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {app.submittedOn}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            background: `${getStatusColor(app.status)}20`,
                                            color: getStatusColor(app.status)
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => toggleEditPermission(app._id)}
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
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                Application Details
                            </h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
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
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0',
                            padding: '0 2rem',
                            borderBottom: '2px solid #e2e8f0',
                            background: '#f8fafc'
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
                                        padding: '1rem 1.5rem',
                                        border: 'none',
                                        background: activeTab === tab.id ? '#10b981' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 600 : 500,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s',
                                        borderRadius: '8px 8px 0 0'
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            {/* Personal Tab */}
                            {activeTab === 'personal' && (
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>
                                        I. Please fill your Full Information
                                    </h3>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.5rem'
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
                                    <h3 style={{ marginBottom: '1.5rem', color: '#0ea5e9', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        Campus Related Information
                                    </h3>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.5rem'
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
                                    <h3 style={{ marginBottom: '1.5rem', color: '#0ea5e9', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        Primary School
                                    </h3>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.5rem'
                                    }}>
                                        <FormField label="School Name" value={selectedApplication.schoolInfo.schoolName} required />
                                        <FormField label="Region" value={selectedApplication.schoolInfo.region} />
                                        <FormField label="City" value={selectedApplication.schoolInfo.city} />
                                        <FormField label="Zone" value={selectedApplication.schoolInfo.zone} />
                                        <FormField label="School Type" value={selectedApplication.schoolInfo.schoolType} required />
                                        <FormField label="Woreda" value={selectedApplication.schoolInfo.woreda} />
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.9rem' }}>
                                                Attended Year (From - To E.C)
                                            </label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <input
                                                    type="text"
                                                    value={selectedApplication.schoolInfo.attendedYearFrom}
                                                    readOnly
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.75rem',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px',
                                                        background: '#f8fafc',
                                                        color: '#1e293b'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    value={selectedApplication.schoolInfo.attendedYearTo}
                                                    readOnly
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.75rem',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px',
                                                        background: '#f8fafc',
                                                        color: '#1e293b'
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
                                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>
                                        II. Please fill your Birth place and Your Family Information
                                    </h3>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(3, 1fr)', 
                                        gap: '1.5rem'
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

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            background: '#f8fafc'
                        }}>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '2px solid #e2e8f0',
                                    background: 'white',
                                    color: '#64748b',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '0.75rem 2rem',
                                    border: 'none',
                                    background: '#10b981',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                }}
                            >
                                Save & Continue
                            </button>
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
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.9rem' }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
            type="text"
            value={value || '-'}
            readOnly
            style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: '#f8fafc',
                color: '#1e293b',
                fontSize: '0.95rem'
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
