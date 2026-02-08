import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, LogIn, FileText, X, GraduationCap, Building2, Users, Heart, DollarSign, Briefcase } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                // Redirect based on user type
                if (result.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '1rem 2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    {/* Left side - Logo and University Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                            alt="OBU Logo" 
                            style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'contain',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '4px'
                            }} 
                        />
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: '1.5rem', 
                                fontWeight: '700',
                                color: 'white'
                            }}>
                                Oda Bultum University
                            </h1>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.9)'
                            }}>
                                Dormitory Management System
                            </p>
                        </div>
                    </div>

                    {/* Right side - Application Form Button */}
                    <button
                        onClick={() => setShowApplicationForm(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <FileText size={18} />
                        Application Form
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                minHeight: 'calc(100vh - 140px)'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '3rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    animation: 'slideIn 0.8s ease-out'
                }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpWVhGUfDQPtwCOjcwTE3tQiAl0obKpwvN1A&s" 
                                alt="OBU Logo" 
                                style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    objectFit: 'contain',
                                    margin: '0 auto 1.5rem',
                                    display: 'block'
                                }} 
                            />
                            <h2 style={{ 
                                margin: '0 0 0.5rem 0', 
                                fontSize: '2rem', 
                                fontWeight: '800',
                                color: '#2d3748',
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.5px'
                            }}>
                                Log In
                            </h2>
                            <p style={{ 
                                margin: 0,
                                color: '#718096',
                                fontSize: '0.95rem'
                            }}>
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {error && (
                            <div style={{ 
                                color: '#e53e3e',
                                backgroundColor: '#fff5f5',
                                border: '1px solid #feb2b2',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                fontSize: '0.9rem',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ 
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem',
                                    display: 'block',
                                    color: '#2d3748'
                                }}>
                                    Username
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User 
                                        size={20} 
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#a0aec0'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ 
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '0.5rem',
                                    display: 'block',
                                    color: '#2d3748'
                                }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock 
                                        size={20} 
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#a0aec0'
                                        }}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ 
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: isLoading 
                                        ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                    transform: 'translateY(0)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTop: '3px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite'
                                        }} />
                                        Logging In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        Log In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: '#000000',
                color: 'white',
                textAlign: 'center',
                padding: '1.5rem',
                fontSize: '0.9rem',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }}>
                Copyright © 2026 Oda Bultum University. All rights reserved.
            </footer>

            {/* Animations */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 768px) {
                    header > div {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    header > div > div:last-child {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                }
            `}</style>

            {/* Application Form Modal - Same as StudentPortal */}
            {showApplicationForm && (
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
                    padding: '1rem',
                    animation: 'fadeIn 0.3s'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        maxWidth: '1200px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                Dormitory Application Form
                            </h2>
                            <button
                                onClick={() => setShowApplicationForm(false)}
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
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            padding: '1rem 2rem 0',
                            borderBottom: '2px solid #e5e7eb',
                            overflowX: 'auto',
                            backgroundColor: '#f9fafb'
                        }}>
                            {[
                                { id: 'personal', label: 'Personal', icon: <User size={18} /> },
                                { id: 'educational', label: 'Educational', icon: <GraduationCap size={18} /> },
                                { id: 'school', label: 'School', icon: <Building2 size={18} /> },
                                { id: 'family', label: 'Family', icon: <Users size={18} /> },
                                { id: 'emergency', label: 'Emergency', icon: <Heart size={18} /> },
                                { id: 'cost', label: 'Cost-Sharing', icon: <DollarSign size={18} /> },
                                { id: 'documents', label: 'Documents', icon: <FileText size={18} /> },
                                { id: 'agreement', label: 'Agreement', icon: <Briefcase size={18} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        border: 'none',
                                        background: activeTab === tab.id ? '#10b981' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : '#64748b',
                                        borderRadius: '8px 8px 0 0',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 600 : 500,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '2rem'
                        }}>
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem 2rem',
                                color: '#64748b'
                            }}>
                                <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                                </h3>
                                <p>This section is under development. Form fields will be added here soon.</p>
                            </div>
                        </div>

                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            backgroundColor: '#f9fafb'
                        }}>
                            <button
                                onClick={() => setShowApplicationForm(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '2px solid #e5e7eb',
                                    background: 'white',
                                    color: '#64748b',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '0.75rem 2rem',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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

export default Login;
