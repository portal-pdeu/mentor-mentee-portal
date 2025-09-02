"use client";

import React from 'react';
import { Student } from '@/types';
import { FiAward } from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentImageUrl, getInitials, hasValidImage } from '@/lib/imageUtils';

interface StudentAchievementsProps {
    mentees: Student[];
}

interface StudentAchievementsError extends Error {
    component: 'StudentAchievements';
    action?: string;
}

const StudentAchievements: React.FC<StudentAchievementsProps> = ({ mentees }) => {
    try {
        const getTopPerformers = () => {
            return mentees
                .filter(s => (s.IA1 + s.IA2 + s.EndSem) / 3 >= 9.0)
                .sort((a, b) => {
                    const aCgpa = (a.IA1 + a.IA2 + a.EndSem) / 3;
                    const bCgpa = (b.IA1 + b.IA2 + b.EndSem) / 3;
                    return bCgpa - aCgpa;
                })
                .slice(0, 4);
        };

        const topPerformers = getTopPerformers();

        return (
            <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <FiAward className="text-yellow-600" />
                    Remarkable Achievements of Mentees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topPerformers.map((student) => (
                        <div
                            key={student.studentId}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
                        >
                            <Avatar className="h-12 w-12 rounded-full">
                                {hasValidImage(student) && (
                                    <AvatarImage
                                        src={getStudentImageUrl(student.imageId!)}
                                        alt={`${student.name}'s profile picture`}
                                        className="object-cover rounded-full"
                                        onLoad={() => console.log('Analytics Achievement: Image loaded for:', student.name)}
                                        onError={(e) => {
                                            console.log('Analytics Achievement: Image failed for:', student.name);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                {student.imageUrl && !hasValidImage(student) && (
                                    <AvatarImage
                                        src={student.imageUrl}
                                        alt={`${student.name}'s profile picture`}
                                        className="object-cover rounded-full"
                                        onLoad={() => console.log('Analytics Achievement: Direct imageUrl loaded for:', student.name)}
                                        onError={(e) => {
                                            console.log('Analytics Achievement: Direct imageUrl failed for:', student.name);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <AvatarFallback className="rounded-full text-white font-semibold bg-gradient-to-br from-yellow-500 to-orange-500">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Outstanding CGPA: {((student.IA1 + student.IA2 + student.EndSem) / 3).toFixed(2)}
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400">🏆 Top Performer</p>
                            </div>
                        </div>
                    ))}
                    {topPerformers.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                            <FiAward className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            <p>No students with CGPA ≥ 9.0 yet.</p>
                            <p className="text-sm">Keep encouraging your mentees!</p>
                        </div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        const studentAchievementsError: StudentAchievementsError = {
            name: 'StudentAchievementsError',
            message: `Failed to render Student Achievements: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'StudentAchievements'
        };
        console.error('[StudentAchievements] Render Error:', studentAchievementsError);

        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Student Achievements Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: StudentAchievements | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default StudentAchievements;
