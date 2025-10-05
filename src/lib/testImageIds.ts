/**
 * Test script to check available image IDs in Appwrite storage
 * Run this to see which images are actually available
 */

// Valid test image IDs that should work (update these based on your actual storage)
export const VALID_TEST_IMAGE_IDS = [
    "687f5a76003d44a72fa2", // TS 1 
    // Add more valid IDs here as you upload images to storage
];

// Use this for development when you need placeholder data
export const getValidTestImageId = (index: number = 0): string => {
    return VALID_TEST_IMAGE_IDS[index % VALID_TEST_IMAGE_IDS.length] || '';
};

// Mock student data with valid image IDs for testing
export const createMockStudentWithValidImage = (name: string, rollNo: string): any => ({
    studentId: `student_${Date.now()}`,
    name,
    email: `${rollNo.toLowerCase()}@pdpu.ac.in`,
    rollNo,
    imageUrl: "",
    imageId: getValidTestImageId(),
    mentorId: "",
    projectRequestStatus: "Pending",
    IA1: 8.5,
    IA2: 9.0,
    EndSem: 8.8,
    total: 0,
    school: "SOT",
    department: "CSE",
    password: "",
    phoneNumber: "+91 9876543210",
    fcmToken: []
});