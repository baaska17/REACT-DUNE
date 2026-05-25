import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id   = parseInt(rawId);
    const data = await request.json();

    const adventure = await prisma.adventure.update({
      where: { id },
      data: {
        title:       data.title,
        description: data.description,
        price:       parseFloat(data.price),
        image:       data.image,
        maxPersons:  parseInt(data.maxPersons) || 10,
        featured:    data.featured || false,
      },
    });

    return NextResponse.json(adventure);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update adventure' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    await prisma.adventure.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete adventure' }, { status: 500 });
  }
}