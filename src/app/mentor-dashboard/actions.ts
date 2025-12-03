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

export async function getRandomStudentsWithImages(count: number = 8): Promise<Student[]> {
    try {
        const allStudents = await studentServerServices.getAllStudents();
        
        // Filter students who have imageId (meaning they have profile pictures)
        const studentsWithImages = allStudents.filter(student => 
            student.imageId && student.imageId.trim() !== ''
        );

        // Shuffle the array
        const shuffled = studentsWithImages.sort(() => Math.random() - 0.5);
        
        // Return first 'count' students
        return shuffled.slice(0, count);
    } catch (error) {
        console.error("Error fetching random students with images:", error);
        return [];
    }
}
