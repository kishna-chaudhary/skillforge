import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ArrowLeft,
  BookOpen,
  CircleHelp,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  ShieldCheck,
  Users,
  Video,
  VideoOff,
  X,
} from 'lucide-react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  io,
} from 'socket.io-client'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

const socket = io(
  'http://localhost:5000',
  {
    autoConnect: true,
  }
)

interface ChatMessage {
  id: number
  name: string
  text: string
  time: string
  own: boolean
}

interface RemoteParticipant {
  socketId: string
  stream: MediaStream
}

interface SessionUsersPayload {
  users: string[]
}

interface ParticipantUpdatePayload {
  users: string[]
}

interface UserJoinedPayload {
  socketId: string
}

interface UserLeftPayload {
  socketId: string
}

interface OfferPayload {
  sender: string
  offer: RTCSessionDescriptionInit
}

interface AnswerPayload {
  sender: string
  answer: RTCSessionDescriptionInit
}

interface IceCandidatePayload {
  sender: string
  candidate: RTCIceCandidateInit
}

interface ChatPayload {
  sender: string
  name: string
  message: string
  time: string
}

const rtcConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],
}

function LiveSessionRoom() {
  const navigate = useNavigate()

  const [searchParams] =
    useSearchParams()

  const roleId =
    searchParams.get('roleId')

  const topicId =
    searchParams.get('topicId')

  const localVideoRef =
    useRef<HTMLVideoElement | null>(
      null
    )

  const localStreamRef =
    useRef<MediaStream | null>(
      null
    )

  const peerConnectionsRef =
    useRef<
      Map<
        string,
        RTCPeerConnection
      >
    >(new Map())

  const pendingIceRef =
    useRef<
      Map<
        string,
        RTCIceCandidateInit[]
      >
    >(new Map())

  const hasJoinedRef =
    useRef(false)

  const session =
    useMemo(() => {
      if (!roleId || !topicId) {
        return undefined
      }

      const role =
        roadmapData[roleId]

      if (!role) {
        return undefined
      }

      const topic =
        role.topics.find(
          (item) =>
            item.id === topicId
        )

      if (!topic) {
        return undefined
      }

      return {
        roleId,
        topicId,
        roleTitle: role.title,
        topicTitle: topic.title,
        description:
          topic.description,
        sessionId:
          `${roleId}-${topicId}-doubt-session`,
        title:
          `${topic.title} Doubt Solving Session`,
      }
    }, [
      roleId,
      topicId,
    ])

  const [
    isMediaInitialized,
    setIsMediaInitialized,
  ] = useState(false)

  const [
    isMicOn,
    setIsMicOn,
  ] = useState(true)

  const [
    isCameraOn,
    setIsCameraOn,
  ] = useState(true)

  const [
    mediaError,
    setMediaError,
  ] = useState('')

  const [
    participantCount,
    setParticipantCount,
  ] = useState(1)

  const [
    remoteParticipants,
    setRemoteParticipants,
  ] = useState<
    RemoteParticipant[]
  >([])

  const [
    isChatOpen,
    setIsChatOpen,
  ] = useState(false)

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    messages,
    setMessages,
  ] = useState<
    ChatMessage[]
  >([])

  /*
  |--------------------------------------------------------------------------
  | INITIAL CHAT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!session) {
      setMessages([])
      return
    }

    setMessages([
      {
        id: 1,
        name:
          'SkillForge Instructor',
        text:
          `Welcome to the ${session.topicTitle} doubt solving session. Ask questions about concepts, practical problems, lessons, or assessment preparation.`,
        time:
          'Session started',
        own: false,
      },
    ])
  }, [session])

  /*
  |--------------------------------------------------------------------------
  | GET LOCAL CAMERA + MICROPHONE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    const initializeMedia =
      async () => {
        try {
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video: true,
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                },
              }
            )

          if (!mounted) {
            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop()
              )

            return
          }

          localStreamRef.current =
            stream

          if (
            localVideoRef.current
          ) {
            localVideoRef.current.srcObject =
              stream
          }

          setIsMicOn(
            stream
              .getAudioTracks()
              .some(
                (track) =>
                  track.enabled
              )
          )

          setIsCameraOn(
            stream
              .getVideoTracks()
              .some(
                (track) =>
                  track.enabled
              )
          )

          setMediaError('')
        } catch {
          if (mounted) {
            setMediaError(
              'Camera or microphone access is unavailable. You can still join and receive other participants.'
            )
          }
        } finally {
          if (mounted) {
            setIsMediaInitialized(
              true
            )
          }
        }
      }

    void initializeMedia()

    return () => {
      mounted = false
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | REMOTE STREAM
  |--------------------------------------------------------------------------
  */

  const addRemoteStream =
    (
      socketId: string,
      stream: MediaStream
    ) => {
      setRemoteParticipants(
        (current) => {
          const exists =
            current.some(
              (participant) =>
                participant.socketId ===
                socketId
            )

          if (exists) {
            return current.map(
              (participant) =>
                participant.socketId ===
                socketId
                  ? {
                      socketId,
                      stream,
                    }
                  : participant
            )
          }

          return [
            ...current,
            {
              socketId,
              stream,
            },
          ]
        }
      )
    }

  const removePeer =
    (socketId: string) => {
      const peer =
        peerConnectionsRef.current.get(
          socketId
        )

      if (peer) {
        peer.onicecandidate =
          null

        peer.ontrack =
          null

        peer.close()

        peerConnectionsRef.current.delete(
          socketId
        )
      }

      pendingIceRef.current.delete(
        socketId
      )

      setRemoteParticipants(
        (current) =>
          current.filter(
            (participant) =>
              participant.socketId !==
              socketId
          )
      )
    }

  /*
  |--------------------------------------------------------------------------
  | CREATE WEBRTC PEER
  |--------------------------------------------------------------------------
  */

  const createPeerConnection =
    (remoteSocketId: string) => {
      const existing =
        peerConnectionsRef.current.get(
          remoteSocketId
        )

      if (existing) {
        return existing
      }

      const peer =
        new RTCPeerConnection(
          rtcConfiguration
        )

      peerConnectionsRef.current.set(
        remoteSocketId,
        peer
      )

      /*
       * Send our camera + microphone tracks
       * to the remote browser.
       */
      const localStream =
        localStreamRef.current

      if (localStream) {
        localStream
          .getTracks()
          .forEach(
            (track) => {
              peer.addTrack(
                track,
                localStream
              )
            }
          )
      }

      /*
       * Receive remote camera + microphone.
       */
      peer.ontrack = (
        event
      ) => {
        const stream =
          event.streams[0]

        if (stream) {
          addRemoteStream(
            remoteSocketId,
            stream
          )
        }
      }

      /*
       * Send ICE networking information
       * through Socket.IO.
       */
      peer.onicecandidate =
        (event) => {
          if (!event.candidate) {
            return
          }

          socket.emit(
            'ice-candidate',
            {
              target:
                remoteSocketId,
              candidate:
                event.candidate.toJSON(),
            }
          )
        }

      peer.onconnectionstatechange =
        () => {
          if (
            peer.connectionState ===
              'failed' ||
            peer.connectionState ===
              'closed'
          ) {
            removePeer(
              remoteSocketId
            )
          }
        }

      return peer
    }

  /*
  |--------------------------------------------------------------------------
  | PROCESS QUEUED ICE
  |--------------------------------------------------------------------------
  */

  const flushPendingIce =
    async (
      socketId: string,
      peer:
        RTCPeerConnection
    ) => {
      const candidates =
        pendingIceRef.current.get(
          socketId
        ) || []

      for (const candidate of candidates) {
        try {
          await peer.addIceCandidate(
            candidate
          )
        } catch {
          // Ignore an invalid/stale candidate.
        }
      }

      pendingIceRef.current.delete(
        socketId
      )
    }

  /*
  |--------------------------------------------------------------------------
  | CREATE OFFER
  |--------------------------------------------------------------------------
  */

  const createOffer =
    async (
      remoteSocketId: string
    ) => {
      const peer =
        createPeerConnection(
          remoteSocketId
        )

      try {
        const offer =
          await peer.createOffer()

        await peer.setLocalDescription(
          offer
        )

        socket.emit(
          'offer',
          {
            target:
              remoteSocketId,
            offer,
          }
        )
      } catch (error) {
        console.error(
          'Unable to create WebRTC offer:',
          error
        )
      }
    }

  /*
  |--------------------------------------------------------------------------
  | SOCKET + WEBRTC SIGNALING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !session ||
      !isMediaInitialized
    ) {
      return
    }

    const handleSessionUsers =
      ({
        users,
      }: SessionUsersPayload) => {
        users.forEach(
          (userId) => {
            if (
              userId !==
              socket.id
            ) {
              void createOffer(
                userId
              )
            }
          }
        )
      }

    const handleUserJoined =
      ({
        socketId,
      }: UserJoinedPayload) => {
        /*
         * The newly joined user creates
         * the offer, so existing users
         * only prepare a peer connection.
         */
        createPeerConnection(
          socketId
        )
      }

    const handleOffer =
      async ({
        sender,
        offer,
      }: OfferPayload) => {
        const peer =
          createPeerConnection(
            sender
          )

        try {
          await peer.setRemoteDescription(
            new RTCSessionDescription(
              offer
            )
          )

          await flushPendingIce(
            sender,
            peer
          )

          const answer =
            await peer.createAnswer()

          await peer.setLocalDescription(
            answer
          )

          socket.emit(
            'answer',
            {
              target: sender,
              answer,
            }
          )
        } catch (error) {
          console.error(
            'Unable to handle offer:',
            error
          )
        }
      }

    const handleAnswer =
      async ({
        sender,
        answer,
      }: AnswerPayload) => {
        const peer =
          peerConnectionsRef.current.get(
            sender
          )

        if (!peer) {
          return
        }

        try {
          await peer.setRemoteDescription(
            new RTCSessionDescription(
              answer
            )
          )

          await flushPendingIce(
            sender,
            peer
          )
        } catch (error) {
          console.error(
            'Unable to handle answer:',
            error
          )
        }
      }

    const handleIceCandidate =
      async ({
        sender,
        candidate,
      }: IceCandidatePayload) => {
        const peer =
          peerConnectionsRef.current.get(
            sender
          )

        if (
          !peer ||
          !peer.remoteDescription
        ) {
          const current =
            pendingIceRef.current.get(
              sender
            ) || []

          pendingIceRef.current.set(
            sender,
            [
              ...current,
              candidate,
            ]
          )

          return
        }

        try {
          await peer.addIceCandidate(
            candidate
          )
        } catch (error) {
          console.error(
            'Unable to add ICE candidate:',
            error
          )
        }
      }

    const handleParticipantUpdate =
      ({
        users,
      }: ParticipantUpdatePayload) => {
        setParticipantCount(
          users.length
        )
      }

    const handleUserLeft =
      ({
        socketId,
      }: UserLeftPayload) => {
        removePeer(
          socketId
        )
      }

    const handleChatMessage =
      ({
        sender,
        name,
        message:
          incomingMessage,
        time,
      }: ChatPayload) => {
        setMessages(
          (current) => [
            ...current,
            {
              id:
                Date.now() +
                Math.random(),
              name:
                sender ===
                socket.id
                  ? 'You'
                  : name,
              text:
                incomingMessage,
              time,
              own:
                sender ===
                socket.id,
            },
          ]
        )
      }

    socket.on(
      'session-users',
      handleSessionUsers
    )

    socket.on(
      'user-joined',
      handleUserJoined
    )

    socket.on(
      'offer',
      handleOffer
    )

    socket.on(
      'answer',
      handleAnswer
    )

    socket.on(
      'ice-candidate',
      handleIceCandidate
    )

    socket.on(
      'participant-update',
      handleParticipantUpdate
    )

    socket.on(
      'user-left',
      handleUserLeft
    )

    socket.on(
      'chat-message',
      handleChatMessage
    )

    if (
      !hasJoinedRef.current
    ) {
      socket.emit(
        'join-session',
        session.sessionId
      )

      hasJoinedRef.current =
        true
    }

    return () => {
      socket.off(
        'session-users',
        handleSessionUsers
      )

      socket.off(
        'user-joined',
        handleUserJoined
      )

      socket.off(
        'offer',
        handleOffer
      )

      socket.off(
        'answer',
        handleAnswer
      )

      socket.off(
        'ice-candidate',
        handleIceCandidate
      )

      socket.off(
        'participant-update',
        handleParticipantUpdate
      )

      socket.off(
        'user-left',
        handleUserLeft
      )

      socket.off(
        'chat-message',
        handleChatMessage
      )
    }
  }, [
    session,
    isMediaInitialized,
  ])

  /*
  |--------------------------------------------------------------------------
  | COMPONENT CLEANUP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (
        session &&
        hasJoinedRef.current
      ) {
        socket.emit(
          'leave-session',
          session.sessionId
        )
      }

      hasJoinedRef.current =
        false

      peerConnectionsRef.current.forEach(
        (peer) =>
          peer.close()
      )

      peerConnectionsRef.current.clear()
      pendingIceRef.current.clear()

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          )

        localStreamRef.current =
          null
      }
    }
  }, [session])

  /*
  |--------------------------------------------------------------------------
  | MICROPHONE
  |--------------------------------------------------------------------------
  */

  const toggleMicrophone =
    () => {
      const stream =
        localStreamRef.current

      if (!stream) {
        return
      }

      const tracks =
        stream.getAudioTracks()

      const nextState =
        !tracks.some(
          (track) =>
            track.enabled
        )

      tracks.forEach(
        (track) => {
          track.enabled =
            nextState
        }
      )

      setIsMicOn(
        nextState
      )
    }

  /*
  |--------------------------------------------------------------------------
  | CAMERA
  |--------------------------------------------------------------------------
  */

  const toggleCamera =
    () => {
      const stream =
        localStreamRef.current

      if (!stream) {
        return
      }

      const tracks =
        stream.getVideoTracks()

      const nextState =
        !tracks.some(
          (track) =>
            track.enabled
        )

      tracks.forEach(
        (track) => {
          track.enabled =
            nextState
        }
      )

      setIsCameraOn(
        nextState
      )
    }

  /*
  |--------------------------------------------------------------------------
  | CHAT
  |--------------------------------------------------------------------------
  */

  const sendMessage =
    () => {
      const trimmed =
        message.trim()

      if (
        !trimmed ||
        !session
      ) {
        return
      }

      socket.emit(
        'chat-message',
        {
          sessionId:
            session.sessionId,
          message:
            trimmed,
          name:
            'Participant',
        }
      )

      setMessage('')
    }

  const handleMessageKeyDown =
    (
      event:
        React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (
        event.key ===
        'Enter'
      ) {
        sendMessage()
      }
    }

  /*
  |--------------------------------------------------------------------------
  | LEAVE
  |--------------------------------------------------------------------------
  */

  const leaveSession =
    () => {
      if (
        session &&
        hasJoinedRef.current
      ) {
        socket.emit(
          'leave-session',
          session.sessionId
        )

        hasJoinedRef.current =
          false
      }

      peerConnectionsRef.current.forEach(
        (peer) =>
          peer.close()
      )

      peerConnectionsRef.current.clear()

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          )
      }

      navigate(
        '/employee/live-sessions'
      )
    }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">

          <div className="mx-auto max-w-3xl">

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <CircleHelp
                  size={26}
                />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Session Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Choose a valid roadmap topic
                from Live Sessions.
              </p>

              <button
                onClick={() =>
                  navigate(
                    '/employee/live-sessions'
                  )
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                <ArrowLeft
                  size={16}
                />

                Back to Sessions
              </button>

            </div>

          </div>

        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white">

        <div className="mx-auto max-w-7xl p-5 lg:p-6">

          {/* HEADER */}

          <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <button
                onClick={
                  leaveSession
                }
                className="mt-1 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft
                  size={19}
                />
              </button>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Doubt Solving Session
                  </span>

                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Live
                  </span>

                </div>

                <h1 className="mt-2 text-xl font-bold">
                  {session.title}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  {session.roleTitle}
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
                <Users
                  size={15}
                />

                {participantCount}{' '}
                participant
                {participantCount ===
                1
                  ? ''
                  : 's'}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
                <ShieldCheck
                  size={15}
                  className="text-green-400"
                />

                Instructor moderated
              </div>

            </div>

          </div>

          {/* VIDEO GRID */}

          <div
            className={`grid gap-4 ${
              remoteParticipants.length >
              0
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >

            {/* LOCAL */}

            <VideoTile
              label="You"
              videoRef={
                localVideoRef
              }
              cameraEnabled={
                isCameraOn
              }
              muted
            />

            {/* REMOTE USERS */}

            {remoteParticipants.map(
              (
                participant,
                index
              ) => (
                <RemoteVideoTile
                  key={
                    participant.socketId
                  }
                  participant={
                    participant
                  }
                  label={`Participant ${
                    index + 1
                  }`}
                />
              )
            )}

          </div>

          {remoteParticipants.length ===
            0 && (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-sm text-slate-400">
              Waiting for another participant
              to join the doubt solving
              session...
            </div>
          )}

          {mediaError && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {mediaError}
            </div>
          )}

          {/* CONTROLS */}

          <div className="mt-5 flex justify-center gap-3">

            <button
              onClick={
                toggleMicrophone
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isMicOn
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isMicOn ? (
                <Mic size={20} />
              ) : (
                <MicOff
                  size={20}
                />
              )}
            </button>

            <button
              onClick={
                toggleCamera
              }
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isCameraOn
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isCameraOn ? (
                <Video size={20} />
              ) : (
                <VideoOff
                  size={20}
                />
              )}
            </button>

            <button
              onClick={() =>
                setIsChatOpen(
                  true
                )
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
            >
              <MessageSquare
                size={20}
              />
            </button>

            <button
              onClick={
                leaveSession
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff
                size={20}
              />
            </button>

          </div>

          {/* SESSION INFORMATION */}

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                  <CircleHelp
                    size={21}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Session Purpose
                  </p>

                  <h2 className="mt-1 font-bold">
                    Ask questions about{' '}
                    {session.topicTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Clarify lesson concepts,
                    implementation problems,
                    practical exercises and
                    assessment preparation.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Career Roadmap
              </p>

              <h2 className="mt-2 font-bold">
                {session.roleTitle}
              </h2>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800 p-4">

                <BookOpen
                  size={18}
                  className="text-purple-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Current topic
                  </p>

                  <p className="text-sm font-semibold">
                    {session.topicTitle}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* CHAT */}

          {isChatOpen && (
            <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">

                <div>
                  <h2 className="font-semibold">
                    Doubt Session Chat
                  </h2>

                  <p className="text-xs text-slate-400">
                    {participantCount}{' '}
                    participants
                  </p>
                </div>

                <button
                  onClick={() =>
                    setIsChatOpen(
                      false
                    )
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4">

                {messages.map(
                  (
                    chatMessage
                  ) => (
                    <div
                      key={
                        chatMessage.id
                      }
                      className={`flex ${
                        chatMessage.own
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >

                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 ${
                          chatMessage.own
                            ? 'bg-purple-600'
                            : 'bg-slate-800'
                        }`}
                      >

                        {!chatMessage.own && (
                          <p className="mb-1 text-xs font-semibold text-purple-400">
                            {
                              chatMessage.name
                            }
                          </p>
                        )}

                        <p className="text-sm">
                          {
                            chatMessage.text
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {
                            chatMessage.time
                          }
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="border-t border-slate-700 p-3">

                <div className="flex gap-2">

                  <input
                    value={
                      message
                    }
                    onChange={(
                      event
                    ) =>
                      setMessage(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleMessageKeyDown
                    }
                    placeholder="Ask your doubt..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                  />

                  <button
                    onClick={
                      sendMessage
                    }
                    disabled={
                      !message.trim()
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 disabled:opacity-50"
                  >
                    <Send
                      size={17}
                    />
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  )
}

interface VideoTileProps {
  label: string
  videoRef:
    React.RefObject<HTMLVideoElement | null>
  cameraEnabled: boolean
  muted?: boolean
}

function VideoTile({
  label,
  videoRef,
  cameraEnabled,
  muted = false,
}: VideoTileProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black">

      <div className="aspect-video">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`h-full w-full object-cover ${
            cameraEnabled
              ? ''
              : 'opacity-0'
          }`}
        />

        {!cameraEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-xl font-bold">
                {label.charAt(0)}
              </div>

              <p className="mt-3 text-sm">
                Camera off
              </p>

            </div>

          </div>
        )}

      </div>

      <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs">
        {label}
      </span>

    </div>
  )
}

interface RemoteVideoTileProps {
  participant:
    RemoteParticipant
  label: string
}

function RemoteVideoTile({
  participant,
  label,
}: RemoteVideoTileProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    )

  useEffect(() => {
    if (
      videoRef.current
    ) {
      videoRef.current.srcObject =
        participant.stream

      void videoRef.current
        .play()
        .catch(() => {
          // Browser may initially block autoplay with audio.
        })
    }
  }, [
    participant.stream,
  ])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black">

      <div className="aspect-video">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />

      </div>

      <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs">
        {label}
      </span>

    </div>
  )
}

export default LiveSessionRoom