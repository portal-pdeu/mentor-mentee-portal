// Define Faculty interface
export interface Faculty {
  facultyId: string;
  nameId: string;
  name: string;
  email: string;
  designation: string;
  specialization?: string;
  imageUrl: string;
  imageId?: string;
  school: string;
  department: string;
  password: string;
  projectCount: number;
  seating?: string;
  freeTimeSlots?: string[];
  phoneNumber?: string;
  fcmToken?: string[];
  preferredMoM: "Online" | "Offline" | "Hybrid";
}

export type userType =
  | "All"
  | "Admin"
  | "Faculty"
  | "Student"
  | "SuperAdmin"
  | "Developer";

export type ImportedFacultytData = {
  Name: string;
  Email: string;
  Designation: string;
  School: string;
  Department: string;
};

export interface Student {
  studentId: string;
  name: string;
  email: string;
  rollNo: string;
  imageUrl: string;
  imageId: string;
  projectRequestStatus:
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "NoRequest"
    | "Waiting"
    | "TeamPending"
    | "TeammateRejected";
  IA1: number;
  IA2: number;
  EndSem: number;
  total?: number;
  school: string;
  department: string;
  password: string;
  phoneNumber?: string;
  fcmToken?: string[];
}

export type ImportedStudentData = {
  Name: string;
  Email: string;
  "Roll Number": string;
  School: string;
  Department: string;
};

// ProjectRequest interface
export interface ProjectRequest {
  id: string;
  studentName: string;
  studentRollNo: string;
  studentImage: string;
  studentDocId: string;
  projectTitle: string;
  projectType: "Major" | "Minor";
  motivation: string;
  appliedAt: string;
  status:
    | "NoRequest"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Waiting"
    | "TeamPending"
    | "TeammateRejected";
  projectIdeaId: string;
  facultyId: string;
  studentId: string;
  includeTeammate: boolean;
  teammateName?: string;
  teammateRollNo?: string;
  teammateImage?: string;
  teammateDocId?: string;
  teammateId?: string;
  teammateStatus?:
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "NoRequest"
    | "Waiting"
    | "TeamPending";
  teammateRequestMessage?: string;
  isActive: boolean;
}

// Project idea interface
export interface ProjectIdea {
  id: string;
  title: string;
  type: "Major" | "Minor";
  description: string;
  tags: string[];
  requirements: string;
  isActive: boolean;
  facultyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalData {
  ProjectSettingsChanged: string;
}

export type tokenInfo = {
  name: string;
  token: string;
  timeStamp: number;
};