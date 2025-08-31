/**
 * Utility functions for handling student profile images
 */

/**
 * Generates the API URL for a student's profile image from their imageId
 */
export function getStudentImageUrl(imageId: string): string {
    if (!imageId || imageId.trim() === '' || imageId === 'undefined') {
        console.warn('Invalid imageId provided:', imageId);
        return '';
    }

    // Use the API route to fetch images
    const url = `/api/student/profile-picture?fileId=${imageId}`;
    console.log('Generated API image URL:', url, 'for imageId:', imageId);
    return url;
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
        student.imageId !== 'null');

    const hasValidImageUrl = !!(student.imageUrl &&
        student.imageUrl.trim() !== '' &&
        student.imageUrl !== 'undefined' &&
        student.imageUrl !== 'null');

    console.log('Checking image validity for student:', {
        imageId: student.imageId,
        imageUrl: student.imageUrl,
        hasValidImageId,
        hasValidImageUrl
    });

    return hasValidImageId || hasValidImageUrl;
}