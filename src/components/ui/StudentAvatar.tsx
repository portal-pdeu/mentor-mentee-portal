"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getStudentImageUrl, getInitials, hasValidImage, markImageAsFailed } from "@/lib/imageUtils";
import { Student } from "@/types";

interface StudentAvatarProps {
    student: Student;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
};

export default function StudentAvatar({ student, className = "", size = "md" }: StudentAvatarProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        console.warn(`Failed to load image for student: ${student.name}, imageId: ${student.imageId}`);
        if (student.imageId) {
            markImageAsFailed(student.imageId);
        }
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    // Determine if we should show an image
    const shouldShowImage = hasValidImage(student) && !imageError;
    const imageUrl = shouldShowImage ? getStudentImageUrl(student.imageId!) : '';

    return (
        <Avatar className={`rounded-full ${sizeClasses[size]} ${className}`}>
            {shouldShowImage && (
                <AvatarImage
                    src={imageUrl}
                    alt={`${student.name}'s profile picture`}
                    className="object-cover rounded-full"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            )}
            <AvatarFallback className="rounded-full text-white font-semibold bg-gradient-to-br from-blue-500 to-indigo-600">
                {imageLoading && shouldShowImage ? (
                    <div className="animate-pulse text-xs">...</div>
                ) : (
                    getInitials(student.name || "")
                )}
            </AvatarFallback>
        </Avatar>
    );
}