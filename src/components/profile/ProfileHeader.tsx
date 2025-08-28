"use client";

import React from 'react';
import { Faculty } from '@/types';

interface ProfileHeaderProps {
    facultyData: Faculty | null;
    userName?: string;
    userType?: string;
    isHOD?: boolean;
}

interface ProfileHeaderError extends Error {
    component: 'ProfileHeader';
    action?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    facultyData,
    userName,
    userType,
    isHOD
}) => {
    const getUserInitials = (name?: string): string => {
        try {
            if (!name) return 'UN';
            return name
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
        } catch (error) {
            const profileError: ProfileHeaderError = {
                name: 'ProfileHeaderError',
                message: `Failed to generate user initials: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'ProfileHeader',
                action: 'getUserInitials'
            };
            console.error('[ProfileHeader] getUserInitials Error:', profileError);
            return 'UN'; // fallback
        }
    };

    try {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl shadow-sm p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Profile Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            {facultyData?.imageUrl ? (
                                <img
                                    src={facultyData.imageUrl}
                                    alt={facultyData.name || userName}
                                    className="w-full h-full rounded-2xl object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        console.warn('[ProfileHeader] Image load failed:', {
                                            imageUrl: facultyData.imageUrl,
                                            component: 'ProfileHeader'
                                        });
                                        target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="text-white font-bold text-2xl">
                                    {getUserInitials(facultyData?.name || userName)}
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
                            {facultyData?.name || userName || "Faculty Name"}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                            {facultyData?.designation || userType || "Faculty"}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                {facultyData?.department || "Department"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                {facultyData?.school || "School"}
                            </span>
                            {isHOD && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                    HOD
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        const profileError: ProfileHeaderError = {
            name: 'ProfileHeaderError',
            message: `Failed to render ProfileHeader: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'ProfileHeader'
        };
        console.error('[ProfileHeader] Render Error:', profileError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-8 mb-8">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Profile Header Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: ProfileHeader | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default ProfileHeader;
