"use client";

import React, { useState, useEffect } from "react";
import { FiEdit, FiMail, FiPhone, FiUser, FiBook, FiCalendar, FiTrendingUp, FiMapPin } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getStudentImageUrl, getInitials, hasValidImage } from "@/lib/imageUtils";
import { Student } from "@/types";

interface StudentProfileProps {
    student: Student;
    onEdit?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState<Student>(student);

    const calculateCGPA = () => {
        return ((student.IA1 + student.IA2 + student.EndSem) / 3).toFixed(2);
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 9) return "text-green-600 dark:text-green-400";
        if (grade >= 8) return "text-blue-600 dark:text-blue-400";
        if (grade >= 7) return "text-yellow-600 dark:text-yellow-400";
        if (grade >= 6) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted":
                return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
            case "Pending":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
            case "Rejected":
                return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
            default:
                return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                        <Avatar className="h-32 w-32 rounded-full">
                            {hasValidImage(student) && (
                                <AvatarImage
                                    src={getStudentImageUrl(student.imageId!)}
                                    alt={`${student.name}'s profile picture`}
                                    className="object-cover rounded-full"
                                />
                            )}
                            <AvatarFallback className="rounded-full text-white font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                                {getInitials(student.name)}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200">
                            <FiEdit className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {student.name}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            {student.rollNo}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.projectRequestStatus)}`}>
                                Project: {student.projectRequestStatus}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                CGPA: {calculateCGPA()}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                                <FiMail className="h-4 w-4" />
                                <span>{student.email}</span>
                            </div>
                            {student.phoneNumber && (
                                <div className="flex items-center space-x-2">
                                    <FiPhone className="h-4 w-4" />
                                    <span>{student.phoneNumber}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <FiBook className="h-4 w-4" />
                                <span>{student.school} - {student.department}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                        <FiEdit className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Academic Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FiTrendingUp className="h-5 w-5 mr-2" />
                        Academic Performance
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Internal Assessment 1</p>
                                <p className={`text-2xl font-bold ${getGradeColor(student.IA1)}`}>
                                    {student.IA1}/10
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                                <p className={`text-lg font-semibold ${getGradeColor(student.IA1)}`}>
                                    {student.IA1 >= 9 ? 'A+' : student.IA1 >= 8 ? 'A' : student.IA1 >= 7 ? 'B+' : student.IA1 >= 6 ? 'B' : 'C'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Internal Assessment 2</p>
                                <p className={`text-2xl font-bold ${getGradeColor(student.IA2)}`}>
                                    {student.IA2}/10
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                                <p className={`text-lg font-semibold ${getGradeColor(student.IA2)}`}>
                                    {student.IA2 >= 9 ? 'A+' : student.IA2 >= 8 ? 'A' : student.IA2 >= 7 ? 'B+' : student.IA2 >= 6 ? 'B' : 'C'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">End Semester</p>
                                <p className={`text-2xl font-bold ${getGradeColor(student.EndSem)}`}>
                                    {student.EndSem}/10
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                                <p className={`text-lg font-semibold ${getGradeColor(student.EndSem)}`}>
                                    {student.EndSem >= 9 ? 'A+' : student.EndSem >= 8 ? 'A' : student.EndSem >= 7 ? 'B+' : student.EndSem >= 6 ? 'B' : 'C'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">Overall CGPA</p>
                                <p className={`text-3xl font-bold ${getGradeColor(parseFloat(calculateCGPA()))}`}>
                                    {calculateCGPA()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <FiUser className="h-5 w-5 mr-2" />
                        Personal Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student ID</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.studentId}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Roll Number</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.rollNo}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.email}</p>
                        </div>

                        {student.phoneNumber && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                                <p className="text-gray-900 dark:text-white font-medium">{student.phoneNumber}</p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">School</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.school}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Department</label>
                            <p className="text-gray-900 dark:text-white font-medium">{student.department}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentor Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    Mentor Information
                </h2>

                {student.mentorId ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16 rounded-full">
                                <AvatarFallback className="rounded-full text-white font-semibold text-lg bg-gradient-to-br from-green-500 to-emerald-600">
                                    TF
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Dr. Test Faculty
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">Computer Science Department</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    📧 test.faculty@sot.pdpu.ac.in
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Contact Mentor
                            </button>
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Schedule Meeting
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FiUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No mentor assigned yet. You will be notified once a mentor is assigned to you.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200 text-left">
                        <FiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Schedule Meeting</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Book a session with your mentor</p>
                    </button>

                    <button className="p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors duration-200 text-left">
                        <FiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">View Progress</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track your academic journey</p>
                    </button>

                    <button className="p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200 text-left">
                        <FiEdit className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Update Profile</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Edit your personal information</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;