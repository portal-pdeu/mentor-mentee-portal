"use client";

import React from 'react';
import { Student } from '@/types';
import { FiCalendar } from 'react-icons/fi';

interface AcademicProgressProps {
    mentees: Student[];
}

interface AcademicProgressError extends Error {
    component: 'AcademicProgress';
    action?: string;
}

const AcademicProgress: React.FC<AcademicProgressProps> = ({ mentees }) => {
    try {
        const calculateAverages = () => {
            const totalStudents = mentees.length;

            if (totalStudents === 0) {
                return { ia1Average: "0.0", ia2Average: "0.0", endSemAverage: "0.0" };
            }

            const ia1Average = (mentees.reduce((sum, s) => sum + s.IA1, 0) / totalStudents).toFixed(1);
            const ia2Average = (mentees.reduce((sum, s) => sum + s.IA2, 0) / totalStudents).toFixed(1);
            const endSemAverage = (mentees.reduce((sum, s) => sum + s.EndSem, 0) / totalStudents).toFixed(1);

            return { ia1Average, ia2Average, endSemAverage };
        };

        const averages = calculateAverages();

        return (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <FiCalendar className="text-indigo-600" />
                    Academic Progress Overview
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">IA1 Average</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {averages.ia1Average}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">First Assessment</div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">IA2 Average</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {averages.ia2Average}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Second Assessment</div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">EndSem Average</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {averages.endSemAverage}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Final Assessment</div>
                        </div>
                    </div>

                    {/* Progress Trend Indicator */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Overall Trend</div>
                                <div className={`text-lg font-semibold ${parseFloat(averages.endSemAverage) > parseFloat(averages.ia1Average)
                                        ? 'text-green-600 dark:text-green-400'
                                        : parseFloat(averages.endSemAverage) < parseFloat(averages.ia1Average)
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                    {parseFloat(averages.endSemAverage) > parseFloat(averages.ia1Average)
                                        ? '📈 Improving'
                                        : parseFloat(averages.endSemAverage) < parseFloat(averages.ia1Average)
                                            ? '📉 Declining'
                                            : '📊 Stable'
                                    }
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Change (IA1 → EndSem)</div>
                                <div className={`text-lg font-semibold ${parseFloat(averages.endSemAverage) > parseFloat(averages.ia1Average)
                                        ? 'text-green-600 dark:text-green-400'
                                        : parseFloat(averages.endSemAverage) < parseFloat(averages.ia1Average)
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {parseFloat(averages.endSemAverage) > parseFloat(averages.ia1Average) ? '+' : ''}
                                    {(parseFloat(averages.endSemAverage) - parseFloat(averages.ia1Average)).toFixed(1)} points
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        const academicProgressError: AcademicProgressError = {
            name: 'AcademicProgressError',
            message: `Failed to render Academic Progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'AcademicProgress'
        };
        console.error('[AcademicProgress] Render Error:', academicProgressError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Academic Progress Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: AcademicProgress | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default AcademicProgress;
