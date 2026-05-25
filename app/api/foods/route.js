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

    const food = await prisma.food.create({
      data: {
        title: data.title,
        description: data.description,

        price: parseFloat(data.price),

        image: data.image,

        category: data.category,

        size: data.size || null,

        stock: parseInt(data.stock) || 0,

        featured: data.featured || false,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Failed to create food',
        details: error.message,
      },
      { status: 500 }
    );
  }
}