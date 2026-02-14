/**
 * ⚡ OPTIMIZED ANNOUNCEMENTS HOOK
 * React Query hook for sub-second announcement loading
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import { queryKeys } from '../lib/queryClient';

/**
 * Fetch announcements with caching and background updates
 * @param {Object} filters - Query filters
 * @returns {Object} - Query result with data, loading, error states
 */
export const useAnnouncements = (filters = {}) => {
    const { status = 'published', type, targetAudience, page = 1, limit = 20 } = filters;
    
    return useQuery({
        queryKey: queryKeys.announcements.list({ status, type, targetAudience, page, limit }),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (type) params.append('type', type);
            if (targetAudience) params.append('targetAudience', targetAudience);
            params.append('page', page);
            params.append('limit', limit);
            
            const { data } = await api.get(`/announcements?${params.toString()}`);
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        keepPreviousData: true, // ⚡ Keep previous data while fetching new page
        refetchOnWindowFocus: true, // ⚡ Refetch when user returns to tab
        select: (data) => ({
            ...data,
            announcements: data.announcements || []
        })
    });
};

/**
 * Fetch single announcement by ID
 * @param {string} id - Announcement ID
 * @returns {Object} - Query result
 */
export const useAnnouncement = (id) => {
    return useQuery({
        queryKey: queryKeys.announcements.detail(id),
        queryFn: async () => {
            const { data } = await api.get(`/announcements/${id}`);
            return data;
        },
        enabled: !!id, // Only fetch if ID exists
        staleTime: 10 * 60 * 1000, // 10 minutes
        cacheTime: 30 * 60 * 1000 // 30 minutes
    });
};

/**
 * Create announcement mutation
 * @returns {Object} - Mutation object
 */
export const useCreateAnnouncement = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (announcementData) => {
            const { data } = await api.post('/announcements', announcementData);
            return data;
        },
        onSuccess: () => {
            // ⚡ Invalidate and refetch announcements
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
        }
    });
};

/**
 * Update announcement mutation
 * @returns {Object} - Mutation object
 */
export const useUpdateAnnouncement = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...announcementData }) => {
            const { data } = await api.put(`/announcements/${id}`, announcementData);
            return data;
        },
        onSuccess: (data, variables) => {
            // ⚡ Invalidate specific announcement and list
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() });
        }
    });
};

/**
 * Delete announcement mutation
 * @returns {Object} - Mutation object
 */
export const useDeleteAnnouncement = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await api.delete(`/announcements/${id}`);
            return data;
        },
        onSuccess: (data, id) => {
            // ⚡ Remove from cache and invalidate list
            queryClient.removeQueries({ queryKey: queryKeys.announcements.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.lists() });
        }
    });
};

/**
 * Bulk delete announcements mutation
 * @returns {Object} - Mutation object
 */
export const useBulkDeleteAnnouncements = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (announcementIds) => {
            const { data } = await api.post('/announcements/bulk-delete', { announcementIds });
            return data;
        },
        onSuccess: () => {
            // ⚡ Invalidate all announcement queries
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
        }
    });
};
