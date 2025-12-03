'use server';

import { Client, Databases, Query } from 'node-appwrite';

interface Mentor {
  mentorId: string;
  name: string;
  email: string;
  department: string;
  school: string;
  phoneNumber?: string;
  officeLocation?: string;
  imageUrl?: string;
  imageId?: string;
  availableHours?: string[];
  expertise?: string[];
  isHOD?: boolean;
}

/**
 * Get mentor information for a student
 * @param studentId - The student's document ID
 * @returns Mentor information or null
 */
export async function getMentorForStudent(studentId: string): Promise<Mentor | null> {
  try {
    if (!studentId) {
      console.error('[getMentorForStudent] Student ID is required');
      return null;
    }

    console.log('[getMentorForStudent] Fetching mentor for student:', studentId);

    // 1. Get the mapping to find the faculty ID
    const mappingClient = new Client()
      .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL))
      .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID))
      .setKey(String(process.env.APPWRITE_MAPPING_API_KEY));

    const mappingDb = new Databases(mappingClient);

    const mappingResult = await mappingDb.listDocuments(
      String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_COLLECTION_ID),
      [Query.equal('studentId', studentId), Query.limit(1)]
    );

    if (mappingResult.documents.length === 0) {
      console.log('[getMentorForStudent] No mapping found for student:', studentId);
      return null;
    }

    const facultyId = mappingResult.documents[0].facultyId;
    console.log('[getMentorForStudent] Found faculty ID:', facultyId);

    // 2. Get the faculty information from the main project
    const mainClient = new Client()
      .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_URL))
      .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID))
      .setKey(String(process.env.APPWRITE_API_KEY));

    const mainDb = new Databases(mainClient);

    const facultyDoc = await mainDb.getDocument(
      String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
      facultyId
    );

    console.log('[getMentorForStudent] Found faculty:', facultyDoc.name);

    // Map faculty document to Mentor interface
    const mentor: Mentor = {
      mentorId: facultyDoc.$id,
      name: facultyDoc.name || 'Unknown',
      email: facultyDoc.email || '',
      department: facultyDoc.department || '',
      school: facultyDoc.school || '',
      phoneNumber: facultyDoc.phoneNumber,
      officeLocation: facultyDoc.seating,
      imageUrl: facultyDoc.imageUrl,
      imageId: facultyDoc.imageId,
      availableHours: facultyDoc.freeTimeSlots || [],
      expertise: facultyDoc.specialization ? facultyDoc.specialization.split(',').map((s: string) => s.trim()) : [],
      isHOD: facultyDoc.isHOD || false
    };

    return mentor;
  } catch (error) {
    console.error('[getMentorForStudent] Error:', error);
    return null;
  }
}
