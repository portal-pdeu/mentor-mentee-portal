"use client";

import React from 'react';
import { Faculty } from '@/types';
import { FiMapPin } from 'react-icons/fi';

interface OfficeLocationProps {
    facultyData: Faculty | null;
}

interface OfficeLocationError extends Error {
    component: 'OfficeLocation';
    action?: string;
}

const OfficeLocation: React.FC<OfficeLocationProps> = ({ facultyData }) => {
    try {
        return (
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
        );
    } catch (error) {
        const officeLocationError: OfficeLocationError = {
            name: 'OfficeLocationError',
            message: `Failed to render OfficeLocation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'OfficeLocation'
        };
        console.error('[OfficeLocation] Render Error:', officeLocationError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Office Location Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: OfficeLocation | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default OfficeLocation;
