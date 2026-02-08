import { ClipboardList } from 'lucide-react';

const Applications = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                    <ClipboardList size={32} /> Applications
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Manage student dormitory applications
                </p>
            </div>

            <div className="card" style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
                <ClipboardList size={64} style={{ 
                    color: 'var(--color-primary)', 
                    margin: '0 auto 1.5rem',
                    opacity: 0.5
                }} />
                <h2 style={{ 
                    color: 'var(--text-main)', 
                    marginBottom: '1rem',
                    fontSize: '1.5rem'
                }}>
                    Applications Section
                </h2>
                <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    This section is under development. Application management features will be added here soon.
                </p>
                <div style={{ 
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <p style={{ 
                        color: 'var(--color-primary)', 
                        fontWeight: 600,
                        margin: 0
                    }}>
                        🚧 Coming Soon: Application forms, submission tracking, and approval workflows
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Applications;
