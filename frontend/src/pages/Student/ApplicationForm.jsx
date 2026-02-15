// Placeholder - Will contain the full application form from StudentPortal
// For now, showing a message that this will be populated

import { FileText } from 'lucide-react';

const ApplicationForm = () => {
    return (
        <div style={{
            height: 'calc(100vh - 81px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa',
            overflow: 'hidden'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                overflow: 'auto'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                    padding: '3rem',
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <FileText size={40} color="white" />
                    </div>
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        Application Form
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6b7280',
                        lineHeight: 1.6
                    }}>
                        The complete dormitory application form will be integrated here from the existing StudentPortal component.
                        This will include all form fields, validation, and submission logic - unchanged from the original.
                    </p>
                </div>
            </div>
            
            <footer style={{
                backgroundColor: '#1e3a5f',
                color: '#ffffff',
                textAlign: 'center',
                padding: '1rem',
                fontSize: '0.875rem',
                borderTop: '1px solid #2d4a6f',
                flexShrink: 0
            }}>
                Copyright © 2026 Oda Bultum University. All rights reserved.
            </footer>
        </div>
    );
};

export default ApplicationForm;
