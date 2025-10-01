import { create } from 'zustand'
import { nanoid } from 'nanoid'

const PAGE_SIZE = 20
const dummyMessage = (i) => ({ id: nanoid(), role: i % 3 === 0 ? 'ai' : 'user', text: `Old message ${i}`, time: Date.now() - i*60000 })

const useChatStore = create((set, get) => ({
  rooms: [{ id: 'room-1', title: 'General', createdAt: Date.now(), messages: [], page: 0, hasMore: true }],
  typing: false,
  createRoom(title='New chat') {
    const room = { id: nanoid(), title, createdAt: Date.now(), messages: [], page: 0, hasMore: true }
    set(state => ({ rooms: [room, ...state.rooms] }))
    get().saveToStorage()
  },
  deleteRoom(id) {
    set(state => ({ rooms: state.rooms.filter(r=>r.id!==id) }))
    get().saveToStorage()
  },
  loadOlderMessages(roomId) {
    set(state => {
      const room = state.rooms.find(r=>r.id===roomId)
      if (!room) return {}
      const nextPage = room.page + 1
      const older = Array.from({length: PAGE_SIZE}).map((_,i) => dummyMessage(nextPage*PAGE_SIZE + i))
      room.messages = [...older, ...room.messages]
      room.page = nextPage
      if (nextPage >= 5) room.hasMore = false
      return { rooms: [...state.rooms.filter(r=>r.id!==roomId), room] }
    })
  },
  sendMessage(roomId, text, image) {
    const msg = { id: nanoid(), role: 'user', text, image, time: Date.now() }
    set(state => {
      const room = state.rooms.find(r=>r.id===roomId)
      if (!room) return {}
      room.messages.push(msg)
      return { rooms: [...state.rooms.filter(r=>r.id!==roomId), room] }
    })
    get().throttledAiReply(roomId)
    get().saveToStorage()
  },
  throttledAiReply: (() => {
    let last = 0
    return (roomId) => {
      const now = Date.now()
      const min = 2000
      const wait = Math.max(0, min - (now - last))
      last = now + wait
      set({ typing: true })
      setTimeout(() => {
        set(state => {
          const room = state.rooms.find(r=>r.id===roomId)
          if (!room) return {}
          room.messages.push({ id: nanoid(), role: 'ai', text: pickReply(), time: Date.now() })
          return { rooms: [...state.rooms.filter(r=>r.id!==roomId), room], typing: false }
        })
        get().saveToStorage()
      }, wait + 800)
    }
  })(),
  saveToStorage() {
    try { localStorage.setItem('kuvaka_rooms', JSON.stringify(get().rooms)) } catch(e){}
  },
  loadFromStorage() {
    try {
      const s = localStorage.getItem('kuvaka_rooms')
      if (s) set({ rooms: JSON.parse(s) })
    } catch(e){}
  }
}))

function pickReply() {
  const r = ['Sure — here you go.','I think the best approach is...','Got it — expanding now.','Here\'s a short summary.']
  return r[Math.floor(Math.random()*r.length)]
}

export default useChatStore
