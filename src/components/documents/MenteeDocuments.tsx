"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiEye, FiFolder, FiCheckCircle, FiClock } from "react-icons/fi";
import { getMentorMenteeDocuments, updateDocumentStatus } from "@/app/documents/actions";
import { StudentDocument } from "@/types";
import { toast } from "sonner";

interface MenteeDocumentsProps {
    mentorId: string;
}

export default function MenteeDocuments({ mentorId }: MenteeDocumentsProps) {
    const [documents, setDocuments] = useState<StudentDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'submitted' | 'verified'>('all');

    useEffect(() => {
        fetchDocuments();
    }, [mentorId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const docs = await getMentorMenteeDocuments(mentorId);
            setDocuments(docs);
        } catch (error) {
            console.error("Error fetching mentee documents:", error);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (docId: string, newStatus: string) => {
        try {
            const success = await updateDocumentStatus(docId, newStatus);
            if (success) {
                setDocuments(prev =>
                    prev.map(doc =>
                        doc.$id === docId ? { ...doc, status: newStatus } : doc
                    )
                );
                toast.success(`Document ${newStatus}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error("Update failed");
        }
    };

    const filteredDocuments = documents.filter(doc => {
        if (filter === 'all') return true;
        return doc.status === filter;
    });

    const getStatusColor = (status: string) => {
        return status === 'verified'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : status === 'submitted'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                        }`}
                >
                    All ({documents.length})
                </button>
                <button
                    onClick={() => setFilter('submitted')}
                    className={`px-4 py-2 font-medium transition-colors ${filter === 'submitted'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                        }`}
                >
                    Submitted ({documents.filter(d => d.status === 'submitted').length})
                </button>
                <button
                    onClick={() => setFilter('verified')}
                    className={`px-4 py-2 font-medium transition-colors ${filter === 'verified'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                        }`}
                >
                    Verified ({documents.filter(d => d.status === 'verified').length})
                </button>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
                {filteredDocuments.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                        <FiFolder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Documents</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'all'
                                ? 'No documents uploaded yet'
                                : `No ${filter} documents`}
                        </p>
                    </div>
                ) : (
                    filteredDocuments.map((doc) => (
                        <div key={doc.$id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="text-2xl">📄</div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {doc.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            <span>Student ID: {doc.studentId}</span>
                                            <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(doc.fileUrl, '_blank')}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                            title="View"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={doc.fileUrl}
                                            download
                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                                            title="Download"
                                        >
                                            <FiDownload className="w-4 h-4" />
                                        </a>
                                        {doc.status === 'submitted' && (
                                            <button
                                                onClick={() => handleStatusUpdate(doc.$id!, 'verified')}
                                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                                                title="Verify"
                                            >
                                                <FiCheckCircle className="w-4 h-4" />
                                                Verify
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Statistics */}
            {documents.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Total</h4>
                        <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Pending</h4>
                        <p className="text-2xl font-bold text-yellow-600">
                            {documents.filter(d => d.status === 'submitted').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Verified</h4>
                        <p className="text-2xl font-bold text-green-600">
                            {documents.filter(d => d.status === 'verified').length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
