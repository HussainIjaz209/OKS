import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import {
    faMoneyBillWave,
    faFileInvoiceDollar,
    faHistory,
    faCheckCircle,
    faExclamationCircle,
    faDownload,
    faCreditCard,
    faWallet,
    faPrint
} from '@fortawesome/free-solid-svg-icons'
import schoolLogo from '../../assets/logo.png'

const Fees = () => {
    const { user, loading: authLoading } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')
    const [invoices, setInvoices] = useState([])
    const [studentProfile, setStudentProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchInvoices = async () => {
        if (!user) return
        try {
            const studentId = user.studentId || user.id || user._id
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices?studentId=${studentId}`)
            const data = await response.json()
            if (response.ok) {
                setInvoices(data)
            }
        } catch (error) {
            console.error('Error fetching invoices:', error)
        }
    }

    const fetchStudentProfile = async () => {
        if (!user) return
        try {
            const studentId = user.studentId || user.id || user._id
            const response = await fetch(`${API_BASE_URL}/api/students/profile/${studentId}`)
            const data = await response.json()
            if (response.ok) {
                setStudentProfile(data)
            }
        } catch (error) {
            console.error('Error fetching student profile:', error)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            const loadData = async () => {
                setLoading(true)
                await Promise.all([fetchInvoices(), fetchStudentProfile()])
                setLoading(false)
            }
            loadData()
        }
    }, [user, authLoading])

    const feeSummary = {
        totalFees: invoices.reduce((acc, curr) => acc + curr.amount, 0),
        paidAmount: invoices.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0),
        pendingAmount: invoices.reduce((acc, curr) => acc + (curr.remainingBalance ?? (curr.amount - (curr.paidAmount || 0))), 0),
        nextDueDate: invoices.filter(i => i.status !== 'paid' && i.status !== 'success')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || 'N/A'
    }

    const pendingDues = invoices.filter(i => i.status !== 'paid' && i.status !== 'success')
    const paymentHistory = invoices.filter(i => i.status === 'paid' || i.status === 'success' || (i.paidAmount && i.paidAmount > 0))

    const handlePrint = (items) => {
        if (!studentProfile) return;
        const invoicesToPrint = Array.isArray(items) ? items : [items];
        const currentMonth = new Date().toISOString().slice(0, 7);

        const printWindow = window.open('', '_blank');
        const logoUrl = window.location.origin + schoolLogo;

        const numberToWords = (num) => {
            const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
            const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            if ((num = num.toString()).length > 9) return 'overflow';
            let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return '';
            let str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
            return str + 'Only';
        }

        // Prepare student data for the print logic
        const student = {
            ...studentProfile,
            unpaidInvoices: invoices.filter(inv => inv.status !== 'paid')
        };

        // Current Month Invoices (could be multiple: Tuition, Lab, etc)
        const currentMonthInvoices = invoicesToPrint.filter(inv => inv.month === currentMonth);
        // Previous Unpaid Invoices (Arrears)
        const arrearsInvoices = student.unpaidInvoices.filter(inv => inv.month !== currentMonth && !invoicesToPrint.find(i => i._id === inv._id));

        const totalArrears = arrearsInvoices.reduce((acc, inv) => acc + (inv.remainingBalance ?? inv.amount), 0);
        const totalCurrent = invoicesToPrint.reduce((acc, inv) => acc + (inv.remainingBalance ?? inv.amount), 0);
        const grandTotal = totalArrears + totalCurrent;

        // For dates, use the first current month invoice if available, else latest from arrears
        const referenceInv = invoicesToPrint[0] || arrearsInvoices[0];
        const dueDate = referenceInv ? new Date(referenceInv.dueDate).toLocaleDateString('en-GB') : '---';
        const validTill = referenceInv ? new Date(new Date(referenceInv.dueDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') : '---';
        const afterDate = referenceInv ? new Date(new Date(referenceInv.dueDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') : '---';

        const copyNames = ['Bank Copy', 'Student Copy', 'School/College Copy'];

        let content = `<div class="student-page">`;

        copyNames.forEach(copyName => {
            content += `
                <div class="copy-column">
                    <div class="header">
                        <img src="${logoUrl}" class="school-logo">
                        <div class="school-header-info">
                            <div class="school-name">The Ocean of Knowledge School</div>
                            <div class="school-loc">Kot Charbagh Swat</div>
                            <div class="school-abb">OKS</div>
                            <div class="school-phone">Phone Number : 03462064044</div>
                        </div>
                    </div>

                    <div class="copy-label-container">
                        <div class="copy-label">${copyName}</div>
                        <div class="bank-info">
                            <div class="bank-name">The Bank of Khyber</div>
                            <div class="bank-detail">Account Title: Principal OKS</div>
                            <div class="bank-detail">Account No: 3004591948</div>
                        </div>
                    </div>

                    <table class="details-grid">
                        <tr>
                            <td>Challan Form No</td>
                            <td class="val">${student.rollNumber || student.studentId}</td>
                        </tr>
                        <tr>
                            <td>Due Date</td>
                            <td class="val">${dueDate}</td>
                        </tr>
                        <tr>
                            <td>Valid Till</td>
                            <td class="val">${validTill}</td>
                        </tr>
                        <tr>
                            <td>Student Reg No</td>
                            <td class="val">${student.rollNumber || student.studentId}</td>
                        </tr>
                        <tr>
                            <td>Student Name</td>
                            <td class="val">${student.name}</td>
                        </tr>
                        <tr>
                            <td>Father Name</td>
                            <td class="val">${student.fatherName || '---'}</td>
                        </tr>
                        <tr>
                            <td>Class</td>
                            <td class="val">${student.class}</td>
                        </tr>
                        <tr>
                            <td>Family Number</td>
                            <td class="val">Nil</td>
                        </tr>
                        <tr>
                            <td>Depositor NIC Number</td>
                            <td class="val"></td>
                        </tr>
                        <tr>
                            <td>Depositor Phone Number</td>
                            <td class="val">${student.contactNumber || ''}</td>
                        </tr>
                    </table>

                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoicesToPrint.map(inv => `
                                <tr>
                                    <td>${inv.type} (${inv.month})</td>
                                    <td class="amt">${(inv.remainingBalance ?? inv.amount).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            ${arrearsInvoices.map(inv => `
                                <tr>
                                    <td>Previous Fee (${inv.month})</td>
                                    <td class="amt">${(inv.remainingBalance ?? inv.amount).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td>Fee Within Due Date (Till ${dueDate})</td>
                                <td class="amt">${grandTotal.toLocaleString()}</td>
                            </tr>
                            <tr class="total-row red">
                                <td>Fee After Due Date (From ${afterDate})</td>
                                <td class="amt">${grandTotal.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="words">Amount in words : ${numberToWords(grandTotal)}</div>
                    
                    <div class="note">
                        <b>NOTE:</b>
                    </div>
                </div>
            `;
        });

        content += `</div>`;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Fee Vouchers</title>
                    <style>
                        @page { size: A4 landscape; margin: 3mm; }
                        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; font-size: 10px; }
                        .student-page { display: flex; width: 100%; height: 100%; page-break-after: always; gap: 8px; padding: 5px; box-sizing: border-box; }
                        .copy-column { flex: 1; border: 1.5px solid #000; padding: 8px; display: flex; flex-direction: column; background: #fff; box-sizing: border-box; }
                        
                        .header { display: flex; align-items: start; gap: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 5px; }
                        .school-logo { width: 50px; height: 50px; }
                        .school-header-info { text-align: center; flex: 1; }
                        .school-name { font-size: 13px; font-weight: bold; text-transform: uppercase; }
                        .school-loc { font-size: 11px; }
                        .school-abb { font-size: 10px; font-weight: bold; }
                        .school-phone { font-size: 9px; margin-top: 2px; }

                        .copy-label-container { display: flex; border: 1.5px solid #000; align-items: stretch; margin-bottom: 5px; }
                        .copy-label { padding: 5px; font-weight: bold; border-right: 1.5px solid #000; display: flex; align-items: center; width: 90px; font-size: 11px; background: #f2f2f2; }
                        .bank-info { flex: 1; padding: 2px 5px; font-size: 10px; text-align: center; }
                        .bank-name { font-weight: bold; text-decoration: underline; font-size: 11px; }

                        .details-grid { width: 100%; border-collapse: collapse; }
                        .details-grid td { border: 1px solid #000; padding: 3px 6px; height: 19px; font-size: 10px; }
                        .details-grid td:first-child { width: 45%; }
                        .val { font-weight: bold; font-size: 11px; }

                        .fee-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        .fee-table th, .fee-table td { border: 1.5px solid #000; padding: 5px 8px; text-align: left; }
                        .fee-table th { background: #f2f2f2; text-align: center; font-size: 12px; }
                        .fee-table td:nth-child(2) { width: 30%; text-align: center; }
                        .amt { font-weight: bold; font-size: 12px; }
                        .total-row { font-weight: bold; }
                        .total-row.red { color: red; }

                        .words { margin-top: 10px; font-weight: bold; font-size: 11px; border-top: 1px solid #000; padding-top: 5px; }
                        .note { border: 1.5px solid #000; margin-top: 8px; padding: 8px; flex-grow: 1; min-height: 80px; }
                        
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                            .student-page { height: 195mm; }
                        }
                    </style>
                </head>
                <body>${content}</body>
                <script>window.onload = function() { window.print(); window.close(); }</script>
            </html>
        `);
        printWindow.document.close();
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'success': return 'text-green-600 bg-green-100'
            case 'pending': return 'text-orange-600 bg-orange-100'
            case 'overdue':
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
                    <h3 className="text-3xl font-bold mb-1">Rs. {feeSummary.totalFees}</h3>
                    <p className="text-blue-100 text-sm">Academic Year 2024-25</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-xl p-3">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                        </div>
                        <span className="text-green-100 text-sm font-medium">Paid Amount</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">Rs. {feeSummary.paidAmount}</h3>
                    <p className="text-green-100 text-sm">Successfully cleared</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-xl p-3">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl" />
                        </div>
                        <span className="text-orange-100 text-sm font-medium">Pending Dues</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">Rs. {feeSummary.pendingAmount}</h3>
                    <p className="text-orange-100 text-sm">Due: {feeSummary.nextDueDate !== 'N/A' ? new Date(feeSummary.nextDueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Dues Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-3 text-blue-600" />
                        Pending Dues
                    </h2>

                    {loading ? (
                        <div className="bg-white rounded-2xl p-8 text-center text-gray-500">Loading dues...</div>
                    ) : pendingDues.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center text-gray-500">No pending dues.</div>
                    ) : (
                        pendingDues.map((due) => (
                            <div key={due._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">{due.type} - {due.month}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(due.status)}`}>
                                                {due.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{due.description || 'Regular monthly tuition fee.'}</p>
                                        <p className="text-red-500 text-sm font-medium">
                                            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                            Due Date: {new Date(due.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-800 block">Rs. {due.amount}</span>
                                            {due.paidAmount > 0 && (
                                                <span className="text-sm text-green-600 block">Paid: Rs. {due.paidAmount}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handlePrint(due)}
                                                className="flex-1 md:flex-none border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faPrint} />
                                            </button>
                                            <button className="flex-[2] md:flex-none bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                                <FontAwesomeIcon icon={faCreditCard} />
                                                Pay Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

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
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Invoice #</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-600">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No payment history found.</td>
                                        </tr>
                                    ) : (
                                        paymentHistory.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.invoiceNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{payment.type} - {payment.month}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-800">Rs. {payment.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handlePrint(payment)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors duration-300 text-lg"
                                                    >
                                                        <FontAwesomeIcon icon={faPrint} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
