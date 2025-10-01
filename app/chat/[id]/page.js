'use client'
import { use, useEffect, useRef, useState } from 'react'
import useChatStore from '../../../stores/chat'
import toast from 'react-hot-toast'
import CopyButton from '../../../components/CopyButton'

export default function ChatRoom({ params }) {
  const { id } = use(params)
  const rooms = useChatStore(s => s.rooms)
  const loadOlderMessages = useChatStore(s => s.loadOlderMessages)
  const loadFromStorage = useChatStore(s => s.loadFromStorage)
  const sendMessage = useChatStore(s => s.sendMessage)
  const typing = useChatStore(s => s.typing)
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => { loadFromStorage() }, [])

  const room = rooms.find(r => r.id === id)
  useEffect(() => { if (!room) toast.error('Room not found') }, [room])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [room?.messages?.length, typing])

  function onSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    sendMessage(id, text)
    setText('')
  }

  function onUpload(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => sendMessage(id, '', reader.result)
    reader.readAsDataURL(f)
    e.target.value = ''
  }

  function onScroll(e) {
    if (e.target.scrollTop === 0 && room?.hasMore) { loadOlderMessages(id); toast('Loaded older messages') }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="text-lg font-semibold">{room?.title || 'Chat'}</div>
        <div className="text-sm text-gray-600">{room ? `${room.messages.length} messages` : ''}</div>
      </div>

      <div ref={listRef} onScroll={onScroll} className="flex-1 overflow-auto p-4">
        {!room && <div className="p-4">No such chat</div>}
        {room?.messages?.map(msg => (
          <div key={msg.id} className={`mb-3 ${msg.role === 'ai' ? 'text-left' : 'text-right'}`}>
            <div className="inline-block bg-gray-200 dark:bg-gray-700 p-2 rounded max-w-[70%] relative group">
              {msg.image ? <img src={msg.image} alt="upload" className="max-w-xs rounded" /> : <div>{msg.text}</div>}
              <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition">
                <CopyButton text={msg.text || (msg.image ? '[image]' : '')} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{new Date(msg.time).toLocaleString()}</div>
          </div>
        ))}
        {typing && <div className="italic">Gemini is typing...</div>}
      </div>

      <form onSubmit={onSend} className="p-4 border-t flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" className="flex-1 input" />
        <input type="file" accept="image/*" onChange={onUpload} />
        <button className="btn">Send</button>
      </form>
    </div>
  )
}
