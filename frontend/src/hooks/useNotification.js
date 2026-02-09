import { useState, useCallback } from 'react';

/**
 * Custom hook for managing notifications
 * Provides a clean API for showing notifications throughout the app
 * 
 * @returns {Object} { notification, showNotification, hideNotification }
 */
export const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        setNotification({ message, type, duration });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showNotification,
        hideNotification
    };
};

/**
 * Custom hook for managing confirmation dialogs
 * Provides a clean API for showing confirmation dialogs
 * 
 * @returns {Object} { confirmDialog, showConfirm, hideConfirm }
 */
export const useConfirmDialog = () => {
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showConfirm = useCallback((config) => {
        return new Promise((resolve) => {
            setConfirmDialog({
                ...config,
                onConfirm: () => {
                    setConfirmDialog(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const hideConfirm = useCallback(() => {
        setConfirmDialog(null);
    }, []);

    return {
        confirmDialog,
        showConfirm,
        hideConfirm
    };
};
