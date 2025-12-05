import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMoneyBillWave,
    faFileInvoiceDollar,
    faHistory,
    faCheckCircle,
    faExclamationCircle,
    faDownload,
    faCreditCard,
    faWallet
} from '@fortawesome/free-solid-svg-icons'

const Fees = () => {
    const [activeTab, setActiveTab] = useState('overview')

    const feeSummary = {
        totalFees: 5000,
        paidAmount: 3500,
        pendingAmount: 1500,
        nextDueDate: 'Dec 15, 2024'
    }

    const pendingDues = [
        {
            id: 1,
            title: 'Tuition Fee - Term 2',
            amount: 1000,
            dueDate: 'Dec 15, 2024',
            status: 'Pending',
            description: 'Regular academic tuition fee for the second term.'
        },
        {
            id: 2,
            title: 'Lab Fee',
            amount: 500,
            dueDate: 'Dec 20, 2024',
            status: 'Pending',
            description: 'Science laboratory maintenance and equipment fee.'
        }
    ]

    const paymentHistory = [
        {
            id: 'TXN123456',
            date: 'Nov 10, 2024',
            amount: 1500,
            type: 'Tuition Fee - Term 1',
            status: 'Success',
            method: 'Credit Card'
        },
        {
            id: 'TXN123457',
            date: 'Oct 05, 2024',
            amount: 1000,
            type: 'Admission Fee',
            status: 'Success',
            method: 'Bank Transfer'
        },
        {
            id: 'TXN123458',
            date: 'Sep 15, 2024',
            amount: 1000,
            type: 'Library Fee',
            status: 'Success',
            method: 'Online Wallet'
        }
    ]

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'success': return 'text-green-600 bg-green-100'
            case 'pending': return 'text-orange-600 bg-orange-100'
            case 'failed': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Fee Management
                </h1>
                <p className="text-gray-600 text-lg">
                    Track your payments, view invoices, and manage dues
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-xl p-3">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl" />
                        </div>
                        <span className="text-blue-100 text-sm font-medium">Total Fees</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">${feeSummary.totalFees}</h3>
                    <p className="text-blue-100 text-sm">Academic Year 2024-25</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-xl p-3">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                        </div>
                        <span className="text-green-100 text-sm font-medium">Paid Amount</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">${feeSummary.paidAmount}</h3>
                    <p className="text-green-100 text-sm">Successfully cleared</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-xl p-3">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl" />
                        </div>
                        <span className="text-orange-100 text-sm font-medium">Pending Dues</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">${feeSummary.pendingAmount}</h3>
                    <p className="text-orange-100 text-sm">Due by {feeSummary.nextDueDate}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Dues Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-3 text-blue-600" />
                        Pending Dues
                    </h2>

                    {pendingDues.map((due) => (
                        <div key={due.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{due.title}</h3>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                                            {due.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{due.description}</p>
                                    <p className="text-red-500 text-sm font-medium">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                        Due Date: {due.dueDate}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                    <span className="text-2xl font-bold text-gray-800">${due.amount}</span>
                                    <button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Payment History */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-8">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FontAwesomeIcon icon={faHistory} className="mr-3 text-blue-600" />
                                Payment History
                            </h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Transaction ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentHistory.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{payment.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{payment.type}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">${payment.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Payment Methods / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl shadow-xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faWallet} className="mr-3" />
                            Payment Methods
                        </h3>
                        <p className="text-purple-100 text-sm mb-6">
                            Securely manage your saved cards and payment options.
                        </p>
                        <div className="space-y-3">
                            <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                                    <span className="text-sm font-medium">**** 4242</span>
                                </div>
                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Primary</span>
                            </div>
                            <button className="w-full py-3 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 text-sm font-bold">
                                + Add New Method
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            If you have any questions regarding your fees or invoices, please contact the accounts department.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center text-gray-600">
                                <span className="font-bold w-20">Email:</span> accounts@school.com
                            </p>
                            <p className="flex items-center text-gray-600">
                                <span className="font-bold w-20">Phone:</span> +1 (555) 123-4567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fees
