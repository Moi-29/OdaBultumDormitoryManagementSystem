/**
 * ⚡ LAZY IMAGE COMPONENT
 * Progressive image loading with LQIP (Low Quality Image Placeholder)
 * Provides instant visual feedback and smooth transitions
 */

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({
    src,
    alt,
    className = '',
    lqip, // Low quality image placeholder
    thumbnail, // Thumbnail version
    onLoad,
    aspectRatio = '1/1',
    objectFit = 'cover',
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(lqip || thumbnail || null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    // ⚡ PERFORMANCE: Only load image when it's in viewport
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger once
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px' // Start loading 50px before entering viewport
    });

    useEffect(() => {
        if (!inView || !src) return;

        // ⚡ PERFORMANCE: Progressive loading strategy
        // 1. Show LQIP immediately (already set in state)
        // 2. Load thumbnail if available
        // 3. Load full image
        
        const loadImage = async () => {
            try {
                // If we have thumbnail and it's not already loaded, load it first
                if (thumbnail && imageSrc !== thumbnail) {
                    const thumbnailImg = new Image();
                    thumbnailImg.src = thumbnail;
                    await thumbnailImg.decode();
                    setImageSrc(thumbnail);
                }

                // Load full image
                const fullImg = new Image();
                fullImg.src = src;
                await fullImg.decode();
                
                setImageSrc(src);
                setImageLoading(false);
                
                if (onLoad) {
                    onLoad();
                }
            } catch (error) {
                console.error('Image loading error:', error);
                setImageError(true);
                setImageLoading(false);
            }
        };

        loadImage();
    }, [inView, src, thumbnail, imageSrc, onLoad]);

    // Error fallback
    if (imageError) {
        return (
            <div
                ref={ref}
                className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
                style={{ aspectRatio }}
            >
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            style={{ aspectRatio }}
        >
            {/* ⚡ LQIP or placeholder */}
            {imageLoading && imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className="absolute inset-0 w-full h-full blur-sm scale-110 transition-opacity duration-300"
                    style={{ objectFit }}
                    loading="lazy"
                />
            )}

            {/* ⚡ Main image */}
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ objectFit }}
                    loading="lazy"
                    {...props}
                />
            )}

            {/* ⚡ Loading overlay */}
            {imageLoading && !imageSrc && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
        </div>
    );
};

export default React.memo(LazyImage);
