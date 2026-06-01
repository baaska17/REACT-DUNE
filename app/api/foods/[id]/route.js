import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id   = parseInt(rawId);
    const data = await request.json();

    const price = parseFloat(data.price);
    const stockRaw = parseInt(data.stock, 10);
    const stock = Number.isNaN(stockRaw) ? 0 : Math.max(0, Math.min(stockRaw, 10000));

    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: 'Invalid price. Price must be a valid positive number.' },
        { status: 400 }
      );
    }

    if (typeof data.title !== 'string' || data.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (typeof data.description !== 'string' || data.description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price. Price must be a valid positive number.' },
        { status: 400 }
      );
    }

    if (typeof data.image !== 'string' || data.image.trim() === '') {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const food = await prisma.food.update({
      where: { id },
      data: {
        title:       data.title,
        description: data.description,
        price:       price,
        image:       data.image,
        category:    data.category,
        size:        data.size || null,
        stock:       stock,
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