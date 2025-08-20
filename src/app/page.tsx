

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
        }
        // else: stay on this page or show a generic landing
    }, [user, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Mentor-Mentee Portal</h1>
            <p className="text-lg text-gray-700">Please sign in to continue.</p>
        </div>
    );
}
