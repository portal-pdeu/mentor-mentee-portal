"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { Faculty } from "@/types";
import profileService from "@/services/profileService";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AcademicInformation from "@/components/profile/AcademicInformation";
import ContactInformation from "@/components/profile/ContactInformation";
import AvailableHours from "@/components/profile/AvailableHours";
import OfficeLocation from "@/components/profile/OfficeLocation";
import QuickActions from "@/components/profile/QuickActions";

interface ProfilePageError extends Error {
    component: 'ProfilePage';
    action?: string;
}

const ProfilePage: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [facultyData, setFacultyData] = useState<Faculty | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const isFaculty = user?.type === "Faculty";

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const loadFacultyData = async (): Promise<void> => {
            if (!isHydrated || !isFaculty || !user?.userId) {
                setLoading(false);
                return;
            }

            try {
                console.log('[ProfilePage] Loading faculty data for userId:', user.userId);
                const data = await profileService.fetchFacultyData(user.userId);
                setFacultyData(data);
                console.log('[ProfilePage] Faculty data loaded successfully');
            } catch (error) {
                const profilePageError: ProfilePageError = {
                    name: 'ProfilePageError',
                    message: `Failed to load faculty data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    component: 'ProfilePage',
                    action: 'loadFacultyData'
                };
                console.error('[ProfilePage] loadFacultyData Error:', profilePageError);

                // Don't throw here, just log the error and continue with null data
                // The components will handle null data gracefully
            } finally {
                setLoading(false);
            }
        };

        loadFacultyData();
    }, [isHydrated, user?.userId, isFaculty]);

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
    if (!isFaculty) {
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
                            <h1 className="text-3xl font-bold">Faculty Profile</h1>
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

                        {/* Profile Content */}
                        {!loading && (
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
