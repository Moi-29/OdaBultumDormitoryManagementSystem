import { useState, useEffect } from 'react';
import { ClipboardList, Eye, Lock, Unlock, X, User, GraduationCap, Home, Users } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            // For now, using mock data. Replace with actual API call later
            const mockData = [
                {
                    _id: '1',
                    studentName: 'Abebech Kebede',
                    schoolName: 'Addis Ababa University',
                    submittedOn: '2024-05-10',
                    status: 'Approved',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Abebech Kebede',
                        idNo: 'STU001',
                        sex: 'F',
                        college: 'Natural Sciences',
                        department: 'Biology',
                        phone: '+251911234567'
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
                        fullName: 'Addis Ketema',
                        idNo: 'STU002',
                        sex: 'M',
                        college: 'Engineering',
                        department: 'Computer Science',
                        phone: '+251922345678'
                    }
                },
                {
                    _id: '3',
                    studentName: 'Debre Berhan',
                    schoolName: 'Pri. School',
                    submittedOn: '2024-05-09',
                    status: 'Pending',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Debre Berhan',
                        idNo: 'STU003',
                        sex: 'M',
                        college: 'Social Sciences',
                        department: 'Economics',
                        phone: '+251933456789'
                    }
                },
                {
                    _id: '4',
                    studentName: 'Bamlku Tadesse',
                    schoolName: 'High School',
                    submittedOn: '2024-05-10',
                    status: 'Rejected',
                    canEdit: false,
                    personalInfo: {
                        fullName: 'Bamlku Tadesse',
                        idNo: 'STU004',
                        sex: 'M',
                        college: 'Health Sciences',
                        department: 'Nursing',
                        phone: '+251944567890'
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
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                    <ClipboardList size={32} /> Applications
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Manage student dormitory applications
                </p>
            </div>

            {/* Applications Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>
                                    <input type="checkbox" style={{ cursor: 'pointer' }} />
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
                                <tr key={app._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <input type="checkbox" style={{ cursor: 'pointer' }} />
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

                        {/* Modal Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            {/* Status Badge */}
                            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    background: `${getStatusColor(selectedApplication.status)}20`,
                                    color: getStatusColor(selectedApplication.status)
                                }}>
                                    {selectedApplication.status}
                                </span>
                                <span style={{ color: '#64748b' }}>
                                    Submitted: {selectedApplication.submittedOn}
                                </span>
                            </div>

                            {/* Personal Information */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    color: '#1e293b'
                                }}>
                                    <User size={20} /> Personal Information
                                </h3>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                    gap: '1rem',
                                    background: '#f8fafc',
                                    padding: '1.5rem',
                                    borderRadius: '8px'
                                }}>
                                    <InfoField label="Full Name" value={selectedApplication.personalInfo.fullName} />
                                    <InfoField label="ID Number" value={selectedApplication.personalInfo.idNo} />
                                    <InfoField label="Sex" value={selectedApplication.personalInfo.sex} />
                                    <InfoField label="College" value={selectedApplication.personalInfo.college} />
                                    <InfoField label="Department" value={selectedApplication.personalInfo.department} />
                                    <InfoField label="Phone" value={selectedApplication.personalInfo.phone} />
                                </div>
                            </div>

                            {/* Placeholder for other sections */}
                            <div style={{ 
                                padding: '2rem',
                                background: '#f1f5f9',
                                borderRadius: '8px',
                                textAlign: 'center',
                                color: '#64748b'
                            }}>
                                <p>Additional sections (Educational, School, Family) will be displayed here</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem'
                        }}>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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
