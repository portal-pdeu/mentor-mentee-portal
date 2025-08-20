import { Faculty, tokenInfo } from "@/types";
import {
  createAdminClient,
  createSessionClient,
} from "@/backend-services/config";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";

class FacultyServerServices {
  // Profile Picture Methods
  async uploadProfilePicture(file: File, fileId: string, docId: string) {
    try {
      const { storage, databases } = await createAdminClient();
      const bucketId = String(
        process.env.NEXT_PUBLIC_APPWRITE_FACULTY_BUCKET_ID
      );

      const result = await storage.createFile(bucketId, fileId, file);
      await this.updateProfileImageId(docId, fileId);

      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  getFilePreviewUrl(fileId: string) {
    // This would need to be called from client-side or return the URL construction
    const bucketId = String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_BUCKET_ID);
    return `${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${bucketId}/files/${fileId}/preview`;
  }

  // Update faculty profile with new image URL
  async updateFacultyProfilePicture(docId: string, imageUrl: string) {
    try {
      const { databases } = await createAdminClient();

      const result = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        docId,
        { imageUrl: imageUrl }
      );

      return result;
    } catch (error) {
      console.error("Error updating faculty profile:", error);
      throw error;
    }
  }

  // Delete a profile picture from Appwrite bucket
  async deleteProfilePicture(fileId: string) {
    try {
      const { storage } = await createAdminClient();
      const bucketId = String(
        process.env.NEXT_PUBLIC_APPWRITE_FACULTY_BUCKET_ID
      );

      const result = await storage.deleteFile(bucketId, fileId);
      return result;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  async updateProfileImageId(docId: string, imageId: string) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        docId,
        { imageId }
      );
      return response;
    } catch (error) {
      console.error("Update Profile Image ID Error:", error);
      return null;
    }
  }

  async getFacultyFCMTokens(facultyId: string) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.getDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        facultyId,
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
      console.error("Get Faculty FCM Tokens Error:", error);
      return [];
    }
  }

  async getFacultyByDocId(docId: string) {
    try {
      if (!docId || docId.trim() === "") {
        console.warn(
          "Get Faculty By Doc ID: docId is required and cannot be empty"
        );
        return null;
      }

      const { databases } = await createAdminClient();

      const response = await databases.getDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        docId
      );

      const faculty: Faculty = {
        facultyId: response.facultyId,
        nameId: response.nameId,
        name: response.name,
        email: response.email,
        designation: response.designation,
        specialization: response.specialization,
        imageUrl: response.imageUrl,
        imageId: response.imageId,
        school: response.school,
        department: response.department,
        projectCount: response.projectCount,
        password: response.password,
        seating: response.seating || "",
        freeTimeSlots: response.freeTimeSlots || [],
        phoneNumber: response.phoneNumber || "",
        fcmToken: response.fcmToken || [],
        preferredMoM: response.preferredMoM || "Offline",
      };
      return faculty;
    } catch (error) {
      console.error("Get Faculty By Doc ID Error:", error);
      return null;
    }
  }

  async getFacultyDetailsByNameId(nameId: string) {
    try {
      if (!nameId || nameId.trim() === "") {
        console.warn(
          "Get Faculty Details By Name ID: nameId is required and cannot be empty"
        );
        return null;
      }

      const { databases } = await createAdminClient();

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        [Query.equal("nameId", nameId)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        const faculty: Faculty = {
          facultyId: doc.facultyId,
          nameId: doc.nameId,
          name: doc.name,
          email: doc.email,
          designation: doc.designation,
          specialization: doc.specialization,
          imageUrl: doc.imageUrl,
          imageId: doc.imageId,
          school: doc.school,
          department: doc.department,
          projectCount: doc.projectCount,
          password: doc.password,
          seating: doc.seating,
          freeTimeSlots: doc.freeTimeSlots,
          phoneNumber: doc.phoneNumber,
          fcmToken: doc.fcmToken || [],
          preferredMoM: doc.preferredMoM || "Offline",
        };
        return faculty;
      }
      return null;
    } catch (error) {
      console.error("Get Faculty Details By Name ID Error:", error);
      return null;
    }
  }

  async getFacultyById(facultyId: string) {
    try {
      if (!facultyId || facultyId.trim() === "") {
        console.warn(
          "Get Faculty By ID: facultyId is required and cannot be empty"
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
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        [Query.equal("facultyId", facultyId)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        const faculty: Faculty = {
          facultyId: doc.facultyId,
          nameId: doc.nameId,
          name: doc.name,
          email: doc.email,
          designation: doc.designation,
          specialization: doc.specialization,
          imageUrl: doc.imageUrl,
          imageId: doc.imageId,
          school: doc.school,
          department: doc.department,
          projectCount: doc.projectCount,
          password: doc.password,
          seating: doc.seating,
          freeTimeSlots: doc.freeTimeSlots,
          phoneNumber: doc.phoneNumber,
          fcmToken: doc.fcmToken || [],
          preferredMoM: doc.preferredMoM || "Offline",
        };
        return faculty;
      }
      return null;
    } catch (error) {
      console.error("Get Faculty By ID Error:", error);
      return null;
    }
  }
  async getFacultyPasswordByEmailId(facultyEmailId: string) {
    try {
      if (!facultyEmailId || facultyEmailId.trim() === "") {
        console.warn(
          "Get Faculty By ID: facultyEmailId is required and cannot be empty"
        );
        return null;
      }

      const { databases } = await createAdminClient();

      const response = await databases.listDocuments(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        [Query.equal("email", facultyEmailId), Query.select(["password"])]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        const faculty = {
          password: doc.password,
        };
        return faculty;
      }
      return null;
    } catch (error) {
      console.error("Get Faculty By ID Error:", error);
      return null;
    }
  }

  async getAllfaculties() {
    try {
      const { databases } = await createAdminClient();

      let allFaculties: Faculty[] = [];
      let offset = 0;
      const limit = 100;
      let hasMoreDocuments = true;

      while (hasMoreDocuments) {
        const response = await databases.listDocuments(
          String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
          [Query.orderAsc("name"), Query.limit(limit), Query.offset(offset)]
        );

        const faculties: Faculty[] = response.documents.map((faculty: any) => ({
          facultyId: faculty.facultyId,
          nameId: faculty.nameId,
          name: faculty.name,
          email: faculty.email,
          designation: faculty.designation,
          specialization: faculty.specialization,
          imageUrl: faculty.imageUrl,
          imageId: faculty.imageId,
          school: faculty.school,
          department: faculty.department,
          projectCount: faculty.projectCount,
          password: faculty.password,
          seating: faculty.seating || "",
          freeTimeSlots: faculty.freeTimeSlots || [],
          phoneNumber: faculty.phoneNumber || "",
          fcmToken: faculty.fcmToken || [],
          preferredMoM: faculty.preferredMoM || "Offline",
        }));

        allFaculties = [...allFaculties, ...faculties];

        if (response.documents.length < limit) {
          hasMoreDocuments = false;
        } else {
          offset += limit;
        }
      }

      console.log(`Retrieved ${allFaculties.length} faculty members in total`);
      return allFaculties;
    } catch (error: any) {
      console.error("Get All Faculties Error:", error);
      return [];
    }
  }

  async updateFacultyInfo(facultyId: string, data: Partial<Faculty>) {
    try {
      const { databases } = await createAdminClient();

      const response = await databases.updateDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_FACULTY_COLLECTION_ID),
        facultyId,
        data
      );
      return response;
    } catch (error) {
      console.error("Error updating faculty info:", error);
      throw error;
    }
  }
}

const facultyServerServices = new FacultyServerServices();
export default facultyServerServices;