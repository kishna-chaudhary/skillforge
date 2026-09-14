import type{
  FormEvent,
  } from 'react'
  import {
    useState,
  } from 'react'

import {
  useNavigate,
} from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')

    const normalizedEmail =
      email.trim().toLowerCase()

    // ==================================================
    // DEMO EMPLOYEE LOGIN
    // ==================================================

    if (
      normalizedEmail ===
        'employee@skillforge.com' &&
      password === 'employee123'
    ) {
      localStorage.setItem(
        'skillforge-auth',
        'true'
      )

      localStorage.setItem(
        'skillforge-role',
        'employee'
      )

      localStorage.setItem(
        'skillforge-user',
        'Employee'
      )

      navigate(
        '/employee/dashboard',
        { replace: true }
      )

      return
    }

    // ==================================================
    // DEMO ADMIN LOGIN
    // ==================================================

    if (
      normalizedEmail ===
        'admin@skillforge.com' &&
      password === 'admin123'
    ) {
      localStorage.setItem(
        'skillforge-auth',
        'true'
      )

      localStorage.setItem(
        'skillforge-role',
        'admin'
      )

      localStorage.setItem(
        'skillforge-user',
        'Admin'
      )

      navigate(
        '/admin/dashboard',
        { replace: true }
      )

      return
    }

    // ==================================================
    // INVALID LOGIN
    // ==================================================

    setError(
      'Invalid email or password.'
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="flex min-h-screen">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

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


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex w-full items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

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


            {/* Login Form */}

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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                className="w-full rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Sign in
              </button>

            </form>


            {/* Demo Credentials */}

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stage 1 Demo Accounts
              </p>

              <div className="mt-3 space-y-3 text-xs text-slate-600">

                <div className="rounded-lg bg-slate-50 p-3">

                  <p className="font-semibold text-slate-800">
                    Employee
                  </p>

                  <p className="mt-1">
                    employee@skillforge.com
                  </p>

                  <p>
                    Password: employee123
                  </p>

                </div>

                <div className="rounded-lg bg-slate-50 p-3">

                  <p className="font-semibold text-slate-800">
                    Admin
                  </p>

                  <p className="mt-1">
                    admin@skillforge.com
                  </p>

                  <p>
                    Password: admin123
                  </p>

                </div>

              </div>

            </div>


            {/* Footer */}

            <p className="mt-8 text-center text-xs text-slate-400">
              © 2026 SkillForge. All rights reserved.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login