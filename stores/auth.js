import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: null,
  pendingOtp: null,
  sendOtp(phone, otp) {
    set({ pendingOtp: otp })
    try { localStorage.setItem('pending_phone', phone) } catch(e) {}
  },
  verifyOtp(code) {
    const { pendingOtp } = get()
    if (String(code) === String(pendingOtp)) {
      const user = { id: Date.now(), phone: tryGetPendingPhone() || 'demo' }
      set({ user, pendingOtp: null })
      try { localStorage.setItem('kuvaka_user', JSON.stringify(user)) } catch(e){}
      return true
    }
    return false
  },
  loadFromStorage() {
    try {
      const s = localStorage.getItem('kuvaka_user')
      if (s) set({ user: JSON.parse(s) })
    } catch(e){}
  }
}))

function tryGetPendingPhone() {
  try { return localStorage.getItem('pending_phone') } catch(e) { return null }
}

export default useAuthStore
