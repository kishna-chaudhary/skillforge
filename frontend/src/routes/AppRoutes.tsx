import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/auth/Login'

// ==================================================
// EMPLOYEE
// ==================================================

import LearningDashboard from '../pages/employee/LearningDashboard'
import JobRoles from '../pages/employee/JobRoles'
import RoleRoadmap from '../pages/employee/RoleRoadmap'
import TopicLearning from '../pages/employee/TopicLearning'
import LessonLearning from '../pages/employee/LessonLearning'
import Quiz from '../pages/employee/Quiz'
import QuizResult from '../pages/employee/QuizResult'
import LiveSessions from '../pages/employee/LiveSessions'
import LiveSessionRoom from '../pages/employee/LiveSessionRoom'
import Certificates from '../pages/employee/Certificates'
import Profile from '../pages/employee/Profile'
import Notifications from '../pages/employee/Notifications'
import Progress from '../pages/employee/Progress'
import FinalPracticalChallenge from '../pages/employee/FinalPracticalChallenge'

// ==================================================
// ADMIN
// ==================================================
import TopicManagement from '../pages/admin/TopicManagement'
import AdminDashboard from '../pages/admin/AdminDashboard'
import CareerRoles from '../pages/admin/CareerRoles'
import RoleManagement from '../pages/admin/RoleManagement'
import Employees from '../pages/admin/Employees'
import LessonManagement from '../pages/admin/LessonManagement'
import LessonContentEditor from '../pages/admin/LessonContentEditor'
import AssessmentManagement from '../pages/admin/AssessmentManagement'
import AssessmentsOverview from '../pages/admin/AssessmentsOverview'
import LearningContentOverview from '../pages/admin/LearningContentOverview'
import AdminLiveSessions from '../pages/admin/AdminLiveSessions'
import CreateLiveSession from '../pages/admin/CreateLiveSession'
import AdminProgressAnalytics from '../pages/admin/AdminProgressAnalytics'
import AdminCertificates from '../pages/admin/AdminCertificates'
import PracticalChallenges from '../pages/admin/PracticalChallenges'
import PracticalChallengeEditor from '../pages/admin/PracticalChallengeEditor'
import QuizRecordings from '../pages/admin/QuizRecordings'

// ==================================================
// OLD ADMIN PAGES
// ==================================================
//
// These pages are still kept temporarily while the
// new Admin architecture is being built.
//
// We will remove them after their replacements are
// complete.
// ==================================================

import AdminCourses from '../pages/admin/Courses'
import CourseBuilder from '../pages/admin/CourseBuilder'
import LessonEditor from '../pages/admin/LessonEditor'
import Quizzes from '../pages/admin/Quizzes'
import QuizBuilder from '../pages/admin/QuizBuilder'

function AppRoutes() {
  return (
    
      <Routes>

        {/* ==================================================
            AUTH
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            EMPLOYEE
        ================================================== */}

        {/* Dashboard */}

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <LearningDashboard />
            </ProtectedRoute>
          }
        />

        {/* Career Roles */}

        <Route
          path="/employee/roles"
          element={
            <ProtectedRoute requiredRole="employee">
              <JobRoles />
            </ProtectedRoute>
          }
        />

        {/* Career Roadmap */}

        <Route
          path="/employee/roles/:roleId"
          element={
            <ProtectedRoute requiredRole="employee">
              <RoleRoadmap />
            </ProtectedRoute>
          }
        />

        {/* Topic Learning */}

        <Route
          path="/employee/roles/:roleId/topics/:topicId"
          element={
            <ProtectedRoute requiredRole="employee">
              <TopicLearning />
            </ProtectedRoute>
          }
        />

        {/* Lesson Learning */}

        <Route
          path="/employee/roles/:roleId/topics/:topicId/lessons/:lessonIndex"
          element={
            <ProtectedRoute requiredRole="employee">
              <LessonLearning />
            </ProtectedRoute>
          }
        />

        {/* Topic Assessment */}

        <Route
          path="/employee/roles/:roleId/topics/:topicId/quiz"
          element={
            <ProtectedRoute requiredRole="employee">
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/roles/:roleId/topics/:topicId/quiz/result"
          element={
            <ProtectedRoute requiredRole="employee">
              <QuizResult />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            EMPLOYEE LIVE SESSIONS
        ================================================== */}

        <Route
          path="/employee/live-sessions"
          element={
            <ProtectedRoute requiredRole="employee">
              <LiveSessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/live-sessions/room"
          element={
            <ProtectedRoute requiredRole="employee">
              <LiveSessionRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/live-sessions/room"
          element={
            <ProtectedRoute requiredRole="admin">
              <LiveSessionRoom />
            </ProtectedRoute>
          }
        />

        {/* Old live-session URLs */}

        <Route
          path="/employee/live-sessions/:sessionId"
          element={
            <ProtectedRoute requiredRole="employee">
              <Navigate
                to="/employee/live-sessions"
                replace
              />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            OLD EMPLOYEE COURSE ROUTES
        ================================================== */}

        <Route
          path="/employee/courses/*"
          element={
            <ProtectedRoute requiredRole="employee">
              <Navigate
                to="/employee/roles"
                replace
              />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            EMPLOYEE CERTIFICATES
        ================================================== */}

        <Route
          path="/employee/certificates"
          element={
            <ProtectedRoute requiredRole="employee">
              <Certificates />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            EMPLOYEE PROGRESS
        ================================================== */}

        <Route
          path="/employee/progress"
          element={
            <ProtectedRoute requiredRole="employee">
              <Progress />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            EMPLOYEE PROFILE
        ================================================== */}

        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute requiredRole="employee">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            EMPLOYEE NOTIFICATIONS
        ================================================== */}

        <Route
          path="/employee/notifications"
          element={
            <ProtectedRoute requiredRole="employee">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/practical-challenge/:roleId"
          element={
           <ProtectedRoute requiredRole="employee">
              <FinalPracticalChallenge />
           </ProtectedRoute>
          }
        />

        <Route
          path="/admin/practical-challenges/:roleId"
          element={
            <ProtectedRoute requiredRole="admin">
              <PracticalChallengeEditor />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN CAREER ROLES
        ================================================== */}

        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute requiredRole="admin">
              <CareerRoles />
            </ProtectedRoute>
          }
        />

        {/* Selected Career Role */}

        <Route
          path="/admin/roles/:roleId"
          element={
            <ProtectedRoute requiredRole="admin">
              <RoleManagement />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN TOPIC MANAGEMENT
        ==================================================

            Topic Management page will be built next.

            For now, clicking "Manage Topic" safely returns
            to Career Roles instead of falling through to
            the /login wildcard.
        ================================================== */}

        <Route
          path="/admin/roles/:roleId/topics/:topicId"
          element={
            <ProtectedRoute requiredRole="admin">
              <TopicManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roles/:roleId/topics/:topicId/lessons"
          element={
            <ProtectedRoute requiredRole="admin">
             <LessonManagement />
            </ProtectedRoute>
          }
        />

        <Route
         path="/admin/roles/:roleId/topics/:topicId/lessons/:lessonIndex"
          element={
            <ProtectedRoute requiredRole="admin">
              <LessonContentEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/practical-challenges"
          element={
           <ProtectedRoute requiredRole="admin">
             <PracticalChallenges />
           </ProtectedRoute>
          }
        />


        <Route
         path="/admin/roles/:roleId/topics/:topicId/assessment"
         element={
            <ProtectedRoute requiredRole="admin">
              <AssessmentManagement />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN LEARNING CONTENT
        ==================================================

                replace
              />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN LEARNING CONTENT
        ==================================================

            Temporary route until Learning Content
            management is implemented.
        ================================================== */}

        <Route
          path="/admin/content"
          element={
            <ProtectedRoute requiredRole="admin">
              <LearningContentOverview />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN ASSESSMENTS
        ==================================================

            Temporary route until Assessment Management
            is implemented.
        ================================================== */}

        <Route
          path="/admin/assessments"
          element={
           <ProtectedRoute requiredRole="admin">
            <AssessmentsOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quiz-recordings"
          element={
            <ProtectedRoute requiredRole="admin">
             <QuizRecordings />
           </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN LIVE SESSIONS
        ==================================================

            Temporary route until Admin Live Sessions
            management is implemented.
        ================================================== */}

        <Route
          path="/admin/live-sessions"
         element={
            <ProtectedRoute requiredRole="admin">
             <AdminLiveSessions />
           </ProtectedRoute>
          }
        />

        <Route
          path="/admin/live-sessions/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateLiveSession />
           </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN EMPLOYEES
        ================================================== */}

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requiredRole="admin">
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN PROGRESS & ANALYTICS
        ==================================================

            Temporary route until Admin Analytics
            is implemented.
        ================================================== */}

        <Route
          path="/admin/progress"
          element={
           <ProtectedRoute requiredRole="admin">
             <AdminProgressAnalytics />
           </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN CERTIFICATES
        ==================================================

            Temporary route until Admin Certificate
            management is implemented.
        ================================================== */}

        <Route
         path="/admin/certificates"
          element={
           <ProtectedRoute requiredRole="admin">
              <AdminCertificates />
           </ProtectedRoute>
          }
        />

        {/* ==================================================
            OLD ADMIN ROUTES
        ==================================================

            Keep these temporarily so the old Admin files
            remain valid while we replace them one by one.
        ================================================== */}

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <CourseBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lessons/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <LessonEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute requiredRole="admin">
              <Quizzes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quizzes/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <QuizBuilder />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            DEFAULT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
   
  )
}

export default AppRoutes