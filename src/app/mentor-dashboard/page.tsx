// Mentor Dashboard Page (for Faculty)
"use client";

"use client";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiMenu, FiX, FiGrid, FiList, FiUser, FiUsers, FiBarChart2, FiCalendar } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";

const mentees = [
    { name: "Arjun Patel", roll: "CS21001 · Div A", email: "arjun.patel@student.edu", phone: "+919123456789", cgpa: 8.45, credits: 180 },
    { name: "Priya Singh", roll: "CS21002 · Div A", email: "priya.singh@student.edu", phone: "+919123456790", cgpa: 9.12, credits: 180 },
    { name: "Rohit Kumar", roll: "CS21003 · Div B", email: "rohit.kumar@student.edu", phone: "+919123456791", cgpa: 7.85, credits: 180 },
    { name: "Sneha Joshi", roll: "CS21004 · Div A", email: "sneha.joshi@student.edu", phone: "+919123456792", cgpa: 8.67, credits: 180 },
];

const stats = [
    { label: "Total Mentees", value: 4 },
    { label: "Average CGPA", value: 8.52 },
    { label: "Excellent Performers", value: 1, sub: "CGPA ≥ 9.0" },
    { label: "Needs Attention", value: 0, sub: "CGPA < 7.0" },
];

const navLinks = [
    { name: "My Mentees", icon: <FiUsers /> },
    { name: "Student Directory", icon: <FiUser /> },
    { name: "Meetings", icon: <FiCalendar /> },
    { name: "Analytics", icon: <FiBarChart2 /> },
];

export default function MentorDashboard() {
    const user = useAppSelector((state) => state.auth.user);
    const isFaculty = user?.labels && user.labels.includes("Faculty");
    const [menuOpen, setMenuOpen] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');

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
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
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
                        <h1 className="text-3xl font-bold">My Mentees</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base">Manage and track your assigned students</p>
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

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-start">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
                            <span className="text-2xl font-bold mt-1 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{stat.value}</span>
                            {stat.sub && <span className="text-xs text-gray-400 dark:text-gray-500">{stat.sub}</span>}
                        </div>
                    ))}
                </section>

                {/* Search and Filter */}
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name, roll number, or division..."
                        className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                        <option>Name</option>
                        <option>CGPA</option>
                        <option>Division</option>
                    </select>
                </section>

                {/* Mentees List */}
                <section>
                    <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm">
                        Showing {mentees.length} of {mentees.length} mentees
                    </div>
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mentees.map((mentee) => (
                                <div key={mentee.email} className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/50 dark:border-gray-800/50 shadow-sm p-6 flex flex-col gap-3 relative">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 text-lg font-bold bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center">
                                            {mentee.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-lg">{mentee.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{mentee.roll}</div>
                                        </div>
                                        <span className="ml-auto text-green-600 dark:text-green-400 font-bold text-lg">{mentee.cgpa}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1 mt-2">
                                        <span className="flex items-center gap-2"><FiUser className="inline" /> {mentee.email}</span>
                                        <span className="flex items-center gap-2"><FiUser className="inline" /> {mentee.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Credits: <span className="font-semibold text-gray-700 dark:text-gray-200">{mentee.credits}</span></span>
                                        <button className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition">View Profile</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {mentees.map((mentee) => (
                                <div key={mentee.email} className="rounded-xl bg-white dark:bg-gray-950 border border-gray-200/50 dark:border-gray-800/50 shadow-sm p-4 flex items-center gap-4">
                                    <Avatar className="h-10 w-10 text-lg font-bold bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center">
                                        {mentee.name.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-semibold">{mentee.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{mentee.roll}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{mentee.email}</div>
                                    </div>
                                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">{mentee.cgpa}</span>
                                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs hover:from-blue-700 hover:to-indigo-700 transition">View Profile</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
