"use client";

import React from 'react';
import { Student } from '@/types';
import { FiBarChart2 } from 'react-icons/fi';

interface PerformanceDistributionProps {
    mentees: Student[];
}

interface PerformanceDistributionError extends Error {
    component: 'PerformanceDistribution';
    action?: string;
}

const PerformanceDistribution: React.FC<PerformanceDistributionProps> = ({ mentees }) => {
    try {
        const getPerformanceDistribution = () => {
            const distinction = mentees.filter(s => {
                const cgpa = (s.IA1 + s.IA2 + s.EndSem) / 3;
                return cgpa >= 8.0;
            }).length;

            const firstClass = mentees.filter(s => {
                const cgpa = (s.IA1 + s.IA2 + s.EndSem) / 3;
                return cgpa >= 7.0 && cgpa < 8.0;
            }).length;

            const secondClass = mentees.filter(s => {
                const cgpa = (s.IA1 + s.IA2 + s.EndSem) / 3;
                return cgpa >= 6.0 && cgpa < 7.0;
            }).length;

            return { distinction, firstClass, secondClass };
        };

        const distribution = getPerformanceDistribution();

        return (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <FiBarChart2 className="text-blue-600" />
                    Performance Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {distribution.distinction}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Distinction (8.0+)</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {distribution.firstClass}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">First Class (7.0-8.0)</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {distribution.secondClass}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Second Class (6.0-7.0)</div>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        const performanceDistributionError: PerformanceDistributionError = {
            name: 'PerformanceDistributionError',
            message: `Failed to render Performance Distribution: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'PerformanceDistribution'
        };
        console.error('[PerformanceDistribution] Render Error:', performanceDistributionError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Performance Distribution Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: PerformanceDistribution | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default PerformanceDistribution;
