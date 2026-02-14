/**
 * ⚡ SKELETON LOADER COMPONENTS
 * Instant visual feedback while data loads
 * Better UX than spinners - shows content structure immediately
 */

import React from 'react';

// Base skeleton component
export const Skeleton = ({ className = '', width, height, circle = false }) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';
    const shapeClasses = circle ? 'rounded-full' : 'rounded';
    
    const style = {
        width: width || '100%',
        height: height || '1rem',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
    };
    
    return (
        <div 
            className={`${baseClasses} ${shapeClasses} ${className}`}
            style={style}
        />
    );
};

// Announcement card skeleton
export const AnnouncementSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            {/* Image skeleton */}
            <Skeleton height="200px" className="rounded-lg" />
            
            {/* Title skeleton */}
            <Skeleton height="24px" width="80%" />
            
            {/* Content skeleton */}
            <div className="space-y-2">
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="95%" />
                <Skeleton height="16px" width="90%" />
            </div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center justify-between pt-4">
                <Skeleton height="20px" width="120px" />
                <Skeleton height="20px" width="80px" />
            </div>
        </div>
    );
};

// Gallery image skeleton
export const GalleryImageSkeleton = () => {
    return (
        <div className="relative aspect-square overflow-hidden rounded-lg">
            <Skeleton height="100%" className="absolute inset-0" />
        </div>
    );
};

// Dashboard stat card skeleton
export const StatCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton circle width="48px" height="48px" />
                <Skeleton height="32px" width="60px" />
            </div>
            <Skeleton height="20px" width="70%" />
            <Skeleton height="16px" width="50%" />
        </div>
    );
};

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }) => {
    return (
        <tr className="border-b dark:border-gray-700">
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index} className="px-6 py-4">
                    <Skeleton height="20px" width="90%" />
                </td>
            ))}
        </tr>
    );
};

// List item skeleton
export const ListItemSkeleton = () => {
    return (
        <div className="flex items-center space-x-4 p-4 border-b dark:border-gray-700">
            <Skeleton circle width="40px" height="40px" />
            <div className="flex-1 space-y-2">
                <Skeleton height="18px" width="60%" />
                <Skeleton height="14px" width="40%" />
            </div>
        </div>
    );
};

// Form skeleton
export const FormSkeleton = () => {
    return (
        <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton height="16px" width="120px" />
                    <Skeleton height="40px" width="100%" className="rounded-md" />
                </div>
            ))}
            <div className="flex justify-end space-x-4 pt-4">
                <Skeleton height="40px" width="100px" className="rounded-md" />
                <Skeleton height="40px" width="100px" className="rounded-md" />
            </div>
        </div>
    );
};

// Page skeleton (full page loading)
export const PageSkeleton = () => {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton height="32px" width="300px" />
                <Skeleton height="20px" width="500px" />
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <StatCardSkeleton key={index} />
                ))}
            </div>
            
            {/* Content area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Skeleton height="24px" width="200px" className="mb-4" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <ListItemSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Add shimmer animation to global CSS
const shimmerStyle = `
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
`;

// Inject shimmer animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = shimmerStyle;
    document.head.appendChild(style);
}

export default Skeleton;
