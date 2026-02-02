import { useState, useEffect } from 'react';
import { Building, Plus, Bed, Users } from 'lucide-react';
import axios from 'axios';

const Dorms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, available, full

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
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building /> Dormitories
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage rooms and allocations</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Plus size={18} /> Add Room
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Rooms</p>
                    <h2 style={{ margin: '0.5rem 0' }}>{stats.total}</h2>
                </div>
                <div className="card">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available</p>
                    <h2 style={{ margin: '0.5rem 0', color: 'var(--color-success)' }}>{stats.available}</h2>
                </div>
                <div className="card">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full</p>
                    <h2 style={{ margin: '0.5rem 0', color: 'var(--color-danger)' }}>{stats.full}</h2>
                </div>
                <div className="card">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Occupancy Rate</p>
                    <h2 style={{ margin: '0.5rem 0', color: 'var(--color-primary)' }}>{stats.occupancy}%</h2>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn ${filter === 'available' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('available')}
                    >
                        Available
                    </button>
                    <button
                        className={`btn ${filter === 'full' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('full')}
                    >
                        Full
                    </button>
                </div>
            </div>

            {/* Rooms Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                {filteredRooms.map((room) => (
                    <div key={room._id} className="card">
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ margin: 0 }}>{room.building} - {room.roomNumber}</h3>
                            <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                backgroundColor: room.status === 'Available' ? 'var(--color-success)' : 'var(--color-danger)',
                                color: 'white'
                            }}>
                                {room.status}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Floor {room.floor} • {room.type} • {room.gender}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={16} />
                                <span>{room.occupants.length}/{room.capacity}</span>
                            </div>
                            <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}>
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRooms.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No rooms found
                </div>
            )}
        </div>
    );
};

export default Dorms;
