require('dotenv').config()

const express =
  require('express')
const http = require('http')
const cors = require('cors')
const {
  Server,
} = require('socket.io')

const pool =
  require('./config/db')

const authRoutes =
  require('./routes/auth')

const adminRoutes =
  require('./routes/admin')

const careerRoleRoutes =
  require('./routes/careerRoles')

const assessmentRoutes =
  require('./routes/assessments')

const recordingRoutes =
  require('./routes/recordings')

const progressRoutes =
  require('./routes/progress')

const practicalChallengeRoutes =
  require('./routes/practicalChallenges')

const liveSessionRoutes =
  require('./routes/liveSessions')

const app = express()

const server =
  http.createServer(app)

const PORT =
  process.env.PORT || 5000

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  'http://localhost:5173'

const allowedMethods = [
  'GET',
  'POST',
  'PATCH',
  'PUT',
  'DELETE',
  'OPTIONS',
]

/*
|--------------------------------------------------------------------------
| EXPRESS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: FRONTEND_URL,
    methods:
      allowedMethods,
  })
)

app.use(express.json())

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/recordings',
  recordingRoutes
)

app.use(
  '/api/admin',
  adminRoutes
)

app.use(
  '/api/career-roles',
  careerRoleRoutes
)

app.use(
  '/api/assessments',
  assessmentRoutes
)

app.use(
  '/api/progress',
  progressRoutes
)

app.use(
  '/api/practical-challenges',
  practicalChallengeRoutes
)

app.use(
  '/api/live-sessions',
  liveSessionRoutes
)

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

app.get(
  '/api/health',
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        'SkillForge API is running',
    })
  }
)

app.get(
  '/api/health/db',
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
            SELECT
              NOW() AS server_time,
              current_database()
                AS database
          `
        )

      return res.status(200).json({
        success: true,
        message:
          'PostgreSQL connection successful',
        database:
          result.rows[0]
            .database,
        serverTime:
          result.rows[0]
            .server_time,
      })
    } catch (error) {
      console.error(
        'Database health check failed:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'PostgreSQL connection failed',
      })
    }
  }
)

app.get('/', (req, res) => {
  return res.json({
    message:
      'SkillForge Live Session Server is running',
  })
})

/*
|--------------------------------------------------------------------------
| SOCKET.IO
|--------------------------------------------------------------------------
*/

const io = new Server(
  server,
  {
    cors: {
      origin: FRONTEND_URL,
      methods:
        allowedMethods,
    },
  }
)

const normalizeSessionId = (
  sessionId
) => {
  const numericId =
    Number(sessionId)

  if (
    !Number.isInteger(
      numericId
    ) ||
    numericId <= 0
  ) {
    return null
  }

  return numericId
}

const getRoomName = (
  sessionId
) => {
  return `live-session-${sessionId}`
}

const getRoomUsers = (
  roomName
) => {
  const room =
    io.sockets.adapter.rooms.get(
      roomName
    )

  if (!room) {
    return []
  }

  return Array.from(room)
}

const broadcastParticipants = (
  roomName
) => {
  const users =
    getRoomUsers(roomName)

  io.to(roomName).emit(
    'participant-update',
    {
      users,
    }
  )

  console.log(
    `${roomName} now has ${users.length} participant(s)`
  )
}

const isSessionLive =
  async (sessionId) => {
    const result =
      await pool.query(
        `
          SELECT id
          FROM live_sessions
          WHERE id = $1
            AND status = 'live'
          LIMIT 1
        `,
        [sessionId]
      )

    return (
      result.rows.length > 0
    )
  }

io.on(
  'connection',
  (socket) => {
    console.log(
      'User connected:',
      socket.id
    )

    socket.data.sessions =
      new Set()

    /*
    |--------------------------------------------------------------------------
    | JOIN SESSION
    |--------------------------------------------------------------------------
    */

    socket.on(
      'join-session',
      async (
        rawSessionId
      ) => {
        const sessionId =
          normalizeSessionId(
            rawSessionId
          )

        if (!sessionId) {
          socket.emit(
            'session-join-error',
            {
              message:
                'Invalid live session.',
            }
          )

          return
        }

        try {
          const live =
            await isSessionLive(
              sessionId
            )

          if (!live) {
            socket.emit(
              'session-join-error',
              {
                message:
                  'This session is not live. Wait for the admin to start it.',
              }
            )

            return
          }

          const roomName =
            getRoomName(
              sessionId
            )

          if (
            socket.data.sessions.has(
              roomName
            )
          ) {
            const users =
              getRoomUsers(
                roomName
              ).filter(
                (id) =>
                  id !==
                  socket.id
              )

            socket.emit(
              'session-users',
              {
                users,
              }
            )

            broadcastParticipants(
              roomName
            )

            return
          }

          const existingUsers =
            getRoomUsers(
              roomName
            )

          socket.join(roomName)

          socket.data.sessions.add(
            roomName
          )

          console.log(
            `User ${socket.id} joined ${roomName}`
          )

          socket.emit(
            'session-users',
            {
              users:
                existingUsers,
            }
          )

          socket
            .to(roomName)
            .emit(
              'user-joined',
              {
                socketId:
                  socket.id,
              }
            )

          broadcastParticipants(
            roomName
          )
        } catch (error) {
          console.error(
            'Join session error:',
            error
          )

          socket.emit(
            'session-join-error',
            {
              message:
                'Unable to join the live session.',
            }
          )
        }
      }
    )

    /*
    |--------------------------------------------------------------------------
    | WEBRTC OFFER
    |--------------------------------------------------------------------------
    */

    socket.on(
      'offer',
      ({
        target,
        offer,
      }) => {
        if (
          !target ||
          !offer
        ) {
          return
        }

        io.to(target).emit(
          'offer',
          {
            sender:
              socket.id,
            offer,
          }
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | WEBRTC ANSWER
    |--------------------------------------------------------------------------
    */

    socket.on(
      'answer',
      ({
        target,
        answer,
      }) => {
        if (
          !target ||
          !answer
        ) {
          return
        }

        io.to(target).emit(
          'answer',
          {
            sender:
              socket.id,
            answer,
          }
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | ICE
    |--------------------------------------------------------------------------
    */

    socket.on(
      'ice-candidate',
      ({
        target,
        candidate,
      }) => {
        if (
          !target ||
          !candidate
        ) {
          return
        }

        io.to(target).emit(
          'ice-candidate',
          {
            sender:
              socket.id,
            candidate,
          }
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | CHAT
    |--------------------------------------------------------------------------
    */

    socket.on(
      'chat-message',
      ({
        sessionId:
          rawSessionId,
        message,
        name,
      }) => {
        const sessionId =
          normalizeSessionId(
            rawSessionId
          )

        const cleanMessage =
          String(
            message || ''
          ).trim()

        if (
          !sessionId ||
          !cleanMessage
        ) {
          return
        }

        const roomName =
          getRoomName(
            sessionId
          )

        /*
         * Only participants who
         * actually joined this room
         * may send chat messages.
         */
        if (
          !socket.data.sessions.has(
            roomName
          )
        ) {
          return
        }

        io.to(roomName).emit(
          'chat-message',
          {
            sender:
              socket.id,

            name:
              String(
                name ||
                  'Participant'
              ).slice(
                0,
                100
              ),

            message:
              cleanMessage.slice(
                0,
                2000
              ),

            time:
              new Date()
                .toLocaleTimeString(
                  [],
                  {
                    hour:
                      '2-digit',
                    minute:
                      '2-digit',
                  }
                ),
          }
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | LEAVE
    |--------------------------------------------------------------------------
    */

    socket.on(
      'leave-session',
      (
        rawSessionId
      ) => {
        const sessionId =
          normalizeSessionId(
            rawSessionId
          )

        if (!sessionId) {
          return
        }

        const roomName =
          getRoomName(
            sessionId
          )

        if (
          !socket.data.sessions.has(
            roomName
          )
        ) {
          return
        }

        socket.data.sessions.delete(
          roomName
        )

        socket.leave(
          roomName
        )

        socket
          .to(roomName)
          .emit(
            'user-left',
            {
              socketId:
                socket.id,
            }
          )

        broadcastParticipants(
          roomName
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | DISCONNECTING
    |--------------------------------------------------------------------------
    */

    socket.on(
      'disconnecting',
      () => {
        const rooms =
          Array.from(
            socket.data
              .sessions || []
          )

        rooms.forEach(
          (roomName) => {
            socket
              .to(roomName)
              .emit(
                'user-left',
                {
                  socketId:
                    socket.id,
                }
              )
          }
        )
      }
    )

    /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

    socket.on(
      'disconnect',
      (reason) => {
        console.log(
          `User disconnected: ${socket.id}`,
          reason
        )

        const rooms =
          Array.from(
            socket.data
              .sessions || []
          )

        rooms.forEach(
          (roomName) => {
            broadcastParticipants(
              roomName
            )
          }
        )

        socket.data.sessions.clear()
      }
    )
  }
)

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SkillForge server running on port ${PORT}`)
})