const {
  authenticate,
} = require('../middleware/auth')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool = require('../config/db')

const router = express.Router()

const normalizeEmail = (email) => {
  return email.trim().toLowerCase()
}

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        '1d',
    }
  )
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post('/register', async (req, res) => {
  const { fullName, email, password } =
    req.body

  if (
    !fullName ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Full name, email and password are required',
    })
  }

  const cleanName = fullName.trim()
  const cleanEmail =
    normalizeEmail(email)

  if (cleanName.length < 2) {
    return res.status(400).json({
      success: false,
      message:
        'Full name must contain at least 2 characters',
    })
  }

  if (
    !cleanEmail.includes('@')
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide a valid email address',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message:
        'Password must contain at least 8 characters',
    })
  }

  try {
    const existingUser =
      await pool.query(
        `
          SELECT id
          FROM users
          WHERE LOWER(email) = $1
          LIMIT 1
        `,
        [cleanEmail]
      )

    if (
      existingUser.rows.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          'An account with this email already exists',
      })
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      )

    /*
     * Public registration always creates
     * an employee.
     *
     * Never accept an admin role from
     * req.body here.
     */
    const result =
      await pool.query(
        `
          INSERT INTO users (
            full_name,
            email,
            password_hash,
            role
          )
          VALUES ($1, $2, $3, 'employee')
          RETURNING
            id,
            full_name,
            email,
            role,
            is_active,
            created_at
        `,
        [
          cleanName,
          cleanEmail,
          passwordHash,
        ]
      )

    const user = result.rows[0]

    const token =
      createToken(user)

    return res.status(201).json({
      success: true,
      message:
        'Account created successfully',
      token,
      user: {
        id: user.id,
        fullName:
          user.full_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Registration error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to create account',
    })
  }
})

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post('/login', async (req, res) => {
  const { email, password } =
    req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        'Email and password are required',
    })
  }

  const cleanEmail =
    normalizeEmail(email)

  try {
    const result =
      await pool.query(
        `
          SELECT
            id,
            full_name,
            email,
            password_hash,
            role,
            is_active
          FROM users
          WHERE LOWER(email) = $1
          LIMIT 1
        `,
        [cleanEmail]
      )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message:
          'This account is inactive',
      })
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash
      )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      })
    }

    const token =
      createToken(user)

    return res.status(200).json({
      success: true,
      message:
        'Login successful',
      token,
      user: {
        id: user.id,
        fullName:
          user.full_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(
      'Login error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Unable to login',
    })
  }
})
/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

router.get(
  '/me',
  authenticate,
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
            SELECT
              id,
              full_name,
              email,
              role,
              is_active,
              created_at
            FROM users
            WHERE id = $1
            LIMIT 1
          `,
          [req.user.userId]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      const user = result.rows[0]

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message:
            'This account is inactive',
        })
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          fullName:
            user.full_name,
          email: user.email,
          role: user.role,
          createdAt:
            user.created_at,
        },
      })
    } catch (error) {
      console.error(
        'Current user error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve user',
      })
    }
  }
)

module.exports = router