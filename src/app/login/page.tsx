"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import { loginAction, logoutAction } from "./actions";
import Authlayout from "@/components/Authlayout";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { login, logout } from "@/GlobalRedux/authSlice";
import CryptoJS from "crypto-js";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [maxProgressIndex, setMaxProgressIndex] = useState(0); // Track maximum progress reached
  const { theme } = useTheme();
  const dispatch = useDispatch();

  // Loading messages that change during login
  const loadingMessages = [
    {
      title: "Signing you in...",
      subtitle: "Please wait while we verify your credentials",
    },
    {
      title: "Authenticating...",
      subtitle: "Checking your account details",
    },
    {
      title: "Almost there!",
      subtitle: "Setting up your session",
    },
    {
      title: "Getting ready...",
      subtitle: "Preparing your dashboard",
    },
    {
      title: "Just a moment...",
      subtitle: "Finalizing your login",
    },
    {
      title: "Welcome back!",
      subtitle: "Redirecting you to your dashboard",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Message rotation effect during loading - only move forward
  useEffect(() => {
    if (isLoading) {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          const nextIndex = prev < loadingMessages.length - 1 ? prev + 1 : prev;
          // Update max progress only if we're moving forward
          setMaxProgressIndex((current) => Math.max(current, nextIndex));
          return nextIndex;
        });
      }, 1200); // Change message every 1.2 seconds

      return () => clearInterval(messageInterval);
    } else {
      // Reset both when not loading
      setCurrentMessageIndex(0);
      setMaxProgressIndex(0);
    }
  }, [isLoading, loadingMessages.length]);

  // Function to update progress only forward
  const updateProgress = (newIndex: number) => {
    setCurrentMessageIndex((prev) => Math.max(prev, newIndex));
    setMaxProgressIndex((prev) => Math.max(prev, newIndex));
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setCurrentMessageIndex(0);
    setMaxProgressIndex(0);
    clearErrors();

    try {
      // Always clear any existing session
      await logoutAction();
      dispatch(logout());

      await new Promise((resolve) => setTimeout(resolve, 800));
      updateProgress(1);

      // Encrypt password using NEXT_PUBLIC_SECRET_KEY
      const encryptedPassword = CryptoJS.AES.encrypt(
        data.password,
        process.env.NEXT_PUBLIC_SECRET_KEY as string
      ).toString();

      const res = await loginAction({
        email: data.email,
        password: encryptedPassword, // send encrypted password
      });


      if (res.success) {
        updateProgress(2);
        // Add a small delay to ensure session is properly set
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateProgress(3);

        dispatch(login(res.user)); // Dispatch the login action with the user data
        updateProgress(4);
        await new Promise((resolve) => setTimeout(resolve, 600));

        updateProgress(5);
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Redirect to dashboard based on user.labels
        if (res.user?.labels?.includes("Faculty")) {
          window.location.href = "/mentor-dashboard";
        } else if (res.user?.labels?.includes("Student")) {
          window.location.href = "/mentee-dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        setError("root", {
          type: "manual",
          message: res.error || res.message || "Login failed",
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: "An error occurred during login. Please try again.",
      });
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Authlayout types={["All"]} noRestriction={true} authentication={true}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:via-gray-900 dark:to-indigo-950 p-4 relative">
        {/* Enhanced Loading Overlay with Changing Messages */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-slate-700/60 max-w-sm w-full mx-4">
              <div className="flex flex-col items-center space-y-6">
                {/* Animated Logo with Rotation */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="w-16 h-16 border-2 border-indigo-200 dark:border-indigo-800 rounded-full border-t-indigo-500 dark:border-t-indigo-400"></div>
                  </div>
                  <div className="relative w-16 h-16 animate-pulse">
                    <Image
                      src="/PDEUlogo.jpeg"
                      alt="Logo"
                      layout="fill"
                      objectFit="contain"
                      className={`filter rounded-full ${theme === "dark"
                          ? "brightness-60 contrast-110 drop-shadow-2xl drop-shadow-indigo-500/30"
                          : "drop-shadow-md"
                        }`}
                    />
                  </div>
                </div>

                {/* Modern Loading Animation */}
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                </div>

                {/* Dynamic Loading Text with Fade Animation */}
                <div className="text-center h-20 flex flex-col justify-center">
                  <div className="relative overflow-hidden">
                    <h3
                      key={currentMessageIndex}
                      className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
                    >
                      {loadingMessages[currentMessageIndex]?.title}
                    </h3>
                  </div>
                  <div className="relative overflow-hidden">
                    <p
                      key={`${currentMessageIndex}-subtitle`}
                      className="text-sm text-gray-600 dark:text-slate-400 animate-in fade-in-50 slide-in-from-bottom-1 duration-500 delay-100"
                    >
                      {loadingMessages[currentMessageIndex]?.subtitle}
                    </p>
                  </div>
                </div>

                {/* Enhanced Progress Bar with Steps - Uses maxProgressIndex to prevent going backwards */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                    <span>Step {maxProgressIndex + 1}</span>
                    <span>
                      {Math.round(
                        ((maxProgressIndex + 1) / loadingMessages.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${((maxProgressIndex + 1) / loadingMessages.length) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Step Indicators - Uses maxProgressIndex to prevent going backwards */}
                <div className="flex space-x-2">
                  {loadingMessages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index <= maxProgressIndex
                          ? "bg-indigo-500 dark:bg-indigo-400 scale-110"
                          : "bg-gray-300 dark:bg-slate-600"
                        }`}
                    />
                  ))}
                </div>

                {/* Success checkmark animation for final step */}
                {maxProgressIndex === loadingMessages.length - 1 && (
                  <div className="animate-in zoom-in-50 duration-500">
                    <div className="w-8 h-8 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white animate-in zoom-in-50 duration-300 delay-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-md w-full space-y-6 p-8 bg-white/90 dark:bg-slate-900/95 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-indigo-900/20 transition-all duration-300 transform hover:scale-[1.01] border border-gray-200/50 dark:border-slate-700/60 relative z-10 backdrop-blur-sm dark:backdrop-blur-md">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24 mb-2">
                <Image
                  src="/PDEUlogo.jpeg"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  className={`filter ${theme === "dark"
                      ? "brightness-60 contrast-110 drop-shadow-2xl drop-shadow-indigo-500/30"
                      : "drop-shadow-md"
                    }`}
                />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-300">
              Sign in to access your account
            </p>
          </div>

          {/* Root Error Display */}
          {errors.root && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-200 p-4 rounded-xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Login Error</p>
                  <p className="text-sm mt-1">{errors.root.message}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail
                      className={`h-5 w-5 transition-colors duration-200 ${errors.email
                          ? "text-red-500 dark:text-red-400"
                          : "text-indigo-500 dark:text-indigo-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-300"
                        }`}
                    />
                  </div>
                  <input
                    {...register("email", {
                      required: "Username or Email is required",
                      validate: (value) => {
                        const emailPattern =
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        const usernamePattern = /^[a-zA-Z0-9._-]{3,}$/;
                        if (
                          emailPattern.test(value) ||
                          usernamePattern.test(value)
                        ) {
                          return true;
                        }
                        return "Enter a valid email or username (min 3 characters, no spaces)";
                      },
                    })}
                    type="text"
                    autoComplete="username"
                    className={`appearance-none block w-full pl-10 pr-3 py-3.5 bg-gray-50 dark:bg-slate-800/80 border rounded-xl placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:border-transparent dark:focus:bg-slate-800 transition-all duration-300 sm:text-sm ${errors.email
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400"
                        : "border-gray-300 dark:border-slate-600/60 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      }`}
                    placeholder="Username or Email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-in slide-in-from-top-1 duration-200">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock
                      className={`h-5 w-5 transition-colors duration-200 ${errors.password
                          ? "text-red-500 dark:text-red-400"
                          : "text-indigo-500 dark:text-indigo-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-300"
                        }`}
                    />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`appearance-none block w-full pl-10 pr-10 py-3.5 bg-gray-50 dark:bg-slate-800/80 border rounded-xl placeholder-gray-500 dark:placeholder-slate-400 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:border-transparent dark:focus:bg-slate-800 transition-all duration-300 sm:text-sm ${errors.password
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400"
                        : "border-gray-300 dark:border-slate-600/60 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400 focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </Authlayout>
  );
}