import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/backend-services/config';
import studentServerServices from '@/backend-services/Student-server';
import facultyServerServices from '@/backend-services/Faculty-server';
import { Query } from 'node-appwrite';

// Helper function to get student by email
async function getStudentByEmail(email: string) {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
      [Query.equal("email", email)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting student by email:', error);
    return null;
  }
}

// Helper function to get faculty by email
async function getFacultyByEmail(email: string) {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
      [Query.equal("email", email)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting faculty by email:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    const sessionValue = sessionCookie.value;

    // Check if it's a custom session (Base64 encoded with our format)
    if (sessionValue.startsWith('custom_')) {
      try {
        const customSessionData = sessionValue.replace('custom_', '');
        const decodedData = JSON.parse(Buffer.from(customSessionData, 'base64').toString());

        // Validate session structure
        if (!decodedData.email || !decodedData.type || !decodedData.userId) {
          return NextResponse.json({ error: 'Invalid session format' }, { status: 401 });
        }

        // Verify user still exists in database
        let userData = null;
        if (decodedData.type === 'Student') {
          userData = await getStudentByEmail(decodedData.email);
        } else if (decodedData.type === 'Faculty') {
          userData = await getFacultyByEmail(decodedData.email);
        }

        if (!userData) {
          return NextResponse.json({ error: 'User not found in database' }, { status: 401 });
        }

        // Return user data for Redux
        return NextResponse.json({
          user: {
            userId: decodedData.userId,
            name: decodedData.name,
            email: decodedData.email,
            type: decodedData.type,
            isHOD: decodedData.isHOD || false,
            labels: decodedData.labels || [],
            facultyData: decodedData.type === 'Faculty' ? userData : null,
            studentData: decodedData.type === 'Student' ? userData : null,
          },
          valid: true
        });

      } catch (error) {
        console.error('Error validating custom session:', error);
        return NextResponse.json({ error: 'Invalid custom session' }, { status: 401 });
      }
    }

    // Handle regular Appwrite sessions
    try {
      const { account } = await createAdminClient();

      // Try to get user from Appwrite session
      const appwriteUser = await account.get();

      if (!appwriteUser) {
        return NextResponse.json({ error: 'Invalid Appwrite session' }, { status: 401 });
      }

      // Get additional user data from database based on email
      let userData = null;
      let userType = 'Admin';

      // Check if user is Faculty
      try {
        userData = await getFacultyByEmail(appwriteUser.email);
        if (userData) {
          userType = 'Faculty';
        }
      } catch (error) {
        // Not a faculty, check if student
        try {
          userData = await getStudentByEmail(appwriteUser.email);
          if (userData) {
            userType = 'Student';
          }
        } catch (error) {
          // Default to Admin if not found in Faculty or Student collections
          userType = 'Admin';
        }
      }

      return NextResponse.json({
        user: {
          userId: appwriteUser.$id,
          name: appwriteUser.name,
          email: appwriteUser.email,
          type: userType,
          isHOD: userData?.isHOD || false,
          labels: appwriteUser.labels || [],
          facultyData: userType === 'Faculty' ? userData : null,
          studentData: userType === 'Student' ? userData : null,
        },
        valid: true
      });

    } catch (error) {
      console.error('Error validating Appwrite session:', error);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}