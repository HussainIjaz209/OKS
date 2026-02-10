import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../apiConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faSearch,
    faCalendarAlt,
    faMoneyBillWave,
    faBuilding,
    faTools,
    faFilter,
    faTrash,
    faCheckCircle,
    faExclamationCircle,
    faChevronRight,
    faPlusCircle,
    faTimes,
    faWallet,
    faChartLine,
    faLightbulb,
    faEdit,
    faMoneyCheckAlt
} from '@fortawesome/free-solid-svg-icons'

const AdminExpenses = () => {
    const [expenses, setExpenses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [stats, setStats] = useState({ totalSpent: 0, totalPending: 0, byCategory: [] })
    const [filter, setFilter] = useState({ category: 'All', startDate: '', endDate: '' })
    const [searchQuery, setSearchQuery] = useState('')

    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: 'Other',
        payee: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        description: '',
        status: 'Paid'
    })

    const fetchData = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams(filter).toString()
            const [expensesRes, statsRes, teachersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/expenses?${queryParams}`),
                fetch(`${API_BASE_URL}/api/expenses/stats`),
                fetch(`${API_BASE_URL}/api/teachers`)
            ])
            const expensesData = await expensesRes.json()
            const statsData = await statsRes.json()
            const teachersData = await teachersRes.json()

            if (expensesData.success) {
                let allExpenses = expensesData.data;
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                // Only generate virtual expenses filters are not restricting date to past/future ranges strictly
                // or if it's the default view
                const isCurrentView = !filter.startDate || (new Date(filter.startDate).getMonth() === currentMonth);

                if (isCurrentView) {
                    // 1. Check/Add Building Rent
                    // Only if filter allows 'Building Rent'
                    if (filter.category === 'All' || filter.category === 'Building Rent') {
                        const hasRent = allExpenses.some(e =>
                            e.category === 'Building Rent' &&
                            new Date(e.date).getMonth() === currentMonth &&
                            new Date(e.date).getFullYear() === currentYear
                        );

                        if (!hasRent) {
                            allExpenses.push({
                                _id: 'virtual_rent',
                                title: `Building Rent - ${new Date().toLocaleString('default', { month: 'long' })}`,
                                category: 'Building Rent',
                                amount: 32000,
                                payee: 'Landlord',
                                date: new Date().toISOString().split('T')[0],
                                status: 'Pending',
                                paymentMethod: 'Cash',
                                isVirtual: true
                            });
                        }
                    }

                    // 2. Check/Add Teacher Salaries
                    // Only if filter allows 'Salary'
                    if (Array.isArray(teachersData) && (filter.category === 'All' || filter.category === 'Salary')) {
                        teachersData.forEach(t => {
                            const fullName = `${t.firstName} ${t.lastName}`;
                            const hasSalary = allExpenses.some(e =>
                                e.category === 'Salary' &&
                                (e.teacher === t._id || e.payee === fullName) &&
                                new Date(e.date).getMonth() === currentMonth &&
                                new Date(e.date).getFullYear() === currentYear
                            );

                            if (!hasSalary) {
                                allExpenses.push({
                                    _id: `virtual_salary_${t._id}`,
                                    title: `Salary - ${fullName}`,
                                    category: 'Salary',
                                    amount: 0,
                                    payee: fullName,
                                    teacher: t._id,
                                    date: new Date().toISOString().split('T')[0],
                                    status: 'Pending',
                                    paymentMethod: 'Cash',
                                    isVirtual: true
                                });
                            }
                        });
                    }
                }

                // Sort by date desc (virtual items might be at end, need resort if strictly needed, but pushed items are 'today')
                allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

                setExpenses(allExpenses)

                // Calculate pending total
                const pending = allExpenses
                    .filter(e => e.status === 'Pending')
                    .reduce((acc, curr) => acc + Number(curr.amount), 0)

                if (statsData.success) {
                    setStats({ ...statsData.data, totalPending: pending })
                }
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching expenses:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filter])

    const handleCreateExpense = async (e) => {
        e.preventDefault()
        try {
            const url = newExpense.isEditing
                ? `${API_BASE_URL}/api/expenses/${newExpense._id}`
                : `${API_BASE_URL}/api/expenses`

            const method = newExpense.isEditing ? 'PUT' : 'POST'

            // Clean up internal flags before sending
            const payload = { ...newExpense }
            delete payload.isEditing
            delete payload.isVirtual
            delete payload._id // Don't send _id for new posts (or virtuals)

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (response.ok) {
                fetchData()
                setShowModal(false)
                setNewExpense({
                    title: '',
                    amount: '',
                    category: 'Other',
                    payee: '',
                    date: new Date().toISOString().split('T')[0],
                    paymentMethod: 'Cash',
                    description: '',
                    status: 'Paid',
                    isEditing: false,
                    isVirtual: false
                })
            }
        } catch (error) {
            console.error('Error saving expense:', error)
        }
    }

    const handleEditExpense = (expense) => {
        // If it's a virtual expense, give it a clean state for "Creation" but with prefilled data
        if (expense.isVirtual) {
            setNewExpense({
                title: expense.title,
                amount: expense.amount || '', // Allow empty for 0
                category: expense.category,
                payee: expense.payee,
                date: expense.date,
                paymentMethod: 'Cash',
                description: '',
                // Actually user said "assign him salary... and pay option...". 
                // Let's default to Paid if they are editing to Pay? No, keep it as they wish.
                status: 'Paid',
                teacher: expense.teacher,
                isVirtual: true // Mark as virtual so save handler knows to POST
            })
        } else {
            setNewExpense({ ...expense, isEditing: true })
        }
        setShowModal(true)
    }

    const handlePayExpense = async (expense) => {
        if (!window.confirm(`Mark ${expense.title} as PAID?`)) return

        try {
            if (expense.isVirtual) {
                // It's a virtual item (e.g. pending rent or salary), so we CREATE it as Paid
                const payload = {
                    title: expense.title,
                    amount: expense.amount,
                    category: expense.category,
                    payee: expense.payee,
                    date: expense.date,
                    paymentMethod: 'Cash', // Default
                    status: 'Paid',
                    teacher: expense.teacher
                };

                const response = await fetch(`${API_BASE_URL}/api/expenses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) fetchData();
            } else {
                // Existing item, just update status
                const response = await fetch(`${API_BASE_URL}/api/expenses/${expense._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'Paid' })
                });
                if (response.ok) fetchData();
            }
        } catch (error) {
            console.error('Error paying expense:', error)
        }
    }

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return
        try {
            const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                fetchData()
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
        }
    }

    const categories = [
        { name: 'Salary', icon: faWallet, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Building Rent', icon: faBuilding, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Maintenance', icon: faTools, color: 'text-orange-600', bg: 'bg-orange-100' },
        { name: 'Utilities', icon: faLightbulb, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { name: 'Stationery', icon: faPlusCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { name: 'Other', icon: faMoneyBillWave, color: 'text-slate-600', bg: 'bg-slate-100' }
    ]

    const getCategoryStyles = (category) => {
        const cat = categories.find(c => c.name === category)
        return cat ? `${cat.color} ${cat.bg}` : 'text-slate-600 bg-slate-100'
    }

    const filteredExpensesList = expenses.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.payee.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Expense Management
                        </h1>
                        <p className="text-gray-600 text-lg">Track salaries, rent, maintenance and other school expenditures</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add New Expense
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Spent</p>
                                <h3 className="text-2xl font-black text-slate-800">Rs. {stats.totalSpent.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faExclamationCircle} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                                <h3 className="text-2xl font-black text-slate-800">Rs. {stats.totalPending?.toLocaleString() || 0}</h3>
                            </div>
                        </div>
                    </div>
                    {/* Add more stats summarizing top 3 categories */}
                    {stats.byCategory.slice(0, 3).map((cat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white hover:shadow-2xl transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${getCategoryStyles(cat._id)}`}>
                                    <FontAwesomeIcon icon={categories.find(c => c.name === cat._id)?.icon || faMoneyBillWave} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{cat._id}</p>
                                    <h3 className="text-2xl font-black text-slate-800">Rs. {cat.total.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="relative w-full lg:w-96 group">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title or payee..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                            {['All', 'Salary', 'Rent', 'Maintenance'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter({ ...filter, category: cat === 'Rent' ? 'Building Rent' : cat })}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${(filter.category === cat || (cat === 'Rent' && filter.category === 'Building Rent'))
                                        ? 'bg-white text-blue-600 shadow-md transform scale-105'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-400" />
                            <input
                                type="date"
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600"
                                value={filter.startDate}
                                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                            />
                            <span className="text-slate-300">to</span>
                            <input
                                type="date"
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600"
                                value={filter.endDate}
                                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Expenses Table */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Expense Details</th>
                                    <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Payee</th>
                                    <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filteredExpensesList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                                            </div>
                                            <p className="text-slate-500 font-bold">No expenses found for the selected criteria</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredExpensesList.map((exp) => (
                                        <tr key={exp._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryStyles(exp.category)}`}>
                                                        <FontAwesomeIcon icon={categories.find(c => c.name === exp.category)?.icon || faMoneyBillWave} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{exp.title}</p>
                                                        <p className="text-xs text-slate-400">{new Date(exp.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getCategoryStyles(exp.category)}`}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-slate-600">{exp.payee}</td>
                                            <td className="px-8 py-6">
                                                <p className="text-lg font-black text-slate-800">Rs. {exp.amount.toLocaleString()}</p>
                                                <p className="text-xs text-slate-400">{exp.paymentMethod}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${exp.status === 'Paid' ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${exp.status === 'Paid' ? 'bg-emerald-600' : 'bg-orange-600 animate-pulse'}`}></div>
                                                    {exp.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {exp.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handlePayExpense(exp)}
                                                            className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110"
                                                            title="Mark as Paid"
                                                        >
                                                            <FontAwesomeIcon icon={faMoneyCheckAlt} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditExpense(exp)}
                                                        className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform hover:rotate-12"
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    {!exp.isVirtual && (
                                                        <button
                                                            onClick={() => handleDeleteExpense(exp._id)}
                                                            className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                                                            title="Delete"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
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

                {/* Add Expense Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)}></div>
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white flex justify-between items-center flex-shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight">Add New Expense</h2>
                                    <p className="text-blue-100 font-medium">Record a new payment or expenditure</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto flex-1 bg-slate-50">
                                <form onSubmit={handleCreateExpense} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Expense Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Electricity Bill Jan 2026"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700"
                                                value={newExpense.title}
                                                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Amount (Rs.)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700"
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Category</label>
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700 appearance-none"
                                                value={newExpense.category}
                                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Payee Name</label>
                                            <input
                                                type="text"
                                                placeholder="Who are you paying?"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700"
                                                value={newExpense.payee}
                                                onChange={(e) => setNewExpense({ ...newExpense, payee: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700"
                                                value={newExpense.date}
                                                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Payment Method</label>
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700 appearance-none"
                                                value={newExpense.paymentMethod}
                                                onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                                            >
                                                <option value="Cash">Cash</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Status</label>
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700 appearance-none"
                                                value={newExpense.status}
                                                onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Description (Optional)</label>
                                            <textarea
                                                placeholder="Add any additional notes here..."
                                                rows="3"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700 resize-none"
                                                value={newExpense.description}
                                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 p-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-12 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            Record Expense
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminExpenses
