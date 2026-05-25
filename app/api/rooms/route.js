import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Failed to fetch rooms',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const room = await prisma.room.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,

        wifi: data.wifi || false,
        heating: data.heating || false,
        airConditioning: data.airConditioning || false,
        breakfast: data.breakfast || false,
        kitchen: data.kitchen || false,

        maxAdults: parseInt(data.maxAdults) || 1,
        maxChildren: parseInt(data.maxChildren) || 0,

        featured: data.featured || false,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Failed to create room',
      },
      {
        status: 500,
      }
    );
  }
}