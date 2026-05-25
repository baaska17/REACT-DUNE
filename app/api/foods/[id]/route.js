import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id   = parseInt(rawId);
    const data = await request.json();

    const food = await prisma.food.update({
      where: { id },
      data: {
        title:       data.title,
        description: data.description,
        price:       parseFloat(data.price),
        image:       data.image,
        category:    data.category,
        size:        data.size || null,
        stock:       parseInt(data.stock) || 0,
        featured:    data.featured || false,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    await prisma.food.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}