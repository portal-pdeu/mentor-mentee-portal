// Simple debug script to check environment variables
console.log('Environment Variables Check:');
console.log('NEXT_PUBLIC_APPWRITE_URL:', process.env.NEXT_PUBLIC_APPWRITE_URL);
console.log('NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID:', process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID);
console.log('NEXT_PUBLIC_APPWRITE_DATABASE_ID:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
console.log('NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID:', process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID);

// Test image URL generation
if (process.env.NEXT_PUBLIC_APPWRITE_URL && process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID) {
    const testImageId = 'test123';
    const testUrl = `${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID}/files/${testImageId}/preview`;
    console.log('Test image URL would be:', testUrl);
} else {
    console.log('Missing required environment variables');
}
