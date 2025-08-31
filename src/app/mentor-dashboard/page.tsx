// Mentor Dashboard Page (for Faculty)
"use client";

import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiMenu, FiX, FiGrid, FiList, FiUser, FiUsers, FiBarChart2, FiCalendar, FiMail, FiLogOut, FiMapPin } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import { Student, Faculty } from "@/types";
import { getMenteesByMentorId, getAllStudents, getFacultyByDocId } from "./actions";
import { useAppDispatch } from "@/GlobalRedux/hooks";
import { logout } from "@/GlobalRedux/authSlice";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { logoutAction } from "@/app/login/actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const stats = [
    { label: "Total Mentees", value: 0 },
    { label: "Average CGPA", value: 0 },
    { label: "Excellent Performers", value: 0, sub: "CGPA ≥ 9.0" },
    { label: "Needs Attention", value: 0, sub: "CGPA < 7.0" },
];

const navLinks = [
    { name: "My Mentees", icon: <FiUsers />, id: "mentees" },
    { name: "Student Directory", icon: <FiUser />, id: "directory" },
    { name: "Meetings", icon: <FiCalendar />, id: "meetings" },
    { name: "Analytics", icon: <FiBarChart2 />, id: "analytics" },
    { name: "Profile", icon: <FiUser />, id: "profile" },
];

export default function MentorDashboard() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [isClient, setIsClient] = useState(false);
    const [activeSection, setActiveSection] = useState("mentees");
    const [mentees, setMentees] = useState<Student[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [facultyData, setFacultyData] = useState<Faculty | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStats, setCurrentStats] = useState(stats);

    const calculateStats = (students: Student[]) => {
        const totalMentees = students.length;
        const cgpaValues = students.map(s => (s.IA1 + s.IA2 + s.EndSem) / 3).filter(cgpa => cgpa > 0);
        const averageCGPA = cgpaValues.length > 0 ?
            Number((cgpaValues.reduce((a, b) => a + b, 0) / cgpaValues.length).toFixed(2)) : 0;
        const excellentPerformers = cgpaValues.filter(cgpa => cgpa >= 9.0).length;
        const needsAttention = cgpaValues.filter(cgpa => cgpa < 7.0).length;

        setCurrentStats([
            { label: "Total Mentees", value: totalMentees },
            { label: "Average CGPA", value: averageCGPA },
            { label: "Excellent Performers", value: excellentPerformers, sub: "CGPA ≥ 9.0" },
            { label: "Needs Attention", value: needsAttention, sub: "CGPA < 7.0" },
        ]);
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            if (user?.userId) {
                // Load faculty data
                const faculty = await getFacultyByDocId(user.userId);
                setFacultyData(faculty);

                // Load mentees for this faculty
                let menteesData = await getMenteesByMentorId(user.userId);

                // HARDCODED TEST DATA - For test faculty2 only (can be deleted later)
                if (user.name?.toLowerCase().includes('test faculty 2') ||
                    user.email?.toLowerCase().includes('test faculty 2')) {
                    const testMentees: Student[] = [
                        {
                            studentId: 'test-001',
                            name: 'TS 1',
                            email: 'test.student@sot.pdpu.ac.in',
                            rollNo: '02BCP001',
                            imageUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=T1',
                            imageId: 'test-img-1',
                            mentorId: user.userId,
                            projectRequestStatus: 'Accepted',
                            IA1: 8.5,
                            IA2: 9.0,
                            EndSem: 8.8,
                            school: 'SOT',
                            department: 'CSE',
                            password: 'test123',
                            phoneNumber: '+91 9876543210'
                        },
                        {
                            studentId: 'test-002',
                            name: 'TS 2',
                            email: 'test.student2@sot.pdpu.ac.in',
                            rollNo: '02BCP002',
                            imageUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=T2',
                            imageId: 'test-img-2',
                            mentorId: user.userId,
                            projectRequestStatus: 'Accepted',
                            IA1: 7.5,
                            IA2: 8.2,
                            EndSem: 9.1,
                            school: 'SOT',
                            department: 'CSE',
                            password: 'test123',
                            phoneNumber: '+91 9876543211'
                        },
                        {
                            studentId: 'test-003',
                            name: 'TS 3',
                            email: 'test.student3@sot.pdpu.ac.in',
                            rollNo: '02BCP003',
                            imageUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=T3',
                            imageId: 'test-img-3',
                            mentorId: user.userId,
                            projectRequestStatus: 'Accepted',
                            IA1: 9.2,
                            IA2: 8.8,
                            EndSem: 9.5,
                            school: 'SOT',
                            department: 'CSE',
                            password: 'test123',
                            phoneNumber: '+91 9876543212'
                        },
                        {
                            studentId: 'test-004',
                            name: 'Yash Bhaiiiii',
                            email: 'test.student4@sot.pdpu.ac.in',
                            rollNo: '02BCP004',
                            imageUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=YB',
                            imageId: 'test-img-4',
                            mentorId: user.userId,
                            projectRequestStatus: 'NoRequest',
                            IA1: 6.8,
                            IA2: 7.3,
                            EndSem: 8.0,
                            school: 'SOT',
                            department: 'CSE',
                            password: 'test123',
                            phoneNumber: '+91 9876543213'
                        }
                    ];

                    // Add test mentees to the actual data (or replace if no real data)
                    menteesData = [...menteesData, ...testMentees];
                    console.log('🧪 Added hardcoded test mentees for test faculty2:', testMentees.length);
                }

                setMentees(menteesData);

                // Load all students for directory
                const allStudentsData = await getAllStudents();
                setAllStudents(allStudentsData);

                // Calculate stats based on mentees
                calculateStats(menteesData);
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && user?.userId) {
            loadData();
        }
    }, [isClient, user, loadData]);

    // Listen for analytics activation from external navigation
    useEffect(() => {
        const handleAnalyticsActive = () => {
            setActiveSection("analytics");
        };

        window.addEventListener('setAnalyticsActive', handleAnalyticsActive);
        return () => window.removeEventListener('setAnalyticsActive', handleAnalyticsActive);
    }, []);

    // Notify navbar when section changes
    useEffect(() => {
        if (activeSection === "analytics") {
            window.dispatchEvent(new CustomEvent('setAnalyticsActive'));
        } else {
            window.dispatchEvent(new CustomEvent('setAnalyticsInactive'));
        }
    }, [activeSection]);

    const handleNavClick = (sectionId: string) => {
        if (sectionId === "directory") {
            // Navigate to the actual student directory page
            window.location.href = "/student-directory";
        } else if (sectionId === "meetings") {
            // Navigate to the meetings page
            window.location.href = "/meetings";
        } else {
            // Handle internal sections (mentees, analytics, profile)
            setActiveSection(sectionId);
            setMenuOpen(false);

            // Notify navbar about section changes
            if (sectionId === "analytics") {
                window.dispatchEvent(new CustomEvent('setAnalyticsActive'));
            } else {
                window.dispatchEvent(new CustomEvent('setAnalyticsInactive'));
            }
        }
    };

    const getCurrentStudents = () => {
        return activeSection === "mentees" ? mentees : allStudents;
    };

    const getCurrentTitle = () => {
        switch (activeSection) {
            case "mentees":
                return "My Mentees";
            case "directory":
                return "Student Directory";
            case "profile":
                return "Faculty Profile";
            case "meetings":
                return "Meetings";
            case "analytics":
                return "Analytics";
            default:
                return "My Mentees";
        }
    };

    const getCurrentSubtitle = () => {
        switch (activeSection) {
            case "mentees":
                return "Manage and track your assigned students";
            case "directory":
                return "Browse all students in the college";
            case "profile":
                return "View and manage your profile information";
            case "meetings":
                return "Schedule and manage meetings";
            case "analytics":
                return "View performance analytics and insights";
            default:
                return "Manage and track your assigned students";
        }
    };

    const handleLogout = async () => {
        try {
            await logoutAction();
            dispatch(logout());
            router.push("/login");
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account.",
            });
        } catch (error) {
            toast({
                title: "Logout Failed",
                description: "An error occurred while logging out. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Helper function to get user initials for avatar fallback
    const getUserInitials = (fullName?: string) => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return <div className="min-h-screen bg-background text-foreground" />;
    }

    const isFaculty = user?.labels && user.labels.includes("Faculty");

    if (!isFaculty) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-lg">You are not authorized to view this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            {/* Hamburger Button */}
            <button
                className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
            >
                <FiMenu className="w-7 h-7" />
            </button>

            {/* Hamburger Menu Drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/30 flex">
                    <div className="w-64 bg-white dark:bg-gray-950 h-full shadow-xl flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                            <span className="text-lg font-bold">Menu</span>
                            <button className="p-2" onClick={() => setMenuOpen(false)}>
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="mt-4 flex flex-col gap-1 px-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.id)}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition ${activeSection === link.id
                                        ? "text-black dark:text-white font-bold shadow-lg border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-emerald-700"
                                        : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-1" onClick={() => setMenuOpen(false)} />
                </div>
            )}

            {/* Main Analytics Dashboard (Full Page) */}
            <div className="flex flex-col w-full max-w-7xl mx-auto py-10 px-4 md:px-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{getCurrentTitle()}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base">{getCurrentSubtitle()}</p>
                    </div>
                    {(activeSection === "mentees" || activeSection === "directory") && (
                        <div className="flex items-center gap-2">
                            <button
                                className={`p-2 rounded-lg border ${view === 'grid' ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400' : 'bg-transparent border-gray-200 dark:border-gray-800'} transition`}
                                onClick={() => setView('grid')}
                                aria-label="Grid view"
                            >
                                <FiGrid className="w-5 h-5" />
                            </button>
                            <button
                                className={`p-2 rounded-lg border ${view === 'list' ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400' : 'bg-transparent border-gray-200 dark:border-gray-800'} transition`}
                                onClick={() => setView('list')}
                                aria-label="List view"
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </header>

                {/* Stats - only show for My Mentees section */}
                {activeSection === "mentees" && (
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {currentStats.map((stat) => (
                            <div key={stat.label} className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                                <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{stat.value}</span>
                                {stat.sub && <span className="text-xs text-gray-400 dark:text-gray-500">{stat.sub}</span>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Search and Filter */}
                {(activeSection === "mentees" || activeSection === "directory") && (
                    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <input
                            type="text"
                            placeholder={`Search by name, roll number, or division...`}
                            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                            <option>Name</option>
                            <option>CGPA</option>
                            <option>Division</option>
                        </select>
                    </section>
                )}

                {/* Loading State - Only show for non-analytics sections */}
                {loading && activeSection !== "analytics" && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
                    </div>
                )}

                {/* Students List */}
                {!loading && (activeSection === "mentees" || activeSection === "directory") && (
                    <section>
                        <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm">
                            Showing {getCurrentStudents().length} of {getCurrentStudents().length} students
                        </div>
                        {getCurrentStudents().length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    {activeSection === "mentees" ? "No mentees assigned yet." : "No students found."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {view === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {getCurrentStudents().map((student) => {
                                            const cgpa = student.IA1 && student.IA2 && student.EndSem
                                                ? Number(((student.IA1 + student.IA2 + student.EndSem) / 3).toFixed(2))
                                                : 0;

                                            // Consistent color scheme matching the stats cards
                                            const colorTheme = {
                                                // Blue theme matching "Total Students" card
                                                bg: 'from-blue-600 to-indigo-600',
                                                accent: 'bg-blue-50 dark:bg-blue-900/20',
                                                // Green theme matching "Filtered Results" card for buttons
                                                buttonBg: 'from-green-600 to-emerald-600'
                                            };

                                            return (
                                                <div key={student.email} className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="p-6 flex flex-col gap-4">
                                                        {/* Header with avatar and basic info */}
                                                        <div className="flex items-center gap-4">
                                                            <div className={`relative h-12 w-12 rounded-lg bg-gradient-to-br ${colorTheme.bg} flex items-center justify-center shadow-sm`}>
                                                                <span className="text-white font-semibold text-sm">
                                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{student.name}</h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</p>
                                                            </div>
                                                            {cgpa > 0 && (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                                        {cgpa}
                                                                    </div>
                                                                    <span className="text-xs text-gray-400 mt-1">CGPA</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Contact and department info */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <div className={`p-1.5 rounded-md ${colorTheme.accent}`}>
                                                                    <FiMail className="w-3.5 h-3.5 text-gray-500" />
                                                                </div>
                                                                <span className="truncate">{student.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <div className={`p-1.5 rounded-md ${colorTheme.accent}`}>
                                                                    <FiUser className="w-3.5 h-3.5 text-gray-500" />
                                                                </div>
                                                                <span className="truncate">
                                                                    Mentor: {facultyData?.name || user?.name || "Faculty Name"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status line for both sections */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                                                                Active
                                                            </span>
                                                        </div>                                                        {/* Action button */}
                                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                                            <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm">
                                                                View Profile
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {getCurrentStudents().map((student) => {
                                            const cgpa = student.IA1 && student.IA2 && student.EndSem
                                                ? Number(((student.IA1 + student.IA2 + student.EndSem) / 3).toFixed(2))
                                                : 0;

                                            // Consistent color scheme matching the stats cards
                                            const colorTheme = {
                                                // Blue theme matching "Total Students" card
                                                bg: 'from-blue-600 to-indigo-600',
                                                accent: 'bg-blue-50 dark:bg-blue-900/20',
                                                // Green theme matching "Filtered Results" card for buttons
                                                buttonBg: 'from-green-600 to-emerald-600'
                                            };

                                            return (
                                                <div key={student.email} className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="p-6 flex flex-col gap-4">
                                                        {/* Header with avatar and basic info */}
                                                        <div className="flex items-center gap-4">
                                                            <div className={`relative h-12 w-12 rounded-lg bg-gradient-to-br ${colorTheme.bg} flex items-center justify-center shadow-sm`}>
                                                                <span className="text-white font-semibold text-sm">
                                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{student.name}</h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</p>
                                                            </div>
                                                            {cgpa > 0 && (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                                        {cgpa}
                                                                    </div>
                                                                    <span className="text-xs text-gray-400 mt-1">CGPA</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Contact and department info */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <div className={`p-1.5 rounded-md ${colorTheme.accent}`}>
                                                                    <FiMail className="w-3.5 h-3.5 text-gray-500" />
                                                                </div>
                                                                <span className="truncate">{student.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <div className={`p-1.5 rounded-md ${colorTheme.accent}`}>
                                                                    <FiUser className="w-3.5 h-3.5 text-gray-500" />
                                                                </div>
                                                                <span className="truncate">
                                                                    Mentor: {facultyData?.name || user?.name || "Faculty Name"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status line for both sections */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                                                                Active
                                                            </span>
                                                        </div>

                                                        {/* Action button */}
                                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                                            <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm">
                                                                View Profile
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}

                {/* Other sections placeholders */}
                {activeSection === "meetings" && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Meetings</h2>
                        <p className="text-gray-500 dark:text-gray-400">Meeting management coming soon...</p>
                    </div>
                )}

                {activeSection === "analytics" && (
                    loading ? (
                        <div className="space-y-8">
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading analytics...</span>
                            </div>
                        </div>
                    ) : (
                        <AnalyticsDashboard mentees={mentees} />
                    )
                )}

                {/* Profile Section */}
                {activeSection === "profile" && (
                    <div className="max-w-2xl mx-auto">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl shadow-sm p-8 mb-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Profile Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        {facultyData?.imageUrl ? (
                                            <img
                                                src={facultyData.imageUrl}
                                                alt={facultyData.name || user?.name}
                                                className="w-full h-full rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold text-2xl">
                                                {getUserInitials(facultyData?.name || user?.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {facultyData?.name || user?.name || "Faculty Name"}
                                    </h2>
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                        {facultyData?.designation || user?.type || "Faculty"}
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                            {facultyData?.department || "Department"}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                            {facultyData?.school || "School"}
                                        </span>
                                        {user?.isHOD && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                                HOD
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FiMail className="text-blue-600" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                                            {facultyData?.email || user?.email || "faculty@pdeu.ac.in"}
                                        </p>
                                    </div>
                                </div>

                                {facultyData?.phoneNumber && (
                                    <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                            <FiUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                                                {facultyData.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seating Arrangement */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <FiMapPin className="text-purple-600" />
                                Office Location
                            </h3>
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                        <FiMapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {facultyData?.seating || "F-212"}
                                        </p>
                                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                                            F Block, 2nd Floor
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Faculty Building, PDEU Campus
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveSection("mentees")}
                                    className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">View My Mentees</span>
                                </button>

                                <button
                                    onClick={() => setActiveSection("analytics")}
                                    className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiBarChart2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">View Analytics</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-200"
                                >
                                    <FiLogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <span className="text-red-700 dark:text-red-300 font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
