"use client";

import React, { useState } from 'react';
import { Faculty } from '@/types';
import { FiClock } from 'react-icons/fi';

interface AvailableHoursProps {
    facultyData: Faculty | null;
}

interface AvailableHoursError extends Error {
    component: 'AvailableHours';
    action?: string;
}

const AvailableHours: React.FC<AvailableHoursProps> = ({ facultyData }) => {
    const [selectedDay, setSelectedDay] = useState<string>('monday');

    // Default time slots for each day
    const defaultTimeSlots = {
        monday: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM', '4:00 PM - 5:00 PM'],
        tuesday: ['9:00 AM - 10:00 AM', '1:00 PM - 2:00 PM', '3:30 PM - 4:30 PM'],
        wednesday: ['11:00 AM - 12:00 PM', '2:30 PM - 3:30 PM', '5:00 PM - 6:00 PM'],
        thursday: ['10:30 AM - 11:30 AM', '1:30 PM - 2:30 PM', '4:30 PM - 5:30 PM'],
        friday: ['9:30 AM - 10:30 AM', '12:00 PM - 1:00 PM', '3:00 PM - 4:00 PM']
    };

    const dayNames = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday'
    };

    const handleDayChange = (day: string): void => {
        try {
            if (!Object.keys(dayNames).includes(day)) {
                throw new Error(`Invalid day selection: ${day}`);
            }
            setSelectedDay(day);
        } catch (error) {
            const availableHoursError: AvailableHoursError = {
                name: 'AvailableHoursError',
                message: `Failed to change day: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'AvailableHours',
                action: 'handleDayChange'
            };
            console.error('[AvailableHours] handleDayChange Error:', availableHoursError);
            // Fallback to monday if invalid day
            setSelectedDay('monday');
        }
    };

    const getTimeSlotsForDay = (day: string): string[] => {
        try {
            // Use faculty data if available, otherwise fall back to default
            if (facultyData?.freeTimeSlots && facultyData.freeTimeSlots.length > 0) {
                return facultyData.freeTimeSlots;
            }

            const dayKey = day as keyof typeof defaultTimeSlots;
            if (!defaultTimeSlots[dayKey]) {
                throw new Error(`No time slots found for day: ${day}`);
            }

            return defaultTimeSlots[dayKey];
        } catch (error) {
            const availableHoursError: AvailableHoursError = {
                name: 'AvailableHoursError',
                message: `Failed to get time slots: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'AvailableHours',
                action: 'getTimeSlotsForDay'
            };
            console.error('[AvailableHours] getTimeSlotsForDay Error:', availableHoursError);
            // Return default monday slots as fallback
            return defaultTimeSlots.monday;
        }
    };

    try {
        const currentTimeSlots = getTimeSlotsForDay(selectedDay);
        const currentDayName = dayNames[selectedDay as keyof typeof dayNames];

        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FiClock className="text-indigo-600" />
                    Available Hours
                </h3>

                {/* Day Selection Dropdown */}
                <div className="mb-4">
                    <label htmlFor="day-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Day:
                    </label>
                    <select
                        id="day-select"
                        value={selectedDay}
                        onChange={(e) => handleDayChange(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {Object.entries(dayNames).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Slots for Selected Day */}
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                        Free Time Slots for {currentDayName}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentTimeSlots.map((slot, index) => (
                            <div key={`${selectedDay}-${index}`} className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                    <FiClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                        {slot}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Available for consultation
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No slots message */}
                    {(!facultyData?.freeTimeSlots || facultyData.freeTimeSlots.length === 0) && (
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                            <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                Showing default time slots. Contact mentor to confirm availability.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        const availableHoursError: AvailableHoursError = {
            name: 'AvailableHoursError',
            message: `Failed to render AvailableHours: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'AvailableHours'
        };
        console.error('[AvailableHours] Render Error:', availableHoursError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Available Hours Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: AvailableHours | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default AvailableHours;
