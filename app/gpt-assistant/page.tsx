'use client'

import { useState } from 'react'

export default function GPTAssistant() {
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleGenerate = async () => {
    if (!description) return
    setStatus('loading')

    const res = await fetch('/api/gpt/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: description }),
    })

    if (!res.ok) {
      setStatus('error')
      return
    }

    setStatus('done')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🧠 GPT Assistant</h1>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        placeholder="Опиши, что нужно сделать..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleGenerate}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Генерация...' : 'Создать'}
      </button>
      {status === 'done' && <p className="text-green-600 mt-4">✅ Код создан и сохранён</p>}
      {status === 'error' && <p className="text-red-600 mt-4">❌ Ошибка при генерации</p>}
    </div>
  )
}
