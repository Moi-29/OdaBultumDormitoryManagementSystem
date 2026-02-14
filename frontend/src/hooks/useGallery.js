/**
 * ⚡ OPTIMIZED GALLERY HOOK
 * React Query hook for sub-second gallery loading with progressive images
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import { queryKeys } from '../lib/queryClient';

/**
 * Fetch gallery images with pagination and caching
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} - Query result
 */
export const useGallery = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: queryKeys.gallery.list(page, limit),
        queryFn: async () => {
            const { data } = await api.get(`/gallery?page=${page}&limit=${limit}`);
            return data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes (images don't change frequently)
        cacheTime: 30 * 60 * 1000, // 30 minutes
        keepPreviousData: true, // ⚡ Keep previous images while loading next page
        refetchOnWindowFocus: false, // Don't refetch on focus (images are static)
        select: (data) => ({
            ...data,
            images: data.images || []
        })
    });
};

/**
 * Fetch single gallery image
 * @param {string} id - Image ID
 * @returns {Object} - Query result
 */
export const useGalleryImage = (id) => {
    return useQuery({
        queryKey: queryKeys.gallery.detail(id),
        queryFn: async () => {
            const { data } = await api.get(`/gallery/${id}`);
            return data;
        },
        enabled: !!id,
        staleTime: 30 * 60 * 1000, // 30 minutes
        cacheTime: 60 * 60 * 1000 // 1 hour
    });
};

/**
 * Upload gallery image mutation
 * @returns {Object} - Mutation object
 */
export const useUploadGalleryImage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        },
        onSuccess: () => {
            // ⚡ Invalidate gallery queries to show new image
            queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
        }
    });
};

/**
 * Delete gallery image mutation
 * @returns {Object} - Mutation object
 */
export const useDeleteGalleryImage = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.delete(`/gallery/${id}`);
            return data;
        },
        onSuccess: (data, id) => {
            // ⚡ Remove from cache and invalidate list
            queryClient.removeQueries({ queryKey: queryKeys.gallery.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
        }
    });
};

/**
 * Bulk delete gallery images mutation
 * @returns {Object} - Mutation object
 */
export const useBulkDeleteGalleryImages = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (imageIds) => {
            const { data } = await api.post('/gallery/bulk-delete', { imageIds });
            return data;
        },
        onSuccess: () => {
            // ⚡ Invalidate all gallery queries
            queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
        }
    });
};

/**
 * Prefetch next page of gallery images
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 */
export const usePrefetchNextGalleryPage = (currentPage, limit = 20) => {
    const queryClient = useQueryClient();
    
    return () => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.gallery.list(currentPage + 1, limit),
            queryFn: async () => {
                const { data } = await api.get(`/gallery?page=${currentPage + 1}&limit=${limit}`);
                return data;
            },
            staleTime: 10 * 60 * 1000
        });
    };
};
