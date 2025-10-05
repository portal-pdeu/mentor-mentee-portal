import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/backend-services/config';
import { ImageGravity } from 'node-appwrite';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 });
        }

        const { storage } = await createAdminClient();
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID;

        if (!bucketId) {
            return NextResponse.json({ error: 'Storage bucket not configured' }, { status: 500 });
        }

        // Get the file preview
        const result = await storage.getFilePreview(bucketId, fileId, 200, 200, ImageGravity.Center, 80);

        // Return the image data
        const response = new NextResponse(result);
        response.headers.set('Content-Type', 'image/jpeg');
        response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

        return response;
    } catch (error: any) {
        console.error('Error fetching profile picture:', error);

        // Handle specific file not found error
        if (error.code === 404 || error.type === 'storage_file_not_found') {
            return NextResponse.json({
                error: 'Profile picture not found',
                code: 'FILE_NOT_FOUND'
            }, { status: 404 });
        }

        // Handle other errors
        return NextResponse.json({
            error: 'Failed to fetch profile picture',
            code: 'FETCH_ERROR'
        }, { status: 500 });
    }
}
