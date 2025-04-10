import { NextResponse } from 'next/server';
import { listRepoFiles } from '@/lib/GitHubService';

export async function GET() {
  try {
    const files = await listRepoFiles(); // Получаем содержимое корня репозитория
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при получении данных с GitHub' }, { status: 500 });
  }
}
