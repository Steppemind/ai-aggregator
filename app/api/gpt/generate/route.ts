import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

// ✅ Импортировать именно так!
export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  const systemPrompt = `
Ты — ассистент-программист. Пользователь пишет, что ему нужно: например "сделай компонент ChatBox". 
Ответь ЧИСТЫМ кодом компонента на TypeScript + React, без комментариев, без Markdown, без объяснений.
Только один компонент. Название файла: ChatBox.tsx
`

  const chatResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  })

  const json = await chatResponse.json()
  const code = json.choices?.[0]?.message?.content || ''

  if (!code || code.length < 20) {
    return NextResponse.json({ error: 'Пустой ответ от GPT' }, { status: 500 })
  }

  const fileName = prompt.match(/(?:компонент|component)\s+([A-Za-z0-9_]+)/i)?.[1] || 'GeneratedComponent'
  const filePath = path.join(process.cwd(), 'components', `${fileName}.tsx`)

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, code)
    return NextResponse.json({ success: true, file: `/components/${fileName}.tsx` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
