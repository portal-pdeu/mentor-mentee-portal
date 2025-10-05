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

            // For now, return mock data. In production, this would be an API call
            const mockMeetings: Meeting[] = [
                {
                    id: '1',
                    title: 'Weekly Progress Review',
                    description: 'Review student progress and discuss upcoming assignments',
                    date: '2025-08-30',
                    time: '10:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/abc-defg-hij',
                    meetingPassword: 'mentor123',
                    purpose: 'Progress Review',
                    status: 'scheduled',
                    mentorId: mentorId,
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: 'student1',
                            studentName: 'Alice Johnson',
                            studentEmail: 'alice@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'accepted'
                        },
                        {
                            studentId: 'student2',
                            studentName: 'Bob Wilson',
                            studentEmail: 'bob@pdeu.ac.in',
                            rollNo: 'CS21002',
                            responseStatus: 'pending'
                        }
                    ],
                    createdAt: '2025-08-25T10:00:00Z',
                    updatedAt: '2025-08-26T15:30:00Z'
                },
                {
                    id: '2',
                    title: 'Project Discussion',
                    description: 'Discuss project requirements and timeline',
                    date: '2025-09-02',
                    time: '14:30',
                    duration: 90,
                    meetingUrl: 'https://zoom.us/j/123456789',
                    purpose: 'Project Planning',
                    status: 'scheduled',
                    mentorId: mentorId,
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: 'student3',
                            studentName: 'Charlie Brown',
                            studentEmail: 'charlie@pdeu.ac.in',
                            rollNo: 'CS21003',
                            responseStatus: 'accepted'
                        }
                    ],
                    createdAt: '2025-08-26T09:00:00Z',
                    updatedAt: '2025-08-26T09:00:00Z'
                },
                {
                    id: '3',
                    title: 'Mid-term Assessment',
                    description: 'Evaluate student performance and provide feedback',
                    date: '2025-08-25',
                    time: '11:00',
                    duration: 45,
                    meetingUrl: 'https://teams.microsoft.com/meet/abc123',
                    purpose: 'Assessment',
                    status: 'completed',
                    mentorId: mentorId,
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: 'student1',
                            studentName: 'Alice Johnson',
                            studentEmail: 'alice@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'accepted',
                            joinedAt: '2025-08-25T11:05:00Z'
                        },
                        {
                            studentId: 'student4',
                            studentName: 'Diana Lee',
                            studentEmail: 'diana@pdeu.ac.in',
                            rollNo: 'CS21004',
                            responseStatus: 'accepted',
                            joinedAt: '2025-08-25T11:02:00Z'
                        }
                    ],
                    createdAt: '2025-08-20T14:00:00Z',
                    updatedAt: '2025-08-25T11:45:00Z'
                }
            ];

            console.log('[MeetingsService] Successfully fetched meetings:', mockMeetings.length);
            return mockMeetings;

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

            // For now, get from mock data. In production, this would be an API call
            const allMeetings = await this.getMeetingsForMentor('currentMentor');
            const meeting = allMeetings.find(m => m.id === meetingId);

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

            // In production, this would make an API call to update the meeting
            // For now, simulate getting the meeting and updating its status
            const meeting = await this.getMeetingById(meetingId);
            if (!meeting) {
                throw new Error('Meeting not found');
            }

            const updatedMeeting: Meeting = {
                ...meeting,
                status: newStatus,
                updatedAt: new Date().toISOString()
            };

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

            // In production, this would be an API call to delete the meeting
            // For now, just simulate success
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

            // Mock data for meetings where the student is invited
            const mockMeetings: Meeting[] = [
                {
                    id: '1',
                    title: 'Weekly Progress Review',
                    description: 'Review your progress and discuss upcoming assignments',
                    date: '2025-10-05',
                    time: '10:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/abc-defg-hij',
                    meetingPassword: 'mentor123',
                    purpose: 'Progress Review',
                    status: 'scheduled',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: studentId,
                            studentName: 'Current Student',
                            studentEmail: 'student@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'accepted'
                        }
                    ],
                    createdAt: '2025-10-01T10:00:00Z',
                    updatedAt: '2025-10-01T15:30:00Z'
                },
                {
                    id: '2',
                    title: 'Project Discussion',
                    description: 'Discuss your project requirements and timeline',
                    date: '2025-10-08',
                    time: '14:30',
                    duration: 90,
                    meetingUrl: 'https://zoom.us/j/123456789',
                    purpose: 'Project Planning',
                    status: 'scheduled',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: studentId,
                            studentName: 'Current Student',
                            studentEmail: 'student@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'pending'
                        }
                    ],
                    createdAt: '2025-10-01T09:00:00Z',
                    updatedAt: '2025-10-01T09:00:00Z'
                },
                {
                    id: '3',
                    title: 'Mid-term Assessment',
                    description: 'Performance evaluation and feedback session',
                    date: '2025-09-28',
                    time: '11:00',
                    duration: 45,
                    meetingUrl: 'https://teams.microsoft.com/meet/abc123',
                    purpose: 'Assessment',
                    status: 'completed',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: studentId,
                            studentName: 'Current Student',
                            studentEmail: 'student@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'accepted',
                            joinedAt: '2025-09-28T11:02:00Z'
                        }
                    ],
                    createdAt: '2025-09-25T09:00:00Z',
                    updatedAt: '2025-09-28T11:45:00Z'
                },
                {
                    id: '4',
                    title: 'Career Guidance Session',
                    description: 'Discuss career opportunities and future plans',
                    date: '2025-09-20',
                    time: '15:00',
                    duration: 60,
                    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
                    purpose: 'Career Guidance',
                    status: 'completed',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: studentId,
                            studentName: 'Current Student',
                            studentEmail: 'student@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'declined',
                            declineReason: 'Had to attend urgent family matter'
                        }
                    ],
                    createdAt: '2025-09-18T10:00:00Z',
                    updatedAt: '2025-09-20T14:30:00Z'
                },
                {
                    id: '5',
                    title: 'Research Methodology Workshop',
                    description: 'Learn about research methodologies for your project',
                    date: '2025-09-15',
                    time: '09:30',
                    duration: 120,
                    meetingUrl: 'https://zoom.us/j/987654321',
                    purpose: 'Workshop',
                    status: 'completed',
                    mentorId: 'mentor1',
                    mentorName: 'Dr. John Smith',
                    invitedStudents: [
                        {
                            studentId: studentId,
                            studentName: 'Current Student',
                            studentEmail: 'student@pdeu.ac.in',
                            rollNo: 'CS21001',
                            responseStatus: 'declined',
                            declineReason: 'Conflicted with another important exam'
                        }
                    ],
                    createdAt: '2025-09-12T10:00:00Z',
                    updatedAt: '2025-09-15T09:00:00Z'
                }
            ];

            // Filter meetings where this student is invited
            const studentMeetings = mockMeetings.filter(meeting =>
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
