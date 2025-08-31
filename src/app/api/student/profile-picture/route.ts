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
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 404 });
    }
}
