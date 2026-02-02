import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const Inventory = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/assets');
            setAssets(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setLoading(false);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'New': return 'var(--color-success)';
            case 'Good': return 'var(--color-primary)';
            case 'Fair': return 'var(--color-warning)';
            case 'Poor': return 'var(--color-warning)';
            case 'Broken': return 'var(--color-danger)';
            default: return 'var(--text-muted)';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package /> Inventory
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage furniture and dorm assets</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Plus size={18} /> Add Asset
                </button>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Name</th>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Category</th>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Condition</th>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Quantity</th>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Room</th>
                            <th style={{ padding: 'var(--spacing-sm)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map((asset) => (
                            <tr key={asset._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: 'var(--spacing-sm)' }}>{asset.name}</td>
                                <td style={{ padding: 'var(--spacing-sm)' }}>{asset.category}</td>
                                <td style={{ padding: 'var(--spacing-sm)' }}>
                                    <span style={{
                                        color: getConditionColor(asset.condition),
                                        fontWeight: 500
                                    }}>
                                        {asset.condition}
                                    </span>
                                </td>
                                <td style={{ padding: 'var(--spacing-sm)' }}>{asset.quantity}</td>
                                <td style={{ padding: 'var(--spacing-sm)' }}>
                                    {asset.assignedToRoom ?
                                        `${asset.assignedToRoom.building}-${asset.assignedToRoom.roomNumber}` :
                                        '-'
                                    }
                                </td>
                                <td style={{ padding: 'var(--spacing-sm)', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-danger)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAssets.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No assets found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
