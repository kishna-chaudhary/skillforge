import {
  useAuth,
} from '../../context/AuthContext'
import type {
  FormEvent,
} from 'react'
import {
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    fullName: string
    email: string
    role: 'employee' | 'admin'
  }
}

interface LocationState {
  from?: string
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
  login,
} = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email: email
              .trim()
              .toLowerCase(),
            password,
          }),
        }
      )

      const data =
        (await response.json()) as LoginResponse

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        setError(
          data.message ||
            'Unable to sign in.'
        )

        return
      }

      login(
          data.token,
          data.user
        )

      const state =
        location.state as
          | LocationState
          | null

      const requestedPath =
        state?.from

      if (
        requestedPath &&
        requestedPath.startsWith(
          `/${data.user.role}/`
        )
      ) {
        navigate(
          requestedPath,
          {
            replace: true,
          }
        )

        return
      }

      if (
        data.user.role === 'admin'
      ) {
        navigate(
          '/admin/dashboard',
          {
            replace: true,
          }
        )

        return
      }

      navigate(
        '/employee/dashboard',
        {
          replace: true,
        }
      )
    } catch (requestError) {
      console.error(
        'Login request failed:',
        requestError
      )

      setError(
        'Unable to connect to the SkillForge server.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        {/* Left side */}

        <div className="hidden w-1/2 flex-col justify-between bg-purple-700 p-12 text-white lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-purple-700">
                S
              </div>

              <span className="text-2xl font-bold">
                SkillForge
              </span>
            </div>

            <div className="mt-20 max-w-lg">
              <h1 className="text-5xl font-bold leading-tight">
                Build skills.
                <br />
                Build your career.
              </h1>

              <p className="mt-6 text-lg leading-8 text-purple-100">
                Learn job-ready skills through
                structured roadmaps, practical
                learning materials, and live
                doubt-solving sessions.
              </p>
            </div>
          </div>

          <p className="text-sm text-purple-200">
            SkillForge Learning Platform
          </p>
        </div>

        {/* Right side */}

        <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile logo */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white">
                S
              </div>

              <span className="text-2xl font-bold text-slate-900">
                SkillForge
              </span>
            </div>

            {/* Heading */}

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue learning.
              </p>
            </div>

            {/* Login form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-purple-600 hover:text-purple-700"
                    onClick={() =>
                      setError(
                        'Password reset will be available soon.'
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    {showPassword
                      ? 'Hide'
                      : 'Show'}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Signing in...'
                  : 'Sign in'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              © 2026 SkillForge. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login