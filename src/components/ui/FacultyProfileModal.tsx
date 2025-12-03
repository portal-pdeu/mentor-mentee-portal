"use client";

import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Faculty, Student } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getStudentImageUrl, getInitials } from '@/lib/imageUtils';
import { getMenteesForFaculty } from '@/app/student-directory/actions';
import StudentProfileModal from './StudentProfileModal';

interface FacultyProfileModalProps {
    faculty: Faculty | null;
    isOpen: boolean;
    onClose: () => void;
}

const FacultyProfileModal: React.FC<FacultyProfileModalProps> = ({ faculty, isOpen, onClose }) => {
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
            <Modal isOpen={isOpen} onClose={onClose} title={`${faculty.name} - Profile & Mentees`} size="lg">
                <div className="p-6">
                    <div className="flex items-center gap-6 mb-4">
                        <Avatar className="h-24 w-24">
                            {(() => {
                                const src = faculty.imageUrl ?? (faculty.imageId ? getStudentImageUrl(faculty.imageId) : undefined);
                                if (src) {
                                    return <AvatarImage src={src} alt={faculty.name} />;
                                }
                                return (
                                    <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-500 text-white text-2xl font-bold">{getInitials(faculty.name)}</AvatarFallback>
                                );
                            })()}
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{faculty.name}</h3>
                            <p className="text-sm text-gray-500">{faculty.designation}</p>
                            <p className="text-sm text-gray-500">{faculty.school} {faculty.department ? `• ${faculty.department}` : ''}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Contact</h4>
                        <p className="text-sm text-gray-600">{faculty.email || 'N/A'}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Mentees ({mentees.length})</h4>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                <span className="ml-2 text-sm text-gray-500">Loading mentees...</span>
                            </div>
                        ) : mentees.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">No mentees assigned to this faculty.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-auto">
                                {mentees.map((mentee) => {
                                    const cgpa = mentee.IA1 && mentee.IA2 && mentee.EndSem
                                        ? Number(((mentee.IA1 + mentee.IA2 + mentee.EndSem) / 3).toFixed(2))
                                        : 0;

                                    return (
                                        <div key={mentee.studentId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden">
                                                    {(() => {
                                                        const src = mentee.imageUrl ?? (mentee.imageId ? getStudentImageUrl(mentee.imageId) : undefined);
                                                        if (src) {
                                                            return <img src={src} alt={mentee.name} className="h-10 w-10 object-cover rounded-full" />;
                                                        }
                                                        return <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-300">{getInitials(mentee.name)}</div>;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{mentee.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{mentee.rollNo} • {mentee.department}</div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500">{mentee.email}</div>
                                                </div>
                                                {cgpa > 0 && (
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">CGPA</div>
                                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cgpa}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => openStudentModal(mentee)}
                                                    className="px-3 py-1.5 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors border border-green-200 dark:border-green-700"
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

export default FacultyProfileModal;
