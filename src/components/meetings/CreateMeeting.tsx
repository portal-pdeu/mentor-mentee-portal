"use client";

import React, { useState, useEffect } from 'react';
import { CreateMeetingData, Student } from '@/types';
import meetingsService from '@/services/meetingsService';
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiExternalLink,
    FiPlus,
    FiX,
    FiCheck,
    FiLoader,
    FiSave
} from 'react-icons/fi';

interface CreateMeetingProps {
    mentorId: string;
    mentorName: string;
    onMeetingCreated: (meeting: any) => void;
    onCancel: () => void;
}

interface CreateMeetingError extends Error {
    component: 'CreateMeeting';
    action?: string;
}

const CreateMeeting: React.FC<CreateMeetingProps> = ({
    mentorId,
    mentorName,
    onMeetingCreated,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateMeetingData>({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        meetingUrl: '',
        meetingPassword: '',
        purpose: 'Discussion',
        invitedStudentIds: []
    });

    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showStudentSelector, setShowStudentSelector] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const purposes = [
        'Discussion',
        'Progress Review',
        'Project Planning',
        'Academic Guidance',
        'Career Counseling',
        'Research Discussion',
        'Other'
    ];

    useEffect(() => {
        loadAvailableStudents();
    }, [mentorId]);

    const loadAvailableStudents = async (): Promise<void> => {
        try {
            setIsLoadingStudents(true);
            const students = await meetingsService.getAvailableStudents(mentorId);
            setAvailableStudents(students);
            console.log('[CreateMeeting] Loaded available students:', students.length);
        } catch (error) {
            const createMeetingError: CreateMeetingError = {
                name: 'CreateMeetingError',
                message: `Failed to load students: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'CreateMeeting',
                action: 'loadAvailableStudents'
            };
            console.error('[CreateMeeting] loadAvailableStudents Error:', createMeetingError);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Meeting title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Meeting description is required';
        }

        if (!formData.date) {
            newErrors.date = 'Meeting date is required';
        } else {
            const meetingDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (meetingDate < today) {
                newErrors.date = 'Meeting date cannot be in the past';
            }
        }

        if (!formData.time) {
            newErrors.time = 'Meeting time is required';
        }

        if (!formData.meetingUrl.trim()) {
            newErrors.meetingUrl = 'Meeting URL is required';
        } else {
            try {
                new URL(formData.meetingUrl);
            } catch {
                newErrors.meetingUrl = 'Please enter a valid URL';
            }
        }

        if (formData.duration < 15) {
            newErrors.duration = 'Duration must be at least 15 minutes';
        }

        if (selectedStudents.length === 0) {
            newErrors.students = 'Please select at least one student';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof CreateMeetingData, value: string | number | string[]): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleStudentToggle = (student: Student): void => {
        setSelectedStudents(prev => {
            const isSelected = prev.find(s => s.studentId === student.studentId);
            if (isSelected) {
                return prev.filter(s => s.studentId !== student.studentId);
            } else {
                return [...prev, student];
            }
        });

        // Clear students error if any student is selected
        if (errors.students) {
            setErrors(prev => ({
                ...prev,
                students: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsCreating(true);

            const meetingData: CreateMeetingData = {
                ...formData,
                invitedStudentIds: selectedStudents.map(s => s.studentId)
            };

            const createdMeeting = await meetingsService.createMeeting(
                meetingData,
                mentorId,
                mentorName
            );

            console.log('[CreateMeeting] Meeting created successfully:', createdMeeting.id);
            onMeetingCreated(createdMeeting);
        } catch (error) {
            const createMeetingError: CreateMeetingError = {
                name: 'CreateMeetingError',
                message: `Failed to create meeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'CreateMeeting',
                action: 'handleSubmit'
            };
            console.error('[CreateMeeting] handleSubmit Error:', createMeetingError);
            setErrors({
                general: 'Failed to create meeting. Please try again.'
            });
        } finally {
            setIsCreating(false);
        }
    };

    // Generate default meeting URL when title changes
    useEffect(() => {
        if (formData.title && !formData.meetingUrl) {
            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            setFormData(prev => ({
                ...prev,
                meetingUrl: `https://meet.google.com/${slug}-${Date.now().toString(36)}`
            }));
        }
    }, [formData.title]);

    try {
        return (
            <div className="p-6">
                {errors.general && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Meeting Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Meeting Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.title
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                placeholder="Enter meeting title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.description
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                placeholder="Enter meeting description"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiCalendar className="w-4 h-4 inline mr-1" />
                                Date *
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.date
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                            )}
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiClock className="w-4 h-4 inline mr-1" />
                                Time *
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.time
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            />
                            {errors.time && (
                                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                            )}
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Duration (minutes) *
                            </label>
                            <select
                                value={formData.duration}
                                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.duration
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                            </select>
                            {errors.duration && (
                                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                            )}
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Purpose
                            </label>
                            <select
                                value={formData.purpose}
                                onChange={(e) => handleInputChange('purpose', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                            >
                                {purposes.map(purpose => (
                                    <option key={purpose} value={purpose}>{purpose}</option>
                                ))}
                            </select>
                        </div>

                        {/* Meeting URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiExternalLink className="w-4 h-4 inline mr-1" />
                                Meeting URL *
                            </label>
                            <input
                                type="url"
                                value={formData.meetingUrl}
                                onChange={(e) => handleInputChange('meetingUrl', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.meetingUrl
                                    ? 'border-red-300 dark:border-red-700'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                placeholder="https://meet.google.com/abc-defg-hij"
                            />
                            {errors.meetingUrl && (
                                <p className="text-red-500 text-sm mt-1">{errors.meetingUrl}</p>
                            )}
                        </div>

                        {/* Meeting Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Meeting Password (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.meetingPassword || ''}
                                onChange={(e) => handleInputChange('meetingPassword', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Enter meeting password"
                            />
                        </div>
                    </div>

                    {/* Student Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <FiUsers className="w-4 h-4 inline mr-1" />
                                Invite Students *
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowStudentSelector(!showStudentSelector)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                            >
                                <FiPlus className="w-3 h-3" />
                                {selectedStudents.length > 0 ? `${selectedStudents.length} Selected` : 'Select Students'}
                            </button>
                        </div>

                        {errors.students && (
                            <p className="text-red-500 text-sm mb-2">{errors.students}</p>
                        )}

                        {/* Selected Students */}
                        {selectedStudents.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {selectedStudents.map(student => (
                                        <div
                                            key={student.studentId}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                                        >
                                            <span>{student.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleStudentToggle(student)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Student Selector */}
                        {showStudentSelector && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                {isLoadingStudents ? (
                                    <div className="text-center py-4">
                                        <FiLoader className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                                        <p className="text-gray-500 text-sm mt-1">Loading students...</p>
                                    </div>
                                ) : availableStudents.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">No students available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availableStudents.map(student => {
                                            const isSelected = selectedStudents.find(s => s.studentId === student.studentId);
                                            return (
                                                <div
                                                    key={student.studentId}
                                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isSelected
                                                        ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                        }`}
                                                    onClick={() => handleStudentToggle(student)}
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {student.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {student.rollNo} • {student.email}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <FiCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4" />
                                    Create Meeting
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    } catch (error) {
        const createMeetingError: CreateMeetingError = {
            name: 'CreateMeetingError',
            message: `Failed to render CreateMeeting: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'CreateMeeting'
        };
        console.error('[CreateMeeting] Render Error:', createMeetingError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Create Meeting Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: CreateMeeting | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default CreateMeeting;
