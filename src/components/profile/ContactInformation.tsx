"use client";

import React from 'react';
import { Faculty } from '@/types';
import { FiMail, FiUser } from 'react-icons/fi';

interface ContactInformationProps {
    facultyData: Faculty | null;
    userEmail?: string;
}

interface ContactInformationError extends Error {
    component: 'ContactInformation';
    action?: string;
}

const ContactInformation: React.FC<ContactInformationProps> = ({
    facultyData,
    userEmail
}) => {
    try {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FiMail className="text-blue-600" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                {facultyData?.email || userEmail || "faculty@pdeu.ac.in"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                            <FiUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                {facultyData?.phoneNumber || "+91 9876543210"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        const contactError: ContactInformationError = {
            name: 'ContactInformationError',
            message: `Failed to render ContactInformation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'ContactInformation'
        };
        console.error('[ContactInformation] Render Error:', contactError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Contact Information Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: ContactInformation | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default ContactInformation;
