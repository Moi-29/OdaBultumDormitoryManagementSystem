import { useState, useEffect } from 'react';
import { Building, Plus, Bed, Users, Edit2, Trash2, X, Search, UserMinus, UserPlus, Save } from 'lucide-react';
import axios from 'axios';

const Dorms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        building: '', roomNumber: '', floor: '', type: 'Standard', capacity: 4, gender: 'M', status: 'Available'
    });

    // Student Assign State
    const [studentSearch, setStudentSearch] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/dorms');
            setRooms(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setLoading(false);
        }
    };

    const handleOpenForm = (room = null) => {
        if (room) {
            setFormData({
                building: room.building,
                roomNumber: room.roomNumber,
                floor: room.floor,
                type: room.type,
                capacity: room.capacity,
                gender: room.gender,
                status: room.status
            });
            setSelectedRoom(room);
        } else {
            setFormData({ building: '', roomNumber: '', floor: '', type: 'Standard', capacity: 4, gender: 'M', status: 'Available' });
            setSelectedRoom(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedRoom(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedRoom) {
                await axios.put(`http://localhost:5000/api/dorms/${selectedRoom._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/dorms', formData);
            }
            fetchRooms();
            handleCloseForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`http://localhost:5000/api/dorms/${id}`);
                fetchRooms();
                if (selectedRoom?._id === id) setIsDetailsOpen(false);
            } catch (error) {
                alert('Failed to delete room');
            }
        }
    };

    const handleAssignStudent = async (e) => {
        e.preventDefault();
        if (!studentSearch) return;

        setAssignLoading(true);
        try {
            // First lookup student by ID to get MongoID (simple implementation logic)
            // Ideally we'd have a dropdown, but direct ID lookup is robust for admins
            const lookupRes = await axios.post('http://localhost:5000/api/students/lookup', { studentId: studentSearch });
            const student = lookupRes.data;

            await axios.post(`http://localhost:5000/api/dorms/${selectedRoom._id}/assign`, { studentId: student._id });

            // Refresh room data
            const roomRes = await axios.get(`http://localhost:5000/api/dorms/${selectedRoom._id}`);
            setSelectedRoom(roomRes.data); // Update modal data
            fetchRooms(); // Update grid
            setStudentSearch('');
            alert(`Assigned ${student.fullName}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign student');
        } finally {
            setAssignLoading(false);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (!window.confirm('Remove this student from the room?')) return;
        try {
            await axios.post(`http://localhost:5000/api/dorms/${selectedRoom._id}/remove`, { studentId });

            // Refresh room data
            const roomRes = await axios.get(`http://localhost:5000/api/dorms/${selectedRoom._id}`);
            setSelectedRoom(roomRes.data);
            fetchRooms();
        } catch (error) {
            alert('Failed to remove student');
        }
    };

    const filteredRooms = rooms.filter(room => {
        if (filter === 'available') return room.status === 'Available';
        if (filter === 'full') return room.status === 'Full';
        return true;
    });

    const stats = {
        total: rooms.length,
        available: rooms.filter(r => r.status === 'Available').length,
        full: rooms.filter(r => r.status === 'Full').length,
        occupancy: rooms.length > 0 ? Math.round((rooms.reduce((sum, r) => sum + r.occupants.length, 0) / rooms.reduce((sum, r) => sum + r.capacity, 0)) * 100) : 0
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ position: 'relative' }}>
            {/* Header */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building /> Dormitory Management
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage rooms, capacities, and occupants</p>
                </div>
                <button onClick={() => handleOpenForm()} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Plus size={18} /> Add Room
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <StatsCard label="Total Rooms" value={stats.total} />
                <StatsCard label="Available" value={stats.available} color="var(--color-success)" />
                <StatsCard label="Full" value={stats.full} color="var(--color-danger)" />
                <StatsCard label="Occupancy Rate" value={`${stats.occupancy}%`} color="var(--color-primary)" />
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', gap: '0.5rem' }}>
                {['all', 'available', 'full'].map(f => (
                    <button
                        key={f}
                        className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(f)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Rooms Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-md)' }}>
                {filteredRooms.map((room) => (
                    <div key={room._id} className="card" style={{ position: 'relative', borderLeft: `4px solid ${room.gender === 'M' ? '#3b82f6' : '#ec4899'}` }}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ margin: 0 }}>{room.building} - {room.roomNumber}</h3>
                            <Badge status={room.status} />
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            Floor {room.floor} • {room.type} • <b style={{ color: room.gender === 'M' ? '#2563eb' : '#db2777' }}>{room.gender === 'M' ? 'Male' : 'Female'}</b>
                        </p>

                        <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
                            <div className="flex justify-between items-center" style={{ fontSize: '0.85rem' }}>
                                <span className="flex items-center gap-2"><Users size={14} /> Occupants</span>
                                <b>{room.occupants.length} / {room.capacity}</b>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(room.occupants.length / room.capacity) * 100}%`,
                                    height: '100%',
                                    background: room.status === 'Full' ? 'var(--color-danger)' : 'var(--color-success)'
                                }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => { setSelectedRoom(room); setIsDetailsOpen(true); }} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>
                                Manage Occupants
                            </button>
                            <button onClick={() => handleOpenForm(room)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteRoom(room._id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="flex justify-between items-center mb-4">
                            <h2>{selectedRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={handleCloseForm} className="btn-icon"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="Building" value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })} required />
                                <Input label="Room Number" value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} required />
                                <Input label="Floor" value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })} type="number" required />
                                <Input label="Capacity" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} type="number" required />
                                <div>
                                    <label className="label">Gender</label>
                                    <select className="input-field" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="Co-ed">Co-ed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Type</label>
                                    <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-4 w-full">
                                <Save size={18} style={{ marginRight: '8px' }} /> Save Room
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Details/Manage Modal */}
            {isDetailsOpen && selectedRoom && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2>Room {selectedRoom.roomNumber}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{selectedRoom.building} • {selectedRoom.occupants.length}/{selectedRoom.capacity} Occupied</p>
                            </div>
                            <button onClick={() => setIsDetailsOpen(false)} className="btn-icon"><X size={24} /></button>
                        </div>

                        {/* Assign Form */}
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserPlus size={16} /> Assign Student</h4>
                            <form onSubmit={handleAssignStudent} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Student ID (e.g. OBU/001/2023)"
                                    className="input-field"
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn btn-primary" disabled={assignLoading}>
                                    {assignLoading ? '...' : 'Assign'}
                                </button>
                            </form>
                        </div>

                        {/* Occupants List */}
                        <h4>Current Occupants</h4>
                        {selectedRoom.occupants && selectedRoom.occupants.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {selectedRoom.occupants.map(student => (
                                    <div key={student._id} className="flex justify-between items-center p-2 border rounded" style={{ background: 'white' }}>
                                        <div>
                                            <strong>{student.fullName}</strong>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{student.studentId} • {student.department}</div>
                                        </div>
                                        <button onClick={() => handleRemoveStudent(student._id)} className="btn btn-secondary" style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>
                                            <UserMinus size={16} /> Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No students assigned yet.</p>
                        )}

                        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                            Room ID: {selectedRoom._id}
                        </div>
                    </div>
                </div>
            )}

            {/* Inline Styles for Modals (should be in CSS but putting here for self-containment request) */}
            <style>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-content {
                    background: white; padding: 2rem; borderRadius: 12px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                }
                .btn-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 4px; }
                .btn-icon:hover { background: #f1f5f9; color: var(--text-main); }
                .label { display: block; font-size: 0.9rem; margin-bottom: 0.25rem; font-weight: 500; }
                .w-full { width: 100%; }
            `}</style>
        </div>
    );
};

// Helper Components
const StatsCard = ({ label, value, color }) => (
    <div className="card">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</p>
        <h2 style={{ margin: '0.5rem 0', color: color || 'inherit' }}>{value}</h2>
    </div>
);

const Badge = ({ status }) => (
    <span style={{
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: status === 'Available' ? '#dcfce7' : '#fee2e2',
        color: status === 'Available' ? '#166534' : '#991b1b',
        border: `1px solid ${status === 'Available' ? '#bbf7d0' : '#fecaca'}`
    }}>
        {status}
    </span>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="label">{label}</label>
        <input className="input-field" {...props} />
    </div>
);

export default Dorms;
