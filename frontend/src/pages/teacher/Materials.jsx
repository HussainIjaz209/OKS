import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faFilePdf,
    faFileWord,
    faFilePowerpoint,
    faVideo,
    faImage,
    faDownload,
    faTrash,
    faEllipsisV,
    faCloudUploadAlt,
    faTimes,
    faFolderOpen,
    faCheckCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../contexts/AuthContext'

const TeacherMaterials = () => {
    const { user } = useAuth()
    const [materials, setMaterials] = useState([])
    const [teacherClasses, setTeacherClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)

    const [newMaterial, setNewMaterial] = useState({
        title: '',
        classInfo: '', // name|section
        subject: '',
        description: ''
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [availableSubjects, setAvailableSubjects] = useState([])
    const [fetchingSubjects, setFetchingSubjects] = useState(false)

    const fetchMaterials = async () => {
        if (!user || !user.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/materials/teacher/${user.teacherId}`);
            if (!response.ok) throw new Error('Failed to fetch materials');
            const data = await response.json();
            setMaterials(data);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        }
    };

    const fetchTeacherClasses = async () => {
        if (!user || !user.teacherId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/students`);
            const students = await response.json();

            const uniqueClasses = Array.from(new Set(students.map(s => s.class)))
                .filter(c => c !== 'Unknown')
                .map(c => {
                    const parts = c.split(' ');
                    return {
                        full: c,
                        name: parts[0] + (parts.length > 2 ? ' ' + parts[1] : ''),
                        section: parts[parts.length - 1]
                    };
                });

            setTeacherClasses(uniqueClasses);
        } catch (err) {
            console.error('Error fetching classes:', err);
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            await Promise.all([fetchMaterials(), fetchTeacherClasses()]);
            setLoading(false);
        };
        loadPageData();
    }, [user]);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (!newMaterial.classInfo || !user?.teacherId) {
                setAvailableSubjects([]);
                return;
            }

            setFetchingSubjects(true);
            try {
                const [className, section] = newMaterial.classInfo.split('|');
                const response = await fetch(`${API_BASE_URL}/api/teachers/${user.teacherId}/subjects?className=${encodeURIComponent(className)}&section=${encodeURIComponent(section)}`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableSubjects(data);
                    // Reset subject if it's not in the new list
                    if (!data.includes(newMaterial.subject)) {
                        setNewMaterial(prev => ({ ...prev, subject: '' }));
                    }
                }
            } catch (err) {
                console.error('Error fetching subjects:', err);
            } finally {
                setFetchingSubjects(false);
            }
        };

        fetchSubjects();
    }, [newMaterial.classInfo, user?.teacherId]);

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        try {
            const [className, section] = newMaterial.classInfo.split('|');
            const formData = new FormData();
            formData.append('title', newMaterial.title);
            formData.append('description', newMaterial.description);
            formData.append('className', className);
            formData.append('section', section);
            formData.append('subject', newMaterial.subject);
            formData.append('teacher', user.teacherId);
            formData.append('file', selectedFile);

            setUploadProgress(10); // Start progress

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_BASE_URL}/api/materials`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 201) {
                    await fetchMaterials();
                    setShowUploadModal(false);
                    setUploadProgress(0);
                    setNewMaterial({ title: '', classInfo: '', subject: '', description: '' });
                    setSelectedFile(null);
                } else {
                    alert('Upload failed');
                    setUploadProgress(0);
                }
            };

            xhr.onerror = () => {
                alert('An error occurred during upload');
                setUploadProgress(0);
            };

            xhr.send(formData);

        } catch (err) {
            console.error('Error:', err);
            alert('Error uploading material');
            setUploadProgress(0);
        }
    }

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/materials/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setMaterials(materials.filter(m => m._id !== id));
            } else {
                alert('Failed to delete material');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const getFileIcon = (type) => {
        const lowType = type?.toLowerCase();
        if (['pdf'].includes(lowType)) return { icon: faFilePdf, color: 'text-red-500', bg: 'bg-red-50' }
        if (['doc', 'docx'].includes(lowType)) return { icon: faFileWord, color: 'text-blue-500', bg: 'bg-blue-50' }
        if (['ppt', 'pptx'].includes(lowType)) return { icon: faFilePowerpoint, color: 'text-orange-500', bg: 'bg-orange-50' }
        if (['mp4', 'mkv', 'avi'].includes(lowType)) return { icon: faVideo, color: 'text-purple-500', bg: 'bg-purple-50' }
        if (['png', 'jpg', 'jpeg', 'gif'].includes(lowType)) return { icon: faImage, color: 'text-green-500', bg: 'bg-green-50' }
        return { icon: faFilePdf, color: 'text-gray-500', bg: 'bg-gray-50' }
    }

    const filteredMaterials = materials.filter(material => {
        const fullClassName = `${material.className} ${material.section}`;
        const matchesClass = selectedClass === 'all' || fullClassName === selectedClass;
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClass && matchesSearch;
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Study Materials
                    </h1>
                    <p className="text-gray-600 text-lg">Upload and manage learning resources</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2" />
                    Upload Material
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Files</p>
                            <h3 className="text-3xl font-bold text-gray-800">{materials.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <FontAwesomeIcon icon={faFolderOpen} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Downloads</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {materials.reduce((acc, curr) => acc + (curr.downloads || 0), 0)}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faDownload} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Subjects</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {new Set(materials.map(m => m.subject)).size}
                            </h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="all">All My Classes</option>
                                {teacherClasses.map(cls => (
                                    <option key={cls.full} value={cls.full}>{cls.full}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 bg-white rounded-3xl p-12 text-center shadow-lg border-2 border-dashed border-gray-200">
                        <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No materials found</h3>
                        <p className="text-gray-500">Upload your first study resource to share with students.</p>
                    </div>
                ) : (
                    filteredMaterials.map((material) => {
                        const style = getFileIcon(material.fileType)
                        return (
                            <div key={material._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative border-t-4 border-t-indigo-500">
                                <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <FontAwesomeIcon icon={style.icon} className={`text-2xl ${style.color}`} />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1" title={material.title}>{material.title}</h3>
                                <p className="text-xs text-indigo-600 font-semibold mb-3">{material.subject}</p>
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">{material.className} {material.section}</span>
                                        <span>{material.fileSize}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                        Uploaded: {new Date(material.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex gap-2">
                                    <a
                                        href={`${API_BASE_URL}${material.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl font-bold transition-colors text-xs flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                        View / Download
                                    </a>
                                    <button
                                        onClick={() => handleDeleteMaterial(material._id)}
                                        className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                            <h2 className="text-2xl font-bold">Upload Study Material</h2>
                            <button onClick={() => setShowUploadModal(false)}><FontAwesomeIcon icon={faTimes} className="text-2xl" /></button>
                        </div>
                        <form onSubmit={handleUpload} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Chapter 1 Notes" value={newMaterial.title} onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Class</label>
                                    <select required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newMaterial.classInfo} onChange={(e) => setNewMaterial({ ...newMaterial, classInfo: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        {teacherClasses.map(cls => (
                                            <option key={cls.full} value={`${cls.name}|${cls.section}`}>{cls.full}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        value={newMaterial.subject}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                                        disabled={!newMaterial.classInfo || fetchingSubjects}
                                    >
                                        <option value="">{fetchingSubjects ? 'Loading...' : 'Select Subject'}</option>
                                        {availableSubjects.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">File</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Click to select file</p>
                                    <p className="text-[10px] text-gray-400 mt-1">PDF, Word, PPT, Video, Image (Max 50MB)</p>
                                    <input type="file" id="fileInput" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </div>
                                {selectedFile && (
                                    <p className="mt-2 text-xs text-green-600 font-bold flex items-center">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            {uploadProgress > 0 && (
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                                        <span>Status: {uploadProgress === 100 ? 'Finalizing...' : 'Uploading...'}</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" disabled={uploadProgress > 0} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                                    {uploadProgress > 0 ? 'Uploading...' : 'Launch Material'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherMaterials
