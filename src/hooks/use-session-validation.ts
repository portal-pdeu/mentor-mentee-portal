"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/GlobalRedux/hooks';
import { logout } from '@/GlobalRedux/authSlice';

export const useSessionValidation = () => {
    const dispatch = useAppDispatch();
    const { user, status } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Check if user is supposedly authenticated
        if (status && user) {
            // Check if session cookie exists
            const cookies = document.cookie.split(';');
            const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='));

            if (!sessionCookie) {
                // Session cookie doesn't exist, clear auth state
                console.log('Session cookie not found, logging out');
                dispatch(logout());
            }
        }
    }, [dispatch, status, user]);
};
