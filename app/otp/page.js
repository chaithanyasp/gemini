'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/auth'

const schema = z.object({ otp: z.string().length(4, 'Enter 4-digit code') })

export default function OtpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const verifyOtp = useAuthStore(s => s.verifyOtp)
  const router = useRouter()

  function onVerify(data) {
    const ok = verifyOtp(data.otp)
    if (ok) {
      try { document.cookie = 'kuvaka_auth=true; path=/' } catch(e) {}
      toast.success('Login successful')
      router.push('/chat')
    } else {
      toast.error('Invalid OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded p-6 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
        <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
          <div>
            <input {...register('otp')} className="input w-full" placeholder="4-digit code" />
            {errors.otp && <p className="text-red-500 text-xs">{errors.otp.message}</p>}
          </div>
          <button className="btn w-full">Verify OTP</button>
        </form>
      </div>
    </div>
  )
}
