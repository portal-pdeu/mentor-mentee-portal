"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/GlobalRedux/hooks";
import { FiDownload, FiTrash2, FiEye, FiFolder, FiUpload, FiPlus, FiFile } from "react-icons/fi";
import { getStudentDocuments, createDocumentRecord, uploadDocumentFile, deleteDocument } from "./actions";
import { StudentDocument } from "@/types";
import { toast } from "sonner";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<StudentDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user?.studentData?.studentId) {
            fetchDocuments();
        }
    }, [user?.studentData?.studentId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const docs = await getStudentDocuments(user!.studentData!.studentId!);
            setDocuments(docs);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File too large. Max size is 10MB');
                return;
            }
            setSelectedFiles(prev => ({ ...prev, [category]: file }));
        }
    };

    const handleUpload = async (category: string) => {
        const selectedFile = selectedFiles[category];
        if (!selectedFile || !user?.studentData) {
            toast.error("Please select a file");
            return;
        }

        setUploading(true);
        setUploadingCategory(category);
        try {
            console.log('Starting upload for category:', category);
            console.log('File:', selectedFile.name, selectedFile.size, 'bytes');
            console.log('User data:', user.studentData);

            const formData = new FormData();
            formData.append('file', selectedFile);

            console.log('Calling uploadDocumentFile...');
            const uploadResult = await uploadDocumentFile(formData);
            console.log('Upload result:', uploadResult);

            if (!uploadResult) {
                throw new Error('File upload failed - no result returned');
            }

            const documentData: Omit<StudentDocument, '$id'> = {
                studentId: user.studentData.studentId || '',
                uploadDate: new Date().toISOString(),
                status: 'submitted',
                mentorId: user.studentData.mentorId || '',
                name: selectedFile.name,
                fileId: uploadResult.fileId,
                fileUrl: uploadResult.fileUrl,
            };

            console.log('Creating document record with data:', documentData);
            const createdDoc = await createDocumentRecord(documentData);
            console.log('Created document:', createdDoc);

            if (createdDoc) {
                setDocuments(prev => [createdDoc, ...prev]);
                toast.success("Document uploaded!");
                setSelectedFiles(prev => {
                    const newFiles = { ...prev };
                    delete newFiles[category];
                    return newFiles;
                });
                const input = document.querySelector(`#file-input-${category}`) as HTMLInputElement;
                if (input) input.value = '';
            } else {
                throw new Error('Failed to create document record - no document returned');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.message || 'Unknown error';
            toast.error(`Upload failed: ${errorMessage}`);
        } finally {
            setUploading(false);
            setUploadingCategory(null);
        }
    };

    const handleDelete = async (doc: StudentDocument) => {
        if (!confirm(`Delete "${doc.name}"?`)) return;

        try {
            const success = await deleteDocument(doc.$id!, doc.fileId);
            if (success) {
                setDocuments(prev => prev.filter(d => d.$id !== doc.$id));
                toast.success("Document deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Delete failed");
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'verified'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : status === 'submitted'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Documents</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage your marksheets and achievements</p>
                </div>

                {/* Three Upload Sections */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Marksheet Upload */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiFile className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Marksheet</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Semester marksheets</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-4 text-center">
                            <FiUpload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <input
                                id="file-input-marksheet"
                                type="file"
                                onChange={(e) => handleFileSelect('marksheet', e)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                            <label htmlFor="file-input-marksheet" className="cursor-pointer">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Click to upload
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                            </label>
                        </div>

                        {selectedFiles['marksheet'] && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                                {selectedFiles['marksheet'].name}
                            </p>
                        )}

                        <button
                            onClick={() => handleUpload('marksheet')}
                            disabled={!selectedFiles['marksheet'] || (uploading && uploadingCategory === 'marksheet')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {uploading && uploadingCategory === 'marksheet' ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FiPlus className="w-4 h-4" />
                                    Upload Marksheet
                                </>
                            )}
                        </button>
                    </div>

                    {/* Achievement Upload */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiFile className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Achievement</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Certificates & awards</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-4 mb-4 text-center">
                            <FiUpload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <input
                                id="file-input-achievement"
                                type="file"
                                onChange={(e) => handleFileSelect('achievement', e)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                            <label htmlFor="file-input-achievement" className="cursor-pointer">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Click to upload
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                            </label>
                        </div>

                        {selectedFiles['achievement'] && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                                {selectedFiles['achievement'].name}
                            </p>
                        )}

                        <button
                            onClick={() => handleUpload('achievement')}
                            disabled={!selectedFiles['achievement'] || (uploading && uploadingCategory === 'achievement')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {uploading && uploadingCategory === 'achievement' ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FiPlus className="w-4 h-4" />
                                    Upload Achievement
                                </>
                            )}
                        </button>
                    </div>

                    {/* Additional Documents Upload */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                                <FiFile className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Documents</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Other documents</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 text-center">
                            <FiUpload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <input
                                id="file-input-other"
                                type="file"
                                onChange={(e) => handleFileSelect('other', e)}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                            <label htmlFor="file-input-other" className="cursor-pointer">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Click to upload
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                            </label>
                        </div>

                        {selectedFiles['other'] && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                                {selectedFiles['other'].name}
                            </p>
                        )}

                        <button
                            onClick={() => handleUpload('other')}
                            disabled={!selectedFiles['other'] || (uploading && uploadingCategory === 'other')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {uploading && uploadingCategory === 'other' ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FiPlus className="w-4 h-4" />
                                    Upload Document
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                    {documents.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                            <FiFolder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Documents</h3>
                            <p className="text-gray-600 dark:text-gray-400">Upload your first document to get started</p>
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.$id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="text-2xl">📄</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                                            </p>
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
                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}