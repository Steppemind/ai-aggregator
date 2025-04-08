'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Войти по email</h1>
      {sent ? (
        <p className="text-green-600">Ссылка отправлена на почту</p>
      ) : (
        <div className="flex flex-col gap-3 w-80">
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded border-gray-300"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Отправка...' : 'Войти'}
          </button>
        </div>
      )}
    </div>
  )
}
