"use client";

import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Faculty, Student } from '@/types';
import { getStudentImageUrl, getInitials } from '@/lib/imageUtils';
import { getMenteesForFaculty } from '@/app/student-directory/actions';
import StudentProfileModal from './StudentProfileModal';

interface MenteesModalProps {
    faculty: Faculty | null;
    isOpen: boolean;
    onClose: () => void;
}

const MenteesModal: React.FC<MenteesModalProps> = ({ faculty, isOpen, onClose }) => {
    const [mentees, setMentees] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentModalOpen, setStudentModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && faculty) {
            console.log(`🔍 Loading mentees for faculty: ${faculty.name} (ID: ${faculty.facultyId})`);
            (async () => {
                setLoading(true);
                try {
                    const list = await getMenteesForFaculty(faculty.facultyId);
                    console.log(`📊 Loaded ${list.length} mentees for ${faculty.name}:`, list.map(m => ({ name: m.name, rollNo: m.rollNo })));
                    setMentees(list || []);
                } catch (err) {
                    console.error('❌ Error loading mentees:', err);
                    setMentees([]);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setMentees([]);
        }
    }, [isOpen, faculty]);

    const openStudentModal = (student: Student) => {
        setSelectedStudent(student);
        setStudentModalOpen(true);
    };

    const closeStudentModal = () => {
        setStudentModalOpen(false);
        setSelectedStudent(null);
    };

    if (!faculty) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Mentees of ${faculty.name}`} size="lg">
                <div className="p-6">
                    {/* Faculty Brief Header */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                            {getInitials(faculty.name)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{faculty.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{faculty.designation} • {faculty.school}</p>
                        </div>
                    </div>

                    {/* Mentees List */}
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Mentees ({mentees.length})
                        </h4>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading mentees...</span>
                            </div>
                        ) : mentees.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2c0-1.656-.126-3.25-.5-4.5M7 20H2v-2a3 3 0 015.196-2.196M7 20v-2c0-1.656.126-3.25.5-4.5M16 10a4 4 0 11-8 0 4 4 0 018 0zm-8 2a6 6 0 0112 0" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No mentees assigned</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">This faculty doesn't have any students assigned as mentees yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-auto">
                                {mentees.map((mentee) => {
                                    const cgpa = mentee.IA1 && mentee.IA2 && mentee.EndSem
                                        ? Number(((mentee.IA1 + mentee.IA2 + mentee.EndSem) / 3).toFixed(2))
                                        : 0;

                                    return (
                                        <div key={mentee.studentId} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full overflow-hidden">
                                                    {(() => {
                                                        const src = mentee.imageUrl ?? (mentee.imageId ? getStudentImageUrl(mentee.imageId) : undefined);
                                                        if (src) {
                                                            return <img src={src} alt={mentee.name} className="h-12 w-12 object-cover rounded-full" />;
                                                        }
                                                        return <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300">{getInitials(mentee.name)}</div>;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{mentee.name}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{mentee.rollNo} • {mentee.department}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-500">{mentee.email}</div>
                                                </div>
                                                {cgpa > 0 && (
                                                    <div className="text-center px-3">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">CGPA</div>
                                                        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{cgpa}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => openStudentModal(mentee)}
                                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-700"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {selectedStudent && (
                <StudentProfileModal student={selectedStudent} isOpen={studentModalOpen} onClose={closeStudentModal} />
            )}
        </>
    );
};

export default MenteesModal;