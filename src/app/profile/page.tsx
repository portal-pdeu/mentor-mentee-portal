"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { Faculty, Student } from "@/types";
import profileService from "@/services/profileService";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AcademicInformation from "@/components/profile/AcademicInformation";
import ContactInformation from "@/components/profile/ContactInformation";
import AvailableHours from "@/components/profile/AvailableHours";
import OfficeLocation from "@/components/profile/OfficeLocation";
import QuickActions from "@/components/profile/QuickActions";
import StudentProfile from "@/components/profile/StudentProfile";

interface ProfilePageError extends Error {
    component: 'ProfilePage';
    action?: string;
}

const ProfilePage: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [facultyData, setFacultyData] = useState<Faculty | null>(null);
    const [studentData, setStudentData] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const isFaculty = user?.type === "Faculty";
    const isStudent = user?.labels?.includes("Student");

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const loadUserData = async (): Promise<void> => {
            if (!isHydrated || !user?.userId) {
                setLoading(false);
                return;
            }

            try {
                if (isFaculty) {
                    console.log('[ProfilePage] Loading faculty data for userId:', user.userId);
                    const data = await profileService.fetchFacultyData(user.userId);
                    setFacultyData(data);
                    console.log('[ProfilePage] Faculty data loaded successfully');
                } else if (isStudent) {
                    console.log('[ProfilePage] Loading student data for userId:', user.userId);
                    // For now, create mock student data. In real implementation, fetch from API
                    const mockStudentData: Student = {
                        studentId: user.userId,
                        name: user.name || "Student Name",
                        email: user.email || "",
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
                    console.log('[ProfilePage] Student data loaded successfully');
                }
            } catch (error) {
                const profilePageError: ProfilePageError = {
                    name: 'ProfilePageError',
                    message: `Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    component: 'ProfilePage',
                    action: 'loadUserData'
                };
                console.error('[ProfilePage] loadFacultyData Error:', profilePageError);

                // Don't throw here, just log the error and continue with null data
                // The components will handle null data gracefully
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [isHydrated, user?.userId, isFaculty, isStudent]);

    // Show loading skeleton during hydration to prevent mismatch
    if (!isHydrated) {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-background text-foreground">
                    <div className="flex flex-col w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
                        <header className="mb-8">
                            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                        </header>
                        <LoadingSpinner
                            message="Initializing..."
                            size="md"
                            className="py-12"
                        />
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    // Authorization check (only after hydration)
    if (!isFaculty && !isStudent) {
        return (
            <ErrorBoundary>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold">Unauthorized</h1>
                    <p className="text-lg">You are not authorized to view this page.</p>
                </div>
            </ErrorBoundary>
        );
    }

    try {
        return (
            <ErrorBoundary>
                <div className="min-h-screen bg-background text-foreground">
                    <div className="flex flex-col w-full max-w-6xl mx-auto py-10 px-4 md:px-8">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold">
                                {isStudent ? "Student Profile" : "Faculty Profile"}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base">
                                View and manage your profile information
                            </p>
                        </header>

                        {/* Loading State */}
                        {loading && (
                            <LoadingSpinner
                                message="Loading profile..."
                                size="md"
                                className="py-12"
                            />
                        )}

                        {/* Student Profile */}
                        {!loading && isStudent && studentData && (
                            <StudentProfile student={studentData} />
                        )}

                        {/* Faculty Profile Content */}
                        {!loading && isFaculty && (
                            <div className="max-w-5xl mx-auto">
                                <ErrorBoundary>
                                    <ProfileHeader
                                        facultyData={facultyData}
                                        userName={user?.name}
                                        userType={user?.type}
                                        isHOD={user?.isHOD}
                                    />
                                </ErrorBoundary>

                                <ErrorBoundary>
                                    <AcademicInformation facultyData={facultyData} />
                                </ErrorBoundary>

                                <ErrorBoundary>
                                    <ContactInformation
                                        facultyData={facultyData}
                                        userEmail={user?.email}
                                    />
                                </ErrorBoundary>

                                <ErrorBoundary>
                                    <AvailableHours facultyData={facultyData} />
                                </ErrorBoundary>

                                <ErrorBoundary>
                                    <OfficeLocation facultyData={facultyData} />
                                </ErrorBoundary>

                                <ErrorBoundary>
                                    <QuickActions />
                                </ErrorBoundary>
                            </div>
                        )}
                    </div>
                </div>
            </ErrorBoundary>
        );
    } catch (error) {
        const profilePageError: ProfilePageError = {
            name: 'ProfilePageError',
            message: `Failed to render ProfilePage: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'ProfilePage'
        };
        console.error('[ProfilePage] Render Error:', profilePageError);

        // This will be caught by the outer ErrorBoundary
        throw profilePageError;
    }
};

export default ProfilePage;
