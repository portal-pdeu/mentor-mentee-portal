// Mentee Dashboard Page (for Student)
"use client";

import { useAppSelector } from "@/GlobalRedux/hooks";
import { useState, useEffect } from "react";

export default function MenteeDashboard() {
    const user = useAppSelector((state) => state.auth.user);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return <div className="min-h-screen bg-background text-foreground" />;
    }

    const isStudent = user?.labels && user.labels.includes("Student");

    if (!isStudent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-lg">You are not authorized to view this page.</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Mentee Dashboard</h1>
            <p className="text-lg text-gray-700">Welcome! You are logged in as a <span className="font-semibold text-blue-600">Student</span>.</p>
            <p className="mt-2 text-gray-500">This is the mentee page. Here you will see your mentor, meetings, and academic progress.</p>
        </div>
    );
}
