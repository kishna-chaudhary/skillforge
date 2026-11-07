import type {
  ReactNode,
} from 'react'
import {
  Navigate,
  useLocation,
} from 'react-router-dom'

import {
  useAuth,
} from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?:
    | 'employee'
    | 'admin'
}

function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const location = useLocation()

  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth()

  // ----------------------------------------------
  // Session is being validated with /api/auth/me
  // ----------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading SkillForge...
          </p>
        </div>
      </div>
    )
  }

  // ----------------------------------------------
  // Not authenticated
  // ----------------------------------------------

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  // ----------------------------------------------
  // Role protection
  // ----------------------------------------------

  if (
    requiredRole &&
    user.role !== requiredRole
  ) {
    if (user.role === 'admin') {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      )
    }

    return (
      <Navigate
        to="/employee/dashboard"
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute