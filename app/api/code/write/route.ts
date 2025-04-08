import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Разрешаем Edge Runtime использовать Node API
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const filePath = body.path
    const content = body.content

    console.log('📥 Получен запрос на сохранение файла:', filePath)

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ error: 'Поле "path" отсутствует или не строка' }, { status: 400 })
    }

    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Поле "content" должно быть строкой' }, { status: 400 })
    }

    const absolutePath = path.join(process.cwd(), filePath)
    const dir = path.dirname(absolutePath)

    // Создаём директорию, если нет
    fs.mkdirSync(dir, { recursive: true })

    // Записываем файл
    fs.writeFileSync(absolutePath, content, 'utf8')

    console.log(`✅ Файл успешно сохранён: ${absolutePath}`)

    return NextResponse.json({ status: 'success', saved: filePath })
  } catch (err: any) {
    console.error('❌ Ошибка при сохранении файла:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
