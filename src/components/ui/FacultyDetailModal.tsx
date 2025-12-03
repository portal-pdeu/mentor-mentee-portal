"use client";

import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Faculty } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentImageUrl, getFacultyImageUrl, getInitials } from '@/lib/imageUtils';
import { getFacultyByFacultyId } from '@/app/student-directory/actions';

interface FacultyDetailModalProps {
    facultyId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const FacultyDetailModal: React.FC<FacultyDetailModalProps> = ({ facultyId, isOpen, onClose }) => {
    const [faculty, setFaculty] = useState<Faculty | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && facultyId) {
            console.log(`🔍 Loading detailed faculty info for ID: ${facultyId}`);
            (async () => {
                setLoading(true);
                try {
                    const facultyData = await getFacultyByFacultyId(facultyId);
                    console.log(`📋 Loaded faculty details:`, facultyData);
                    setFaculty(facultyData);
                } catch (err) {
                    console.error('❌ Error loading faculty details:', err);
                    setFaculty(null);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setFaculty(null);
        }
    }, [isOpen, facultyId]);

    if (!facultyId) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Faculty Profile" size="lg">
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading faculty details...</span>
                    </div>
                ) : faculty ? (
                    <div className="space-y-6">
                        {/* Header with Photo and Basic Info */}
                        <div className="flex items-start gap-6">
                            <Avatar className="h-32 w-32 border-4 border-green-100 dark:border-green-800">
                                {(() => {
                                    const src = faculty.imageUrl ?? (faculty.imageId ? getFacultyImageUrl(faculty.imageId) : undefined);
                                    if (src) {
                                        return <AvatarImage src={src} alt={faculty.name} className="object-cover" />;
                                    }
                                    return (
                                        <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white text-3xl font-bold">
                                            {getInitials(faculty.name)}
                                        </AvatarFallback>
                                    );
                                })()}
                            </Avatar>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{faculty.name}</h2>
                                <div className="space-y-1">
                                    <p className="text-lg text-green-700 dark:text-green-400 font-medium">{faculty.designation}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{faculty.school}</p>
                                    {faculty.department && (
                                        <p className="text-gray-600 dark:text-gray-400">Department: {faculty.department}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <p className="text-gray-900 dark:text-gray-100">{faculty.email || 'Not available'}</p>
                                </div>
                                {faculty.phoneNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                        <p className="text-gray-900 dark:text-gray-100">{faculty.phoneNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Academic Information */}
                        {faculty.specialization && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Academic Information
                                </h3>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
                                    <p className="text-gray-900 dark:text-gray-100">{faculty.specialization}</p>
                                </div>
                            </div>
                        )}

                        {/* Office & Availability */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Office & Availability
                            </h3>
                            <div>
                                {faculty.seating && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Office Location</label>
                                        <p className="text-gray-900 dark:text-gray-100">{faculty.seating}</p>
                                    </div>
                                )}
                            </div>

                            {faculty.freeTimeSlots && faculty.freeTimeSlots.length > 0 && (
                                <div className="mt-3">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Time Slots</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {faculty.freeTimeSlots.map((slot, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                                            >
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Faculty not found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Unable to load faculty details.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default FacultyDetailModal;