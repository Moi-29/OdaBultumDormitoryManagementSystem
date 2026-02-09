import { AlertTriangle, X } from 'lucide-react';

/**
 * Premium Confirmation Dialog Component
 * Replaces window.confirm() with a modern, accessible dialog
 * 
 * @param {Object} props
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @param {string} props.confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} props.cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} props.type - Type: 'danger', 'warning', 'info' (default: 'warning')
 */
const ConfirmDialog = ({
    title = 'Confirm Action',
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    confirmBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    confirmHoverBg: '#dc2626'
                };
            case 'info':
                return {
                    iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    confirmBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    confirmHoverBg: '#2563eb'
                };
            case 'warning':
            default:
                return {
                    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    confirmBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    confirmHoverBg: '#d97706'
                };
        }
    };

    const config = getTypeConfig();

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10002,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                padding: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'center'
            }}>
                {/* Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: config.iconBg,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                }}>
                    <AlertTriangle size={40} color="white" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    marginBottom: '1rem',
                    letterSpacing: '-0.5px'
                }}>
                    {title}
                </h2>

                {/* Message */}
                <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem',
                    whiteSpace: 'pre-line'
                }}>
                    {message}
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '0.875rem 2rem',
                            border: '2px solid #e5e7eb',
                            background: 'white',
                            color: '#64748b',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.875rem 2rem',
                            border: 'none',
                            background: config.confirmBg,
                            color: 'white',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
