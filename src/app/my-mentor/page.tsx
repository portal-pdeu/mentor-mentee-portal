"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiMail, FiPhone, FiMapPin, FiClock, FiCalendar, FiUser } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/imageUtils";
import { getMentorForStudent } from "./actions";

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

export default function MyMentorPage() {
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchMentor = async () => {
            setLoading(true);
            try {
                if (user?.userId) {
                    console.log('[MyMentor] Fetching mentor for user:', user.userId);
                    const mentorData = await getMentorForStudent(user.userId);
                    console.log('[MyMentor] Received mentor:', mentorData);
                    setMentor(mentorData);
                } else {
                    console.log('[MyMentor] No user ID available');
                }
            } catch (error) {
                console.error("Error fetching mentor:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMentor();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                                    <div className="h-4 bg-gray-300 rounded w-36"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Here's an overview of your academic journey and mentor interactions.
                        </p>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current CGPA</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8.77</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mentor Status</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">Not Assigned</p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <FiUser className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Meetings</p>
                                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">0</p>
                                </div>
                                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                                    <FiCalendar className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <div className="p-8 text-center">
                            <div className="text-gray-500 dark:text-gray-400">
                                <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">No Mentor Assigned</h3>
                                <p>You haven't been assigned a mentor yet. Please contact the administration for assistance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's an overview of your academic journey and mentor interactions.
                    </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current CGPA</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8.77</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mentor Status</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Assigned</p>
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
                </div>

                {/* Mentor Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                                    {getInitials(mentor.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{mentor.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{mentor.department}, {mentor.school}</p>
                                {mentor.isHOD && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        Head of Department
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h3>

                                <div className="flex items-center gap-3">
                                    <FiMail className="text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{mentor.email}</p>
                                    </div>
                                </div>

                                {mentor.phoneNumber && (
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="text-green-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{mentor.phoneNumber}</p>
                                        </div>
                                    </div>
                                )}

                                {mentor.officeLocation && (
                                    <div className="flex items-center gap-3">
                                        <FiMapPin className="text-red-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Office</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{mentor.officeLocation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Available Hours */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Available Hours</h3>
                                <div className="space-y-2">
                                    {mentor.availableHours?.map((hour, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <FiClock className="text-purple-500" />
                                            <p className="font-medium text-gray-900 dark:text-white">{hour}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Expertise */}
                        {mentor.expertise && mentor.expertise.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Areas of Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.expertise.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <FiMail className="w-4 h-4" />
                                Send Email
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <FiCalendar className="w-4 h-4" />
                                Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}