"use server";

import { Client, Databases, Storage, ID, Query } from 'node-appwrite';
import { StudentDocument } from '@/types';

const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL as string)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID as string)
        .setKey(process.env.APPWRITE_MAPPING_API_KEY as string);

    return {
        databases: new Databases(client),
        storage: new Storage(client),
    };
};

/**
 * Upload a document file to Appwrite Storage
 */
export async function uploadDocumentFile(formData: FormData): Promise<{ fileId: string; fileUrl: string } | null> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            throw new Error('No file provided');
        }

        const { storage } = await createAdminClient();
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_BUCKET_ID as string;

        console.log('📤 Uploading file:', file.name, 'Size:', file.size, 'to bucket:', bucketId);

        // Upload file to Appwrite Storage
        const uploadedFile = await storage.createFile(
            bucketId,
            ID.unique(),
            file
        );

        console.log('✅ File uploaded successfully:', uploadedFile.$id);

        // Get file URL
        const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_MAPPING_URL}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_MAPPING_PROJECT_ID}`;

        return {
            fileId: uploadedFile.$id,
            fileUrl
        };
    } catch (error) {
        console.error('❌ Error uploading document file:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
    }
}

/**
 * Create a document record in the database
 */
export async function createDocumentRecord(documentData: Omit<StudentDocument, '$id'>): Promise<StudentDocument | null> {
    try {
        const { databases } = await createAdminClient();

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID as string;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENT_COLLECTION_ID || 'document';

        console.log('📝 Creating document record in DB:', dbId, 'Collection:', collectionId);
        console.log('Document data:', JSON.stringify(documentData, null, 2));

        const document = await databases.createDocument(
            dbId,
            collectionId,
            ID.unique(),
            documentData
        );

        console.log('✅ Document record created:', document.$id);
        return document as unknown as StudentDocument;
    } catch (error) {
        console.error('❌ Error creating document record:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
    }
}

/**
 * Get documents uploaded by a specific student
 */
export async function getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
    try {
        const { databases } = await createAdminClient();

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID as string;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENT_COLLECTION_ID || 'document';

        const response = await databases.listDocuments(
            dbId,
            collectionId,
            [
                Query.equal('studentId', studentId),
                Query.orderDesc('uploadDate')
            ]
        );

        return response.documents as unknown as StudentDocument[];
    } catch (error) {
        console.error('Error fetching student documents:', error);
        return [];
    }
}

/**
 * Get all documents uploaded by mentees of a specific mentor
 */
export async function getMentorMenteeDocuments(mentorId: string): Promise<StudentDocument[]> {
    try {
        const { databases } = await createAdminClient();

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID as string;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENT_COLLECTION_ID || 'document';

        const response = await databases.listDocuments(
            dbId,
            collectionId,
            [
                Query.equal('mentorId', mentorId),
                Query.orderDesc('uploadDate'),
                Query.limit(100)
            ]
        );

        return response.documents as unknown as StudentDocument[];
    } catch (error) {
        console.error('Error fetching mentor mentee documents:', error);
        return [];
    }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
    documentId: string,
    status: string
): Promise<boolean> {
    try {
        const { databases } = await createAdminClient();

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID as string;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENT_COLLECTION_ID || 'document';

        await databases.updateDocument(
            dbId,
            collectionId,
            documentId,
            { status }
        );

        return true;
    } catch (error) {
        console.error('Error updating document status:', error);
        return false;
    }
}

/**
 * Delete a document (file and record)
 */
export async function deleteDocument(documentId: string, fileId: string): Promise<boolean> {
    try {
        const { databases, storage } = await createAdminClient();

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_DATABASE_ID as string;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENT_COLLECTION_ID || 'document';
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_MAPPING_BUCKET_ID as string;

        // Delete from storage
        await storage.deleteFile(bucketId, fileId);

        // Delete from database
        await databases.deleteDocument(dbId, collectionId, documentId);

        return true;
    } catch (error) {
        console.error('Error deleting document:', error);
        return false;
    }
}
