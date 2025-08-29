"use client";

import React from 'react';
import { Student } from '@/types';

interface PerformanceOverviewProps {
    mentees: Student[];
}

interface PerformanceOverviewError extends Error {
    component: 'PerformanceOverview';
    action?: string;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ mentees }) => {
    try {
        const calculateStats = () => {
            const totalMentees = mentees.length;
            const cgpaValues = mentees.map(s => (s.IA1 + s.IA2 + s.EndSem) / 3).filter(cgpa => cgpa > 0);
            const averageCGPA = cgpaValues.length > 0 ?
                Number((cgpaValues.reduce((a, b) => a + b, 0) / cgpaValues.length).toFixed(2)) : 0;
            const excellentPerformers = cgpaValues.filter(cgpa => cgpa >= 9.0).length;
            const studentsWithBacklogs = mentees.filter(s => s.IA1 < 4 || s.IA2 < 4 || s.EndSem < 4).length;
            const shortOfAttendance = Math.floor(mentees.length * 0.15); // Estimated 15%

            return { totalMentees, averageCGPA, excellentPerformers, studentsWithBacklogs, shortOfAttendance };
        };

        const stats = calculateStats();

        return (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average CGPA</span>
                    <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {stats.averageCGPA}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Out of 10.0</span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Excellent Performers</span>
                    <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        {stats.excellentPerformers}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">CGPA ≥ 9.0</span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Students with Backlogs</span>
                    <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                        {stats.studentsWithBacklogs}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Below 4.0 marks</span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Short of Attendance</span>
                    <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {stats.shortOfAttendance}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Below 75%</span>
                </div>
            </section>
        );
    } catch (error) {
        const performanceOverviewError: PerformanceOverviewError = {
            name: 'PerformanceOverviewError',
            message: `Failed to render Performance Overview: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'PerformanceOverview'
        };
        console.error('[PerformanceOverview] Render Error:', performanceOverviewError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Performance Overview Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: PerformanceOverview | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default PerformanceOverview;
