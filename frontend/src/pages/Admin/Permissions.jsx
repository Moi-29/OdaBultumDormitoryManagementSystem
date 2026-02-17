import { useState, useEffect } from 'react';
import { FileCheck, Download, CheckCircle, X, Clock, Filter, Calendar, Search, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchPermissions();
    }, []);

    useEffect(() => {
        filterPermissions();
    }, [permissions, statusFilter, searchTerm]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            showNotification('Failed to fetch permissions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterPermissions = () => {
        let filtered = permissions;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPermissions(filtered);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleUpdateStatus = async (id, status, adminNotes = '') => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_URL}/api/permissions/${id}/status`,
                { status, adminNotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showNotification(`Permission ${status} successfully`, 'success');
            fetchPermissions();
            setShowModal(false);
            setSelectedPermission(null);
        } catch (error) {
            console.error('Error updating permission:', error);
            showNotification('Failed to update permission', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDownloadPDF = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/permissions/${id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `permission-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showNotification('PDF downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            showNotification('Failed to download PDF', 'error');
        }
    };

    const handleDownloadAllPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const response = await axios.get(`${API_URL}/api/permissions/export/all-pdf?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'all-permissions.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            showNotification('All permissions PDF downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading all PDFs:', error);
            showNotification('Failed to download all permissions PDF', 'error');
        }
    };

    const handleDeleteClick = (permission) => {
        setPermissionToDelete(permission);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!permissionToDelete) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/permissions/${permissionToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Permission deleted successfully', 'success');
            fetchPermissions();
            setShowDeleteConfirm(false);
            setPermissionToDelete(null);
        } catch (error) {
            console.error('Error deleting permission:', error);
            showNotification('Failed to delete permission', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setPermissionToDelete(null);
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

    const stats = {
        total: permissions.length,
        pending: permissions.filter(p => p.status === 'pending').length,
        approved: permissions.filter(p => p.status === 'approved').length,
        rejected: permissions.filter(p => p.status === 'rejected').length
    };

    return (
        <div style={{ padding: '2rem' }}>
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
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
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
                            cursor: 'pointer'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && selectedPermission && (
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
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
                            Permission Details
                        </h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Full Name:</strong> {selectedPermission.fullName}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Student ID:</strong> {selectedPermission.studentId}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Department:</strong> {selectedPermission.department}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Year:</strong> {selectedPermission.year}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Sex:</strong> {selectedPermission.sex}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Date:</strong> {new Date(selectedPermission.date).toLocaleDateString()}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Status:</strong>{' '}
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '6px',
                                    backgroundColor: getStatusColor(selectedPermission.status),
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}>
                                    {selectedPermission.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {selectedPermission.status === 'pending' && (
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                }}>
                                    Admin Notes (Optional)
                                </label>
                                <textarea
                                    id="adminNotes"
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '1rem',
                                        marginBottom: '1rem'
                                    }}
                                    placeholder="Add any notes or comments..."
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedPermission(null);
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteClick(selectedPermission);
                                    setShowModal(false);
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                            <button
                                onClick={() => handleDownloadPDF(selectedPermission._id)}
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
                                    gap: '0.5rem'
                                }}
                            >
                                <Download size={18} />
                                Download PDF
                            </button>
                            {selectedPermission.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            const notes = document.getElementById('adminNotes').value;
                                            handleUpdateStatus(selectedPermission._id, 'rejected', notes);
                                        }}
                                        disabled={actionLoading}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: 'white',
                                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                                            fontWeight: 600,
                                            opacity: actionLoading ? 0.6 : 1
                                        }}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => {
                                            const notes = document.getElementById('adminNotes').value;
                                            handleUpdateStatus(selectedPermission._id, 'approved', notes);
                                        }}
                                        disabled={actionLoading}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            cursor: actionLoading ? 'not-allowed' : 'pointer',
                                            fontWeight: 600,
                                            opacity: actionLoading ? 0.6 : 1
                                        }}
                                    >
                                        Approve
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && permissionToDelete && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        animation: 'slideInRight 0.3s ease-out'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Trash2 size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                                Delete Permission Request
                            </h2>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: '#fef2f2',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid #fecaca'
                        }}>
                            <p style={{ margin: 0, color: '#991b1b', fontWeight: 600 }}>
                                Are you sure you want to delete this permission request?
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#7f1d1d', fontSize: '0.875rem' }}>
                                Student: {permissionToDelete.fullName} ({permissionToDelete.studentId})
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#7f1d1d', fontSize: '0.875rem' }}>
                                This action cannot be undone.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleDeleteCancel}
                                disabled={actionLoading}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    opacity: actionLoading ? 0.6 : 1
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={actionLoading}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    opacity: actionLoading ? 0.6 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Trash2 size={18} />
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <FileCheck size={32} />
                            Permission Requests
                        </h1>
                        <p style={{ color: '#6b7280' }}>
                            Manage student permission requests for religious purposes
                        </p>
                    </div>
                    <button
                        onClick={handleDownloadAllPDF}
                        style={{
                            padding: '0.875rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Download size={20} />
                        Download All PDF
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Total Requests
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                            {stats.total}
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderLeft: '4px solid #f59e0b'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Pending
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
                            {stats.pending}
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderLeft: '4px solid #10b981'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Approved
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
                            {stats.approved}
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderLeft: '4px solid #ef4444'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Rejected
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
                            {stats.rejected}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <Filter size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Status Filter
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <Search size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, ID, or department..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions List */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                            Loading permissions...
                        </div>
                    ) : filteredPermissions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                            No permissions found
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Student</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Department</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Year</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPermissions.map((permission) => (
                                        <tr
                                            key={permission._id}
                                            style={{ borderBottom: '1px solid #e5e7eb' }}
                                        >
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 600 }}>{permission.fullName}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {permission.studentId}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{permission.department}</td>
                                            <td style={{ padding: '1rem' }}>{permission.year}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {new Date(permission.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.375rem 0.75rem',
                                                    borderRadius: '6px',
                                                    backgroundColor: getStatusColor(permission.status),
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {getStatusIcon(permission.status)}
                                                    {permission.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPermission(permission);
                                                            setShowModal(true);
                                                        }}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadPDF(permission._id)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d1d5db',
                                                            backgroundColor: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <Download size={16} />
                                                        PDF
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(permission)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '6px',
                                                            border: 'none',
                                                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

export default Permissions;
