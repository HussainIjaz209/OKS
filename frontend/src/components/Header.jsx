import { useAuth } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBars, 
  faBell, 
  faGraduationCap, 
  faSignOutAlt, 
  faTimes,
  faCrown,
  faChalkboardTeacher,
  faUserGraduate,
  faUser
} from '@fortawesome/free-solid-svg-icons'

const Header = ({ user, onToggleSidebar, sidebarOpen }) => {
  const { logout } = useAuth()

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'from-purple-500 to-purple-600'
      case 'teacher': return 'from-green-500 to-green-600'
      case 'student': return 'from-blue-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin': return faCrown;
      case 'teacher': return faChalkboardTeacher;
      case 'student': return faUserGraduate;
      default: return faUser;
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
            >
              <FontAwesomeIcon
                icon={sidebarOpen ? faTimes : faBars}
                className="text-lg"
              />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OKS
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative group">
              <button className="w-12 h-12 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>

              {/* Notification Dropdown */}
              <div className="absolute right-0 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {[
                    { id: 1, message: 'New assignment submitted', time: '5 min ago', type: 'success' },
                    { id: 2, message: 'Fee payment reminder', time: '1 hour ago', type: 'warning' },
                    { id: 3, message: 'System update available', time: '2 hours ago', type: 'info' }
                  ].map(notification => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <p className="text-gray-800 font-medium">{notification.message}</p>
                      <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <button className="w-full text-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                    View All Notifications
                  </button>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                <div className="flex items-center justify-end space-x-2">
                  <FontAwesomeIcon
                    icon={getRoleIcon()}
                    className="text-sm text-gray-500"
                  />
                  <p className="text-sm text-gray-600 capitalize font-medium">{user?.role}</p>
                </div>
              </div>

              {/* User Avatar */}
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 cursor-pointer">
                  {user?.name?.split(' ').map(n => n[0]).join('')}

                  {/* Online Status */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Profile Dropdown - Uncomment if needed */}
                <div className="absolute right-0 top-16 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <FontAwesomeIcon
                            icon={getRoleIcon()}
                            className="text-sm text-gray-500"
                          />
                          <p className="text-sm text-gray-600 capitalize font-medium">{user?.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Logout button inside dropdown */}
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header