"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/GlobalRedux/hooks';
import { logout } from '@/GlobalRedux/authSlice';
import { logoutAction } from '@/app/login/actions';
import { toast } from '@/hooks/use-toast';
import { FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';

interface QuickActionsProps {
    [key: string]: unknown; // Allow any additional props
}

interface QuickActionsError extends Error {
    component: 'QuickActions';
    action?: string;
}

const QuickActions: React.FC<QuickActionsProps> = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = async (): Promise<void> => {
        try {
            // Clear Redux state
            dispatch(logout());

            // Clear server-side session
            await logoutAction();

            // Show success message
            toast({
                title: "Success",
                description: "Logged out successfully",
                variant: "default",
            });

            // Redirect to login
            router.replace("/login");

        } catch (error) {
            const quickActionsError: QuickActionsError = {
                name: 'QuickActionsError',
                message: `Failed to logout: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'QuickActions',
                action: 'handleLogout'
            };
            console.error('[QuickActions] Logout Error:', quickActionsError);

            // Show error toast
            toast({
                title: "Error",
                description: "Failed to logout. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleNavigation = (path: string): void => {
        try {
            router.push(path);
        } catch (error) {
            const quickActionsError: QuickActionsError = {
                name: 'QuickActionsError',
                message: `Failed to navigate to ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                component: 'QuickActions',
                action: 'handleNavigation'
            };
            console.error('[QuickActions] Navigation Error:', quickActionsError);

            toast({
                title: "Error",
                description: "Failed to navigate. Please try again.",
                variant: "destructive",
            });
        }
    };

    try {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Quick Actions
                </h3>
                <div className="space-y-3">
                    <button
                        onClick={() => handleNavigation("/mentor-dashboard")}
                        className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors duration-200"
                        type="button"
                    >
                        <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">View My Mentees</span>
                    </button>

                    <button
                        onClick={() => handleNavigation("/student-directory")}
                        className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors duration-200"
                        type="button"
                    >
                        <FiBarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">Student Directory</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-200"
                        type="button"
                    >
                        <FiLogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-700 dark:text-red-300 font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        const quickActionsError: QuickActionsError = {
            name: 'QuickActionsError',
            message: `Failed to render QuickActions: ${error instanceof Error ? error.message : 'Unknown error'}`,
            component: 'QuickActions'
        };
        console.error('[QuickActions] Render Error:', quickActionsError);

        // Fallback UI
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        Quick Actions Error
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        Component: QuickActions | Check console for details
                    </p>
                </div>
            </div>
        );
    }
};

export default QuickActions;
