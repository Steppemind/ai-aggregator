// app/api/github/edit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { editFileContent } from '@/lib/GitHubService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filePath, newContent } = body;

    if (!filePath || !newContent) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = await editFileContent(filePath, newContent);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[EDIT FILE ERROR]', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
