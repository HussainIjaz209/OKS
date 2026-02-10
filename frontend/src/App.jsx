import React from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import StudentDashboard from './pages/student/Dashboard'
import Layout from './components/Layout'
import StudentProfile from './pages/student/Profile'
import StudentAcademic from './pages/student/Academic'
import StudentFees from './pages/student/Fees'
import StudentEvents from './pages/student/Events'
import StudentAssignments from './pages/student/Assignments'
import StudentExam from './pages/student/Exam'
import StudentAnnouncements from './pages/student/Announcements'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherStudents from './pages/teacher/Students'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherTimetable from './pages/teacher/Timetable'
import TeacherMaterials from './pages/teacher/Materials'
import TeacherAnnouncements from './pages/teacher/Announcements'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherExams from './pages/teacher/Exams'
import TeacherEvaluation from './pages/teacher/Evaluation'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAdmissions from './pages/admin/Admissions'
import TeacherProfile from './pages/teacher/Profile'
import AdminFees from './pages/admin/Fees'
import AdminUsers from './pages/admin/Users'
import AdminClasses from './pages/admin/Classes'
import AdminExams from './pages/admin/Exams'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import AdminExpenses from './pages/admin/Expenses'
import AdminIDCards from './pages/admin/IDCards'
import AdminEvents from './pages/admin/Events'
import Settings from './pages/shared/Settings'
import NotFound from './pages/NotFound'
import Gallery from './pages/publicPages/Gallery'
import Contact from './pages/publicPages/Contact'
import OnlineAdmission from './pages/publicPages/OnlineAdmission'
import EventDetails from './pages/publicPages/EventDetails'
import Jobs from './pages/publicPages/Jobs'

function App() {

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/online-admission" element={<OnlineAdmission />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/jobs" element={<Jobs />} />

            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentProfile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/academics" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentAcademic />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/fees" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentFees />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/events" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentEvents />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/events/:id" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <EventDetails isPublic={false} />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentAssignments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/exams" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentExam />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <StudentAnnouncements />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout role="student">
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher/profile" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherProfile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/students" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherStudents />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/assignments" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherAssignments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/timetable" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherTimetable />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/materials" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherMaterials />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/announcements" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherAnnouncements />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/attendance" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherAttendance />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/exams" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherExams />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/evaluation" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <TeacherEvaluation />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/teacher/settings" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout role="teacher">
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/admissions" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminAdmissions />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fees" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminFees />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/id-cards" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminIDCards />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/classes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminClasses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/exams" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminExams />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/expenses" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminExpenses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout role="admin">
                  <AdminEvents />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App
