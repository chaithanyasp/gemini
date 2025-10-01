'use client'
export default function CopyButton({ text }) {
  async function handleCopy(e) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text || '')
      alert('Copied to clipboard')
    } catch (err) {
      alert('Copy failed')
    }
  }
  return <button onClick={handleCopy} className="text-xs px-2 py-1 bg-gray-300 rounded">Copy</button>
}
