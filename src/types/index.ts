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
  mentorId?: string; // Add mentorId to link student with faculty mentor
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

// Meeting interfaces
export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  meetingUrl: string;
  meetingPassword?: string;
  purpose: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  mentorId: string;
  mentorName: string;
  invitedStudents: InvitedStudent[];
  createdAt: string;
  updatedAt: string;
}

export interface InvitedStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  rollNo: string;
  responseStatus: 'pending' | 'accepted' | 'declined';
  joinedAt?: string;
}

export interface CreateMeetingData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  meetingUrl: string;
  meetingPassword?: string;
  purpose: string;
  invitedStudentIds: string[];
}

export type tokenInfo = {
  name: string;
  token: string;
  timeStamp: number;
};