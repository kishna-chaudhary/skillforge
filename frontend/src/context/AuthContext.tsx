import type {
  ReactNode,
} from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserRole =
  | 'employee'
  | 'admin'

interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    token: string,
    user: AuthUser
  ) => void
  logout: () => void
}

interface MeResponse {
  success: boolean
  message?: string
  user?: AuthUser
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null
  )

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem(
        'skillforge-token'
      )
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const clearSession = () => {
    localStorage.removeItem(
      'skillforge-token'
    )

    // Remove old prototype auth values too.
    localStorage.removeItem(
      'skillforge-auth'
    )

    localStorage.removeItem(
      'skillforge-role'
    )

    localStorage.removeItem(
      'skillforge-user'
    )

    localStorage.removeItem(
      'skillforge-user-email'
    )

    setToken(null)
    setUser(null)
  }

  const login = (
    newToken: string,
    newUser: AuthUser
  ) => {
    localStorage.setItem(
      'skillforge-token',
      newToken
    )

    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    clearSession()
  }

  useEffect(() => {
    const validateSession =
      async () => {
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        setIsLoading(true)

        try {
          const response =
            await fetch(
              'http://localhost:5000/api/auth/me',
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          if (!response.ok) {
            clearSession()
            return
          }

          const data =
            (await response.json()) as MeResponse

          if (
            !data.success ||
            !data.user
          ) {
            clearSession()
            return
          }

          setUser(data.user)
        } catch (error) {
          console.error(
            'Session validation failed:',
            error
          )

          /*
           * A network failure is different
           * from an invalid JWT.
           *
           * Keep the token so a temporary
           * backend outage does not destroy
           * the saved login.
           */
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }

    void validateSession()
  }, [token])

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated:
      Boolean(token && user),
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}

export {
  AuthProvider,
  useAuth,
}

export type {
  AuthUser,
  UserRole,
}