"use client";

import React from 'react';
import { Meeting } from '@/types';
import meetingsService from '@/services/meetingsService';
import { FiCalendar, FiClock, FiUsers, FiMoreVertical, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';

interface MeetingsListProps {
    meetings: Meeting[];
    selectedMeetingId?: string;
    onMeetingSelect: (meeting: Meeting) => void;
    onMeetingDeleted: (meetingId: string) => void;
}

interface MeetingsListError extends Error {
    component: 'MeetingsList';
    action?: string;
}

const MeetingsList: React.FC<MeetingsListProps> = ({
    meetings,
    selectedMeetingId,
    onMeetingSelect,
    onMeetingDeleted
}) => {
    const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
    const [deletingMeeting, setDeletingMeeting] = useState<string | null>(null);

    const handleDeleteMeeting = async (meetingId: string): Promise<void> => {
        try {
            setDeletingMeeting(meetingId);

            const success = await meetingsService.deleteMeeting(meetingId);
            if (success) {
                onMeetingDeleted(meetingId);
                setShowMenuFor(null);
                console.log('[MeetingsList] Meeting deleted successfully:', meetingId);
            } else {
                throw new Error('Failed to delete meeting');
            }
        } catch (error) {
            const meetingsListError: MeetingsListError = {
                name: 'MeetingsListError',
                message: `Failed to delete meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'MeetingsList',
                action: 'handleDeleteMeeting'
            };
            console.error('[MeetingsList] handleDeleteMeeting Error:', meetingsListError);
        } finally {
            setDeletingMeeting(null);
        }
    };

    const getUpcomingMeetings = (): Meeting[] => {
        const now = new Date();
        return meetings.filter(meeting => {
            const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
            return meetingDate >= now && meeting.status === 'scheduled';
        }).sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
        });
    };

    const getPastMeetings = (): Meeting[] => {
        const now = new Date();
        return meetings.filter(meeting => {
            const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
            return meetingDate < now || meeting.status === 'completed';
        }).sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime(); // Most recent first
        });
    };

    const renderMeetingCard = (meeting: Meeting): JSX.Element => {
        const isSelected = selectedMeetingId === meeting.id;
        const isDeleting = deletingMeeting === meeting.id;

        return (
            <div
                key={meeting.id}
                className={`relative group cursor-pointer transition-all duration-200 ${isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md'
                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200/50 dark:border-gray-800/50'
                    } border rounded-xl p-4 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => !isDeleting && onMeetingSelect(meeting)}
            >
                {/* Status Badge - Top Right */}
                <span className={`absolute top-2 right-2 z-10 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow ${meetingsService.getStatusBadgeColor(meeting.status)} bg-white dark:bg-gray-900`}
                >
                    {meeting.status}
                </span>

                {/* Meeting Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {meeting.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {meeting.description}
                        </p>
                    </div>
                </div>

                {/* Meeting Info */}
                <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span>{meetingsService.formatMeetingDateTime(meeting.date, meeting.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiClock className="w-4 h-4" />
                        <span>{meeting.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiUsers className="w-4 h-4" />
                        <span>{meeting.invitedStudents.length} student{meeting.invitedStudents.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Purpose */}
                <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        {meeting.purpose}
                    </span>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-2 right-2 mt-8">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenuFor(showMenuFor === meeting.id ? null : meeting.id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <FiMoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {showMenuFor === meeting.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                            <div className="py-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(meeting.meetingUrl, '_blank');
                                        setShowMenuFor(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                                >
                                    <FiExternalLink className="w-4 h-4" />
                                    Open Meeting Link
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteMeeting(meeting.id);
                                    }}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    {isDeleting ? 'Deleting...' : 'Delete Meeting'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading overlay for deletion */}
                {isDeleting && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    </div>
                )}
            </div>
        );
    };

    try {
        const upcomingMeetings = getUpcomingMeetings();
        const pastMeetings = getPastMeetings();

        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Your Meetings
                </h2>

                {meetings.length === 0 ? (
                    <div className="text-center py-12">
                        <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Meetings Yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Create your first meeting to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Upcoming Meetings */}
                        {upcomingMeetings.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                    Upcoming ({upcomingMeetings.length})
                                </h3>
                                <div className="space-y-3">
                                    {upcomingMeetings.map(renderMeetingCard)}
                                </div>
                            </div>
                        )}

                        {/* Past Meetings */}
                        {pastMeetings.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                    Past ({pastMeetings.length})
                                </h3>
                                <div className="space-y-3">
                                    {pastMeetings.map(renderMeetingCard)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Click outside to close menu */}
                {showMenuFor && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenuFor(null)}
                    />
                )}
            </div>
        );
    } catch (error) {
        const meetingsListError: MeetingsListError = {
            name: 'MeetingsListError',
            message: `Failed to render MeetingsList: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'MeetingsList'
        };
        console.error('[MeetingsList] Render Error:', meetingsListError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Meetings List Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: MeetingsList | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default MeetingsList;
