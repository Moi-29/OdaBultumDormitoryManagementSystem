// This component wraps the existing dormitory placement search functionality
// Extracted from StudentPortal.jsx - NO internal changes, just isolated

import { useState } from 'react';
import { Search, User, Copy, Building2, MapPin, Users, Printer, Download } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../../context/ThemeContext';

const DormitoryView = () => {
    const { isDarkMode } = useTheme();
    const [studentId, setStudentId] = useState('');
    const [placement, setPlacement] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!studentId) return;

        setError('');
        setPlacement(null);
        setLoading(true);

        try {
            const { data } = await axios.post('https://odabultumdormitorymanagementsystem.onrender.com/api/students/lookup', {
                studentId
            });

            setTimeout(() => {
                setPlacement(data);
                setLoading(false);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Student not found');
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('placement-result');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Dorm_Placement_${studentId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div style={{
            height: 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isDarkMode ? '#111827' : '#f8f9fa',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                overflow: 'auto'
            }}>
            {!placement ? (
                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : 'white',
                    borderRadius: '16px',
                    boxShadow: isDarkMode ? '0 4px 24px rgba(0, 0, 0, 0.5)' : '0 4px 24px rgba(0, 0, 0, 0.04)',
                    padding: '3rem 2.5rem',
                    width: '100%',
                    maxWidth: '550px',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        height: '4px',
                        backgroundColor: '#cca300',
                        borderRadius: '0 0 8px 8px'
                    }}></div>

                    <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        marginTop: '0.5rem',
                        transition: 'color 0.3s ease'
                    }}>Find Your Dorm Placement</h2>

                    <p style={{
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        marginBottom: '2.5rem',
                        fontSize: '0.95rem',
                        transition: 'color 0.3s ease'
                    }}>
                        Enter your university ID to view your assigned accommodation
                    </p>

                    <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{
                                marginBottom: '0.5rem',
                                color: '#b49000',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <User size={16} /> University ID
                            </label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="RU1270/18"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
                                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#cca300',
                                color: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {loading ? 'SEARCHING...' : (
                                <>
                                    <Search size={18} /> VIEW PLACEMENT
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <p style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </p>
                    )}
                </div>
            ) : (
                <div
                    id="placement-result"
                    style={{
                        width: '100%',
                        maxWidth: '550px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        overflow: 'visible',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                    <div style={{
                        backgroundColor: '#0f172a',
                        color: 'white',
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderBottom: '3px solid #cca300',
                        flexShrink: 0
                    }}>
                        <Building2 size={18} color="#cca300" />
                        <h2 style={{
                            margin: 0,
                            fontFamily: '"Playfair Display", serif',
                            fontSize: '1rem',
                            fontWeight: '600',
                            letterSpacing: '0.025em',
                            color: 'white'
                        }}>Dormitory Placement Details</h2>
                    </div>

                    <div style={{ padding: '1rem', flex: 1, overflow: 'visible' }}>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '0.75rem',
                            textAlign: 'center',
                            border: '1px solid #e5e7eb',
                            marginBottom: '0.75rem'
                        }}>
                            <p style={{ color: '#6b7280', fontSize: '0.7rem', marginBottom: '0.15rem', margin: 0 }}>Your Room</p>
                            <h1 style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: '1.75rem',
                                color: '#d97706',
                                fontWeight: '700',
                                margin: '0.15rem 0',
                                lineHeight: '1'
                            }}>{placement.room?.roomNumber}</h1>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                margin: 0
                            }}>{placement.room?.building}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>University ID</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.studentId}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(placement.studentId)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Full Name</span>
                                <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.fullName}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Sex</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.8rem' }}>{placement.gender === 'M' ? 'M' : 'F'}</span>
                                    <div style={{
                                        width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#f3f4f6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '0.65rem'
                                    }}>
                                        {placement.gender === 'M' ? '♂' : '♀'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Department</span>
                                <span style={{
                                    backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.45rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600'
                                }}>
                                    {placement.department}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Building</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <Building2 size={13} color="#d97706" /> {placement.room?.building}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Room Number</span>
                                <span style={{ color: '#d97706', fontWeight: '700', fontSize: '0.95rem' }}>{placement.room?.roomNumber}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.35rem' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Campus</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <MapPin size={13} color="#d97706" /> Main Campus
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Capacity</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <Users size={13} color="#d97706" /> {placement.room?.capacity} Students
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                            <button style={{
                                flex: 1,
                                minWidth: '100px',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                border: 'none',
                                padding: '0.55rem',
                                borderRadius: '7px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                            }} onClick={() => window.print()}>
                                <Printer size={14} /> Print
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                style={{
                                    flex: 1,
                                    minWidth: '100px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#1f2937',
                                    border: '1px solid #e5e7eb',
                                    padding: '0.55rem',
                                    borderRadius: '7px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                }}>
                                <Download size={14} /> Save PDF
                            </button>
                        </div>

                        <button
                            onClick={() => setPlacement(null)}
                            style={{
                                width: '100%',
                                marginTop: '0.65rem',
                                padding: '0.6rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '7px',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                        >
                            <Search size={15} /> New Search
                        </button>
                    </div>
                </div>
            )}
            </div>
            
            {/* Footer */}
            <footer style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
                borderTop: isDarkMode ? '1px solid #1e293b' : '1px solid #2d4a6f',
                flexShrink: 0,
                transition: 'all 0.3s ease'
            }}>
                Copyright © 2026 Oda Bultum University. All rights reserved.
            </footer>
        </div>
    );
};

export default DormitoryView;
