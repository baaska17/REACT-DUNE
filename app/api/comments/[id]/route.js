import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
