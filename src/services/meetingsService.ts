/**
 * Meetings Service - Handles all meeting-related data operations
 * 
 * This service provides a centralized way to manage meeting data
 * with proper error handling and logging for debugging purposes.
 */

import { Meeting, CreateMeetingData, Student } from '@/types';

export interface MeetingsServiceError extends Error {
    service: 'MeetingsService';
    action: string;
    originalError?: unknown;
}

// In-memory storage for meetings (shared between mentor and students)
// In production, this would be replaced with actual database calls
let meetingsStore: Meeting[] = [];

class MeetingsService {
    /**
     * Fetch all meetings for a mentor
     * @param mentorId - The mentor's ID
     * @returns Promise<Meeting[]>
     */
    async getMeetingsForMentor(mentorId: string): Promise<Meeting[]> {
        try {
            if (!mentorId) {
                throw new Error('Mentor ID is required');
            }

            console.log('[MeetingsService] Fetching meetings for mentor:', mentorId);

            // Filter meetings created by this mentor
            const mentorMeetings = meetingsStore.filter(meeting => meeting.mentorId === mentorId);

            console.log('[MeetingsService] Successfully fetched meetings:', mentorMeetings.length);
            return mentorMeetings;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to fetch meetings: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'getMeetingsForMentor',
                originalError: error
            };

            console.error('[MeetingsService] getMeetingsForMentor Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Get meeting by ID
     * @param meetingId - The meeting ID
     * @returns Promise<Meeting | null>
     */
    async getMeetingById(meetingId: string): Promise<Meeting | null> {
        try {
            if (!meetingId) {
                throw new Error('Meeting ID is required');
            }

            console.log('[MeetingsService] Fetching meeting by ID:', meetingId);

            // Find meeting in the shared store
            const meeting = meetingsStore.find(m => m.id === meetingId);

            if (!meeting) {
                console.warn('[MeetingsService] Meeting not found:', meetingId);
                return null;
            }

            console.log('[MeetingsService] Successfully fetched meeting:', meeting.title);
            return meeting;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to fetch meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'getMeetingById',
                originalError: error
            };

            console.error('[MeetingsService] getMeetingById Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Create a new meeting
     * @param meetingData - The meeting data
     * @param mentorId - The mentor's ID
     * @param mentorName - The mentor's name
     * @returns Promise<Meeting>
     */
    async createMeeting(meetingData: CreateMeetingData, mentorId: string, mentorName: string): Promise<Meeting> {
        try {
            if (!meetingData || !mentorId || !mentorName) {
                throw new Error('Meeting data, mentor ID, and mentor name are required');
            }

            console.log('[MeetingsService] Creating new meeting:', meetingData.title);

            // In production, this would be an API call to create the meeting
            const newMeeting: Meeting = {
                id: `meeting_${Date.now()}`,
                title: meetingData.title,
                description: meetingData.description,
                date: meetingData.date,
                time: meetingData.time,
                duration: meetingData.duration,
                meetingUrl: meetingData.meetingUrl,
                meetingPassword: meetingData.meetingPassword,
                purpose: meetingData.purpose,
                status: 'scheduled',
                mentorId: mentorId,
                mentorName: mentorName,
                invitedStudents: meetingData.invitedStudentIds.map(studentId => ({
                    studentId,
                    studentName: `Student ${studentId}`, // In production, fetch actual student data
                    studentEmail: `student${studentId}@pdeu.ac.in`,
                    rollNo: `CS2100${studentId}`,
                    responseStatus: 'pending'
                })),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add the meeting to the shared store so it's visible to students
            meetingsStore.push(newMeeting);

            console.log('[MeetingsService] Successfully created meeting:', newMeeting.id);
            return newMeeting;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to create meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'createMeeting',
                originalError: error
            };

            console.error('[MeetingsService] createMeeting Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Get available students for invitation
     * @param mentorId - The mentor's ID
     * @returns Promise<Student[]>
     */
    async getAvailableStudents(mentorId: string): Promise<Student[]> {
        try {
            if (!mentorId) {
                throw new Error('Mentor ID is required');
            }

            console.log('[MeetingsService] Fetching available students for mentor:', mentorId);

            // Mock data for students. In production, this would fetch actual mentees
            const mockStudents: Student[] = [
                {
                    studentId: 'student1',
                    name: 'Alice Johnson',
                    email: 'alice@pdeu.ac.in',
                    rollNo: 'CS21001',
                    imageUrl: '',
                    imageId: '',
                    projectRequestStatus: 'Accepted',
                    IA1: 85,
                    IA2: 90,
                    EndSem: 88,
                    school: 'School of Engineering',
                    department: 'Computer Science',
                    password: '',
                    mentorId: mentorId
                },
                {
                    studentId: 'student2',
                    name: 'Bob Wilson',
                    email: 'bob@pdeu.ac.in',
                    rollNo: 'CS21002',
                    imageUrl: '',
                    imageId: '',
                    projectRequestStatus: 'Accepted',
                    IA1: 78,
                    IA2: 82,
                    EndSem: 85,
                    school: 'School of Engineering',
                    department: 'Computer Science',
                    password: '',
                    mentorId: mentorId
                },
                {
                    studentId: 'student3',
                    name: 'Charlie Brown',
                    email: 'charlie@pdeu.ac.in',
                    rollNo: 'CS21003',
                    imageUrl: '',
                    imageId: '',
                    projectRequestStatus: 'Accepted',
                    IA1: 92,
                    IA2: 88,
                    EndSem: 91,
                    school: 'School of Engineering',
                    department: 'Computer Science',
                    password: '',
                    mentorId: mentorId
                },
                {
                    studentId: 'student4',
                    name: 'Diana Lee',
                    email: 'diana@pdeu.ac.in',
                    rollNo: 'CS21004',
                    imageUrl: '',
                    imageId: '',
                    projectRequestStatus: 'Accepted',
                    IA1: 89,
                    IA2: 94,
                    EndSem: 90,
                    school: 'School of Engineering',
                    department: 'Computer Science',
                    password: '',
                    mentorId: mentorId
                }
            ];

            console.log('[MeetingsService] Successfully fetched students:', mockStudents.length);
            return mockStudents;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'getAvailableStudents',
                originalError: error
            };

            console.error('[MeetingsService] getAvailableStudents Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Update meeting status
     * @param meetingId - The meeting ID to update
     * @param newStatus - The new status
     * @returns Promise<Meeting | null> - updated meeting if successful
     */
    async updateMeetingStatus(meetingId: string, newStatus: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'): Promise<Meeting | null> {
        try {
            if (!meetingId) {
                throw new Error('Meeting ID is required');
            }

            if (!newStatus) {
                throw new Error('New status is required');
            }

            console.log('[MeetingsService] Updating meeting status:', meetingId, 'to', newStatus);

            // Find the meeting in the store
            const meetingIndex = meetingsStore.findIndex(m => m.id === meetingId);
            if (meetingIndex === -1) {
                throw new Error('Meeting not found');
            }

            // Update the meeting in the store
            meetingsStore[meetingIndex] = {
                ...meetingsStore[meetingIndex],
                status: newStatus,
                updatedAt: new Date().toISOString()
            };

            const updatedMeeting = meetingsStore[meetingIndex];

            console.log('[MeetingsService] Meeting status updated successfully:', meetingId, newStatus);
            return updatedMeeting;
        } catch (error) {
            const meetingsServiceError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to update meeting status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'updateMeetingStatus',
                originalError: error
            };
            console.error('[MeetingsService] updateMeetingStatus Error:', meetingsServiceError);
            throw meetingsServiceError;
        }
    }

    /**
     * Delete a meeting
     * @param meetingId - The meeting ID
     * @returns Promise<boolean>
     */
    async deleteMeeting(meetingId: string): Promise<boolean> {
        try {
            if (!meetingId) {
                throw new Error('Meeting ID is required');
            }

            console.log('[MeetingsService] Deleting meeting:', meetingId);

            // Find the meeting index in the store
            const meetingIndex = meetingsStore.findIndex(m => m.id === meetingId);
            if (meetingIndex === -1) {
                throw new Error('Meeting not found');
            }

            // Remove the meeting from the store
            meetingsStore.splice(meetingIndex, 1);

            console.log('[MeetingsService] Successfully deleted meeting:', meetingId);
            return true;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to delete meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'deleteMeeting',
                originalError: error
            };

            console.error('[MeetingsService] deleteMeeting Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Fetch all meetings for a student/mentee
     * @param studentId - The student's ID
     * @returns Promise<Meeting[]>
     */
    async getMeetingsForStudent(studentId: string): Promise<Meeting[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            console.log('[MeetingsService] Fetching meetings for student:', studentId);

            // Filter meetings where this student is invited
            const studentMeetings = meetingsStore.filter(meeting =>
                meeting.invitedStudents.some(student => student.studentId === studentId)
            );

            console.log('[MeetingsService] Found', studentMeetings.length, 'meetings for student:', studentId);
            return studentMeetings;

        } catch (error) {
            const meetingError: MeetingsServiceError = {
                name: 'MeetingsServiceError',
                message: `Failed to fetch meetings for student: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'MeetingsService',
                action: 'getMeetingsForStudent',
                originalError: error
            };

            console.error('[MeetingsService] getMeetingsForStudent Error:', meetingError);
            throw meetingError;
        }
    }

    /**
     * Format meeting date and time for display
     * @param date - Meeting date
     * @param time - Meeting time
     * @returns Formatted date string
     */
    formatMeetingDateTime(date: string, time: string): string {
        try {
            const meetingDate = new Date(`${date}T${time}`);
            return meetingDate.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.warn('[MeetingsService] Failed to format date:', error);
            return `${date} at ${time}`;
        }
    }

    /**
     * Get meeting status badge color
     * @param status - Meeting status
     * @returns CSS classes for status badge
     */
    getStatusBadgeColor(status: Meeting['status']): string {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'ongoing':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'completed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    }
}

// Export singleton instance
const meetingsService = new MeetingsService();
export default meetingsService;
