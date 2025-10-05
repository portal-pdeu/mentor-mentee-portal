/**
 * Meeting Notifications Service
 * Handles notifications for meeting invitations and responses
 */

import { MeetingNotification, Meeting } from '@/types';

export interface NotificationServiceError extends Error {
    service: 'NotificationService';
    action: string;
    originalError?: unknown;
}

class NotificationService {
    /**
     * Get pending meeting notifications for a student
     * @param studentId - The student's ID
     * @returns Promise<MeetingNotification[]>
     */
    async getPendingNotifications(studentId: string): Promise<MeetingNotification[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            console.log('[NotificationService] Fetching pending notifications for student:', studentId);

            // Mock data for pending notifications
            const mockNotifications: MeetingNotification[] = [
                {
                    id: 'notif_1',
                    meetingId: 'meeting_1',
                    meetingTitle: 'Weekly Progress Review',
                    meetingDescription: 'Review your progress and discuss upcoming assignments',
                    meetingDate: '2025-10-05',
                    meetingTime: '10:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/abc-defg-hij',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    studentId: studentId,
                    status: 'pending',
                    createdAt: '2025-10-01T10:00:00Z'
                },
                {
                    id: 'notif_2',
                    meetingId: 'meeting_2',
                    meetingTitle: 'Project Discussion',
                    meetingDescription: 'Discuss your project requirements and timeline',
                    meetingDate: '2025-10-08',
                    meetingTime: '14:30',
                    duration: 90,
                    meetingUrl: 'https://zoom.us/j/123456789',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    studentId: studentId,
                    status: 'pending',
                    createdAt: '2025-10-01T09:00:00Z'
                }
            ];

            console.log('[NotificationService] Found', mockNotifications.length, 'pending notifications');
            return mockNotifications;

        } catch (error) {
            const notificationError: NotificationServiceError = {
                name: 'NotificationServiceError',
                message: `Failed to fetch pending notifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'NotificationService',
                action: 'getPendingNotifications',
                originalError: error
            };

            console.error('[NotificationService] getPendingNotifications Error:', notificationError);
            throw notificationError;
        }
    }

    /**
     * Respond to a meeting notification
     * @param notificationId - The notification ID
     * @param response - 'accepted' or 'declined'
     * @param declineReason - Reason for declining (required if declined)
     * @returns Promise<boolean>
     */
    async respondToNotification(
        notificationId: string,
        response: 'accepted' | 'declined',
        declineReason?: string
    ): Promise<boolean> {
        try {
            if (!notificationId) {
                throw new Error('Notification ID is required');
            }

            if (response === 'declined' && !declineReason?.trim()) {
                throw new Error('Decline reason is required when declining a meeting');
            }

            console.log('[NotificationService] Responding to notification:', notificationId, 'with:', response);

            // In production, this would update the database
            // For now, we'll simulate the response
            const responseData = {
                notificationId,
                response,
                declineReason: response === 'declined' ? declineReason : undefined,
                respondedAt: new Date().toISOString()
            };

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('[NotificationService] Response recorded:', responseData);
            return true;

        } catch (error) {
            const notificationError: NotificationServiceError = {
                name: 'NotificationServiceError',
                message: `Failed to respond to notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'NotificationService',
                action: 'respondToNotification',
                originalError: error
            };

            console.error('[NotificationService] respondToNotification Error:', notificationError);
            throw notificationError;
        }
    }

    /**
     * Create notification when mentor schedules a meeting
     * @param meetingData - Meeting information
     * @param invitedStudentIds - Array of student IDs to notify
     * @returns Promise<string[]> - Array of created notification IDs
     */
    async createMeetingNotifications(
        meetingData: Meeting,
        invitedStudentIds: string[]
    ): Promise<string[]> {
        try {
            if (!meetingData || !invitedStudentIds.length) {
                throw new Error('Meeting data and invited students are required');
            }

            console.log('[NotificationService] Creating notifications for', invitedStudentIds.length, 'students');

            const notificationIds: string[] = [];

            // Create a notification for each invited student
            for (const studentId of invitedStudentIds) {
                const notificationId = `notif_${Date.now()}_${studentId}`;

                const notification: MeetingNotification = {
                    id: notificationId,
                    meetingId: meetingData.id,
                    meetingTitle: meetingData.title,
                    meetingDescription: meetingData.description,
                    meetingDate: meetingData.date,
                    meetingTime: meetingData.time,
                    duration: meetingData.duration,
                    meetingUrl: meetingData.meetingUrl,
                    mentorId: meetingData.mentorId,
                    mentorName: meetingData.mentorName,
                    studentId: studentId,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };

                // In production, save to database
                console.log('[NotificationService] Created notification:', notification);
                notificationIds.push(notificationId);
            }

            return notificationIds;

        } catch (error) {
            const notificationError: NotificationServiceError = {
                name: 'NotificationServiceError',
                message: `Failed to create meeting notifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'NotificationService',
                action: 'createMeetingNotifications',
                originalError: error
            };

            console.error('[NotificationService] createMeetingNotifications Error:', notificationError);
            throw notificationError;
        }
    }

    /**
     * Get all notifications for a student (pending, accepted, declined)
     * @param studentId - The student's ID
     * @returns Promise<MeetingNotification[]>
     */
    async getAllNotifications(studentId: string): Promise<MeetingNotification[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            console.log('[NotificationService] Fetching all notifications for student:', studentId);

            // Mock data including responded notifications
            const mockNotifications: MeetingNotification[] = [
                {
                    id: 'notif_1',
                    meetingId: 'meeting_1',
                    meetingTitle: 'Weekly Progress Review',
                    meetingDescription: 'Review your progress and discuss upcoming assignments',
                    meetingDate: '2025-10-05',
                    meetingTime: '10:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/abc-defg-hij',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    studentId: studentId,
                    status: 'pending',
                    createdAt: '2025-10-01T10:00:00Z'
                },
                {
                    id: 'notif_3',
                    meetingId: 'meeting_3',
                    meetingTitle: 'Career Guidance Session',
                    meetingDescription: 'Discuss career opportunities and future plans',
                    meetingDate: '2025-09-20',
                    meetingTime: '15:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    studentId: studentId,
                    status: 'declined',
                    declineReason: 'Had to attend urgent family matter',
                    createdAt: '2025-09-18T10:00:00Z',
                    respondedAt: '2025-09-20T14:30:00Z'
                }
            ];

            return mockNotifications;

        } catch (error) {
            const notificationError: NotificationServiceError = {
                name: 'NotificationServiceError',
                message: `Failed to fetch all notifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'NotificationService',
                action: 'getAllNotifications',
                originalError: error
            };

            console.error('[NotificationService] getAllNotifications Error:', notificationError);
            throw notificationError;
        }
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;