"use server";

import studentServerServices from "@/backend-services/Student-server";
import facultyServerServices from "@/backend-services/Faculty-server";
import { Student, Faculty } from "@/types";

export async function getMenteesByMentorId(mentorId: string): Promise<Student[]> {
    try {
        const mentees = await studentServerServices.getStudentsByMentorId(mentorId);
        return mentees;
    } catch (error) {
        console.error("Error fetching mentees:", error);
        return [];
    }
}

export async function getAllStudents(): Promise<Student[]> {
    try {
        const students = await studentServerServices.getAllStudents();
        return students;
    } catch (error) {
        console.error("Error fetching all students:", error);
        return [];
    }
}

export async function getFacultyByDocId(docId: string): Promise<Faculty | null> {
    try {
        const faculty = await facultyServerServices.getFacultyByDocId(docId);
        return faculty;
    } catch (error) {
        console.error("Error fetching faculty data:", error);
        return null;
    }
}
