"use client";

import React from 'react';
import { Student } from '@/types';
import { FiTrendingUp } from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentImageUrl, getInitials, hasValidImage } from '@/lib/imageUtils';

interface MostImprovedStudentsProps {
    mentees: Student[];
}

interface MostImprovedStudentsError extends Error {
    component: 'MostImprovedStudents';
    action?: string;
}

const MostImprovedStudents: React.FC<MostImprovedStudentsProps> = ({ mentees }) => {
    try {
        const getMostImprovedStudents = () => {
            return mentees
                .filter(s => s.IA1 > 0 && s.IA2 > 0 && s.EndSem > 0)
                .sort((a, b) => {
                    const aImprovement = a.EndSem - a.IA1;
                    const bImprovement = b.EndSem - b.IA1;
                    return bImprovement - aImprovement;
                })
                .slice(0, 4);
        };

        const mostImprovedStudents = getMostImprovedStudents();

        return (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <FiTrendingUp className="text-purple-600" />
                    Most Improved Students
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mostImprovedStudents.map((student) => {
                        const improvement = student.EndSem - student.IA1;
                        return (
                            <div key={student.studentId} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg">
                                <Avatar className="h-12 w-12 rounded-full">
                                    {hasValidImage(student) && (
                                        <AvatarImage
                                            src={getStudentImageUrl(student.imageId!)}
                                            alt={`${student.name}'s profile picture`}
                                            className="object-cover rounded-full"
                                            onLoad={() => console.log('Analytics Improved: Image loaded for:', student.name)}
                                            onError={(e) => {
                                                console.log('Analytics Improved: Image failed for:', student.name);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {student.imageUrl && !hasValidImage(student) && (
                                        <AvatarImage
                                            src={student.imageUrl}
                                            alt={`${student.name}'s profile picture`}
                                            className="object-cover rounded-full"
                                            onLoad={() => console.log('Analytics Improved: Direct imageUrl loaded for:', student.name)}
                                            onError={(e) => {
                                                console.log('Analytics Improved: Direct imageUrl failed for:', student.name);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <AvatarFallback className="rounded-full text-white font-semibold bg-gradient-to-br from-purple-500 to-indigo-500">
                                        {getInitials(student.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        IA1: {student.IA1} → EndSem: {student.EndSem}
                                    </p>
                                    <p className={`text-xs font-medium ${improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {improvement > 0 ? '↗️' : '↘️'} {improvement > 0 ? '+' : ''}{improvement} points
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {mostImprovedStudents.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                            <FiTrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            <p>No assessment data available to track improvement.</p>
                            <p className="text-sm">Improvement tracking requires IA1 and EndSem scores.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        const mostImprovedStudentsError: MostImprovedStudentsError = {
            name: 'MostImprovedStudentsError',
            message: `Failed to render Most Improved Students: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'MostImprovedStudents'
        };
        console.error('[MostImprovedStudents] Render Error:', mostImprovedStudentsError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Most Improved Students Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: MostImprovedStudents | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default MostImprovedStudents;
