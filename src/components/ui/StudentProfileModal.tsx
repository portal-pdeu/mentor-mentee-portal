"use client";

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBook, FiAward, FiUserCheck, FiCalendar } from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Modal from './Modal';
import { Student, Faculty } from '@/types';
import { getStudentImageUrl, getInitials } from '@/lib/imageUtils';
import { getFacultyByFacultyId, getFacultyForStudent } from '@/app/student-directory/actions';

interface StudentProfileModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, isOpen, onClose }) => {
    const [mentor, setMentor] = useState<Faculty | null>(null);
    const [mentorLoading, setMentorLoading] = useState(false);

    useEffect(() => {
        // When modal opens, fetch mapping (student -> faculty) from cloud mapping project
        // then fetch faculty details by facultyId attribute. This avoids requiring a
        // mentorId field on the Student collection.
        if (isOpen && student) {
            (async () => {
                setMentorLoading(true);
                try {
                    // 1) ask mapping project for facultyId for this student
                    const facultyId = await getFacultyForStudent(student.studentId || (student as any).$id);
                    if (!facultyId) {
                        setMentor(null);
                        return;
                    }

                    // 2) fetch faculty details by facultyId attribute
                    const mentorData = await getFacultyByFacultyId(facultyId);
                    setMentor(mentorData);
                } catch (error) {
                    console.error('Error loading mentor info for student:', error);
                    setMentor(null);
                } finally {
                    setMentorLoading(false);
                }
            })();
        } else {
            setMentor(null);
        }
    }, [isOpen, student]);

    if (!student) {
        return null;
    }

    // Calculate CGPA
    const cgpa = student.IA1 && student.IA2 && student.EndSem
        ? Number(((student.IA1 + student.IA2 + student.EndSem) / 3).toFixed(2))
        : 0;

    // Determine current year based on roll number (you may need to adjust this logic)
    const getCurrentYear = (rollNo: string) => {
        // This is a basic implementation - adjust based on your roll number format
        const currentYear = new Date().getFullYear();
        const rollYear = parseInt(rollNo.substring(0, 2)) + 2000;
        const yearDiff = currentYear - rollYear;

        if (yearDiff >= 0 && yearDiff <= 3) {
            return `${yearDiff + 1}${getOrdinalSuffix(yearDiff + 1)} Year`;
        }
        return "Final Year";
    };

    const getOrdinalSuffix = (num: number) => {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return "st";
        if (j === 2 && k !== 12) return "nd";
        if (j === 3 && k !== 13) return "rd";
        return "th";
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Student Profile"
            size="lg"
        >
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Profile Picture */}
                    <div className="flex justify-center md:justify-start">
                        <Avatar className="h-32 w-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-800">
                            {student.imageId && student.imageId.trim() !== '' && student.imageId !== 'undefined' ? (
                                <AvatarImage
                                    src={getStudentImageUrl(student.imageId)}
                                    alt={`${student.name}'s profile picture`}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            ) : student.imageUrl && student.imageUrl.trim() !== '' && student.imageUrl !== 'undefined' ? (
                                <AvatarImage
                                    src={student.imageUrl}
                                    alt={`${student.name}'s profile picture`}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-3xl rounded-full flex items-center justify-center">
                                {getInitials(student.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {student.name}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                {student.rollNo}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                {student.department}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                                {student.school}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FiUser className="w-5 h-5" />
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FiMail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {student.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <FiPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {student.phoneNumber || "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FiBook className="w-5 h-5" />
                            Academic Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <FiCalendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Year</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {getCurrentYear(student.rollNo)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <FiAward className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Semester CGPA</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {cgpa > 0 ? cgpa : "Not available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Information */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FiUserCheck className="w-5 h-5" />
                            Mentor Information
                        </h3>
                        {mentorLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-500">Loading mentor details...</span>
                            </div>
                        ) : mentor ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <FiUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {mentor.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                        <FiPhone className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Contact</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {mentor.phoneNumber || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                        <FiMail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mentor Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {mentor.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                        <FiBook className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {mentor.department}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : student.mentorId ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Unable to load mentor details
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No mentor assigned
                            </p>
                        )}
                    </div>

                    {/* Academic Performance (if available) */}
                    {(student.IA1 > 0 || student.IA2 > 0 || student.EndSem > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FiAward className="w-5 h-5" />
                                Academic Performance
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {student.IA1 > 0 && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">IA1</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            {student.IA1}
                                        </p>
                                    </div>
                                )}
                                {student.IA2 > 0 && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">IA2</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            {student.IA2}
                                        </p>
                                    </div>
                                )}
                                {student.EndSem > 0 && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">End Sem</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                            {student.EndSem}
                                        </p>
                                    </div>
                                )}
                                {cgpa > 0 && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {cgpa}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default StudentProfileModal;
