import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Building, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import API_URL from '../config/api';

const BulkImportAllocation = ({ onImportComplete, onAllocationComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [allocating, setAllocating] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [allocationResult, setAllocationResult] = useState(null);
    const [error, setError] = useState('');
    
    // Progress tracking states - Initialize as hidden, will restore from localStorage only if operation is active
    const [importProgress, setImportProgress] = useState({ show: false, message: '', current: 0, total: 0 });
    const [allocationProgress, setAllocationProgress] = useState({ show: false, message: '', current: 0, total: 0 });
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [criteria, setCriteria] = useState({ department: '', year: '', gender: '' });
    const [targetBuilding, setTargetBuilding] = useState('');
    const [targetBlock, setTargetBlock] = useState(''); // Add block state
    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [availableBlocks, setAvailableBlocks] = useState([]); // All blocks
    const [filteredBlocks, setFilteredBlocks] = useState([]); // Blocks for selected building
    const [availableDepartments, setAvailableDepartments] = useState([]);
    const [roomsData, setRoomsData] = useState([]); // Store all rooms for filtering
    
    // Poll student count during import
    useEffect(() => {
        let pollInterval;
        
        if (importing && importProgress.show) {
            pollInterval = setInterval(async () => {
                try {
                    const { data: students } = await axios.get(`${API_URL}/api/students`);
                    const currentCount = students.length;
                    
                    setImportProgress(prev => {
                        const newProgress = {
                            ...prev,
                            current: currentCount,
                            message: `Extracting students... ${currentCount} students in system`
                        };
                        localStorage.setItem('importProgress', JSON.stringify(newProgress));
                        return newProgress;
                    });
                } catch (err) {
                    console.error('Error polling student count:', err);
                }
            }, 1000); // Poll every second
        }
        
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [importing, importProgress.show]);
    
    // Poll allocated student count during allocation
    useEffect(() => {
        let pollInterval;
        
        if (allocating && allocationProgress.show) {
            pollInterval = setInterval(async () => {
                try {
                    const { data: students } = await axios.get(`${API_URL}/api/students`);
                    const allocatedStudents = students.filter(s => s.room);
                    const currentAllocated = allocatedStudents.length;
                    
                    // Count males and females
                    const males = allocatedStudents.filter(s => s.gender === 'M').length;
                    const females = allocatedStudents.filter(s => s.gender === 'F').length;
                    
                    setAllocationProgress(prev => {
                        const newProgress = {
                            ...prev,
                            current: currentAllocated,
                            message: `Allocating students... ${currentAllocated} allocated (👨 ${males} males, 👩 ${females} females)`
                        };
                        localStorage.setItem('allocationProgress', JSON.stringify(newProgress));
                        return newProgress;
                    });
                } catch (err) {
                    console.error('Error polling allocation count:', err);
                }
            }, 800); // Poll every 0.8 seconds for faster updates
        }
        
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [allocating, allocationProgress.show]);
    
    // Cleanup localStorage when operations complete
    useEffect(() => {
        if (!importing) {
            localStorage.removeItem('importingState');
            if (!importProgress.show) {
                localStorage.removeItem('importProgress');
            }
        } else {
            localStorage.setItem('importingState', 'true');
        }
    }, [importing, importProgress.show]);
    
    useEffect(() => {
        if (!allocating) {
            localStorage.removeItem('allocatingState');
            if (!allocationProgress.show) {
                localStorage.removeItem('allocationProgress');
            }
        } else {
            localStorage.setItem('allocatingState', 'true');
        }
    }, [allocating, allocationProgress.show]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // If component unmounts while not actively importing/allocating, clear everything
            if (!importing) {
                localStorage.removeItem('importingState');
                localStorage.removeItem('importProgress');
            }
            if (!allocating) {
                localStorage.removeItem('allocatingState');
                localStorage.removeItem('allocationProgress');
            }
        };
    }, [importing, allocating]);

    useEffect(() => {
        // Fetch buildings, blocks, and departments for dropdowns
        const fetchFilters = async () => {
            try {
                // Fetch buildings and blocks from rooms
                const { data: rooms } = await axios.get(`${API_URL}/api/dorms`);
                setRoomsData(rooms); // Store rooms data

                const buildings = [...new Set(rooms.map(r => r.building))].sort();
                setAvailableBuildings(buildings);

                const blocks = [...new Set(rooms.map(r => r.block).filter(Boolean))].sort();
                setAvailableBlocks(blocks);
                setFilteredBlocks(blocks); // Initialize filtered blocks with all blocks

                // Fetch departments from students
                const { data: students } = await axios.get(`${API_URL}/api/students`);
                const departments = [...new Set(students.map(s => s.department))].sort();
                setAvailableDepartments(departments);
            } catch (e) {
                console.error('Failed to fetch filter options:', e);
            }
        };
        
        // IMPORTANT: Clear all stale progress on mount
        const importingState = localStorage.getItem('importingState');
        const allocatingState = localStorage.getItem('allocatingState');
        
        console.log('Component mounted - checking localStorage:', { importingState, allocatingState });
        
        // Only restore if actively running
        if (importingState === 'true') {
            const saved = localStorage.getItem('importProgress');
            if (saved) {
                setImportProgress(JSON.parse(saved));
                setImporting(true);
                console.log('Restored import progress');
            }
        } else {
            // Clear everything related to import
            localStorage.removeItem('importingState');
            localStorage.removeItem('importProgress');
            setImportProgress({ show: false, message: '', current: 0, total: 0 });
            setImporting(false);
            console.log('Cleared import progress');
        }
        
        if (allocatingState === 'true') {
            const saved = localStorage.getItem('allocationProgress');
            if (saved) {
                setAllocationProgress(JSON.parse(saved));
                setAllocating(true);
                console.log('Restored allocation progress');
            }
        } else {
            // Clear everything related to allocation
            localStorage.removeItem('allocatingState');
            localStorage.removeItem('allocationProgress');
            setAllocationProgress({ show: false, message: '', current: 0, total: 0 });
            setAllocating(false);
            console.log('Cleared allocation progress');
        }
        
        fetchFilters();
    }, []);

    // Filter blocks when building changes
    useEffect(() => {
        if (targetBuilding) {
            const blocksInBuilding = roomsData
                .filter(r => r.building === targetBuilding && r.block)
                .map(r => r.block);
            const uniqueBlocks = [...new Set(blocksInBuilding)].sort();
            setFilteredBlocks(uniqueBlocks);

            // Reset block if it doesn't exist in the selected building
            if (targetBlock && !uniqueBlocks.includes(targetBlock)) {
                setTargetBlock('');
            }
        } else {
            setFilteredBlocks(availableBlocks);
        }
    }, [targetBuilding, roomsData, availableBlocks, targetBlock]);

    // Toast notification helper
    const showToast = (type, title, message) => {
        setToast({ show: true, type, title, message });
        setTimeout(() => setToast({ show: false, type: '', title: '', message: '' }), 5000);
    };

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
        setError('');
        setImportResult(null);
        const resetProgress = { show: false, message: '', current: 0, total: 0 };
        setImportProgress(resetProgress);
        localStorage.removeItem('importProgress');
    };

    const handleImport = async () => {
        if (!selectedFile) {
            showToast('error', 'No File Selected', 'Please select an Excel or CSV file first');
            return;
        }

        setImporting(true);
        localStorage.setItem('importingState', 'true');
        setError('');
        setImportResult(null);
        
        // Get initial student count
        let initialCount = 0;
        try {
            const { data: students } = await axios.get(`${API_URL}/api/students`);
            initialCount = students.length;
        } catch (err) {
            console.error('Error getting initial count:', err);
        }
        
        // Show progress with initial count
        const initialProgress = { 
            show: true, 
            message: `Starting import... ${initialCount} students currently in system`, 
            current: initialCount, 
            total: 0 // Will be updated from backend response
        };
        setImportProgress(initialProgress);
        localStorage.setItem('importProgress', JSON.stringify(initialProgress));

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log('📤 Uploading file:', selectedFile.name);
            
            const { data } = await axios.post(`${API_URL}/api/students/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Import response:', data);
            
            // IMPORTANT: Stop importing state first to stop polling
            setImporting(false);
            localStorage.removeItem('importingState');
            
            setImportResult(data);
            setSelectedFile(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            // Get final count
            let finalCount = initialCount + data.imported;
            try {
                const { data: students } = await axios.get(/api/students);
                finalCount = students.length;
            } catch (err) {
                console.error('Error getting final count:', err);
            }

            // Show completion message briefly
            const completeProgress = { 
                show: true, 
                message: `✅ Import completed! ${data.imported} students imported successfully`, 
                current: finalCount, 
                total: finalCount 
            };
            setImportProgress(completeProgress);
            localStorage.setItem('importProgress', JSON.stringify(completeProgress));
            
            // Build success message
            let toastMessage = `Successfully imported ${data.imported} students`;
            if (data.errors > 0) {
                toastMessage += `\n⚠️ ${data.errors} rows had errors`;
            }
            
            // Show success toast immediately
            showToast('success', 'Import Successful!', toastMessage);
            
            // Hide progress after 2 seconds
            setTimeout(() => {
                setImportProgress({ show: false, message: '', current: 0, total: 0 });
                localStorage.removeItem('importProgress');
            }, 2000);

            if (onImportComplete) onImportComplete();
        } catch (err) {
            console.error('❌ Import error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Import failed';
            setError(errorMsg);
            
            // Stop importing and clear progress
            setImporting(false);
            localStorage.removeItem('importingState');
            setImportProgress({ show: false, message: '', current: 0, total: 0 });
            localStorage.removeItem('importProgress');
            
            showToast('error', 'Import Failed', errorMsg);
        }
    };

    const handleAutoAllocate = async () => {
        setAllocating(true);
        localStorage.setItem('allocatingState', 'true');
        setError('');
        setAllocationResult(null);
        
        // Get initial allocated count
        let initialAllocated = 0;
        let totalUnallocated = 0;
        try {
            const { data: students } = await axios.get(/api/students);
            initialAllocated = students.filter(s => s.room).length;
            totalUnallocated = students.filter(s => !s.room).length;
        } catch (err) {
            console.error('Error getting student count:', err);
        }
        
        // Show progress
        const initialProgress = { 
            show: true, 
            message: `Starting allocation... ${initialAllocated} students already allocated`, 
            current: initialAllocated, 
            total: initialAllocated + totalUnallocated 
        };
        setAllocationProgress(initialProgress);
        localStorage.setItem('allocationProgress', JSON.stringify(initialProgress));

        try {
            const payload = {
                criteria: {
                    ...(criteria.department && { department: criteria.department }),
                    ...(criteria.year && { year: criteria.year }),
                    ...(criteria.gender && { gender: criteria.gender }),
                },
                targetBuilding: targetBuilding || undefined,
                targetBlock: targetBlock || undefined
            };

            console.log('🚀 Starting allocation with payload:', payload);
            console.log('🔗 Allocate URL:', `${API_URL}/api/dorms/allocate`);
            
            const { data } = await axios.post(`${API_URL}/api/dorms/allocate`, payload);
            
            console.log('✅ Allocation response:', data);
            
            // IMPORTANT: Stop allocating state first to stop polling
            setAllocating(false);
            localStorage.removeItem('allocatingState');
            
            setAllocationResult(data);

            // Get final counts
            let finalAllocated = initialAllocated + data.allocated;
            let malesAllocated = data.details?.malesAllocated || 0;
            let femalesAllocated = data.details?.femalesAllocated || 0;
            
            try {
                const { data: students } = await axios.get(/api/students);
                const allocated = students.filter(s => s.room);
                finalAllocated = allocated.length;
                malesAllocated = allocated.filter(s => s.gender === 'M').length;
                femalesAllocated = allocated.filter(s => s.gender === 'F').length;
            } catch (err) {
                console.error('Error getting final count:', err);
            }

            // Show completion message briefly
            const completeProgress = { 
                show: true, 
                message: `✅ Allocation completed! ${data.allocated} students allocated (👨 ${data.details?.malesAllocated || 0} males, 👩 ${data.details?.femalesAllocated || 0} females)`, 
                current: finalAllocated, 
                total: finalAllocated 
            };
            setAllocationProgress(completeProgress);
            localStorage.setItem('allocationProgress', JSON.stringify(completeProgress));

            // Show success toast immediately
            if (data.allocated > 0) {
                const toastMessage = `Successfully allocated ${data.allocated} students to rooms\n\n👨 Males: ${data.details?.malesAllocated || 0}\n👩 Females: ${data.details?.femalesAllocated || 0}\n\n📊 Total allocated in system: ${finalAllocated}`;
                showToast('success', 'Allocation Successful!', toastMessage);
            } else {
                showToast('info', 'No Allocation', data.message || 'No students were allocated. All matching students may already have rooms.');
            }
            
            // Hide progress after 2 seconds
            setTimeout(() => {
                setAllocationProgress({ show: false, message: '', current: 0, total: 0 });
                localStorage.removeItem('allocationProgress');
            }, 2000);

            if (onAllocationComplete) onAllocationComplete();
        } catch (err) {
            console.error('❌ Allocation error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Allocation failed';
            setError(errorMsg);
            
            // Stop allocating and clear progress
            setAllocating(false);
            localStorage.removeItem('allocatingState');
            setAllocationProgress({ show: false, message: '', current: 0, total: 0 });
            localStorage.removeItem('allocationProgress');
            
            showToast('error', 'Allocation Failed', errorMsg);
        }
    };

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

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Import Section */}
            <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                <h3 style={{ marginBottom: '1rem' }}>📥 Import Students</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Upload an Excel (.xlsx, .xls) or CSV file with columns: studentId, fullName, gender, department, year, phone
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="input-field"
                        disabled={importing}
                    />
                    {selectedFile && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Selected: {selectedFile.name}
                        </div>
                    )}

                    <button
                        onClick={handleImport}
                        className="btn btn-primary"
                        disabled={!selectedFile || importing}
                    >
                        {importing ? 'Importing...' : 'Import Students'}
                    </button>

                    {/* Import Progress Bar */}
                    {importProgress.show && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f0f9ff',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            marginTop: '1rem',
                            position: 'relative'
                        }}>
                            {!importing && (
                                <button
                                    onClick={() => {
                                        setImportProgress({ show: false, message: '', current: 0, total: 0 });
                                        localStorage.removeItem('importProgress');
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.25rem',
                                        cursor: 'pointer',
                                        color: '#64748b',
                                        padding: '0',
                                        lineHeight: 1,
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="Close"
                                >
                                    ×
                                </button>
                            )}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                marginBottom: '0.75rem'
                            }}>
                                {importing && <Loader size={18} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />}
                                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1e40af' }}>
                                    {importProgress.message}
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total * 100) : 0}%`,
                                    height: '100%',
                                    backgroundColor: '#3b82f6',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '4px'
                                }} />
                            </div>
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem', 
                                color: '#1e40af',
                                marginTop: '0.5rem',
                                fontWeight: '600'
                            }}>
                                <span>{importProgress.current} students in system</span>
                                {importProgress.total > 0 && (
                                    <span>{Math.round(importProgress.current / importProgress.total * 100)}%</span>
                                )}
                            </div>
                        </div>
                    )}

                    {importResult && (
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: '#e8f5e9',
                            border: '2px solid #4caf50',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            marginTop: '1rem'
                        }}>
                            <div style={{ color: '#2e7d32', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                ✅ Import Successful!
                            </div>
                            <div style={{ color: '#1b5e20', fontSize: '0.95rem' }}>
                                Imported: <strong>{importResult.imported}</strong> students
                            </div>
                            {importResult.errors > 0 && (
                                <div style={{ color: '#f57c00', marginTop: '0.5rem', fontWeight: 500 }}>
                                    ⚠️ Errors: {importResult.errors} rows
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Allocation Section */}
            <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 style={{ margin: 0 }}>🏠 Auto-Allocate Dorms</h3>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                    >
                        <Filter size={14} style={{ marginRight: '4px' }} />
                        {showFilters ? 'Hide Filters' : 'Targeted Allocation'}
                    </button>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Automatically assign students to dorms based on smart rules.
                </p>

                {showFilters && (
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Allocation Filters (Optional)</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Target Building</label>
                                <select
                                    className="input-field"
                                    style={{ padding: '0.4rem' }}
                                    value={targetBuilding}
                                    onChange={(e) => setTargetBuilding(e.target.value)}
                                >
                                    <option value="">Any Available</option>
                                    {availableBuildings.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Target Block</label>
                                <select
                                    className="input-field"
                                    style={{ padding: '0.4rem' }}
                                    value={targetBlock}
                                    onChange={(e) => setTargetBlock(e.target.value)}
                                    disabled={!targetBuilding}
                                >
                                    <option value="">{targetBuilding ? 'Any Block' : 'Select Building First'}</option>
                                    {filteredBlocks.map(block => <option key={block} value={block}>{block}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Department</label>
                                <select
                                    className="input-field"
                                    style={{ padding: '0.4rem' }}
                                    value={criteria.department}
                                    onChange={(e) => setCriteria({ ...criteria, department: e.target.value })}
                                >
                                    <option value="">Any Department</option>
                                    {availableDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Year</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    style={{ padding: '0.4rem' }}
                                    placeholder="e.g. 1"
                                    value={criteria.year}
                                    onChange={(e) => setCriteria({ ...criteria, year: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Gender</label>
                                <select
                                    className="input-field"
                                    style={{ padding: '0.4rem' }}
                                    value={criteria.gender}
                                    onChange={(e) => setCriteria({ ...criteria, gender: e.target.value })}
                                >
                                    <option value="">Any</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                            * Only unassigned students matching these criteria will be allocated to {targetBuilding ? `Building ${targetBuilding}` : 'any available building'}{targetBlock ? ` → Block ${targetBlock}` : ''}.
                        </div>
                    </div>
                )}

                {!showFilters && (
                    <ul style={{ fontSize: '0.85rem', marginBottom: '1rem', marginLeft: '1.5rem', color: 'var(--text-muted)' }}>
                        <li>Fresh students: Alphabetically</li>
                        <li>Senior students: By department, then alphabetically</li>
                        <li>Gender separation enforced</li>
                    </ul>
                )}

                <button
                    onClick={handleAutoAllocate}
                    className="btn btn-success"
                    disabled={allocating}
                    style={{ width: '100%' }}
                >
                    {allocating ? 'Allocating...' : 'Run Allocation'}
                </button>

                {/* Allocation Progress Bar */}
                {allocationProgress.show && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #22c55e',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        position: 'relative'
                    }}>
                        {!allocating && (
                            <button
                                onClick={() => {
                                    setAllocationProgress({ show: false, message: '', current: 0, total: 0 });
                                    localStorage.removeItem('allocationProgress');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '0.5rem',
                                    right: '0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.25rem',
                                    cursor: 'pointer',
                                    color: '#64748b',
                                    padding: '0',
                                    lineHeight: 1,
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Close"
                            >
                                ×
                            </button>
                        )}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            marginBottom: '0.75rem'
                        }}>
                            {allocating && <Loader size={18} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />}
                            <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#15803d' }}>
                                {allocationProgress.message}
                            </span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#dcfce7',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${allocationProgress.total > 0 ? (allocationProgress.current / allocationProgress.total * 100) : 0}%`,
                                height: '100%',
                                backgroundColor: '#22c55e',
                                transition: 'width 0.3s ease',
                                borderRadius: '4px'
                            }} />
                        </div>
                        <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.85rem', 
                            color: '#15803d',
                            marginTop: '0.5rem',
                            fontWeight: '600'
                        }}>
                            <span>{allocationProgress.current} / {allocationProgress.total} students</span>
                            <span>{allocationProgress.total > 0 ? Math.round(allocationProgress.current / allocationProgress.total * 100) : 0}%</span>
                        </div>
                    </div>
                )}

                {allocationResult && (
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: allocationResult.allocated > 0 ? '#e8f5e9' : '#fff3e0',
                        border: allocationResult.allocated > 0 ? '2px solid #4caf50' : '2px solid #ff9800',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginTop: '1rem'
                    }}>
                        <div style={{
                            color: allocationResult.allocated > 0 ? '#2e7d32' : '#e65100',
                            marginBottom: '0.75rem',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}>
                            {allocationResult.allocated > 0 ? '✅ Allocation Successful!' : 'ℹ️ No Allocation'}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#1b5e20', marginBottom: '0.5rem' }}>
                            <strong>{allocationResult.message}</strong>
                        </div>
                        <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: '#424242' }}>
                            <div>👨 Males: <strong>{allocationResult.details?.malesAllocated || 0}</strong> allocated</div>
                            <div>👩 Females: <strong>{allocationResult.details?.femalesAllocated || 0}</strong> allocated</div>
                            <div style={{ marginTop: '0.5rem' }}>
                                📊 Total: <strong>{allocationResult.allocated}</strong> students placed
                            </div>
                            {allocationResult.unallocated > 0 && (
                                <div style={{
                                    color: '#f57c00',
                                    marginTop: '0.75rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#fff3e0',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}>
                                    ⚠️ {allocationResult.unallocated} matching students could not be allocated (insufficient rooms)
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

                {error && (
                    <div className="card" style={{ width: '100%', backgroundColor: 'var(--color-danger-light)', borderLeft: '4px solid var(--color-danger)' }}>
                        <p style={{ color: 'var(--color-danger)', margin: 0 }}>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkImportAllocation;
