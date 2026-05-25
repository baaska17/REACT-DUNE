import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':
      'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type',
  };
}

/*
========================================
OPTIONS
========================================
*/

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { headers: corsHeaders() }
  );
}

/*
========================================
GET SINGLE ORDER
========================================
*/

export async function GET(
  request,
  { params }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    const order =
      await prisma.order.findUnique({
        where: { id },

        include: {
          items: true,
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          error:
            'Order not found',
        },
        {
          status: 404,
          headers: corsHeaders(),
        }
      );
    }

    return NextResponse.json(
      order,
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'GET ORDER ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch order',
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

/*
========================================
UPDATE ORDER STATUS
========================================
*/

export async function PUT(
  request,
  { params }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    const body =
      await request.json();

    const updatedOrder =
      await prisma.order.update({
        where: { id },

        data: {
          status:
            body.status,
        },
      });

    return NextResponse.json(
      updatedOrder,
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'UPDATE ORDER ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to update order',
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

/*
========================================
DELETE ORDER
========================================
*/

export async function DELETE(
  request,
  { params }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    /*
    ========================================
    DELETE ORDER ITEMS FIRST
    ========================================
    */

    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    /*
    ========================================
    DELETE ORDER
    ========================================
    */

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'DELETE ORDER ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to delete order',
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}