import { useState } from 'react'
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
    faFolderOpen
} from '@fortawesome/free-solid-svg-icons'

const TeacherMaterials = () => {
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)

    // Mock Data
    const classes = ['Class 9A', 'Class 9B', 'Class 10A']

    const [materials, setMaterials] = useState([
        {
            id: 1,
            title: 'Algebra Formulas Cheat Sheet',
            type: 'pdf',
            class: 'Class 9A',
            subject: 'Mathematics',
            size: '2.5 MB',
            date: '2024-12-01',
            downloads: 24
        },
        {
            id: 2,
            title: 'Geometry Introduction Video',
            type: 'video',
            class: 'Class 9B',
            subject: 'Mathematics',
            size: '45 MB',
            date: '2024-12-03',
            downloads: 18
        },
        {
            id: 3,
            title: 'Trigonometry Practice Problems',
            type: 'word',
            class: 'Class 10A',
            subject: 'Mathematics',
            size: '1.2 MB',
            date: '2024-12-05',
            downloads: 30
        },
        {
            id: 4,
            title: 'Calculus Presentation',
            type: 'ppt',
            class: 'Class 10A',
            subject: 'Mathematics',
            size: '5.8 MB',
            date: '2024-11-28',
            downloads: 15
        }
    ])

    const [newMaterial, setNewMaterial] = useState({
        title: '',
        class: '',
        subject: 'Mathematics',
        file: null
    })

    const handleUpload = (e) => {
        e.preventDefault()
        // Simulate upload
        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            setUploadProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                const material = {
                    id: materials.length + 1,
                    title: newMaterial.title,
                    class: newMaterial.class,
                    subject: newMaterial.subject,
                    type: 'pdf', // Mock type
                    size: '1.5 MB', // Mock size
                    date: new Date().toISOString().split('T')[0],
                    downloads: 0
                }
                setMaterials([material, ...materials])
                setTimeout(() => {
                    setShowUploadModal(false)
                    setUploadProgress(0)
                    setNewMaterial({ title: '', class: '', subject: 'Mathematics', file: null })
                }, 500)
            }
        }, 200)
    }

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return { icon: faFilePdf, color: 'text-red-500', bg: 'bg-red-50' }
            case 'word': return { icon: faFileWord, color: 'text-blue-500', bg: 'bg-blue-50' }
            case 'ppt': return { icon: faFilePowerpoint, color: 'text-orange-500', bg: 'bg-orange-50' }
            case 'video': return { icon: faVideo, color: 'text-purple-500', bg: 'bg-purple-50' }
            case 'image': return { icon: faImage, color: 'text-green-500', bg: 'bg-green-50' }
            default: return { icon: faFilePdf, color: 'text-gray-500', bg: 'bg-gray-50' }
        }
    }

    const filteredMaterials = materials.filter(material => {
        const matchesClass = selectedClass === 'all' || material.class === selectedClass
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesClass && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Study Materials
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Upload and manage learning resources
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2" />
                    Upload Material
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
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
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Downloads</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {materials.reduce((acc, curr) => acc + curr.downloads, 0)}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faDownload} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Storage Used</p>
                            <h3 className="text-3xl font-bold text-gray-800">1.2 GB</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="all">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.map((material) => {
                    const style = getFileIcon(material.type)
                    return (
                        <div key={material.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
                            <div className="absolute top-4 right-4">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>

                            <div className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <FontAwesomeIcon icon={style.icon} className={`text-3xl ${style.color}`} />
                            </div>

                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-1" title={material.title}>
                                {material.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{material.class}</span>
                                    <span>{material.size}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Uploaded: {material.date}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl font-medium transition-colors text-sm flex items-center justify-center">
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download
                                </button>
                                <button className="w-10 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Upload Material</h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="e.g., Chapter 1 Notes"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={newMaterial.class}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, class: e.target.value })}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-gray-400 mb-3" />
                                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, Word, PPT, Video (Max 50MB)</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
                                    />
                                </div>
                                {newMaterial.file && (
                                    <p className="mt-2 text-sm text-green-600 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                        {newMaterial.file.name}
                                    </p>
                                )}
                            </div>

                            {uploadProgress > 0 && (
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-600 transition-all duration-200"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadProgress > 0}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
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
