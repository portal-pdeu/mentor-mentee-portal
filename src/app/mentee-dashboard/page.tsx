// Mentee Dashboard Page (for Student)
"use client";

import { useAppSelector } from "@/GlobalRedux/hooks";
import { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiBookOpen, FiTrendingUp, FiMail, FiPhone, FiAward, FiClock, FiMessageCircle } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getStudentImageUrl, getInitials, hasValidImage } from "@/lib/imageUtils";
import { Student } from "@/types";
import { getMentorForStudent } from "@/app/my-mentor/actions";

interface Mentor {
    mentorId: string;
    name: string;
    email: string;
    department: string;
    school: string;
    phoneNumber?: string;
    officeLocation?: string;
    imageUrl?: string;
    imageId?: string;
    availableHours?: string[];
    expertise?: string[];
    isHOD?: boolean;
}

export default function MenteeDashboard() {
    const user = useAppSelector((state) => state.auth.user);
    const [isClient, setIsClient] = useState(false);
    const [studentData, setStudentData] = useState<Student | null>(null);
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        if (user?.userId) {
            fetchStudentData();
        }
    }, [user]);

    const fetchStudentData = async () => {
        try {
            // In a real implementation, you'd fetch this from your API
            // For now, I'll create mock data based on the user
            const mockStudentData: Student = {
                studentId: user?.userId || "",
                name: user?.name || "Student Name",
                email: user?.email || "",
                rollNo: "22BCP001", // This should come from the database
                imageUrl: "",
                imageId: "", // This should come from the database
                mentorId: "faculty_123", // This should come from the database
                projectRequestStatus: "Accepted",
                IA1: 8.5,
                IA2: 9.0,
                EndSem: 8.8,
                total: 0,
                school: "SOT",
                department: "CSE",
                password: "",
                phoneNumber: "+91 9876543210",
                fcmToken: []
            };

            setStudentData(mockStudentData);

            // Fetch mentor information
            if (user?.userId) {
                const mentorData = await getMentorForStudent(user.userId);
                console.log('[MenteeDashboard] Fetched mentor:', mentorData);
                setMentor(mentorData);
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return <div className="min-h-screen bg-background text-foreground" />;
    }

    const isStudent = user?.labels && user.labels.includes("Student");

    if (!isStudent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-lg">You are not authorized to view this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const calculateCGPA = () => {
        if (studentData) {
            return ((studentData.IA1 + studentData.IA2 + studentData.EndSem) / 3).toFixed(2);
        }
        return "0.00";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {studentData?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's an overview of your academic journey and mentor interactions.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current CGPA</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculateCGPA()}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mentor Status</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {mentor ? "Assigned" : "Pending"}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <FiUser className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Meetings</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Project Status</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {studentData?.projectRequestStatus || "None"}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <FiBookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                My Profile
                            </h2>

                            <div className="text-center mb-6">
                                <Avatar className="h-24 w-24 mx-auto mb-4 rounded-full">
                                    {hasValidImage(studentData) && (
                                        <AvatarImage
                                            src={getStudentImageUrl(studentData!.imageId!)}
                                            alt={`${studentData?.name}'s profile picture`}
                                            className="object-cover rounded-full"
                                        />
                                    )}
                                    <AvatarFallback className="rounded-full text-white font-semibold text-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                                        {getInitials(studentData?.name || "")}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {studentData?.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{studentData?.rollNo}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{studentData?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiPhone className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{studentData?.phoneNumber}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FiBookOpen className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{studentData?.school} - {studentData?.department}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* My Mentor & Recent Meetings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* My Mentor */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                My Mentor
                            </h2>

                            {mentor ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-12 w-12 rounded-full">
                                            <AvatarFallback className="rounded-full text-white font-semibold bg-gradient-to-br from-green-500 to-emerald-600">
                                                {getInitials(mentor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {mentor.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">{mentor.department}, {mentor.school}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                            <FiMessageCircle className="h-4 w-4 inline mr-2" />
                                            Message
                                        </button>
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                            <FiCalendar className="h-4 w-4 inline mr-2" />
                                            Schedule
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No mentor assigned yet. You will be notified once a mentor is assigned.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Recent Meetings */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Recent Meetings
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <FiCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Weekly Progress Review</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tomorrow at 2:00 PM</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                                        Upcoming
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <FiCalendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Project Discussion</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday at 11:00 AM</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                                        Completed
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                                View All Meetings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
