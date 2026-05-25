import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':
      'GET, POST, OPTIONS',
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
GET ORDERS
========================================
*/

export async function GET() {
  try {
    const orders =
      await prisma.order.findMany({
        include: {
          items: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return NextResponse.json(
      orders,
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'GET ORDERS ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch orders',
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
CREATE ORDER
========================================
*/

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customerName,
      email,
      phone,
      totalAmount,
      items,
    } = body;

    /*
    ========================================
    VALIDATION
    ========================================
    */

    if (
      !customerName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          error:
            'Missing customer information',
        },
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            'Cart is empty',
        },
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    /*
    ========================================
    CREATE ORDER
    ========================================
    */

    const order =
      await prisma.order.create({
        data: {
          customerName,

          email,

          phone,

          totalAmount:
            parseFloat(
              totalAmount
            ) || 0,

          status: 'PENDING',

          items: {
            create: items.map(
              (item) => ({
                itemType:
                  item.type,

                itemId:
                  item.id,

                title:
                  item.title,

                price:
                  parseFloat(
                    item.price
                  ) || 0,

                quantity:
                  parseInt(
                    item.quantity
                  ) || 1,
              })
            ),
          },
        },

        include: {
          items: true,
        },
      });

    /*
    ========================================
    SUCCESS
    ========================================
    */

    return NextResponse.json(
      {
        success: true,

        orderId: order.id,

        trackingId: `DUNE-${order.id}`,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'CREATE ORDER ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to create order',

        details:
          error.message,
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}