"use client";

import React, { useState, useRef } from 'react';
import { FiX, FiUpload, FiFile, FiBookOpen, FiAward } from 'react-icons/fi';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadType: 'marksheet' | 'achievement';
    onUpload: (file: File, metadata: {
        semester?: string;
        year?: string;
        description?: string;
    }) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
    isOpen,
    onClose,
    uploadType,
    onUpload
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        semester: '',
        year: '',
        description: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = uploadType === 'marksheet'
            ? ['application/pdf']
            : ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
            alert(`Invalid file type. Please upload ${uploadType === 'marksheet' ? 'PDF files only' : 'PDF, JPG, or PNG files'}.`);
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size too large. Please upload files smaller than 10MB.');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        // Validate metadata based on upload type
        if (uploadType === 'marksheet' && (!metadata.semester || !metadata.year)) {
            alert('Please fill in all required fields for marksheet.');
            return;
        }

        if (uploadType === 'achievement' && !metadata.description) {
            alert('Please provide a description for the achievement.');
            return;
        }

        onUpload(selectedFile, metadata);
        handleClose();
    };

    const handleClose = () => {
        setSelectedFile(null);
        setMetadata({ semester: '', year: '', description: '' });
        setDragActive(false);
        onClose();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${uploadType === 'marksheet'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-purple-100 dark:bg-purple-900/30'
                            }`}>
                            {uploadType === 'marksheet' ? (
                                <FiBookOpen className={`w-5 h-5 ${uploadType === 'marksheet'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-purple-600 dark:text-purple-400'
                                    }`} />
                            ) : (
                                <FiAward className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Upload {uploadType === 'marksheet' ? 'Marksheet' : 'Achievement'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {uploadType === 'marksheet'
                                    ? 'Upload your semester marksheet'
                                    : 'Upload your achievement certificate'
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select File
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
                                ? `border-${uploadType === 'marksheet' ? 'blue' : 'purple'}-400 bg-${uploadType === 'marksheet' ? 'blue' : 'purple'}-50 dark:bg-${uploadType === 'marksheet' ? 'blue' : 'purple'}-950/30`
                                : `border-${uploadType === 'marksheet' ? 'blue' : 'purple'}-300 dark:border-${uploadType === 'marksheet' ? 'blue' : 'purple'}-700 hover:border-${uploadType === 'marksheet' ? 'blue' : 'purple'}-400 dark:hover:border-${uploadType === 'marksheet' ? 'blue' : 'purple'}-600`
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileInputChange}
                                accept={uploadType === 'marksheet' ? '.pdf' : '.pdf,.jpg,.jpeg,.png'}
                            />

                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-3">
                                    <FiFile className={`w-8 h-8 text-${uploadType === 'marksheet' ? 'blue' : 'purple'}-500`} />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FiUpload className={`w-8 h-8 text-${uploadType === 'marksheet' ? 'blue' : 'purple'}-500 mx-auto mb-2`} />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {uploadType === 'marksheet'
                                            ? 'PDF files only, max 10MB'
                                            : 'PDF, JPG, PNG files, max 10MB'
                                        }
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Metadata Fields */}
                    {uploadType === 'marksheet' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Semester *
                                </label>
                                <select
                                    value={metadata.semester}
                                    onChange={(e) => setMetadata({ ...metadata, semester: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <option key={sem} value={`${sem}th`}>{sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Academic Year *
                                </label>
                                <input
                                    type="text"
                                    value={metadata.year}
                                    onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
                                    placeholder="e.g., 2023-24"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Achievement Description *
                            </label>
                            <textarea
                                value={metadata.description}
                                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                placeholder="Describe your achievement (e.g., 1st Prize in National Coding Competition)"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || (uploadType === 'marksheet' && (!metadata.semester || !metadata.year)) || (uploadType === 'achievement' && !metadata.description)}
                        className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${uploadType === 'marksheet'
                            ? 'bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600'
                            : 'bg-purple-600 hover:bg-purple-700 disabled:hover:bg-purple-600'
                            }`}
                    >
                        Upload {uploadType === 'marksheet' ? 'Marksheet' : 'Achievement'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadModal;