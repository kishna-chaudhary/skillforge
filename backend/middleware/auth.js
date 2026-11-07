const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const authorization =
    req.headers.authorization

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  const token = authorization.substring(
    'Bearer '.length
  )

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        'Invalid or expired authentication token',
    })
  }
}

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You do not have permission to access this resource',
      })
    }

    next()
  }
}

module.exports = {
  authenticate,
  requireRole,
}