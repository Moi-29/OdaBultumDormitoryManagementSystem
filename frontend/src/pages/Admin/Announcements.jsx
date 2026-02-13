import { Megaphone } from 'lucide-react';

const Announcements = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '2rem'
        }}>
            <div style={{ 
                maxWidth: '1400px', 
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{ 
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Megaphone size={24} color="white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 style={{ 
                                fontSize: '2rem', 
                                fontWeight: 800, 
                                color: '#1e293b',
                                margin: 0,
                                letterSpacing: '-0.5px'
                            }}>
                                Announcements & Events
                            </h1>
                            <p style={{ 
                                fontSize: '0.95rem', 
                                color: '#64748b',
                                margin: '0.25rem 0 0 0'
                            }}>
                                Manage system-wide announcements and upcoming events
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        opacity: 0.9
                    }}>
                        <Megaphone size={40} color="white" strokeWidth={2} />
                    </div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        margin: '0 0 0.75rem 0'
                    }}>
                        Coming Soon
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        margin: 0,
                        maxWidth: '500px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.6'
                    }}>
                        The announcements and events management feature is currently under development. 
                        You'll be able to create, edit, and manage announcements and events for all users.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
