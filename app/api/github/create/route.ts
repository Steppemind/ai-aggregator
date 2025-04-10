import { NextRequest, NextResponse } from 'next/server';
import { createFileContent } from '@/lib/GitHubService';

export async function POST(req: NextRequest) {
  try {
    const { filePath, content } = await req.json();

    await createFileContent(filePath, content);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ошибка при создании файла:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
