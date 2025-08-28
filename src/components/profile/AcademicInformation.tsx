"use client";

import React from 'react';
import { Faculty } from '@/types';
import { FiUser, FiBarChart2 } from 'react-icons/fi';

interface AcademicInformationProps {
    facultyData: Faculty | null;
}

interface AcademicInformationError extends Error {
    component: 'AcademicInformation';
    action?: string;
}

const AcademicInformation: React.FC<AcademicInformationProps> = ({ facultyData }) => {
    try {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FiUser className="text-indigo-600" />
                    Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                <FiUser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Degree/Qualification</p>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">
                                    {facultyData?.designation || "Ph.D. in Computer Science"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                <FiBarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Areas of Expertise</p>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">
                                    {facultyData?.specialization || "Machine Learning, Data Science, Software Engineering"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        const academicError: AcademicInformationError = {
            name: 'AcademicInformationError',
            message: `Failed to render AcademicInformation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'AcademicInformation'
        };
        console.error('[AcademicInformation] Render Error:', academicError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Academic Information Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: AcademicInformation | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default AcademicInformation;
