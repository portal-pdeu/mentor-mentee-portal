"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { Meeting } from "@/types";
import meetingsService from "@/services/meetingsService";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MeetingsList from "@/components/meetings/MeetingsList";
import MeetingDetails from "@/components/meetings/MeetingDetails";
import CreateMeeting from "@/components/meetings/CreateMeeting";
import Modal from "@/components/ui/Modal";
import { FiPlus, FiCalendar } from "react-icons/fi";

interface MeetingsPageError extends Error {
    component: 'MeetingsPage';
    action?: string;
}

const MeetingsPage: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [showCreateMeeting, setShowCreateMeeting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const isFaculty = user?.type === "Faculty";

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const loadMeetings = async (): Promise<void> => {
            if (!isHydrated || !isFaculty || !user?.userId) {
                setLoading(false);
                return;
            }

            try {
                console.log('[MeetingsPage] Loading meetings for mentor:', user.userId);
                const data = await meetingsService.getMeetingsForMentor(user.userId);
                setMeetings(data);
                console.log('[MeetingsPage] Meetings loaded successfully:', data.length);
            } catch (error) {
                const meetingsPageError: MeetingsPageError = {
                    name: 'MeetingsPageError',
                    message: `Failed to load meetings: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    component: 'MeetingsPage',
                    action: 'loadMeetings'
                };
                console.error('[MeetingsPage] loadMeetings Error:', meetingsPageError);
            } finally {
                setLoading(false);
            }
        };

        loadMeetings();
    }, [isHydrated, user?.userId, isFaculty, refreshTrigger]);

    const handleMeetingCreated = (newMeeting: Meeting): void => {
        try {
            setMeetings(prevMeetings => [newMeeting, ...prevMeetings]);
            setShowCreateMeeting(false);
            setSelectedMeeting(newMeeting); // Select the new meeting for details
            setRefreshTrigger(prev => prev + 1);
            console.log('[MeetingsPage] Meeting created successfully:', newMeeting.id);
        } catch (error) {
            const meetingsPageError: MeetingsPageError = {
                name: 'MeetingsPageError',
                message: `Failed to handle meeting creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'MeetingsPage',
                action: 'handleMeetingCreated'
            };
            console.error('[MeetingsPage] handleMeetingCreated Error:', meetingsPageError);
        }
    };

    const handleMeetingDeleted = (meetingId: string): void => {
        try {
            setMeetings(prevMeetings => prevMeetings.filter(m => m.id !== meetingId));
            if (selectedMeeting?.id === meetingId) {
                setSelectedMeeting(null);
            }
            console.log('[MeetingsPage] Meeting deleted successfully:', meetingId);
        } catch (error) {
            const meetingsPageError: MeetingsPageError = {
                name: 'MeetingsPageError',
                message: `Failed to handle meeting deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'MeetingsPage',
                action: 'handleMeetingDeleted'
            };
            console.error('[MeetingsPage] handleMeetingDeleted Error:', meetingsPageError);
        }
    };

    const handleMeetingUpdated = (updatedMeeting: Meeting): void => {
        try {
            setMeetings(prevMeetings =>
                prevMeetings.map(meeting =>
                    meeting.id === updatedMeeting.id ? updatedMeeting : meeting
                )
            );
            setSelectedMeeting(updatedMeeting);
            console.log('[MeetingsPage] Meeting updated successfully:', updatedMeeting.id);
        } catch (error) {
            const meetingsPageError: MeetingsPageError = {
                name: 'MeetingsPageError',
                message: `Failed to handle meeting update: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'MeetingsPage',
                action: 'handleMeetingUpdated'
            };
            console.error('[MeetingsPage] handleMeetingUpdated Error:', meetingsPageError);
        }
    };

    // Show loading skeleton during hydration to prevent mismatch
    if (!isHydrated) {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-background text-foreground">
                    <div className="flex flex-col w-full max-w-7xl mx-auto py-10 px-4 md:px-8">
                        <header className="mb-8">
                            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                        </header>
                        <LoadingSpinner
                            message="Initializing..."
                            size="md"
                            className="py-12"
                        />
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    // Authorization check (only after hydration)
    if (!isFaculty) {
        return (
            <ErrorBoundary>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <FiCalendar className="w-16 h-16 text-gray-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Only faculty members can access meetings.
                    </p>
                </div>
            </ErrorBoundary>
        );
    }

    try {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-background text-foreground">
                    <div className="flex flex-col w-full max-w-7xl mx-auto py-10 px-4 md:px-8">
                        <header className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        Meetings
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-base mt-1">
                                        Manage your mentor meetings and schedules
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateMeeting(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    <FiPlus className="w-5 h-5" />
                                    Create Meeting
                                </button>
                            </div>
                        </header>

                        {/* Loading State */}
                        {loading && (
                            <LoadingSpinner
                                message="Loading meetings..."
                                size="md"
                                className="py-12"
                            />
                        )}

                        {/* Content */}
                        {!loading && (
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Meetings List */}
                                <div className="flex-1 lg:max-w-md">
                                    <ErrorBoundary>
                                        <MeetingsList
                                            meetings={meetings}
                                            selectedMeetingId={selectedMeeting?.id}
                                            onMeetingSelect={setSelectedMeeting}
                                            onMeetingDeleted={handleMeetingDeleted}
                                        />
                                    </ErrorBoundary>
                                </div>

                                {/* Meeting Details */}
                                <div className="flex-1">
                                    <ErrorBoundary>
                                        {selectedMeeting ? (
                                            <MeetingDetails
                                                meeting={selectedMeeting}
                                                onMeetingUpdated={handleMeetingUpdated}
                                                onMeetingDeleted={handleMeetingDeleted}
                                            />
                                        ) : (
                                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-8">
                                                <div className="text-center">
                                                    <FiCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                        Select a Meeting
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Choose a meeting from the list to view its details
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </ErrorBoundary>
                                </div>
                            </div>
                        )}

                        {/* Create Meeting Modal */}
                        <Modal
                            isOpen={showCreateMeeting}
                            onClose={() => setShowCreateMeeting(false)}
                            title="Create New Meeting"
                            size="lg"
                        >
                            <ErrorBoundary>
                                <CreateMeeting
                                    onCancel={() => setShowCreateMeeting(false)}
                                    onMeetingCreated={handleMeetingCreated}
                                    mentorId={user?.userId || ''}
                                    mentorName={user?.name || ''}
                                />
                            </ErrorBoundary>
                        </Modal>
                    </div>
                </div>
            </ErrorBoundary>
        );
    } catch (error) {
        const meetingsPageError: MeetingsPageError = {
            name: 'MeetingsPageError',
            message: `Failed to render MeetingsPage: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'MeetingsPage'
        };
        console.error('[MeetingsPage] Render Error:', meetingsPageError);

        // This will be caught by the outer ErrorBoundary
        throw meetingsPageError;
    }
};

export default MeetingsPage;
