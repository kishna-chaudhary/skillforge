import type { ReactNode } from 'react'
import {
  Navigate,
  useLocation,
} from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'employee' | 'admin'
}

function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const location = useLocation()

  const isAuthenticated =
    localStorage.getItem(
      'skillforge-auth'
    ) === 'true'

  const userRole =
    localStorage.getItem(
      'skillforge-role'
    )

  // ----------------------------------------------
  // Not logged in
  // ----------------------------------------------

  if (!isAuthenticated) {
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
    userRole !== requiredRole
  ) {
    if (userRole === 'admin') {
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