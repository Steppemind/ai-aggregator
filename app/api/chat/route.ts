import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages || []
    const model = body.model || 'openai/gpt-3.5-turbo'

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000', // ⚠️ укажи свой домен на проде
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    })

    const data = await res.json().catch(() => null)

    console.log('✅ Ответ от OpenRouter:', data)

    if (!data || !data.choices || !data.choices[0]) {
      return NextResponse.json({ reply: '❌ Ошибка от OpenRouter или пустой ответ' })
    }

    const reply = data.choices[0].message.content
    return NextResponse.json({ reply })
  } catch (e) {
    console.error('❌ Ошибка сервера:', e)
    return NextResponse.json({ reply: '⚠️ Ошибка при запросе к OpenRouter' })
  }
}
