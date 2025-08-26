"use client";

import { useAppSelector, useAppDispatch } from "@/GlobalRedux/hooks";
import { FiMail, FiLogOut, FiMapPin, FiUsers, FiBarChart2, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Faculty } from "@/types";
import { getFacultyByDocId } from "../mentor-dashboard/actions";
import { logout } from "@/GlobalRedux/authSlice";
import { logoutAction } from "@/app/login/actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [facultyData, setFacultyData] = useState<Faculty | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && user?.userId) {
            loadFacultyData();
        }
    }, [isClient, user]);

    const loadFacultyData = async () => {
        setLoading(true);
        try {
            if (user?.userId) {
                const faculty = await getFacultyByDocId(user.userId);
                setFacultyData(faculty);
            }
        } catch (error) {
            console.error("Error loading faculty data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutAction();
            dispatch(logout());
            router.push("/login");
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account.",
            });
        } catch (error) {
            toast({
                title: "Logout Failed",
                description: "An error occurred while logging out. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Helper function to get user initials for avatar fallback
    const getUserInitials = (fullName?: string) => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return <div className="min-h-screen bg-background text-foreground" />;
    }

    const isFaculty = user?.labels && user.labels.includes("Faculty");

    if (!isFaculty) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-lg">You are not authorized to view this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex flex-col w-full max-w-4xl mx-auto py-10 px-4 md:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Faculty Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base">View and manage your profile information</p>
                </header>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading profile...</span>
                    </div>
                )}

                {/* Profile Content */}
                {!loading && (
                    <div className="max-w-2xl mx-auto">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl shadow-sm p-8 mb-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Profile Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        {facultyData?.imageUrl ? (
                                            <img
                                                src={facultyData.imageUrl}
                                                alt={facultyData.name || user?.name}
                                                className="w-full h-full rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-2xl">
                                                {getUserInitials(facultyData?.name || user?.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {facultyData?.name || user?.name || "Faculty Name"}
                                    </h2>
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                        {facultyData?.designation || user?.type || "Faculty"}
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                            {facultyData?.department || "Department"}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                            {facultyData?.school || "School"}
                                        </span>
                                        {user?.isHOD && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                                HOD
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FiMail className="text-blue-600" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {facultyData?.email || user?.email || "faculty@pdeu.ac.in"}
                                        </p>
                                    </div>
                                </div>

                                {facultyData?.phoneNumber && (
                                    <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                            <FiUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                                {facultyData.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seating Arrangement */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FiMapPin className="text-purple-600" />
                                Office Location
                            </h3>
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                        <FiMapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {facultyData?.seating || "F-212"}
                                        </p>
                                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                                            F Block, 2nd Floor
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Faculty Building, PDEU Campus
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/mentor-dashboard")}
                                    className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">View My Mentees</span>
                                </button>

                                <button
                                    onClick={() => router.push("/student-directory")}
                                    className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiBarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">Student Directory</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiLogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <span className="text-red-700 dark:text-red-300 font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
