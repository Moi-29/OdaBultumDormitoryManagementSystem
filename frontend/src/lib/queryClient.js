/**
 * ⚡ REACT QUERY CONFIGURATION
 * High-performance data fetching with smart caching
 * Target: Sub-second data loading with background updates
 */

import { QueryClient } from '@tanstack/react-query';

// ⚡ PERFORMANCE: Configure React Query for optimal caching
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // ⚡ Stale time: Data considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000, // 5 minutes
            
            // ⚡ Cache time: Keep unused data in cache for 10 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            
            // ⚡ Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            
            // ⚡ Refetch on reconnect
            refetchOnReconnect: true,
            
            // ⚡ Retry failed requests
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // ⚡ Enable request deduplication
            refetchOnMount: 'always',
            
            // ⚡ Suspense mode for better loading states
            suspense: false,
            
            // ⚡ Keep previous data while fetching new data
            keepPreviousData: true
        },
        mutations: {
            // ⚡ Retry mutations once on failure
            retry: 1,
            retryDelay: 1000
        }
    }
});

// ⚡ PERFORMANCE: Query keys for consistent caching
export const queryKeys = {
    // Announcements
    announcements: {
        all: ['announcements'],
        lists: () => [...queryKeys.announcements.all, 'list'],
        list: (filters) => [...queryKeys.announcements.lists(), filters],
        details: () => [...queryKeys.announcements.all, 'detail'],
        detail: (id) => [...queryKeys.announcements.details(), id]
    },
    
    // Gallery
    gallery: {
        all: ['gallery'],
        lists: () => [...queryKeys.gallery.all, 'list'],
        list: (page, limit) => [...queryKeys.gallery.lists(), { page, limit }],
        details: () => [...queryKeys.gallery.all, 'detail'],
        detail: (id) => [...queryKeys.gallery.details(), id]
    },
    
    // Students
    students: {
        all: ['students'],
        lists: () => [...queryKeys.students.all, 'list'],
        list: (filters) => [...queryKeys.students.lists(), filters],
        details: () => [...queryKeys.students.all, 'detail'],
        detail: (id) => [...queryKeys.students.details(), id],
        lookup: (studentId) => [...queryKeys.students.all, 'lookup', studentId]
    },
    
    // Rooms/Dorms
    dorms: {
        all: ['dorms'],
        lists: () => [...queryKeys.dorms.all, 'list'],
        list: (filters) => [...queryKeys.dorms.lists(), filters],
        statistics: () => [...queryKeys.dorms.all, 'statistics']
    },
    
    // Requests
    requests: {
        all: ['requests'],
        lists: () => [...queryKeys.requests.all, 'list'],
        list: (filters) => [...queryKeys.requests.lists(), filters],
        details: () => [...queryKeys.requests.all, 'detail'],
        detail: (id) => [...queryKeys.requests.details(), id],
        unreadCount: () => [...queryKeys.requests.all, 'unreadCount']
    },
    
    // Applications
    applications: {
        all: ['applications'],
        lists: () => [...queryKeys.applications.all, 'list'],
        list: (filters) => [...queryKeys.applications.lists(), filters],
        check: (studentId) => [...queryKeys.applications.all, 'check', studentId]
    },
    
    // Dashboard
    dashboard: {
        stats: (role) => ['dashboard', 'stats', role],
        recentStudents: () => ['dashboard', 'recentStudents'],
        blockOccupancy: () => ['dashboard', 'blockOccupancy']
    },
    
    // Admin
    admins: {
        all: ['admins'],
        lists: () => [...queryKeys.admins.all, 'list'],
        list: (filters) => [...queryKeys.admins.lists(), filters],
        activityLogs: () => [...queryKeys.admins.all, 'activityLogs'],
        loginHistory: () => [...queryKeys.admins.all, 'loginHistory']
    },
    
    // Roles
    roles: {
        all: ['roles'],
        lists: () => [...queryKeys.roles.all, 'list'],
        permissions: () => [...queryKeys.roles.all, 'permissions']
    },
    
    // Proctors
    proctors: {
        all: ['proctors'],
        profile: (id) => [...queryKeys.proctors.all, 'profile', id],
        reports: (id) => [...queryKeys.proctors.all, 'reports', id]
    },
    
    // Maintainers
    maintainers: {
        all: ['maintainers'],
        profile: (id) => [...queryKeys.maintainers.all, 'profile', id],
        workOrders: (id) => [...queryKeys.maintainers.all, 'workOrders', id]
    }
};

// ⚡ PERFORMANCE: Prefetch strategies
export const prefetchStrategies = {
    // Prefetch announcements on app load
    prefetchAnnouncements: async () => {
        await queryClient.prefetchQuery({
            queryKey: queryKeys.announcements.list({ status: 'published', page: 1, limit: 10 }),
            staleTime: 5 * 60 * 1000
        });
    },
    
    // Prefetch gallery on navigation
    prefetchGallery: async () => {
        await queryClient.prefetchQuery({
            queryKey: queryKeys.gallery.list(1, 20),
            staleTime: 10 * 60 * 1000
        });
    },
    
    // Prefetch dashboard stats
    prefetchDashboardStats: async (role) => {
        await queryClient.prefetchQuery({
            queryKey: queryKeys.dashboard.stats(role),
            staleTime: 2 * 60 * 1000
        });
    }
};

// ⚡ PERFORMANCE: Cache invalidation helpers
export const invalidateQueries = {
    announcements: () => queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all }),
    gallery: () => queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all }),
    students: () => queryClient.invalidateQueries({ queryKey: queryKeys.students.all }),
    dorms: () => queryClient.invalidateQueries({ queryKey: queryKeys.dorms.all }),
    requests: () => queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
    applications: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
    dashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    all: () => queryClient.invalidateQueries()
};
