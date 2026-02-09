import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Premium Notification Component
 * Centralized notification system for the entire application
 * 
 * @param {Object} props
 * @param {string} props.message - The notification message
 * @param {string} props.type - Type: 'success', 'error', 'warning', 'info'
 * @param {function} props.onClose - Callback when notification is closed
 * @param {number} props.duration - Auto-close duration in ms (default: 4000, 0 = no auto-close)
 * @param {string} props.position - Position: 'top-right', 'top-center', 'bottom-right', 'bottom-center'
 */
const Notification = ({ 
    message, 
    type = 'info', 
    onClose, 
    duration = 4000,
    position = 'top-right'
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    icon: <CheckCircle2 size={24} />,
                    title: 'Success!'
                };
            case 'error':
                return {
                    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    icon: <AlertCircle size={24} />,
                    title: 'Error'
                };
            case 'warning':
                return {
                    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    icon: <AlertTriangle size={24} />,
                    title: 'Warning'
                };
            case 'info':
            default:
                return {
                    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    icon: <Info size={24} />,
                    title: 'Info'
                };
        }
    };

    const getPositionStyles = () => {
        switch (position) {
            case 'top-center':
                return { top: '2rem', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-right':
                return { bottom: '2rem', right: '2rem' };
            case 'bottom-center':
                return { bottom: '2rem', left: '50%', transform: 'translateX(-50%)' };
            case 'top-right':
            default:
                return { top: '2rem', right: '2rem' };
        }
    };

    const config = getConfig();

    return (
        <div style={{
            position: 'fixed',
            ...getPositionStyles(),
            zIndex: 10001,
            minWidth: '320px',
            maxWidth: '500px',
            background: config.gradient,
            color: 'white',
            padding: '1.25rem 1.5rem',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {config.icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ 
                    fontWeight: 700, 
                    fontSize: '1rem', 
                    marginBottom: '0.25rem',
                    letterSpacing: '-0.2px'
                }}>
                    {config.title}
                </div>
                <div style={{ 
                    fontSize: '0.9rem', 
                    opacity: 0.95,
                    lineHeight: '1.4'
                }}>
                    {message}
                </div>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Notification;
