"use client";

import React, { useState, useEffect } from 'react';
import { MeetingNotification } from '@/types';
import notificationService from '@/services/notificationService';
import MeetingNotificationCard from './MeetingNotificationCard';
import { FiBell, FiBellOff, FiRefreshCw } from 'react-icons/fi';

interface MeetingNotificationsProps {
    userId: string;
    onNotificationUpdate?: () => void;
}

const MeetingNotifications: React.FC<MeetingNotificationsProps> = ({
    userId,
    onNotificationUpdate
}) => {
    const [notifications, setNotifications] = useState<MeetingNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = async () => {
        try {
            setError(null);
            const pendingNotifications = await notificationService.getPendingNotifications(userId);
            setNotifications(pendingNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            setError('Failed to load meeting invitations. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [userId]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
    };

    const handleNotificationResponse = async (
        notificationId: string,
        response: 'accepted' | 'declined',
        reason?: string
    ) => {
        try {
            await notificationService.respondToNotification(notificationId, response, reason);

            // Remove the notification from the list
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            // Notify parent component about the update
            if (onNotificationUpdate) {
                onNotificationUpdate();
            }
        } catch (error) {
            console.error('Error responding to notification:', error);
            alert('Failed to respond to meeting invitation. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Loading meeting invitations...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FiBellOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                        Error Loading Notifications
                    </h3>
                </div>
                <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors duration-200"
                >
                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Retry
                </button>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <FiBellOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No New Meeting Invitations
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    You don't have any pending meeting invitations from your mentors.
                    Check back later or contact your mentor if you're expecting an invitation.
                </p>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors duration-200"
                >
                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FiBell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Meeting Invitations
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {notifications.length} pending
                    </span>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    title="Refresh notifications"
                >
                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <MeetingNotificationCard
                        key={notification.id}
                        notification={notification}
                        onResponse={handleNotificationResponse}
                    />
                ))}
            </div>
        </div>
    );
};

export default MeetingNotifications;