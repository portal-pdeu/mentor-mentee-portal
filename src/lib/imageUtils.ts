/**
 * Utility functions for handling student and faculty profile images
 */

// Cache for tracking failed image IDs to avoid repeated requests
const failedImageIds = new Set<string>();
const failedFacultyImageIds = new Set<string>();

/**
 * Generates the API URL for a student's profile image from their imageId
 */
export function getStudentImageUrl(imageId: string): string {
    if (!imageId || imageId.trim() === '' || imageId === 'undefined') {
        console.warn('Invalid student imageId provided:', imageId);
        return '';
    }

    // Check if this imageId has failed before
    if (failedImageIds.has(imageId)) {
        console.warn('Skipping previously failed student imageId:', imageId);
        return '';
    }

    // Use the API route to fetch images
    const url = `/api/student/profile-picture?fileId=${imageId}`;
    console.log('Generated student API image URL:', url, 'for imageId:', imageId);
    return url;
}

/**
 * Generates the API URL for a faculty's profile image from their imageId
 */
export function getFacultyImageUrl(imageId: string): string {
    if (!imageId || imageId.trim() === '' || imageId === 'undefined') {
        console.warn('Invalid faculty imageId provided:', imageId);
        return '';
    }

    // Check if this imageId has failed before
    if (failedFacultyImageIds.has(imageId)) {
        console.warn('Skipping previously failed faculty imageId:', imageId);
        return '';
    }

    // Use the API route to fetch faculty images
    const url = `/api/faculty/profile-picture?fileId=${imageId}`;
    console.log('Generated faculty API image URL:', url, 'for imageId:', imageId);
    return url;
}

/**
 * Mark an imageId as failed to avoid future requests
 */
export function markImageAsFailed(imageId: string): void {
    if (imageId && imageId.trim() !== '') {
        failedImageIds.add(imageId);
        console.warn('Marked student imageId as failed:', imageId);
    }
}

/**
 * Mark a faculty imageId as failed to avoid future requests
 */
export function markFacultyImageAsFailed(imageId: string): void {
    if (imageId && imageId.trim() !== '') {
        failedFacultyImageIds.add(imageId);
        console.warn('Marked faculty imageId as failed:', imageId);
    }
}

/**
 * Clears the failed images cache
 */
export function clearFailedImagesCache(): void {
    failedImageIds.clear();
    failedFacultyImageIds.clear();
    console.log('Cleared failed images cache for both students and faculty');
}

/**
 * Generates initials from a full name for avatar fallback
 */
export function getInitials(name: string): string {
    if (!name || typeof name !== 'string') {
        return '??';
    }
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Checks if a student has a valid profile image
 */
export function hasValidImage(student: { imageId?: string; imageUrl?: string }): boolean {
    const hasValidImageId = !!(student.imageId &&
        student.imageId.trim() !== '' &&
        student.imageId !== 'undefined' &&
        student.imageId !== 'null' &&
        !failedImageIds.has(student.imageId));

    const hasValidImageUrl = !!(student.imageUrl &&
        student.imageUrl.trim() !== '' &&
        student.imageUrl !== 'undefined' &&
        student.imageUrl !== 'null');

    console.log('Checking student image validity:', {
        imageId: student.imageId,
        imageUrl: student.imageUrl,
        hasValidImageId,
        hasValidImageUrl,
        isImageIdFailed: student.imageId ? failedImageIds.has(student.imageId) : false
    });

    return hasValidImageId || hasValidImageUrl;
}

/**
 * Checks if a faculty has a valid profile image
 */
export function hasValidFacultyImage(faculty: { imageId?: string; imageUrl?: string }): boolean {
    const hasValidImageId = !!(faculty.imageId &&
        faculty.imageId.trim() !== '' &&
        faculty.imageId !== 'undefined' &&
        faculty.imageId !== 'null' &&
        !failedFacultyImageIds.has(faculty.imageId));

    const hasValidImageUrl = !!(faculty.imageUrl &&
        faculty.imageUrl.trim() !== '' &&
        faculty.imageUrl !== 'undefined' &&
        faculty.imageUrl !== 'null');

    console.log('Checking faculty image validity:', {
        imageId: faculty.imageId,
        imageUrl: faculty.imageUrl,
        hasValidImageId,
        hasValidImageUrl,
        isImageIdFailed: faculty.imageId ? failedFacultyImageIds.has(faculty.imageId) : false
    });

    return hasValidImageId || hasValidImageUrl;
}