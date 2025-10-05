"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiDownload, FiUpload, FiTrash2, FiEye, FiFolder, FiBookOpen, FiAward, FiPlus } from "react-icons/fi";
import DocumentUploadModal from "@/components/documents/DocumentUploadModal";

interface Document {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    category: "marksheet" | "achievement" | "other";
    status: "submitted" | "verified" | "pending";
    semester?: string;
    year?: string;
    description?: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState<'marksheet' | 'achievement'>('marksheet');
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // TODO: Fetch documents from API
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                // Placeholder data
                const placeholderDocs: Document[] = [
                    {
                        id: "1",
                        name: "Semester 5 Marksheet.pdf",
                        type: "PDF",
                        size: "2.1 MB",
                        uploadDate: "2025-09-25",
                        category: "marksheet",
                        status: "verified",
                        semester: "5th",
                        year: "2024-25"
                    },
                    {
                        id: "2",
                        name: "Semester 4 Marksheet.pdf",
                        type: "PDF",
                        size: "1.8 MB",
                        uploadDate: "2025-06-20",
                        category: "marksheet",
                        status: "verified",
                        semester: "4th",
                        year: "2023-24"
                    },
                    {
                        id: "3",
                        name: "National Coding Competition Certificate.pdf",
                        type: "PDF",
                        size: "1.2 MB",
                        uploadDate: "2025-09-15",
                        category: "achievement",
                        status: "verified",
                        description: "1st Prize in National Level Coding Competition"
                    },
                    {
                        id: "4",
                        name: "Research Paper Publication Certificate.pdf",
                        type: "PDF",
                        size: "956 KB",
                        uploadDate: "2025-08-10",
                        category: "achievement",
                        status: "pending",
                        description: "Published research paper in IEEE Conference"
                    },
                    {
                        id: "5",
                        name: "Internship Completion Certificate.pdf",
                        type: "PDF",
                        size: "1.5 MB",
                        uploadDate: "2025-07-30",
                        category: "achievement",
                        status: "verified",
                        description: "Summer Internship at Tech Corp"
                    }
                ];

                setDocuments(placeholderDocs);
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const filteredDocuments = selectedCategory === "all"
        ? documents
        : documents.filter(doc => doc.category === selectedCategory);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "verified": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
            case "submitted": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
            case "pending": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "marksheet": return "�";
            case "achievement": return "🏆";
            default: return "�";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "marksheet": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
            case "achievement": return "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400";
            default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const handleFileUpload = (file: File, metadata: {
        semester?: string;
        year?: string;
        description?: string;
    }) => {
        // Create a new document object
        const newDocument: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGE' : 'FILE',
            size: formatFileSize(file.size),
            uploadDate: new Date().toISOString().split('T')[0],
            category: uploadType,
            status: 'pending',
            ...metadata
        };

        // Add to documents list
        setDocuments(prev => [newDocument, ...prev]);

        // TODO: Upload file to server
        console.log('Uploading file:', file, 'with metadata:', metadata);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const openUploadModal = (type: 'marksheet' | 'achievement') => {
        setUploadType(type);
        setUploadModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Documents</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage your marksheets and achievements</p>
                    </div>
                </div>

                {/* Upload Sections */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Marksheet Upload Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Marksheet</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upload your semester marksheets</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
                            onClick={() => openUploadModal('marksheet')}>
                            <FiUpload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                PDF files only, max 10MB
                            </p>
                        </div>

                        <button
                            onClick={() => openUploadModal('marksheet')}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            Upload Marksheet
                        </button>
                    </div>

                    {/* Achievements Upload Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiAward className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Achievement</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upload certificates and achievements</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-6 text-center hover:border-purple-400 dark:hover:border-purple-600 transition-colors cursor-pointer"
                            onClick={() => openUploadModal('achievement')}>
                            <FiUpload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                PDF, JPG, PNG files, max 10MB
                            </p>
                        </div>

                        <button
                            onClick={() => openUploadModal('achievement')}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            Upload Achievement
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: "all", label: "All Documents", icon: "�" },
                            { key: "marksheet", label: "Marksheets", icon: "�" },
                            { key: "achievement", label: "Achievements", icon: "🏆" }
                        ].map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setSelectedCategory(category.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.key
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                    {filteredDocuments.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                            <FiFolder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Documents Found</h3>
                            <p className="text-gray-600 dark:text-gray-400">No documents found in this category. Upload your first document to get started.</p>
                        </div>
                    ) : (
                        filteredDocuments.map((doc) => (
                            <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl">
                                                {getCategoryIcon(doc.category)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    <span>{doc.type}</span>
                                                    <span>{doc.size}</span>
                                                    <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                                                </div>
                                                {doc.semester && doc.year && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        <span className="font-medium">Semester:</span> {doc.semester} • <span className="font-medium">Year:</span> {doc.year}
                                                    </div>
                                                )}
                                                {doc.description && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        <span className="font-medium">Description:</span> {doc.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Category Badge */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                                                {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                                            </span>

                                            {/* Status Badge */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="View Document"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                    title="Download Document"
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Delete Document"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Document Statistics */}
                <div className="mt-8 grid md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Total Documents</h4>
                        <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Marksheets</h4>
                        <p className="text-2xl font-bold text-blue-600">
                            {documents.filter(d => d.category === "marksheet").length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Achievements</h4>
                        <p className="text-2xl font-bold text-purple-600">
                            {documents.filter(d => d.category === "achievement").length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Verified</h4>
                        <p className="text-2xl font-bold text-green-600">
                            {documents.filter(d => d.status === "verified").length}
                        </p>
                    </div>
                </div>

                {/* Upload Modal */}
                <DocumentUploadModal
                    isOpen={uploadModalOpen}
                    onClose={() => setUploadModalOpen(false)}
                    uploadType={uploadType}
                    onUpload={handleFileUpload}
                />
            </div>
        </div>
    );
}