"use client";

import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiMenu, FiX, FiGrid, FiList, FiUser, FiSearch, FiMail } from "react-icons/fi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Student } from "@/types";
import { getAllStudents } from "../mentor-dashboard/actions";
import { getStudentImageUrl, getInitials, hasValidImage } from "@/lib/imageUtils";
import "./styles.css";

export default function StudentDirectory() {
    const user = useAppSelector((state) => state.auth.user);
    const [menuOpen, setMenuOpen] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [isClient, setIsClient] = useState(false);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            loadAllStudents();
        }
    }, [isClient]);

    useEffect(() => {
        filterAndSortStudents();
    }, [allStudents, searchTerm, sortBy]);

    const loadAllStudents = async () => {
        setLoading(true);
        try {
            const studentsData = await getAllStudents();
            console.log('Sample student data:', studentsData.slice(0, 3).map(s => ({
                name: s.name,
                imageId: s.imageId,
                imageUrl: s.imageUrl,
                hasImageId: !!s.imageId,
                hasImageUrl: !!s.imageUrl
            })));
            setAllStudents(studentsData);
        } catch (error) {
            console.error("Error loading students:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortStudents = () => {
        let filtered = allStudents;

        // Filter by search term
        if (searchTerm.trim() !== "") {
            filtered = allStudents.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort students
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "rollNo":
                    return a.rollNo.localeCompare(b.rollNo);
                case "cgpa":
                    const cgpaA = a.IA1 && a.IA2 && a.EndSem ? (a.IA1 + a.IA2 + a.EndSem) / 3 : 0;
                    const cgpaB = b.IA1 && b.IA2 && b.EndSem ? (b.IA1 + b.IA2 + b.EndSem) / 3 : 0;
                    return cgpaB - cgpaA; // Descending order
                case "department":
                    return a.department.localeCompare(b.department);
                default:
                    return 0;
            }
        });

        setFilteredStudents(filtered);
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
                            <a
                                href="/mentor-dashboard"
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FiUser />
                                <span>My Mentees</span>
                            </a>
                            <div
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-base font-bold text-black dark:text-white shadow-lg border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-emerald-700"
                            >
                                <FiSearch className="w-5 h-5" />
                                <span>Student Directory</span>
                            </div>
                        </nav>
                    </div>
                    <div className="flex-1" onClick={() => setMenuOpen(false)} />
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col w-full max-w-7xl mx-auto py-10 px-4 md:px-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Student Directory</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base">Browse all students in the college</p>
                    </div>
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
                </header>

                {/* Search and Filter */}
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative w-full md:w-1/2">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, roll number, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="rollNo">Sort by Roll No</option>
                        <option value="cgpa">Sort by CGPA</option>
                        <option value="department">Sort by Department</option>
                    </select>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Students</span>
                        <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{allStudents.length}</span>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Filtered Results</span>
                        <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{filteredStudents.length}</span>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Departments</span>
                        <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                            {new Set(allStudents.map(s => s.department)).size}
                        </span>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Schools</span>
                        <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                            {new Set(allStudents.map(s => s.school)).size}
                        </span>
                    </div>
                </section>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading students...</span>
                    </div>
                )}

                {/* Students List */}
                {!loading && (
                    <section>
                        <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm flex items-center justify-between">
                            <span>Showing {filteredStudents.length} of {allStudents.length} students</span>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>

                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchTerm ? `No students found matching "${searchTerm}"` : "No students found."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {view === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredStudents.map((student) => {
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
                                                            <Avatar className="h-12 w-12 rounded-lg overflow-hidden">
                                                                {student.imageId && student.imageId.trim() !== '' && student.imageId !== 'undefined' ? (
                                                                    <AvatarImage
                                                                        src={getStudentImageUrl(student.imageId)}
                                                                        alt={`${student.name}'s profile picture`}
                                                                        className="object-cover w-full h-full"
                                                                        onLoad={() => console.log('Grid: Image loaded successfully for:', student.name)}
                                                                        onError={(e) => {
                                                                            console.log('Grid: Image failed to load for:', student.name);
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : student.imageUrl && student.imageUrl.trim() !== '' && student.imageUrl !== 'undefined' ? (
                                                                    <AvatarImage
                                                                        src={student.imageUrl}
                                                                        alt={`${student.name}'s profile picture`}
                                                                        className="object-cover w-full h-full"
                                                                        onLoad={() => console.log('Grid: Direct imageUrl loaded for:', student.name)}
                                                                        onError={(e) => {
                                                                            console.log('Grid: Direct imageUrl failed for:', student.name);
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className={`bg-gradient-to-br ${colorTheme.bg} text-white font-semibold text-sm rounded-lg flex items-center justify-center`}>
                                                                    {getInitials(student.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
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

                                                        {/* Contact and mentor info */}
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
                                                                    Mentor: {student.mentorId ? "Faculty Name" : "Not Assigned"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status line */}
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
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {filteredStudents.map((student) => {
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
                                                            <Avatar className="h-12 w-12 rounded-lg overflow-hidden">
                                                                {student.imageId && student.imageId.trim() !== '' && student.imageId !== 'undefined' ? (
                                                                    <AvatarImage
                                                                        src={getStudentImageUrl(student.imageId)}
                                                                        alt={`${student.name}'s profile picture`}
                                                                        className="object-cover w-full h-full"
                                                                        onLoad={() => console.log('List: Image loaded successfully for:', student.name)}
                                                                        onError={(e) => {
                                                                            console.log('List: Image failed to load for:', student.name);
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : student.imageUrl && student.imageUrl.trim() !== '' && student.imageUrl !== 'undefined' ? (
                                                                    <AvatarImage
                                                                        src={student.imageUrl}
                                                                        alt={`${student.name}'s profile picture`}
                                                                        className="object-cover w-full h-full"
                                                                        onLoad={() => console.log('List: Direct imageUrl loaded for:', student.name)}
                                                                        onError={(e) => {
                                                                            console.log('List: Direct imageUrl failed for:', student.name);
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <AvatarFallback className={`bg-gradient-to-br ${colorTheme.bg} text-white font-semibold text-sm rounded-lg flex items-center justify-center`}>
                                                                    {getInitials(student.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
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

                                                        {/* Contact and mentor info */}
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
                                                                    Mentor: {student.mentorId ? "Faculty Name" : "Not Assigned"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status line */}
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
            </div>
        </div>
    );
}
