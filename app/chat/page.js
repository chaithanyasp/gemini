'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useChatStore from '../../stores/chat'
import useAuthStore from '../../stores/auth'

export default function ChatDashboard() {
  const router = useRouter()
  const rooms = useChatStore(s => s.rooms)
  const createRoom = useChatStore(s => s.createRoom)
  const deleteRoom = useChatStore(s => s.deleteRoom)
  const loadFromStorage = useChatStore(s => s.loadFromStorage)
  const { user, loadFromStorage: loadAuth } = useAuthStore()
  const [q, setQ] = useState('')

  useEffect(() => { loadFromStorage(); loadAuth() }, [])

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  const filtered = useMemo(() => rooms.filter(r => r.title.toLowerCase().includes(q.toLowerCase())), [rooms, q])

  function handleCreate() {
    createRoom('Chat ' + new Date().toLocaleString())
    toast.success('Chat created')
  }

  function handleDelete(id) {
    deleteRoom(id)
    toast.success('Chat deleted')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-80 border-r p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={handleCreate} className="btn">New</button>
          <input placeholder="Search chats" value={q} onChange={e => setQ(e.target.value)} className="input flex-1" />
        </div>
        <div className="mb-4">Logged in as: <strong>{user?.phone}</strong></div>
        <ul className="space-y-2 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {filtered.map(r => (
            <li key={r.id} className="flex justify-between items-center border p-2 rounded">
              <a href={`/chat/${r.id}`} className="flex-1">{r.title}</a>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(r.id)} className="text-sm">Del</button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold">Select or create a chatroom</h2>
        <p className="mt-4 text-sm text-gray-600">Click a chat on the left to open the conversation.</p>
      </main>
    </div>
  )
}
