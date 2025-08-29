"use client";

import React from 'react';
import { Student } from '@/types';
import { FiBarChart2 } from 'react-icons/fi';
import PerformanceOverview from './PerformanceOverview';
import StudentAchievements from './StudentAchievements';
import PerformanceDistribution from './PerformanceDistribution';
import ConsistentPerformers from './ConsistentPerformers';
import MostImprovedStudents from './MostImprovedStudents';
import AcademicProgress from './AcademicProgress';

interface AnalyticsDashboardProps {
    mentees: Student[];
}

interface AnalyticsDashboardError extends Error {
    component: 'AnalyticsDashboard';
    action?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ mentees }) => {
    try {
        // Remove the loading check here since the parent already handles loading
        // The parent will not render this component until loading is complete

        if (!mentees || mentees.length === 0) {
            return (
                <div className="space-y-8">
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                        <FiBarChart2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Analytics Data Available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            No mentees assigned yet. Once students are assigned, their performance analytics will appear here.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Performance Overview Stats */}
                <PerformanceOverview mentees={mentees} />

                {/* Performance Distribution Chart */}
                <PerformanceDistribution mentees={mentees} />

                {/* Student Achievements */}
                <StudentAchievements mentees={mentees} />

                {/* Top 3 Consistent Performers */}
                <ConsistentPerformers mentees={mentees} />

                {/* Most Improved Students */}
                <MostImprovedStudents mentees={mentees} />

                {/* Academic Progress Timeline */}
                <AcademicProgress mentees={mentees} />
            </div>
        );
    } catch (error) {
        const analyticsDashboardError: AnalyticsDashboardError = {
            name: 'AnalyticsDashboardError',
            message: `Failed to render Analytics Dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'AnalyticsDashboard'
        };
        console.error('[AnalyticsDashboard] Render Error:', analyticsDashboardError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Analytics Dashboard Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: AnalyticsDashboard | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default AnalyticsDashboard;
