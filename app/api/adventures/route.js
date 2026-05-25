import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adventures = await prisma.adventure.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(adventures);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch adventures' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const adventure = await prisma.adventure.create({
      data: {
        title: data.title,
        description: data.description,

        price: parseFloat(data.price),

        image: data.image,

        maxPersons: parseInt(data.maxPersons) || 10,

        featured: data.featured || false,
      },
    });

    return NextResponse.json(adventure);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Failed to create adventure',
        details: error.message,
      },
      { status: 500 }
    );
  }
}