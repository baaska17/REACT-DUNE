import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id   = parseInt(rawId);
    const data = await request.json();

    const room = await prisma.room.update({
      where: { id },
      data: {
        title:          data.title,
        description:    data.description,
        price:          parseFloat(data.price),
        image:          data.image,
        wifi:           data.wifi || false,
        heating:        data.heating || false,
        airConditioning: data.airConditioning || false,
        breakfast:      data.breakfast || false,
        kitchen:        data.kitchen || false,
        maxAdults:      parseInt(data.maxAdults) || 1,
        maxChildren:    parseInt(data.maxChildren) || 0,
        featured:       data.featured || false,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    await prisma.room.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}