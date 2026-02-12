import { useState, useEffect, useMemo } from 'react'
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
    faTimes,
    faPrint,
    faTrash,
    faCheck,
} from '@fortawesome/free-solid-svg-icons'
import schoolLogo from '../../assets/logo.png'
import { API_BASE_URL } from '../../apiConfig'

const AdminFees = () => {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)
    const [showBatchModal, setShowBatchModal] = useState(false)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [showPartialModal, setShowPartialModal] = useState(false)
    const [selectedInvoicePartial, setSelectedInvoicePartial] = useState(null)
    const [partialAmount, setPartialAmount] = useState('')
    const [selectedStudentHistory, setSelectedStudentHistory] = useState(null)
    const [batchConfig, setBatchConfig] = useState({
        month: new Date().toISOString().slice(0, 7),
        overwrite: false
    })
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [students, setStudents] = useState([])
    const [structures, setStructures] = useState([])
    const [studentSearchQuery, setStudentSearchQuery] = useState('')
    const [showStudentDropdown, setShowStudentDropdown] = useState(false)

    const fetchInvoices = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices`)
            const data = await response.json()
            if (response.ok) {
                setTransactions(data)
            }
        } catch (error) {
            console.error('Error fetching invoices:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admissions?status=approved`)
            const data = await response.json()
            if (response.ok) {
                // Exclude withdrawn students from fee management
                const activeStudents = data.filter(student => student.status !== 'withdrawn')
                setStudents(activeStudents)
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const fetchStructures = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/structures`)
            const data = await response.json()
            if (response.ok) {
                setStructures(data)
            }
        } catch (error) {
            console.error('Error fetching structures:', error)
        }
    }

    useEffect(() => {
        fetchInvoices()
        fetchStudents()
        fetchStructures()
    }, [])

    // Handle click outside to close student dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStudentDropdown && !event.target.closest('.student-search-container')) {
                setShowStudentDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStudentDropdown]);

    // Reset student search when modal opens/closes
    useEffect(() => {
        if (!showInvoiceModal) {
            setStudentSearchQuery('');
            setShowStudentDropdown(false);
        }
    }, [showInvoiceModal]);

    const handleGenerateMonthly = async (e) => {
        if (e) e.preventDefault();

        setLoading(true)
        setShowBatchModal(false)
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/generate-monthly`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batchConfig)
            })
            const result = await response.json()
            if (response.ok) {
                alert(`Batch processing complete for ${batchConfig.month}: \n - Generated: ${result.generatedCount} \n - Updated: ${result.updatedCount || 0} \n - Skipped: ${result.skippedCount} `)
                fetchInvoices()
            } else {
                alert(`Error: ${result.message} `)
            }
        } catch (error) {
            console.error('Error generating invoices:', error)
            alert('Failed to connect to server')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteMonthly = async (e) => {
        if (e) e.preventDefault();

        if (!window.confirm(`Are you sure you want to delete ALL invoices for ${batchConfig.month} ? This action cannot be undone.`)) return;

        setLoading(true)
        setShowBatchModal(false)
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices/month/${batchConfig.month}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            if (response.ok) {
                alert(result.message)
                fetchInvoices()
            } else {
                alert(`Error: ${result.message} `)
            }
        } catch (error) {
            console.error('Error deleting invoices:', error)
            alert('Failed to connect to server')
        } finally {
            setLoading(false)
        }
    }
    const normalizeClass = (className) => {
        if (!className) return '';
        return className
            .replace(/-/g, ' ')
            .replace(/1/g, 'I')
            .replace(/2/g, 'II')
            .replace(/3/g, 'III')
            .replace(/4/g, 'IV')
            .replace(/5/g, 'V')
            .replace(/6/g, 'VI')
            .replace(/7/g, 'VII')
            .replace(/8/g, 'VIII')
            .replace(/9/g, 'IX')
            .replace(/10/g, 'X')
            .replace(/Grade /i, '')
            .trim();
    };

    const handleStudentChange = (studentId) => {
        const student = students.find(s => s._id.toString() === studentId.toString());
        if (student) {
            const studentClass = normalizeClass(student.CurrentClass || student.AdmissionClass);
            const structure = structures.find(s => normalizeClass(s.class) === studentClass);

            setNewInvoice({
                ...newInvoice,
                studentId,
                amount: structure ? structure.monthlyFee : ''
            });
        } else {
            setNewInvoice({ ...newInvoice, studentId });
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                fetchInvoices()
            } else {
                alert('Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handlePartialPaymentSubmit = async (e) => {
        e.preventDefault()
        if (!selectedInvoicePartial || !partialAmount) return

        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices/${selectedInvoicePartial._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paidAmount: parseFloat(partialAmount) })
            })
            if (response.ok) {
                setShowPartialModal(false)
                setPartialAmount('')
                fetchInvoices()
            } else {
                alert('Failed to update payment')
            }
        } catch (error) {
            console.error('Error recording partial payment:', error)
        }
    }

    const handleDeleteInvoice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                fetchInvoices()
            } else {
                alert('Failed to delete invoice')
            }
        } catch (error) {
            console.error('Error deleting invoice:', error)
        }
    }

    const handlePrint = (items) => {
        const studentsToPrint = Array.isArray(items) ? items : [items];
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

        let content = '';
        studentsToPrint.forEach((student, studentIndex) => {
            const studentInvoices = student.unpaidInvoices || [];

            // Current Month Invoices (could be multiple: Tuition, Lab, etc)
            const currentMonthInvoices = studentInvoices.filter(inv => inv.month === currentMonth);
            // Previous Unpaid Invoices (Arrears)
            const arrearsInvoices = studentInvoices.filter(inv => inv.month !== currentMonth);

            const totalArrears = arrearsInvoices.reduce((acc, inv) => acc + (inv.remainingBalance ?? inv.amount), 0);
            const totalCurrent = currentMonthInvoices.reduce((acc, inv) => acc + (inv.remainingBalance ?? inv.amount), 0);
            const grandTotal = totalArrears + totalCurrent;

            // For dates, use the first current month invoice if available, else latest from arrears
            const referenceInv = currentMonthInvoices[0] || arrearsInvoices[0];
            const dueDate = referenceInv ? new Date(referenceInv.dueDate).toLocaleDateString('en-GB') : '---';
            const validTill = referenceInv ? new Date(new Date(referenceInv.dueDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') : '---';
            const afterDate = referenceInv ? new Date(new Date(referenceInv.dueDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB') : '---';

            const copyNames = ['Bank Copy', 'Student Copy', 'School/College Copy'];

            content += `<div class="student-page">`;

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
                                <td class="val">${student.RollNo || student._id}</td>
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
                                <td class="val">${student.RollNo || student._id}</td>
                            </tr>
                            <tr>
                                <td>Student Name</td>
                                <td class="val">${student.FirstName} ${student.LastName}</td>
                            </tr>
                            <tr>
                                <td>Father Name</td>
                                <td class="val">${student.FatherName || student.fatherName || '---'}</td>
                            </tr>
                            <tr>
                                <td>Class</td>
                                <td class="val">${student.CurrentClass || student.AdmissionClass}</td>
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
                                <td class="val">${student.GuardianContactNo || student.GuardianPhone || ''}</td>
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
                                ${currentMonthInvoices.map(inv => `
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
        });

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

    const [newInvoice, setNewInvoice] = useState({
        studentId: '',
        studentName: '',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        amount: '',
        dueDate: '',
        type: 'Tuition Fee',
        description: ''
    })

    const handleCreateInvoice = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/api/fees/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newInvoice),
            })

            if (response.ok) {
                const savedInvoice = await response.json()
                setTransactions([savedInvoice, ...transactions])
                setShowInvoiceModal(false)
                setNewInvoice({
                    studentId: '',
                    studentName: '',
                    month: new Date().toISOString().slice(0, 7),
                    amount: '',
                    dueDate: '',
                    type: 'Tuition Fee',
                    description: ''
                })
            } else {
                const error = await response.json()
                alert(`Error: ${error.message}`)
            }
        } catch (error) {
            console.error('Error creating invoice:', error)
            alert('Failed to connect to server')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200'
            case 'partially_paid': return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200'
            case 'not-generated': return 'bg-gray-100 text-gray-500 border-gray-200 italic'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Memoize combined data calculation to improve performance
    const combinedData = useMemo(() => {
        return students.map(student => {
            const studentInvoices = transactions.filter(t => t.studentId.toString() === student._id.toString());
            const unpaidInvoices = studentInvoices.filter(t => t.status !== 'paid');
            const thisMonthInvoice = studentInvoices.find(t => t.month === currentMonth);

            const totalAmount = studentInvoices.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const totalPaid = studentInvoices.reduce((acc, curr) => acc + Number(curr.paidAmount || 0), 0);
            const totalRemaining = studentInvoices.reduce((acc, curr) => acc + Number(curr.remainingBalance !== undefined ? curr.remainingBalance : (curr.status === 'pending' || curr.status === 'overdue' ? curr.amount : 0)), 0);

            const getOverallStatus = () => {
                if (!thisMonthInvoice && studentInvoices.length === 0) return 'not-generated';
                if (thisMonthInvoice) return thisMonthInvoice.status;

                // If no this month invoice, look at history
                if (studentInvoices.some(inv => inv.status === 'overdue')) return 'overdue';
                if (studentInvoices.some(inv => inv.status === 'partially_paid')) return 'partially_paid';
                if (studentInvoices.some(inv => inv.status === 'pending')) return 'pending';
                if (studentInvoices.every(inv => inv.status === 'paid')) return 'paid';
                return 'not-generated';
            };

            return {
                ...student,
                latestInvoice: thisMonthInvoice || studentInvoices[0],
                status: getOverallStatus(),
                displayInvoice: thisMonthInvoice || studentInvoices[0],
                unpaidInvoices,
                totalAmount,
                totalPaid,
                totalRemaining,
                invoiceCount: studentInvoices.length
            };
        });
    }, [students, transactions, currentMonth]);

    // Memoize filtered transactions to avoid recalculating on every render
    const filteredTransactions = useMemo(() => {
        return combinedData.filter(item => {
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
            const itemClass = item.CurrentClass || item.AdmissionClass
            const matchesClass = selectedClass === 'all' || normalizeClass(itemClass) === normalizeClass(selectedClass)

            const name = `${item.FirstName} ${item.LastName}`.toLowerCase()
            const id = (item._id || '').toString()
            const invNum = (item.displayInvoice?.invoiceNumber || '').toLowerCase()
            const matchesSearch = name.includes(searchQuery.toLowerCase()) || id.includes(searchQuery) || invNum.includes(searchQuery.toLowerCase())

            return matchesStatus && matchesClass && matchesSearch
        })
    }, [combinedData, selectedStatus, selectedClass, searchQuery]);

    // Memoize revenue calculations
    const totalRevenue = useMemo(() => {
        return transactions
            .filter(t => t.status === 'paid' || t.status === 'partially_paid')
            .reduce((acc, curr) => acc + Number(curr.paidAmount || (curr.status === 'paid' ? curr.amount : 0)), 0)
    }, [transactions]);

    const pendingAmount = useMemo(() => {
        return transactions
            .filter(t => t.status !== 'paid')
            .reduce((acc, curr) => {
                const balance = curr.remainingBalance !== undefined ? curr.remainingBalance : (curr.status === 'pending' || curr.status === 'overdue' ? curr.amount : 0);
                return acc + Number(balance);
            }, 0)
    }, [transactions]);

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
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowBatchModal(true)}
                        className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faHistory} className="mr-2" />
                        Batch Generate
                    </button>
                    <button
                        onClick={() => setShowInvoiceModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Create Invoice
                    </button>
                </div>
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
                                <option value="not-generated">Not Generated</option>
                            </select>
                        </div>

                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="all">All Classes</option>
                                {structures.map(s => (
                                    <option key={s._id} value={s.class}>{s.class}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => handlePrint(filteredTransactions)}
                            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center shadow-sm whitespace-nowrap"
                            title="Print all filtered slips"
                        >
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            Print All
                        </button>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading data...</td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No students found.</td>
                                </tr>
                            ) : (
                                filteredTransactions.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {item.displayInvoice?.invoiceNumber || '---'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"
                                                onClick={() => {
                                                    setSelectedStudentHistory(item);
                                                    setShowHistoryModal(true);
                                                }}
                                            >
                                                {item.FirstName} {item.LastName}
                                                <FontAwesomeIcon icon={faHistory} className="text-[10px] opacity-0 group-hover:opacity-50" />
                                            </div>
                                            <div className="text-xs text-gray-500">{item.CurrentClass || item.AdmissionClass}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.displayInvoice ? `${item.displayInvoice.month} - ${item.displayInvoice.type}` : 'No Invoice'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">${item.totalAmount.toLocaleString()}</div>
                                            {item.totalPaid > 0 && (
                                                <div className="text-[10px] text-green-600 font-medium">Paid: ${item.totalPaid.toLocaleString()}</div>
                                            )}
                                            {item.totalRemaining > 0 && (
                                                <div className="text-[10px] text-red-500 font-medium">Due: ${item.totalRemaining.toLocaleString()}</div>
                                            )}
                                            {item.invoiceCount > 1 && (
                                                <div className="text-[9px] text-blue-500 italic mt-0.5">{item.invoiceCount} invoices total</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.displayInvoice ? new Date(item.displayInvoice.createdAt).toLocaleDateString() : '---'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                                {item.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-2">
                                                {item.displayInvoice ? (
                                                    <>
                                                        <button
                                                            onClick={() => handlePrint(item)}
                                                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                                                            title="Print Slip"
                                                        >
                                                            <FontAwesomeIcon icon={faPrint} />
                                                        </button>
                                                        {item.status === 'paid' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(item.displayInvoice._id, 'pending')}
                                                                className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors"
                                                                title="Mark as Unpaid"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(item.displayInvoice._id, 'paid')}
                                                                className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                                                                title="Mark as Paid"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedInvoicePartial(item.displayInvoice);
                                                                setPartialAmount(item.displayInvoice.paidAmount || '');
                                                                setShowPartialModal(true);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center transition-colors"
                                                            title="Partial Payment"
                                                        >
                                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">No actions</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                                <div className="relative student-search-container">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            placeholder="Search or select student..."
                                            value={studentSearchQuery}
                                            onChange={(e) => {
                                                setStudentSearchQuery(e.target.value);
                                                setShowStudentDropdown(true);
                                            }}
                                            onFocus={() => setShowStudentDropdown(true)}
                                        />
                                        {showStudentDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                {students
                                                    .filter(s => {
                                                        const searchLower = studentSearchQuery.toLowerCase();
                                                        const fullName = `${s.FirstName} ${s.LastName}`.toLowerCase();
                                                        const id = s._id.toString();
                                                        return fullName.includes(searchLower) || id.includes(searchLower);
                                                    })
                                                    .map(s => (
                                                        <div
                                                            key={s._id}
                                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                                            onClick={() => {
                                                                handleStudentChange(s._id);
                                                                setStudentSearchQuery(`${s.FirstName} ${s.LastName} (ID: ${s._id})`);
                                                                setShowStudentDropdown(false);
                                                            }}
                                                        >
                                                            <div className="font-medium text-gray-900">{s.FirstName} {s.LastName}</div>
                                                            <div className="text-sm text-gray-500">ID: {s._id} • Class: {s.CurrentClass || s.AdmissionClass}</div>
                                                        </div>
                                                    ))}
                                                {students.filter(s => {
                                                    const searchLower = studentSearchQuery.toLowerCase();
                                                    const fullName = `${s.FirstName} ${s.LastName}`.toLowerCase();
                                                    const id = s._id.toString();
                                                    return fullName.includes(searchLower) || id.includes(searchLower);
                                                }).length === 0 && (
                                                        <div className="px-4 py-3 text-gray-500 text-center">
                                                            No students found
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                                    <input
                                        type="month"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={newInvoice.month}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, month: e.target.value })}
                                    />
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
                </div >
            )}

            {/* Batch Generation Modal */}
            {
                showBatchModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Batch Generate</h2>
                                <button
                                    onClick={() => setShowBatchModal(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleGenerateMonthly} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Month</label>
                                    <input
                                        type="month"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        value={batchConfig.month}
                                        onChange={(e) => setBatchConfig({ ...batchConfig, month: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="overwrite"
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        checked={batchConfig.overwrite}
                                        onChange={(e) => setBatchConfig({ ...batchConfig, overwrite: e.target.checked })}
                                    />
                                    <label htmlFor="overwrite" className="text-sm font-medium text-orange-800 cursor-pointer select-none">
                                        Regenerate existing invoices for this month
                                        <span className="block text-xs text-orange-600/70 mt-0.5">(Overwrites previously generated amounts)</span>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                                    >
                                        Start Batch Generation
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteMonthly}
                                        className="w-full bg-white text-red-600 border border-red-200 px-8 py-3 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        Delete All Invoices for {batchConfig.month}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowBatchModal(false)}
                                        className="w-full px-6 py-2 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Student Fee History Modal */}
            {
                showHistoryModal && selectedStudentHistory && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Fee History</h2>
                                    <p className="text-blue-100 text-sm">
                                        {selectedStudentHistory.FirstName} {selectedStudentHistory.LastName} • Student ID: {selectedStudentHistory._id}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowHistoryModal(false)}
                                    className="text-white/80 hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto bg-gray-50/50">
                                <div className="space-y-4">
                                    {transactions
                                        .filter(t => t.studentId.toString() === selectedStudentHistory._id.toString())
                                        .sort((a, b) => b.month.localeCompare(a.month))
                                        .map((inv) => (
                                            <div key={inv._id} className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${inv.status === 'paid' ? 'bg-green-50 text-green-600' :
                                                        inv.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                                                        }`}>
                                                        <FontAwesomeIcon icon={inv.status === 'paid' ? faCheckCircle : faFileInvoiceDollar} />
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {new Date(inv.month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                                                            {inv.type} • #{inv.invoiceNumber}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">ISSUED: {new Date(inv.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-gray-900 mb-1">${inv.amount.toLocaleString()}</div>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            inv.status === 'overdue' ? 'bg-red-100 text-red-700 border-red-200' :
                                                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                            }`}>
                                                            {inv.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handlePrint({ ...selectedStudentHistory, displayInvoice: inv })}
                                                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                                                            title="Print Slip"
                                                        >
                                                            <FontAwesomeIcon icon={faPrint} className="text-xs" />
                                                        </button>
                                                        {inv.status === 'paid' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(inv._id, 'pending')}
                                                                className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 flex items-center justify-center transition-colors shadow-sm"
                                                                title="Mark as Unpaid"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(inv._id, 'paid')}
                                                                className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors shadow-sm"
                                                                title="Mark as Paid"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedInvoicePartial(inv);
                                                                setPartialAmount(inv.paidAmount || '');
                                                                setShowPartialModal(true);
                                                            }}
                                                            className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center transition-colors shadow-sm"
                                                            title="Partial Payment"
                                                        >
                                                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-xs" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteInvoice(inv._id)}
                                                            className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm"
                                                            title="Delete Invoice"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {transactions.filter(t => t.studentId.toString() === selectedStudentHistory._id.toString()).length === 0 && (
                                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FontAwesomeIcon icon={faHistory} className="text-3xl text-gray-200" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold text-lg">No Records Yet</h3>
                                            <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">This student doesn't have any generated invoices in the system yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Total {transactions.filter(t => t.studentId.toString() === selectedStudentHistory._id.toString()).length} Entries
                                    </span>
                                </div>
                                <button
                                    onClick={() => handlePrint(transactions.filter(t => t.studentId.toString() === selectedStudentHistory._id.toString()).map(t => ({ ...selectedStudentHistory, displayInvoice: t })))}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center shadow-md"
                                >
                                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                                    Print Statements
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Partial Payment Modal */}
            {
                showPartialModal && selectedInvoicePartial && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-100">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Record Payment</h2>
                                    <p className="text-purple-100 text-sm">Invoice: {selectedInvoicePartial.invoiceNumber}</p>
                                </div>
                                <button
                                    onClick={() => setShowPartialModal(false)}
                                    className="text-white/80 hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handlePartialPaymentSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</div>
                                        <div className="text-xl font-black text-gray-900">${selectedInvoicePartial.amount}</div>
                                    </div>
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Current Balance</div>
                                        <div className="text-xl font-black text-blue-700">
                                            ${selectedInvoicePartial.remainingBalance !== undefined ? selectedInvoicePartial.remainingBalance : selectedInvoicePartial.amount}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-tight">Amount Paid (PKR)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</div>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max={selectedInvoicePartial.amount}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-purple-500 focus:bg-white focus:outline-none transition-all text-lg font-bold"
                                            placeholder="0.00"
                                            value={partialAmount}
                                            onChange={(e) => setPartialAmount(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                                        {partialAmount > 0 && partialAmount < selectedInvoicePartial.amount
                                            ? `* This will mark the invoice as Partially Paid.`
                                            : partialAmount == selectedInvoicePartial.amount
                                                ? `* This will mark the invoice as Fully Paid.`
                                                : '* Enter the amount received from the student.'}
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPartialModal(false)}
                                        className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Record Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default AdminFees
