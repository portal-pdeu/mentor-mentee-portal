"use client";

import React from 'react';
import { Student } from '@/types';
import { FiUsers } from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentImageUrl, getInitials, hasValidImage } from '@/lib/imageUtils';

interface ConsistentPerformersProps {
    mentees: Student[];
}

interface ConsistentPerformersError extends Error {
    component: 'ConsistentPerformers';
    action?: string;
}

const ConsistentPerformers: React.FC<ConsistentPerformersProps> = ({ mentees }) => {
    try {
        const getConsistentPerformers = () => {
            return mentees
                .filter(s => s.IA1 > 0 && s.IA2 > 0 && s.EndSem > 0)
                .sort((a, b) => {
                    const aConsistency = Math.min(a.IA1, a.IA2, a.EndSem);
                    const bConsistency = Math.min(b.IA1, b.IA2, b.EndSem);
                    return bConsistency - aConsistency;
                })
                .slice(0, 3);
        };

        const consistentPerformers = getConsistentPerformers();

        return (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <FiUsers className="text-green-600" />
                    Top 3 Consistent Performers
                </h3>
                <div className="space-y-4">
                    {consistentPerformers.map((student, index) => {
                        const minScore = Math.min(student.IA1, student.IA2, student.EndSem);
                        const avgScore = (student.IA1 + student.IA2 + student.EndSem) / 3;
                        const consistencyPercentage = ((minScore / avgScore) * 100).toFixed(0);

                        return (
                            <div key={student.studentId} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <Avatar className="h-10 w-10 rounded-full">
                                        {hasValidImage(student) && (
                                            <AvatarImage
                                                src={getStudentImageUrl(student.imageId!)}
                                                alt={`${student.name}'s profile picture`}
                                                className="object-cover rounded-full"
                                                onLoad={() => console.log('Analytics Consistent: Image loaded for:', student.name)}
                                                onError={(e) => {
                                                    console.log('Analytics Consistent: Image failed for:', student.name);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        {student.imageUrl && !hasValidImage(student) && (
                                            <AvatarImage
                                                src={student.imageUrl}
                                                alt={`${student.name}'s profile picture`}
                                                className="object-cover rounded-full"
                                                onLoad={() => console.log('Analytics Consistent: Direct imageUrl loaded for:', student.name)}
                                                onError={(e) => {
                                                    console.log('Analytics Consistent: Direct imageUrl failed for:', student.name);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <AvatarFallback className="rounded-full text-white text-sm font-bold bg-gradient-to-br from-green-500 to-emerald-500">
                                            {getInitials(student.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Avg: {avgScore.toFixed(2)} | Lowest: {minScore} | Consistency: {consistencyPercentage}%
                                    </p>
                                </div>
                                <div className="text-green-600 dark:text-green-400">
                                    <span className="text-sm font-medium">⭐ Consistent</span>
                                </div>
                            </div>
                        );
                    })}
                    {consistentPerformers.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FiUsers className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            <p>No assessment data available yet.</p>
                            <p className="text-sm">Performance tracking will appear once students have assessment scores.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        const consistentPerformersError: ConsistentPerformersError = {
            name: 'ConsistentPerformersError',
            message: `Failed to render Consistent Performers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'ConsistentPerformers'
        };
        console.error('[ConsistentPerformers] Render Error:', consistentPerformersError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Consistent Performers Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: ConsistentPerformers | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default ConsistentPerformers;
