

"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (user?.labels?.includes("Faculty")) {
            router.replace("/mentor-dashboard");
        } else if (user?.labels?.includes("Student")) {
            router.replace("/mentee-dashboard");
        } else {
            // If user is not logged in, redirect to login page
            router.replace("/login");
        }
    }, [user, router]);

    // Show loading state while redirecting
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
    );
}
