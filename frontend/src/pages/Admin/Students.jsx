import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Edit, Trash2, ExternalLink, CheckSquare, XSquare, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import BulkImportAllocation from '../../components/BulkImportAllocation';
import { Link } from 'react-router-dom';
import API_URL from '../../config/api';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [deleting, setDeleting] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });
    
    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState({ show: false, step: 1 });

    useEffect(() => {
        fetchStudents();
    }, []);
    
    // Toast notification helper
    const showToast = (type, title, message) => {
        setToast({ show: true, type, title, message });
        setTimeout(() => setToast({ show: false, type: '', title: '', message: '' }), 5000);
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/students`);
            
            // Sort students: First by department, then alphabetically by name within each department
            const sortedStudents = data.sort((a, b) => {
                // First, sort by department
                if (a.department !== b.department) {
                    return a.department.localeCompare(b.department);
                }
                // Then, sort alphabetically by full name within the same department
                return a.fullName.localeCompare(b.fullName);
            });
            
            setStudents(sortedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        console.log('Select All clicked');
        if (selectedStudents.length === filteredStudents.length) {
            console.log('Deselecting all students');
            setSelectedStudents([]);
        } else {
            console.log(`Selecting all ${filteredStudents.length} students`);
            setSelectedStudents(filteredStudents.map(s => s._id));
        }
    };

    const handleClearAll = () => {
        console.log('Clear All clicked');
        console.log(`Total students to delete: ${students.length}`);
        setConfirmModal({ show: true, step: 1 });
    };
    
    const confirmClearAll = async () => {
        console.log('All confirmations passed, proceeding with deletion...');
        setConfirmModal({ show: false, step: 1 });
        setDeleting(true);
        
        try {
            console.log('Sending DELETE request to /api/students/bulk/all');
            const { data } = await axios.delete(`${API_URL}/api/students/bulk/all`);
            console.log('Delete response:', data);
            
            showToast('success', 'Students Deleted', `Successfully deleted ${students.length} students`);
            setStudents([]);
            setSelectedStudents([]);
            await fetchStudents();
        } catch (error) {
            console.error('Error deleting all students:', error);
            showToast('error', 'Deletion Failed', error.response?.data?.message || error.message);
        } finally {
            setDeleting(false);
        }
    };

    const filteredStudents = students
        .filter(student =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Maintain sorting: First by department, then alphabetically by name
            if (a.department !== b.department) {
                return a.department.localeCompare(b.department);
            }
            return a.fullName.localeCompare(b.fullName);
        });

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ position: 'relative' }}>
            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    minWidth: '350px',
                    maxWidth: '500px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    animation: 'slideInRight 0.3s ease-out',
                    border: `3px solid ${
                        toast.type === 'success' ? '#4caf50' : 
                        toast.type === 'error' ? '#ef4444' : 
                        '#3b82f6'
                    }`
                }}>
                    {toast.type === 'success' && <CheckCircle size={24} color="#4caf50" />}
                    {toast.type === 'error' && <AlertCircle size={24} color="#ef4444" />}
                    {toast.type === 'info' && <AlertCircle size={24} color="#3b82f6" />}
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.1rem', 
                            marginBottom: '0.25rem',
                            color: toast.type === 'success' ? '#2e7d32' : 
                                   toast.type === 'error' ? '#dc2626' : '#1e40af'
                        }}>
                            {toast.title}
                        </div>
                        <div style={{ 
                            fontSize: '0.95rem', 
                            color: '#4b5563',
                            whiteSpace: 'pre-line'
                        }}>
                            {toast.message}
                        </div>
                    </div>
                    <button
                        onClick={() => setToast({ show: false, type: '', title: '', message: '' })}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            padding: 0,
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
            
            {/* Confirmation Modal */}
            {confirmModal.show && (
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
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                            ⚠️
                        </div>
                        <h2 style={{ textAlign: 'center', color: '#dc2626', marginBottom: '1rem' }}>
                            {confirmModal.step === 1 ? 'Warning!' : 'Final Confirmation'}
                        </h2>
                        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem', color: '#4b5563' }}>
                            {confirmModal.step === 1 
                                ? `This will permanently delete ALL ${students.length} students from the database. This action CANNOT be undone!`
                                : `You are about to delete ${students.length} students. Are you absolutely sure?`
                            }
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setConfirmModal({ show: false, step: 1 })}
                                className="btn btn-secondary"
                                style={{ minWidth: '120px' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.step === 1) {
                                        setConfirmModal({ show: true, step: 2 });
                                    } else {
                                        confirmClearAll();
                                    }
                                }}
                                className="btn"
                                style={{ 
                                    minWidth: '120px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                {confirmModal.step === 1 ? 'Continue' : 'Delete All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users /> Students
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage student records</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <UserPlus size={18} /> Add Student
                </button>
            </div>

            {/* Import & Allocation Section */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <BulkImportAllocation onImportComplete={fetchStudents} onAllocationComplete={fetchStudents} />
            </div>

            {/* Bulk Actions */}
            {students.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--spacing-lg)', padding: '1.5rem', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <strong style={{ fontSize: '1.1rem' }}>Bulk Actions</strong>
                            <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                📊 Total: <strong>{students.length}</strong> students
                                {selectedStudents.length > 0 && (
                                    <span style={{ marginLeft: '1rem', color: '#3b82f6' }}>
                                        ✓ Selected: <strong>{selectedStudents.length}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handleSelectAll}
                                type="button"
                                className="btn btn-secondary"
                                style={{ 
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    position: 'relative',
                                    zIndex: 10
                                }}
                            >
                                <CheckSquare size={18} />
                                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <button
                                onClick={handleClearAll}
                                type="button"
                                disabled={deleting}
                                className="btn"
                                style={{ 
                                    gap: '0.5rem',
                                    backgroundColor: deleting ? '#9ca3af' : '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    pointerEvents: 'auto',
                                    position: 'relative',
                                    zIndex: 10,
                                    fontWeight: '600'
                                }}
                                onMouseEnter={(e) => !deleting && (e.currentTarget.style.backgroundColor = '#dc2626')}
                                onMouseLeave={(e) => !deleting && (e.currentTarget.style.backgroundColor = '#ef4444')}
                            >
                                <XSquare size={18} />
                                {deleting ? 'Deleting All...' : 'Clear All Students'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Student ID</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Full Name</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Gender</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Department</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Year</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Room</th>
                                <th style={{ padding: 'var(--spacing-sm)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>{student.studentId}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>{student.fullName}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>{student.gender}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>{student.department}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>Year {student.year}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>
                                        {student.room ? `${student.room.building}-${student.room.roomNumber}` : 'Not Assigned'}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-sm)', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-danger)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                        {/* Preview Portal Button */}
                                        <Link
                                            to={`/student-portal?studentId=${student.studentId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ padding: '0.25rem 0.5rem', color: '#ca8a04', textDecoration: 'none' }}
                                            title="Preview Student Portal"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No students found
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    h1 {
                        font-size: 1.5rem !important;
                    }

                    .card {
                        padding: 1rem !important;
                    }

                    /* Make bulk actions stack on mobile */
                    div[style*="flexWrap: wrap"] {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }

                    /* Stack buttons vertically on mobile */
                    div[style*="display: flex"][style*="gap: 0.75rem"] button {
                        width: 100%;
                    }

                    /* Make table scrollable */
                    table {
                        font-size: 0.85rem !important;
                    }

                    table th,
                    table td {
                        padding: 0.5rem !important;
                        white-space: nowrap;
                    }
                }

                @media (max-width: 480px) {
                    h1 {
                        font-size: 1.25rem !important;
                    }

                    .card {
                        padding: 0.75rem !important;
                    }

                    table {
                        font-size: 0.75rem !important;
                    }

                    table th,
                    table td {
                        padding: 0.35rem !important;
                    }

                    button {
                        font-size: 0.85rem !important;
                    }
                }
            `}</style>
        </div>
        </div>
    );
};

export default Students;
