// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = file.name.replace(/\s+/g, '-');
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filePath, buffer);

  return NextResponse.json({ filename });
}
