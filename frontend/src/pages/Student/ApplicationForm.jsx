// Placeholder - Will contain the full application form from StudentPortal
// For now, showing a message that this will be populated

import { FileText } from 'lucide-react';

const ApplicationForm = () => {
    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                padding: '3rem',
                maxWidth: '600px',
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
    );
};

export default ApplicationForm;
