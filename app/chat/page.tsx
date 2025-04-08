'use client'

import { useState } from 'react'
import { MODELS } from '@/lib/models'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('openai/gpt-3.5-turbo')

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages,
        model: model,
      }),
    })

    try {
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: '❌ Ошибка в ответе от модели' }])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen">

      {/* Выбор модели */}
      <div className="p-4 border-b space-y-2">
        <p className="font-semibold">Выбери модель:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`text-left border rounded-lg p-3 transition hover:border-blue-500 ${
                model === m.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-gray-500">{m.tags.join(' ')}</span>
              </div>
              <p className="text-sm text-gray-600">{m.description}</p>
              <p className="text-xs text-gray-400 mt-1">Провайдер: {m.provider}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Чат */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xl ${
              msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="p-3 bg-gray-200 rounded-lg max-w-xl animate-pulse">
            GPT пишет ответ...
          </div>
        )}
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Напиши сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Отправить
        </button>
      </div>
    </div>
  )
}
