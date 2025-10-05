"use server";

import studentServerServices from "@/backend-services/Student-server";
import facultyServerServices from "@/backend-services/Faculty-server";
import { Student, Faculty } from "@/types";

/**
 * Fetch all students for the student directory
 * Accessible by both Faculty and Student roles
 */
export async function getAllStudents(): Promise<Student[]> {
    try {
        const students = await studentServerServices.getAllStudents();
        return students;
    } catch (error) {
        console.error("Error fetching all students:", error);
        return [];
    }
}

/**
 * Fetch faculty information by document ID
 * Used to get mentor details for students
 */
export async function getFacultyByDocId(docId: string): Promise<Faculty | null> {
    try {
        const faculty = await facultyServerServices.getFacultyByDocId(docId);
        return faculty;
    } catch (error) {
        console.error("Error fetching faculty data:", error);
        return null;
    }
}

/**
 * Search students by various criteria
 * Accessible by both Faculty and Student roles
 */
export async function searchStudents(searchTerm: string): Promise<Student[]> {
    try {
        const allStudents = await studentServerServices.getAllStudents();

        if (!searchTerm.trim()) {
            return allStudents;
        }

        const filtered = allStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.school.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    } catch (error) {
        console.error("Error searching students:", error);
        return [];
    }
}