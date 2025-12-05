import {
  faUserGraduate,
  faTachometerAlt,
  faUser,
  faGraduationCap,
  faMoneyBillWave,
  faCalendarAlt,
  faBookOpen,
  faTasks,
  faUsers,
  faBullhorn,
  faClipboardCheck,
  faSchool,
  faChartBar,
  faCog,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ role, isOpen, onClose }) => {
  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          { path: '/student', icon: faTachometerAlt, label: 'Dashboard' },
          { path: '/student/profile', icon: faUser, label: 'Profile' },
          { path: '/student/academics', icon: faGraduationCap, label: 'Academics' },
          { path: '/student/fees', icon: faMoneyBillWave, label: 'Fees' },
          { path: '/student/events', icon: faCalendarAlt, label: 'Events' },
          { path: '/student/learning', icon: faBookOpen, label: 'Learning' },
          { path: '/student/assignments', icon: faTasks, label: 'Assignments' }
        ]
      case 'teacher':
        return [
          { path: '/teacher', icon: faTachometerAlt, label: 'Dashboard' },
          { path: '/teacher/students', icon: faUsers, label: 'My Students' },
          { path: '/teacher/assignments', icon: faTasks, label: 'Assignments' },
          { path: '/teacher/timetable', icon: faCalendarAlt, label: 'Timetable' },
          { path: '/teacher/materials', icon: faBookOpen, label: 'Materials' },
          { path: '/teacher/announcements', icon: faBullhorn, label: 'Announcements' },
          { path: '/teacher/attendance', icon: faClipboardCheck, label: 'Attendance' }
        ]
      case 'admin':
        return [
          { path: '/admin', icon: faTachometerAlt, label: 'Dashboard' },
          { path: '/admin/admissions', icon: faUserGraduate, label: 'Admissions' },
          { path: '/admin/fees', icon: faMoneyBillWave, label: 'Fee Management' },
          { path: '/admin/users', icon: faUsers, label: 'User Management' },
          { path: '/admin/classes', icon: faSchool, label: 'Class Management' },
          { path: '/admin/reports', icon: faChartBar, label: 'Reports' },
          { path: '/admin/settings', icon: faCog, label: 'Settings' }
        ]
      default:
        return []
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case 'student': return 'from-blue-500 to-blue-600'
      case 'teacher': return 'from-green-500 to-green-600'
      case 'admin': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRoleGradient = () => {
    switch (role) {
      case 'student': return 'from-blue-500/10 to-blue-600/10'
      case 'teacher': return 'from-green-500/10 to-green-600/10'
      case 'admin': return 'from-purple-500/10 to-purple-600/10'
      default: return 'from-gray-500/10 to-gray-600/10'
    }
  }

  const menuItems = getMenuItems()

  // Active Link Component to handle the active state properly
  const ActiveNavLink = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group relative flex items-center px-4 py-3 text-slate-300 rounded-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg ${isActive
          ? `bg-gradient-to-r ${getRoleColor()} text-white shadow-lg scale-105`
          : `hover:bg-gradient-to-r ${getRoleGradient()} hover:text-white`
        }`
      }
      onClick={() => {
        if (window.innerWidth < 1024) {
          onClose()
        }
      }}
    >
      {({ isActive }) => (
        <>
          {/* Animated background effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getRoleColor()} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''
            }`}></div>

          {/* Content */}
          <div className="relative z-10 flex items-center w-full">
            <FontAwesomeIcon
              icon={item.icon}
              className={`text-lg w-6 text-center mr-3 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'group-hover:text-white group-hover:scale-110'
                }`}
            />
            <span className="font-medium transition-all duration-300">
              {item.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Hover arrow */}
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`ml-auto text-xs opacity-0 transform -translate-x-2 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'
                }`}
            />
          </div>
        </>
      )}
    </NavLink>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r border-slate-700/50 p-6 transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        }`}>

        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center shadow-lg`}>
              <FontAwesomeIcon icon={faUserGraduate} className='text-xl text-white' />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white capitalize">
                {role} Portal
              </h2>
              <p className="text-slate-400 text-sm">Welcome back!</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <ActiveNavLink key={item.path} item={item} />
          ))}
        </nav>


      </div>
    </>
  )
}

export default Sidebar