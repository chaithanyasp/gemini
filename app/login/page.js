'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../stores/auth'

const schema = z.object({
  country: z.string().min(1, 'Select country'),
  phone: z.string().min(6, 'Enter valid phone number'),
})

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ resolver: zodResolver(schema) })
  const [countries, setCountries] = useState([])
  const sendOtp = useAuthStore(s => s.sendOtp)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        const list = data.map(c => {
          const root = c.idd?.root || ''
          const suffix = (c.idd?.suffixes && c.idd.suffixes.length>0) ? c.idd.suffixes[0] : ''
          const code = (root + suffix).trim()
          return { name: c.name?.common || c.cca2, code }
        }).filter(c => c.code).sort((a,b)=>a.name.localeCompare(b.name))
        const seen = new Set()
        const dedup = []
        for (const it of list) {
          const key = `${it.code}-${it.name}`
          if (!seen.has(key)) { seen.add(key); dedup.push(it) }
        }
        setCountries(dedup)
      })
      .catch(() => { toast.error('Could not load country codes') })
    return () => { mounted = false }
  }, [])

  function onSend(data) {
    const otp = String(Math.floor(1000 + Math.random()*9000))
    sendOtp(data.country + data.phone, otp)
    toast.success('OTP sent (simulated): ' + otp)
    router.push('/otp')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded p-6 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Login / Signup</h2>
        <form onSubmit={handleSubmit(onSend)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Country</label>
            <select {...register('country')} className="input w-full" defaultValue="" onChange={(e)=>setValue('country', e.target.value)}>
              <option value="">Select country</option>
              {countries.map(c=> <option key={`${c.code}-${c.name}`} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
            {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input {...register('phone')} className="input w-full" placeholder="e.g. 5551234" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
          <button className="btn w-full">Send OTP</button>
        </form>
      </div>
    </div>
  )
}
