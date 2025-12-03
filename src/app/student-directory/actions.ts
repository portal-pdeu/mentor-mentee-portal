"use server";

import studentServerServices from "@/backend-services/Student-server";
import facultyServerServices from "@/backend-services/Faculty-server";
import { Student, Faculty } from "@/types";
import { Client, Databases, Query } from 'node-appwrite';

/**
 * Fetch all students for the student directory
 * Accessible by both Faculty and Student roles
 */
export async function getAllStudents(): Promise<Student[]> {
    try {
        const students = await studentServerServices.getAllStudents();
        return students;
    } catch (error) {
        console.error("Error fetching all students:", error);
        return [];
    }
}

/**
 * Fetch faculty information by document ID
 * Used to get mentor details for students
 */
export async function getFacultyByDocId(docId: string): Promise<Faculty | null> {
    try {
        const faculty = await facultyServerServices.getFacultyByDocId(docId);
        return faculty;
    } catch (error) {
        console.error("Error fetching faculty data:", error);
        return null;
    }
}

/**
 * Fetch faculty information by facultyId attribute
 * Used to get mentor details from mentorId field
 */
export async function getFacultyByFacultyId(facultyId: string): Promise<Faculty | null> {
    try {
        const faculty = await facultyServerServices.getFacultyById(facultyId);
        return faculty || null;
    } catch (error) {
        console.error("Error fetching faculty by facultyId:", error);
        return null;
    }
}

/**
 * Search students by various criteria
 * Accessible by both Faculty and Student roles
 */
export async function searchStudents(searchTerm: string): Promise<Student[]> {
    try {
        const allStudents = await studentServerServices.getAllStudents();

        if (!searchTerm.trim()) {
            return allStudents;
        }

        const filtered = allStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.school.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    } catch (error) {
        console.error("Error searching students:", error);
        return [];
    }
}

/**
 * Fetch all faculties for the faculty directory
 * Accessible by both Faculty and Student roles
 */
export async function getAllFaculties(): Promise<Faculty[]> {
    try {
        const faculties = await facultyServerServices.getAllfaculties();
        return faculties;
    } catch (error) {
        console.error("Error fetching all faculties:", error);
        return [];
    }
}

/**
 * Fetch student->faculty mapping from the cloud mapping project
 * Returns an object where keys are studentId and values are facultyId
 */
export async function getStudentFacultyMapping(): Promise<Record<string, string>> {
    try {
        // Use node-appwrite to connect to the mapping project (cloud)
        const client = new Client()
            .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL))
            .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID))
            .setKey(String(process.env.APPWRITE_MAPPING_API_KEY));

        const databases = new Databases(client);

        const limit = 100;
        let offset = 0;
        const map: Record<string, string> = {};

        while (true) {
            const res = await databases.listDocuments(
                String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID),
                String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_COLLECTION_ID),
                [Query.limit(limit), Query.offset(offset)]
            );

            for (const doc of res.documents) {
                if (doc.studentId && doc.facultyId) {
                    map[doc.studentId] = doc.facultyId;
                }
            }

            if (res.documents.length < limit) break;
            offset += limit;
        }

        return map;
    } catch (err) {
        console.error('Error fetching mapping collection:', err);
        return {};
    }
}

/**
 * Fetch facultyId assigned to a given student from the cloud mapping collection
 */
export async function getFacultyForStudent(studentId: string): Promise<string | null> {
    try {
        const client = new Client()
            .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL))
            .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID))
            .setKey(String(process.env.APPWRITE_MAPPING_API_KEY));

        const databases = new Databases(client);

        const res = await databases.listDocuments(
            String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_COLLECTION_ID),
            [Query.equal('studentId', studentId), Query.limit(1)]
        );

        if (res.documents.length > 0 && res.documents[0].facultyId) {
            return res.documents[0].facultyId;
        }

        return null;
    } catch (err) {
        console.error('Error fetching faculty for student:', err);
        return null;
    }
}

/**
 * Given a facultyId, return an array of full Student objects who are mapped to this faculty
 * This reads the mapping collection in the mapping project to find student document ids, then
 * fetches those student documents from the main Appwrite project.
 * If no results found with facultyId, tries with nameId as fallback.
 */
export async function getMenteesForFaculty(facultyId: string): Promise<Student[]> {
    try {
        console.log(`📋 Fetching mentees for faculty: ${facultyId}`);

        // First, get the faculty info to have both facultyId and nameId
        const facultyInfo = await getFacultyByFacultyId(facultyId);
        const nameId = facultyInfo?.nameId;

        console.log(`📋 Faculty info: ${facultyInfo?.name} (facultyId: ${facultyId}, nameId: ${nameId})`);

        // 1) query mapping project for entries with this facultyId
        const mappingClient = new Client()
            .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL))
            .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID))
            .setKey(String(process.env.APPWRITE_MAPPING_API_KEY));

        const mappingDb = new Databases(mappingClient);

        const limit = 100;
        let offset = 0;
        let studentDocIds: string[] = [];

        // Try with facultyId first
        console.log(`🔍 Searching with facultyId: ${facultyId}`);
        while (true) {
            const res = await mappingDb.listDocuments(
                String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID),
                String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_COLLECTION_ID),
                [Query.equal('facultyId', facultyId), Query.limit(limit), Query.offset(offset)]
            );

            console.log(`📋 Query result for facultyId ${facultyId}: ${res.documents.length} documents found`);

            for (const doc of res.documents) {
                if (doc.studentId) {
                    studentDocIds.push(doc.studentId);
                    console.log(`   ✓ Found student mapping: ${doc.studentId} -> ${facultyId}`);
                }
            }

            if (res.documents.length < limit) break;
            offset += limit;
        }

        // If no results with facultyId and we have nameId, try with nameId
        if (studentDocIds.length === 0 && nameId) {
            console.log(`🔍 No results with facultyId, trying with nameId: ${nameId}`);
            offset = 0;

            while (true) {
                const res = await mappingDb.listDocuments(
                    String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID),
                    String(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_COLLECTION_ID),
                    [Query.equal('facultyId', nameId), Query.limit(limit), Query.offset(offset)]
                );

                console.log(`📋 Query result for nameId ${nameId}: ${res.documents.length} documents found`);

                for (const doc of res.documents) {
                    if (doc.studentId) {
                        studentDocIds.push(doc.studentId);
                        console.log(`   ✓ Found student mapping with nameId: ${doc.studentId} -> ${nameId}`);
                    }
                }

                if (res.documents.length < limit) break;
                offset += limit;
            }
        }

        console.log(`📍 Found ${studentDocIds.length} student mappings for faculty ${facultyId}`);

        if (studentDocIds.length === 0) return [];

        // 2) fetch student documents from main project using admin key
        const client = new Client()
            .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_URL))
            .setProject(String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID))
            .setKey(String(process.env.APPWRITE_API_KEY));

        const db = new Databases(client);

        const mentees: Student[] = [];
        // Use Promise.all but limit concurrency to avoid large parallel calls; simple sequential is fine here
        for (const docId of studentDocIds) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const studentDoc = await db.getDocument(
                    String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
                    String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
                    String(docId)
                ) as any;

                // Map to proper Student object structure
                const student: Student = {
                    name: studentDoc.name || '',
                    rollNo: studentDoc.rollNo || '',
                    email: studentDoc.email || '',
                    studentId: studentDoc.studentId || '',
                    department: studentDoc.department || '',
                    school: studentDoc.school || '',
                    imageUrl: studentDoc.imageUrl || '',
                    imageId: studentDoc.imageId || '',
                    IA1: studentDoc.IA1 || 0,
                    IA2: studentDoc.IA2 || 0,
                    EndSem: studentDoc.EndSem || 0,
                    mentorId: studentDoc.mentorId || '',
                    password: studentDoc.password || '',
                    projectRequestStatus: studentDoc.projectRequestStatus || 'NoRequest',
                    phoneNumber: studentDoc.phoneNumber || '',
                    fcmToken: studentDoc.fcmToken || [],
                };

                mentees.push(student);
            } catch (err) {
                // ignore missing student documents
                console.warn('Failed to fetch student doc for id', docId, (err as Error)?.message || err);
            }
        }

        console.log(`✅ Successfully fetched ${mentees.length} mentees for faculty ${facultyId}`);
        return mentees;
    } catch (err) {
        console.error('❌ Error fetching mentees for faculty:', err);
        return [];
    }
}