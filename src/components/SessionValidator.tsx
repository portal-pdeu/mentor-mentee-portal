"use client";

import { useSessionValidation } from '@/hooks/use-session-validation';

export default function SessionValidator() {
    useSessionValidation();
    return null;
}
