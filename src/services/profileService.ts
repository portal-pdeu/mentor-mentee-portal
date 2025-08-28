/**
 * Profile Service - Handles all profile-related data operations
 * 
 * This service provides a centralized way to manage faculty profile data
 * with proper error handling and logging for debugging purposes.
 */

import { Faculty } from '@/types';
import { getFacultyByDocId } from '@/app/mentor-dashboard/actions';

export interface ProfileServiceError extends Error {
    service: 'ProfileService';
    action: string;
    originalError?: unknown;
}

class ProfileService {
    /**
     * Fetch faculty data by document ID
     * @param docId - The document ID of the faculty member
     * @returns Promise<Faculty | null>
     */
    async fetchFacultyData(docId: string): Promise<Faculty | null> {
        try {
            if (!docId) {
                throw new Error('Document ID is required');
            }

            console.log('[ProfileService] Fetching faculty data for docId:', docId);

            const facultyData = await getFacultyByDocId(docId);

            if (!facultyData) {
                console.warn('[ProfileService] No faculty data found for docId:', docId);
                return null;
            }

            console.log('[ProfileService] Successfully fetched faculty data:', {
                name: facultyData.name,
                email: facultyData.email,
                department: facultyData.department
            });

            return facultyData;

        } catch (error) {
            const profileError: ProfileServiceError = {
                name: 'ProfileServiceError',
                message: `Failed to fetch faculty data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'ProfileService',
                action: 'fetchFacultyData',
                originalError: error
            };

            console.error('[ProfileService] fetchFacultyData Error:', profileError);
            throw profileError;
        }
    }

    /**
     * Validate faculty data structure
     * @param facultyData - The faculty data to validate
     * @returns boolean - true if valid, false otherwise
     */
    validateFacultyData(facultyData: unknown): facultyData is Faculty {
        try {
            if (!facultyData || typeof facultyData !== 'object') {
                return false;
            }

            const faculty = facultyData as Faculty;

            // Check required fields
            const requiredFields: (keyof Faculty)[] = ['facultyId', 'name', 'email'];

            for (const field of requiredFields) {
                if (!faculty[field]) {
                    console.warn(`[ProfileService] Missing required field: ${field}`);
                    return false;
                }
            }

            return true;

        } catch (error) {
            console.error('[ProfileService] validateFacultyData Error:', error);
            return false;
        }
    }

    /**
     * Get formatted faculty info for display
     * @param facultyData - The faculty data
     * @returns Formatted faculty information
     */
    getFormattedFacultyInfo(facultyData: Faculty | null) {
        try {
            if (!facultyData) {
                return {
                    displayName: 'Faculty Name',
                    displayTitle: 'Faculty',
                    displayDepartment: 'Department',
                    displaySchool: 'School',
                    displayEmail: 'faculty@pdeu.ac.in',
                    displayPhone: '+91 9876543210',
                    displayOffice: 'F-212'
                };
            }

            return {
                displayName: facultyData.name || 'Faculty Name',
                displayTitle: facultyData.designation || 'Faculty',
                displayDepartment: facultyData.department || 'Department',
                displaySchool: facultyData.school || 'School',
                displayEmail: facultyData.email || 'faculty@pdeu.ac.in',
                displayPhone: facultyData.phoneNumber || '+91 9876543210',
                displayOffice: facultyData.seating || 'F-212',
                displaySpecialization: facultyData.specialization || 'Not specified'
            };

        } catch (error) {
            const profileError: ProfileServiceError = {
                name: 'ProfileServiceError',
                message: `Failed to format faculty info: ${error instanceof Error ? error.message : 'Unknown error'}`,
                service: 'ProfileService',
                action: 'getFormattedFacultyInfo',
                originalError: error
            };

            console.error('[ProfileService] getFormattedFacultyInfo Error:', profileError);

            // Return safe defaults on error
            return {
                displayName: 'Faculty Name',
                displayTitle: 'Faculty',
                displayDepartment: 'Department',
                displaySchool: 'School',
                displayEmail: 'faculty@pdeu.ac.in',
                displayPhone: '+91 9876543210',
                displayOffice: 'F-212',
                displaySpecialization: 'Not specified'
            };
        }
    }
}

// Export a singleton instance
const profileService = new ProfileService();
export default profileService;
