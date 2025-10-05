/**
 * Utility functions for handling student profile images
 */

// Cache for tracking failed image IDs to avoid repeated requests
const failedImageIds = new Set<string>();

/**
 * Generates the API URL for a student's profile image from their imageId
 */
export function getStudentImageUrl(imageId: string): string {
    if (!imageId || imageId.trim() === '' || imageId === 'undefined') {
        console.warn('Invalid imageId provided:', imageId);
        return '';
    }

    // Check if this imageId has failed before
    if (failedImageIds.has(imageId)) {
        console.warn('Skipping previously failed imageId:', imageId);
        return '';
    }

    // Use the API route to fetch images
    const url = `/api/student/profile-picture?fileId=${imageId}`;
    console.log('Generated API image URL:', url, 'for imageId:', imageId);
    return url;
}

/**
 * Mark an imageId as failed to avoid future requests
 */
export function markImageAsFailed(imageId: string): void {
    if (imageId && imageId.trim() !== '') {
        failedImageIds.add(imageId);
        console.warn('Marked imageId as failed:', imageId);
    }
}

/**
 * Clears the failed images cache
 */
export function clearFailedImagesCache(): void {
    failedImageIds.clear();
    console.log('Cleared failed images cache');
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

    console.log('Checking image validity for student:', {
        imageId: student.imageId,
        imageUrl: student.imageUrl,
        hasValidImageId,
        hasValidImageUrl,
        isImageIdFailed: student.imageId ? failedImageIds.has(student.imageId) : false
    });

    return hasValidImageId || hasValidImageUrl;
}