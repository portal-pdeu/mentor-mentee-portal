"use client";

import React, { useState } from 'react';
import { MeetingNotification } from '@/types';
import notificationService from '@/services/notificationService';
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiExternalLink } from 'react-icons/fi';

interface MeetingNotificationCardProps {
    notification: MeetingNotification;
    onResponse: (notificationId: string, response: 'accepted' | 'declined', reason?: string) => void;
}

const MeetingNotificationCard: React.FC<MeetingNotificationCardProps> = ({
    notification,
    onResponse
}) => {
    const [showDeclineReason, setShowDeclineReason] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [isResponding, setIsResponding] = useState(false);

    const handleAccept = async () => {
        setIsResponding(true);
        try {
            await onResponse(notification.id, 'accepted');
        } finally {
            setIsResponding(false);
        }
    };

    const handleDecline = async () => {
        if (!declineReason.trim()) {
            alert('Please provide a reason for declining the meeting.');
            return;
        }

        setIsResponding(true);
        try {
            await onResponse(notification.id, 'declined', declineReason);
            setShowDeclineReason(false);
            setDeclineReason('');
        } finally {
            setIsResponding(false);
        }
    };

    const formatDateTime = (date: string, time: string) => {
        try {
            const meetingDate = new Date(`${date}T${time}`);
            return meetingDate.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return `${date} at ${time}`;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 p-6 mb-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            Meeting Invitation
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            from {notification.mentorName}
                        </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.meetingTitle}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {notification.meetingDescription}
                    </p>
                </div>
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDateTime(notification.meetingDate, notification.meetingTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiClock className="w-4 h-4" />
                    <span>{notification.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FiUser className="w-4 h-4" />
                    <span>Mentor: {notification.mentorName}</span>
                </div>
            </div>

            {/* Meeting Link */}
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
                    <FiExternalLink className="w-4 h-4" />
                    <span className="font-medium">Meeting Link:</span>
                    <a
                        href={notification.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                        {notification.meetingUrl}
                    </a>
                </div>
            </div>

            {/* Decline Reason Input */}
            {showDeclineReason && (
                <div className="mb-4 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <label className="block text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                        Please provide a reason for declining this meeting:
                    </label>
                    <textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        className="w-full p-3 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                        rows={3}
                        placeholder="e.g., I have another important commitment at that time..."
                        disabled={isResponding}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                {!showDeclineReason ? (
                    <>
                        <button
                            onClick={handleAccept}
                            disabled={isResponding}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            <FiCheck className="w-5 h-5" />
                            {isResponding ? 'Accepting...' : 'Accept Meeting'}
                        </button>
                        <button
                            onClick={() => setShowDeclineReason(true)}
                            disabled={isResponding}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            <FiX className="w-5 h-5" />
                            Decline Meeting
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleDecline}
                            disabled={isResponding || !declineReason.trim()}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            <FiX className="w-5 h-5" />
                            {isResponding ? 'Declining...' : 'Confirm Decline'}
                        </button>
                        <button
                            onClick={() => {
                                setShowDeclineReason(false);
                                setDeclineReason('');
                            }}
                            disabled={isResponding}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {/* Timestamp */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Invitation received: {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default MeetingNotificationCard;