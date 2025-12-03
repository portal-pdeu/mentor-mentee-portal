"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/GlobalRedux/hooks';
import { logout, login } from '@/GlobalRedux/authSlice';

export const useSessionValidation = () => {
    const dispatch = useAppDispatch();
    const { user, status } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const validateSession = async () => {
            try {
                const response = await fetch('/api/auth/validate-session', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.valid && data.user) {
                        // Update Redux with user data if not already logged in or user data differs
                        if (!status || !user || user.email !== data.user.email) {
                            dispatch(login(data.user));
                        }
                    } else {
                        // Session is invalid
                        if (status && user) {
                            console.log('Session validation failed, logging out');
                            dispatch(logout());
                        }
                    }
                } else {
                    // Session validation failed
                    if (status && user) {
                        console.log('Session validation request failed, logging out');
                        dispatch(logout());
                    }
                }
            } catch (error) {
                console.error('Session validation error:', error);
                if (status && user) {
                    console.log('Session validation error, logging out');
                    dispatch(logout());
                }
            }
        };

        // Check if user is supposedly authenticated
        if (status && user) {
            // Check if session cookie exists
            const cookies = document.cookie.split(';');
            const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='));

            if (!sessionCookie) {
                // Session cookie doesn't exist, clear auth state
                console.log('Session cookie not found, logging out');
                dispatch(logout());
            } else {
                // Validate session with server
                validateSession();
            }
        } else {
            // Not logged in according to Redux, check if there's a valid session
            const cookies = document.cookie.split(';');
            const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session='));

            if (sessionCookie) {
                // Session cookie exists but Redux doesn't know about it, validate and restore
                validateSession();
            }
        }
    }, [dispatch, status, user]);
};
