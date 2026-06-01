import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch foods' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const price = parseFloat(data.price);
    const stockRaw = parseInt(data.stock, 10);
    const stock = Number.isNaN(stockRaw) ? 0 : Math.max(0, Math.min(stockRaw, 10000));
    const category = Array.isArray(data.category) ? data.category.join(',') : data.category;
    const featured = data.featured === true || data.featured === 'true';

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

    const food = await prisma.food.create({
      data: {
        title: data.title,
        description: data.description,
        price: price,
        image: data.image,
        category: category || 'MAIN_DISH',
        size: data.size || null,
        stock,
        featured,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error('Foods POST error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create food',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}