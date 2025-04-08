import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { command } = await req.json()

  if (!command) {
    return NextResponse.json({ error: 'Команда пуста' }, { status: 400 })
  }

  const prompt = `
Ты помощник программиста. Получив команду, верни JSON с полями:

{
  "action": "create",
  "file": "ComponentName.tsx",
  "content": "// React-компонент"
}

Пример команды:
"Создай компонент Alert с пропсами title и type"
`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты возвращаешь только JSON, без объяснений' },
        { role: 'user', content: prompt + '\n\n' + command },
      ],
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''

  try {
    const parsed = JSON.parse(content)

    if (parsed.action === 'create' && parsed.file && parsed.content) {
      const filePath = path.join(process.cwd(), 'components', parsed.file)
      fs.writeFileSync(filePath, parsed.content)
      return NextResponse.json({ success: true, file: parsed.file })
    } else {
      return NextResponse.json({ error: 'Некорректный формат JSON', raw: content }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка парсинга ответа', raw: content }, { status: 500 })
  }
}

