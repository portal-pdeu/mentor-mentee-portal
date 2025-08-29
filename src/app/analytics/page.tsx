"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/GlobalRedux/hooks";

export default function AnalyticsPage() {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user?.type === "Faculty") {
            // Redirect Faculty to mentor dashboard with analytics section
            router.replace("/mentor-dashboard");
            // Set analytics as active section via URL fragment or localStorage
            setTimeout(() => {
                const event = new CustomEvent('setAnalyticsActive');
                window.dispatchEvent(event);
            }, 100);
        } else {
            // For other roles, you can implement their respective analytics pages
            // For now, redirect to home
            router.replace("/");
        }
    }, [user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Redirecting to analytics...</p>
            </div>
        </div>
    );
}
