import { Student, tokenInfo } from "@/types";
import {
  createAdminClient,
  createSessionClient,
} from "@/backend-services/config";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";

class StudentServerServices {
  async getStudentFCMTokens(studentId: string) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.getDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        studentId,
        [Query.select(["fcmToken"])]
      );

      if (response && response.fcmToken && Array.isArray(response.fcmToken)) {
        return response.fcmToken.map((token: string) => {
          const t = JSON.parse(token);
          const tokenInfo: tokenInfo = {
            name: t.name || "",
            token: t.token || "",
            timeStamp: t.timeStamp || new Date(),
          };
          return tokenInfo;
        });
      }
      return [];
    } catch (error) {
      console.error("Get Student FCM Tokens Error:", error);
      return [];
    }
  }

  async getStudentById(studentId: string) {
    try {
      if (!studentId || studentId.trim() === "") {
        console.warn(
          "Get Student By ID: studentId is required and cannot be empty"
        );
        return null;
      }

      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");
      if (!sessionCookie?.value) {
        return;
      }
      const { databases } = await createSessionClient(sessionCookie.value);

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        [Query.equal("studentId", studentId)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        const student: Student = {
          studentId: doc.studentId,
          name: doc.name,
          email: doc.email,
          rollNo: doc.rollNo,
          imageUrl: doc.imageUrl,
          imageId: doc.imageId,
          projectRequestStatus: doc.projectRequestStatus,
          IA1: doc.IA1 || 0,
          IA2: doc.IA2 || 0,
          EndSem: doc.EndSem || 0,
          total: 0,
          school: doc.school || "",
          department: doc.department || "",
          password: doc.password || "",
          phoneNumber: doc.phoneNumber || "",
          fcmToken: doc.fcmToken || [],
        };
        return student;
      }
      return null;
    } catch (error) {
      console.error("Get Student By ID Error:", error);
      return null;
    }
  }
  async getStudentPasswordByEmailId(studentEmailId: string) {
    try {
      if (!studentEmailId || studentEmailId.trim() === "") {
        console.warn(
          "Get Student By ID: studentEmailId is required and cannot be empty"
        );
        return null;
      }

      const { databases } = await createAdminClient();

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        [Query.equal("email", studentEmailId), Query.select(["password"])]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        const student = {
          password: doc.password,
        };
        return student;
      }
      return null;
    } catch (error) {
      console.error("Get Student By ID Error:", error);
      return null;
    }
  }

  async getAllStudents() {
    try {
      const { databases } = await createAdminClient();

      let allStudents: Student[] = [];
      let offset = 0;
      const limit = 100;
      let hasMoreDocuments = true;

      while (hasMoreDocuments) {
        const response = await databases.listDocuments(
          String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
          [Query.limit(limit), Query.offset(offset)]
        );

        const students: Student[] = response.documents.map((student: any) => ({
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          rollNo: student.rollNo,
          imageUrl: student.imageUrl,
          imageId: student.imageId,
          projectRequestStatus: student.projectRequestStatus,
          IA1: student.IA1 || 0,
          IA2: student.IA2 || 0,
          EndSem: student.EndSem || 0,
          total: 0,
          school: student.school || "",
          department: student.department || "",
          password: student.password || "",
          phoneNumber: student.phoneNumber || "",
          fcmToken: student.fcmToken || [],
        }));

        allStudents = [...allStudents, ...students];

        if (response.documents.length < limit) {
          hasMoreDocuments = false;
        } else {
          offset += limit;
        }
      }

      console.log(`Retrieved ${allStudents.length} students in total`);
      return allStudents;
    } catch (error) {
      console.error("Get All Students Error:", error);
      return [];
    }
  }

  async uploadStudentProfilePicture(file: File, fileId: string, docId: string) {
    try {
      const { storage, databases } = await createAdminClient();
      const bucketId = String(
        process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID
      );

      const result = await storage.createFile(bucketId, fileId, file);
      await this.updateStudentProfileImageId(docId, fileId);

      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  async deleteStudentProfilePicture(fileId: string) {
    try {
      const { storage } = await createAdminClient();
      const bucketId = String(
        process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID
      );

      const result = await storage.deleteFile(bucketId, fileId);
      return result;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  getStudentFilePreviewUrl(fileId: string) {
    const bucketId = String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_BUCKET_ID);
    return `${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${bucketId}/files/${fileId}/preview`;
  }

  async updateStudentProfilePicture(docId: string, imageUrl: string) {
    try {
      const { databases } = await createAdminClient();

      const result = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        docId,
        { imageUrl: imageUrl }
      );

      return result;
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    }
  }

  async updateStudentProfileImageId(docId: string, imageId: string) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        docId,
        { imageId }
      );
      return response;
    } catch (error) {
      console.error("Update Profile Image ID Error:", error);
      return null;
    }
  }

  async setStudentRequestStatus(
    docId: string,
    status:
      | "Pending"
      | "Accepted"
      | "Rejected"
      | "TeammateRejected"
      | "NoRequest"
      | "Waiting"
      | "TeamPending"
  ) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        docId,
        { projectRequestStatus: status }
      );
      return response;
    } catch (error) {
      console.error("Set Student Request Status Error:", error);
      return null;
    }
  }

  async getStudentByRollNumber(rollNumber: string) {
    try {
      if (!rollNumber || rollNumber.trim() === "") {
        console.warn(
          "Get Student By Roll Number: rollNumber is required and cannot be empty"
        );
        return null;
      }

      const { databases } = await createAdminClient();

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        [Query.equal("rollNo", rollNumber)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const student = response.documents[0];
      return {
        name: student.name,
        rollNo: student.rollNo,
        image: student.imageUrl,
        documentId: student.$id,
        userId: student.studentId,
        projectRequestStatus: student.projectRequestStatus,
        fcmToken: student.fcmToken || [],
      };
    } catch (error) {
      console.error("Error fetching student by roll number:", error);
      throw error;
    }
  }

  async updateStudentInfo(studentId: string, studentData: Partial<Student>) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        studentId,
        studentData
      );
      return response;
    } catch (error) {
      console.error("Error updating student info:", error);
      throw error;
    }
  }

  async getStudentsByMentorId(mentorId: string) {
    try {
      if (!mentorId || mentorId.trim() === "") {
        console.warn("Get Students By Mentor ID: mentorId is required and cannot be empty");
        return [];
      }

      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");
      if (!sessionCookie?.value) {
        return [];
      }
      const { databases } = await createSessionClient(sessionCookie.value);

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_STUDENT_COLLECTION_ID),
        [Query.equal("mentorId", mentorId)]
      );

      const students: Student[] = response.documents.map((student: any) => ({
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        imageUrl: student.imageUrl,
        imageId: student.imageId,
        projectRequestStatus: student.projectRequestStatus,
        IA1: student.IA1 || 0,
        IA2: student.IA2 || 0,
        EndSem: student.EndSem || 0,
        total: 0,
        school: student.school || "",
        department: student.department || "",
        password: student.password || "",
        phoneNumber: student.phoneNumber || "",
        fcmToken: student.fcmToken || [],
      }));

      return students;
    } catch (error) {
      console.error("Get Students By Mentor ID Error:", error);
      return [];
    }
  }
}

const studentServerServices = new StudentServerServices();
export default studentServerServices;