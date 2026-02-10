import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { Users, UserPlus, Edit2, Trash2, X, Save, Building2, Wrench } from 'lucide-react';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('proctors');
    const [proctors, setProctors] = useState([]);
    const [maintainers, setMaintainers] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        blockId: '',
        specialization: 'general',
        status: 'active'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [blocksRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/api/user-management/blocks`, config),
                axios.get(`${API_URL}/api/user-management/${activeTab}`, config)
            ]);

            if (blocksRes.data.success) setBlocks(blocksRes.data.blocks);
            
            if (usersRes.data.success) {
                if (activeTab === 'proctors') {
                    setProctors(usersRes.data.proctors);
                } else {
                    setMaintainers(usersRes.data.maintainers);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                username: user.username,
                password: '',
                phone: user.phone || '',
                email: user.email || '',
                blockId: user.blockId || '',
                specialization: user.specialization || 'general',
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({
                fullName: '',
                username: '',
                password: '',
                phone: '',
                email: '',
                blockId: '',
                specialization: 'general',
                status: 'active'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            fullName: '',
            username: '',
            password: '',
            phone: '',
            email: '',
            blockId: '',
            specialization: 'general',
            status: 'active'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.username) {
            showNotification('Full name and username are required', 'error');
            return;
        }

        if (!editingUser && !formData.password) {
            showNotification('Password is required for new users', 'error');
            return;
        }

        if (activeTab === 'proctors' && !formData.blockId) {
            showNotification('Block assignment is required for proctors', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = { ...formData };
            if (editingUser && !payload.password) {
                delete payload.password;
            }

            let response;
            if (editingUser) {
                response = await axios.put(
                    `${API_URL}/api/user-management/${activeTab}/${editingUser._id}`,
                    payload,
                    config
                );
            } else {
                response = await axios.post(
                    `${API_URL}/api/user-management/${activeTab}`,
                    payload,
                    config
                );
            }

            if (response.data.success) {
                showNotification(
                    editingUser ? 'User updated successfully' : 'User created successfully',
                    'success'
                );
                handleCloseModal();
                fetchData();
            }
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Operation failed',
                'error'
            );
        }
    };

    const handleDelete = async (userId) => {
        setConfirmDialog({
            title: 'Dismiss User',
            message: 'Are you sure you want to dismiss this user? This action will deactivate their account.',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };

                    const response = await axios.delete(
                        `${API_URL}/api/user-management/${activeTab}/${userId}`,
                        config
                    );

                    if (response.data.success) {
                        showNotification('User dismissed successfully', 'success');
                        fetchData();
                    }
                } catch (error) {
                    showNotification(
                        error.response?.data?.message || 'Failed to dismiss user',
                        'error'
                    );
                }
                setConfirmDialog(null);
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(
                `${API_URL}/api/user-management/${activeTab}/${userId}`,
                { status: newStatus },
                config
            );

            if (response.data.success) {
                showNotification('Status updated successfully', 'success');
                fetchData();
            }
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Failed to update status',
                'error'
            );
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return { bg: '#dcfce7', text: '#166534' };
            case 'inactive': return { bg: '#fef3c7', text: '#92400e' };
            case 'dismissed': return { bg: '#fee2e2', text: '#991b1b' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '60px', height: '60px', border: '4px solid #e2e8f0',
                        borderTopColor: '#3b82f6', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    const currentUsers = activeTab === 'proctors' ? proctors : maintainers;

    return (
        <div style={{ padding: '2rem' }}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {confirmDialog && (
                <ConfirmDialog
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />
            )}

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                        User Management
                    </h1>
                    <button onClick={() => handleOpenModal()} style={{
                        padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                    }}>
                        <UserPlus size={18} />
                        Add {activeTab === 'proctors' ? 'Proctor' : 'Maintainer'}
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e5e7eb' }}>
                    <button onClick={() => setActiveTab('proctors')} style={{
                        padding: '1rem 2rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'proctors' ? '3px solid #3b82f6' : '3px solid transparent',
                        color: activeTab === 'proctors' ? '#3b82f6' : '#64748b',
                        cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
                    }}>
                        <Building2 size={20} />
                        Proctors ({proctors.length})
                    </button>
                    <button onClick={() => setActiveTab('maintainers')} style={{
                        padding: '1rem 2rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'maintainers' ? '3px solid #f97316' : '3px solid transparent',
                        color: activeTab === 'maintainers' ? '#f97316' : '#64748b',
                        cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px'
                    }}>
                        <Wrench size={20} />
                        Maintainers ({maintainers.length})
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {currentUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Users size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>
                            No {activeTab} yet
                        </p>
                        <p style={{ color: '#94a3b8' }}>
                            Click "Add {activeTab === 'proctors' ? 'Proctor' : 'Maintainer'}" to create one
                        </p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Username</th>
                                {activeTab === 'proctors' && (
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Block</th>
                                )}
                                {activeTab === 'maintainers' && (
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Specialization</th>
                                )}
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Contact</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => {
                                const statusColors = getStatusColor(user.status);
                                return (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.fullName}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>@{user.username}</td>
                                        {activeTab === 'proctors' && (
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.375rem 0.75rem', borderRadius: '8px',
                                                    background: '#dbeafe', color: '#1e40af',
                                                    fontSize: '0.875rem', fontWeight: 600
                                                }}>
                                                    {user.blockId}
                                                </span>
                                            </td>
                                        )}
                                        {activeTab === 'maintainers' && (
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.375rem 0.75rem', borderRadius: '8px',
                                                    background: '#fed7aa', color: '#9a3412',
                                                    fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize'
                                                }}>
                                                    {user.specialization}
                                                </span>
                                            </td>
                                        )}
                                        <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                            {user.phone && <div>{user.phone}</div>}
                                            {user.email && <div>{user.email}</div>}
                                            {!user.phone && !user.email && <span style={{ opacity: 0.5 }}>N/A</span>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={user.status}
                                                onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                                style={{
                                                    padding: '0.375rem 0.75rem', borderRadius: '8px',
                                                    background: statusColors.bg, color: statusColors.text,
                                                    border: 'none', fontSize: '0.75rem', fontWeight: 600,
                                                    textTransform: 'uppercase', cursor: 'pointer'
                                                }}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="dismissed">Dismissed</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button onClick={() => handleOpenModal(user)} style={{
                                                    padding: '0.5rem', background: '#dbeafe', color: '#1e40af',
                                                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} style={{
                                                    padding: '0.5rem', background: '#fee2e2', color: '#991b1b',
                                                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', maxWidth: '600px',
                        width: '100%', maxHeight: '90vh', overflow: 'auto', margin: '1rem'
                    }}>
                        <div style={{
                            padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                {editingUser ? 'Edit' : 'Add'} {activeTab === 'proctors' ? 'Proctor' : 'Maintainer'}
                            </h2>
                            <button onClick={handleCloseModal} style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'
                            }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter full name"
                                    required
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Username <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Password {!editingUser && <span style={{ color: '#ef4444' }}>*</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                                    required={!editingUser}
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                                {editingUser && (
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                        Leave blank to keep current password
                                    </p>
                                )}
                            </div>

                            {activeTab === 'proctors' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Assigned Block <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <select
                                        value={formData.blockId}
                                        onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                                        required
                                        style={{
                                            width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                            borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Select a block</option>
                                        {blocks.map(block => (
                                            <option key={block._id} value={block.name}>
                                                {block.name} - {block.description} ({block.gender})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {activeTab === 'maintainers' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Specialization
                                    </label>
                                    <select
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                            borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
                                        }}
                                    >
                                        <option value="general">General</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="carpentry">Carpentry</option>
                                        <option value="hvac">HVAC</option>
                                        <option value="painting">Painting</option>
                                        <option value="cleaning">Cleaning</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email address"
                                    style={{
                                        width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb',
                                        borderRadius: '8px', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{
                                padding: '1.5rem 0 0 0', borderTop: '1px solid #e5e7eb',
                                display: 'flex', gap: '1rem', justifyContent: 'flex-end'
                            }}>
                                <button type="button" onClick={handleCloseModal} style={{
                                    padding: '0.75rem 1.5rem', background: 'white', color: '#64748b',
                                    border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white', border: 'none', borderRadius: '8px',
                                    cursor: 'pointer', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    <Save size={18} />
                                    {editingUser ? 'Update' : 'Create'} {activeTab === 'proctors' ? 'Proctor' : 'Maintainer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default UserManagement;
