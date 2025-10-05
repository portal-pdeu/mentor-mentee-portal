"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiSun,
  FiMoon,
  FiClipboard,
  FiBarChart2,
} from "react-icons/fi";
import { RiTeamFill } from "react-icons/ri";
import {
  FileText,
  Users,
  Home,
  UserRoundCog,
  LogOut,
  LogIn,
  ChevronDown,
  Book,
  BookOpen,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/GlobalRedux/hooks";
import { logout } from "@/GlobalRedux/authSlice";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/login/actions";
import { toast } from "@/hooks/use-toast";

// Navigation links array with role-based access
const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Developer"],
  },
  {
    name: "My Mentor",
    path: "/my-mentor",
    icon: <Users className="mr-2" />,
    roles: ["Student"],
  },
  {
    name: "Student Directory",
    path: "/student-directory",
    icon: <Users className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Student", "Developer"],
  },
  {
    name: "Meetings",
    path: "/meetings",
    icon: <FiClipboard className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Student", "Developer"],
  },
  {
    name: "Documents",
    path: "/documents",
    icon: <FileText className="mr-2" />,
    roles: ["Student"],
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <FiBarChart2 className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Developer"],
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: <UserRoundCog className="mr-2" />,
    roles: ["Student"],
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <UserRoundCog className="mr-2" />,
    roles: ["Faculty"],
  },
  {
    name: "Settings",
    path: "/super-admin/settings",
    icon: <FiSettings className="mr-2" />,
    roles: ["SuperAdmin", "Developer"],
  },
  {
    name: "Allocation",
    path: "/super-admin/allocation",
    icon: <FiSettings className="mr-2" />,
    roles: ["SuperAdmin", "Developer"],
  },
  {
    name: "Guidelines",
    path: "/guidelines/login",
    icon: <BookOpen className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Student", "Developer", "Public"],
  },
  {
    name: "Creators",
    path: "/creators",
    icon: <RiTeamFill className="mr-2" />,
    roles: ["Admin", "SuperAdmin", "Faculty", "Student", "Developer", "Public"],
  },
];

const privilegedLabels = ["Admin", "SuperAdmin", "Developer"];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [analyticsActive, setAnalyticsActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { status: isLoggedIn, user } = useAppSelector((state) => state.auth);
  const isHOD = user?.isHOD;
  const settings = useAppSelector((state) => state.settings);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Get user role from Redux state
  const userRole = user?.type || "Public";

  // Filter nav links based on user role and isHOD for Allocation
  let filteredNavLinks = navLinks.filter((link) => {
    if (link.name === "Allocation") {
      return isHOD || !link.roles || link.roles.includes(userRole); // Only show if isHOD is true
    }
    return !link.roles || link.roles.includes(userRole);
  });

  if (settings.studentAccessLocked && user?.type === "Student") {
    filteredNavLinks = navLinks.filter((link) => link.name === "Home");
  }

  if (settings.facultyAccessLocked && user?.type === "Faculty") {
    filteredNavLinks = navLinks.filter((link) => link.name === "Home");
  }

  // Handle scroll effect and mounting
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Listen for analytics activation from mentor dashboard
  useEffect(() => {
    const handleAnalyticsActive = () => {
      setAnalyticsActive(true);
    };

    const handleAnalyticsInactive = () => {
      setAnalyticsActive(false);
    };

    // Reset analytics active state when navigating away from mentor dashboard
    if (pathname !== "/mentor-dashboard") {
      setAnalyticsActive(false);
    }

    window.addEventListener('setAnalyticsActive', handleAnalyticsActive);
    window.addEventListener('setAnalyticsInactive', handleAnalyticsInactive);

    return () => {
      window.removeEventListener('setAnalyticsActive', handleAnalyticsActive);
      window.removeEventListener('setAnalyticsInactive', handleAnalyticsInactive);
    };
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      dispatch(logout());
      router.push("/login");
      setShowUserMenu(false);
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // Add this helper function to extract first name
  const getFirstName = (fullName?: string) => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(" ").filter(Boolean);
    if (nameParts.length === 1) {
      return nameParts[0];
    }
    return `${nameParts[0]} ${nameParts[1]}`;
  };

  // Add this helper function to get user initials for avatar fallback
  const getUserInitials = (fullName?: string) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Show profile options for logged-in users
  const handleProfile = () => {
    if (user?.type && privilegedLabels.includes(user.type)) return;
    router.push("/profile");
    setShowUserMenu(false);
  };

  // Helper function to check if a link is active
  const isActiveLink = (linkPath: string) => {
    if (!mounted) return false; // Prevent hydration mismatch

    // Special handling for analytics
    if (linkPath === "/analytics" && analyticsActive && pathname === "/mentor-dashboard") {
      return true;
    }

    // Special handling for home - only active if not in analytics mode
    if (linkPath === "/" && (pathname === "/" || pathname === "/mentor-dashboard" || pathname === "/my-mentor")) {
      return !analyticsActive; // Home is not active when analytics is active
    }

    if (linkPath !== "/" && pathname.startsWith(linkPath)) return true;
    return false;
  };

  // Show loading skeleton during hydration to prevent mismatch
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md py-4 border-b border-gray-200/30 dark:border-gray-800/30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-32 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-9 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                ))}
              </div>
              <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${isScrolled
        ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/20 py-3 border-b border-gray-200/50 dark:border-gray-800/50"
        : "bg-white/70 dark:bg-gray-950/70 backdrop-blur-md py-4 border-b border-gray-200/30 dark:border-gray-800/30"
        }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src="/PDEUlogo.jpeg"
                    alt="Company Logo"
                    width={44}
                    height={44}
                    className="rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-blue-100 dark:ring-blue-900/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <span className="hidden sm:block lg:hidden xl:block text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    PDEU Portal
                  </span>
                  <span className="sm:hidden lg:block xl:hidden text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    PDEU
                  </span>
                  <div className="hidden sm:block lg:hidden xl:block text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Mentor Mentee Program
                  </div>
                  <div className="sm:hidden lg:block xl:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                    MMP
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {filteredNavLinks.map((link) => {
                const isActive = isActiveLink(link.path);
                return (
                  <Link
                    key={link.path}
                    href={
                      isLoggedIn || link.roles.includes("Public")
                        ? link.path
                        : "/login"
                    }
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                      ? "text-green-800 dark:text-green-200 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-200 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/40 dark:hover:to-emerald-950/40"
                      }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                );
              })}

              {isLoggedIn ? (
                <div className="flex items-center space-x-3 ml-4">
                  {/* User Profile Section */}
                  <div className="user-menu-container relative">
                    <button
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-900 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm hover:shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                        <AvatarImage
                          src={
                            user?.facultyData?.imageUrl ||
                            user?.studentData?.imageUrl
                          }
                          alt={user?.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getUserInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-24 truncate">
                        {getFirstName(user?.name)}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
                              <AvatarImage
                                src={
                                  user?.facultyData?.imageUrl ||
                                  user?.studentData?.imageUrl
                                }
                                alt={user?.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {getUserInitials(user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                              </p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mt-1">
                                {user?.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          {!privilegedLabels.includes(user?.type || "") && (
                            <button
                              onClick={handleProfile}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 flex items-center"
                            >
                              <UserRoundCog className="w-4 h-4 mr-3" />
                              View Profile
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LogIn className="mr-2 w-4 h-4" /> Sign In
                </button>
              )}
            </div>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 shadow-sm hover:shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 bg-white/50 dark:bg-gray-800/50 hidden lg:block transition-all duration-150"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Show user avatar in mobile view when logged in */}
            {isLoggedIn && (
              <div className="flex items-center mr-1" onClick={handleProfile}>
                <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                  <AvatarImage
                    src={
                      user?.facultyData?.imageUrl || user?.studentData?.imageUrl
                    }
                    alt={user?.name}
                  />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-150"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-150"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? "block" : "hidden"
          } lg:hidden bg-white dark:bg-gray-950 backdrop-blur-xl shadow-2xl border-t border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 mt-2`}
      >
        {/* User info section at top of mobile menu */}
        {isLoggedIn && (
          <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-800 shadow-lg">
                <AvatarImage
                  src={
                    user?.facultyData?.imageUrl || user?.studentData?.imageUrl
                  }
                  alt={user?.name}
                />
                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mt-1 w-fit">
                  {user?.type}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="px-2 pt-2 pb-3 space-y-1">
          {filteredNavLinks.map((link) => {
            const isActive = isActiveLink(link.path);
            return (
              <Link
                key={link.path}
                href={isLoggedIn ? link.path : "/login"}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 mx-2 ${isActive
                  ? "text-green-800 dark:text-green-200 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-200 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/40 dark:hover:to-emerald-950/40"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.name}
                </div>
              </Link>
            );
          })}

          {/* Auth Button for Mobile */}
          {isLoggedIn ? (
            <div className="space-y-2 px-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
              >
                <div className="flex items-center">
                  <FiLogOut className="mr-3 w-5 h-5" /> Sign Out
                </div>
              </button>
            </div>
          ) : (
            <div className="px-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
              <button
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-center">
                  <FiLogIn className="mr-3 w-5 h-5" /> Sign In
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;