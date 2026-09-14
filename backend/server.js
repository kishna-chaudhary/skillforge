const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const PORT = 5000
const FRONTEND_URL = 'http://localhost:5173'

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  })
)

app.use(express.json())

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
})

app.get('/', (req, res) => {
  res.json({
    message: 'SkillForge Live Session Server is running',
  })
})

const getRoomUsers = (sessionId) => {
  const room = io.sockets.adapter.rooms.get(sessionId)

  if (!room) {
    return []
  }

  return Array.from(room)
}

const broadcastParticipants = (sessionId) => {
  const users = getRoomUsers(sessionId)

  io.to(sessionId).emit('participant-update', {
    users,
  })

  console.log(
    `Session ${sessionId} now has ${users.length} participant(s)`
  )
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.data.sessions = new Set()

  /*
  |--------------------------------------------------------------------------
  | JOIN SESSION
  |--------------------------------------------------------------------------
  */

  socket.on('join-session', (sessionId) => {
    if (!sessionId) {
      return
    }

    if (socket.data.sessions.has(sessionId)) {
      const users = getRoomUsers(sessionId).filter(
        (id) => id !== socket.id
      )

      socket.emit('session-users', {
        users,
      })

      broadcastParticipants(sessionId)

      return
    }

    const existingUsers = getRoomUsers(sessionId)

    socket.join(sessionId)
    socket.data.sessions.add(sessionId)

    console.log(
      `User ${socket.id} joined session ${sessionId}`
    )

    /*
     * Tell the newly joined browser which peers
     * are already inside the room.
     *
     * The new browser will create WebRTC offers
     * to these users.
     */
    socket.emit('session-users', {
      users: existingUsers,
    })

    /*
     * Existing users only need to know that the
     * new peer exists. They will receive an offer
     * from that peer shortly.
     */
    socket.to(sessionId).emit('user-joined', {
      socketId: socket.id,
    })

    broadcastParticipants(sessionId)
  })

  /*
  |--------------------------------------------------------------------------
  | WEBRTC OFFER
  |--------------------------------------------------------------------------
  */

  socket.on('offer', ({ target, offer }) => {
    if (!target || !offer) {
      return
    }

    io.to(target).emit('offer', {
      sender: socket.id,
      offer,
    })
  })

  /*
  |--------------------------------------------------------------------------
  | WEBRTC ANSWER
  |--------------------------------------------------------------------------
  */

  socket.on('answer', ({ target, answer }) => {
    if (!target || !answer) {
      return
    }

    io.to(target).emit('answer', {
      sender: socket.id,
      answer,
    })
  })

  /*
  |--------------------------------------------------------------------------
  | ICE CANDIDATE
  |--------------------------------------------------------------------------
  */

  socket.on(
    'ice-candidate',
    ({ target, candidate }) => {
      if (!target || !candidate) {
        return
      }

      io.to(target).emit('ice-candidate', {
        sender: socket.id,
        candidate,
      })
    }
  )

  /*
  |--------------------------------------------------------------------------
  | CHAT
  |--------------------------------------------------------------------------
  */

  socket.on(
    'chat-message',
    ({ sessionId, message, name }) => {
      if (!sessionId || !message) {
        return
      }

      io.to(sessionId).emit('chat-message', {
        sender: socket.id,
        name: name || 'Participant',
        message,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    }
  )

  /*
  |--------------------------------------------------------------------------
  | LEAVE SESSION
  |--------------------------------------------------------------------------
  */

  socket.on('leave-session', (sessionId) => {
    if (!sessionId) {
      return
    }

    if (!socket.data.sessions.has(sessionId)) {
      return
    }

    socket.data.sessions.delete(sessionId)

    socket.leave(sessionId)

    socket.to(sessionId).emit('user-left', {
      socketId: socket.id,
    })

    broadcastParticipants(sessionId)
  })

  /*
  |--------------------------------------------------------------------------
  | DISCONNECTING
  |--------------------------------------------------------------------------
  |
  | "disconnecting" runs BEFORE Socket.IO removes
  | this socket from its rooms.
  |--------------------------------------------------------------------------
  */

  socket.on('disconnecting', () => {
    const sessions = Array.from(
      socket.data.sessions || []
    )

    sessions.forEach((sessionId) => {
      socket.to(sessionId).emit('user-left', {
        socketId: socket.id,
      })
    })
  })

  /*
  |--------------------------------------------------------------------------
  | DISCONNECT
  |--------------------------------------------------------------------------
  */

  socket.on('disconnect', (reason) => {
    console.log(
      `User disconnected: ${socket.id}`,
      reason
    )

    const sessions = Array.from(
      socket.data.sessions || []
    )

    /*
     * At this point Socket.IO has removed the
     * disconnected socket from its rooms, so the
     * server can now calculate the correct count.
     */
    sessions.forEach((sessionId) => {
      broadcastParticipants(sessionId)
    })

    socket.data.sessions.clear()
  })
})

server.listen(PORT, () => {
  console.log(
    `SkillForge server running on http://localhost:${PORT}`
  )
})