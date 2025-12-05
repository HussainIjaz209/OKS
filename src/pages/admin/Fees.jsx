import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faFilter,
    faMoneyBillWave,
    faFileInvoiceDollar,
    faCheckCircle,
    faExclamationCircle,
    faHistory,
    faDownload,
    faEllipsisV,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

const AdminFees = () => {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock Data
    const [transactions, setTransactions] = useState([
        {
            id: 'INV-2024-001',
            studentName: 'John Smith',
            class: 'Class 9A',
            amount: 500,
            date: '2024-12-01',
            status: 'paid',
            type: 'Tuition Fee'
        },
        {
            id: 'INV-2024-002',
            studentName: 'Alice Johnson',
            class: 'Class 10A',
            amount: 150,
            date: '2024-12-03',
            status: 'pending',
            type: 'Lab Fee'
        },
        {
            id: 'INV-2024-003',
            studentName: 'David Wilson',
            class: 'Class 8B',
            amount: 500,
            date: '2024-11-28',
            status: 'overdue',
            type: 'Tuition Fee'
        },
        {
            id: 'INV-2024-004',
            studentName: 'Emma Brown',
            class: 'Class 9B',
            amount: 200,
            date: '2024-12-05',
            status: 'paid',
            type: 'Transport Fee'
        }
    ])

    const [newInvoice, setNewInvoice] = useState({
        studentName: '',
        class: '',
        amount: '',
        dueDate: '',
        type: 'Tuition Fee',
        description: ''
    })

    const handleCreateInvoice = (e) => {
        e.preventDefault()
        const invoice = {
            id: `INV-2024-${String(transactions.length + 1).padStart(3, '0')}`,
            ...newInvoice,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        }
        setTransactions([invoice, ...transactions])
        setShowInvoiceModal(false)
        setNewInvoice({
            studentName: '',
            class: '',
            amount: '',
            dueDate: '',
            type: 'Tuition Fee',
            description: ''
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200'
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const filteredTransactions = transactions.filter(t => {
        const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus
        const matchesSearch = t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const totalRevenue = transactions
        .filter(t => t.status === 'paid')
        .reduce((acc, curr) => acc + Number(curr.amount), 0)

    const pendingAmount = transactions
        .filter(t => t.status === 'pending' || t.status === 'overdue')
        .reduce((acc, curr) => acc + Number(curr.amount), 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Fee Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track payments and manage invoices
                    </p>
                </div>
                <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Invoice
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl text-green-600">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
                            <h3 className="text-3xl font-bold text-gray-800">${pendingAmount.toLocaleString()}</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                            <FontAwesomeIcon icon={faHistory} className="text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Overdue Invoices</p>
                            <h3 className="text-3xl font-bold text-gray-800">
                                {transactions.filter(t => t.status === 'overdue').length}
                            </h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-xl text-red-600">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-xl" />
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
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {t.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{t.studentName}</div>
                                        <div className="text-xs text-gray-500">{t.class}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {t.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ${t.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {t.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Download Invoice">
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Create Invoice</h2>
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateInvoice} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.studentName}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, studentName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.class}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, class: e.target.value })}
                                    >
                                        <option value="">Select Class</option>
                                        <option value="Class 8A">Class 8A</option>
                                        <option value="Class 9A">Class 9A</option>
                                        <option value="Class 10A">Class 10A</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Type</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.type}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, type: e.target.value })}
                                    >
                                        <option value="Tuition Fee">Tuition Fee</option>
                                        <option value="Lab Fee">Lab Fee</option>
                                        <option value="Transport Fee">Transport Fee</option>
                                        <option value="Library Fee">Library Fee</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.amount}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.dueDate}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    placeholder="Optional details..."
                                    value={newInvoice.description}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Generate Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminFees
