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

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { headers: corsHeaders() }
  );
}

/*
========================================
GET COMMENTS
========================================
*/

export async function GET(request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const type =
      searchParams.get('type');

    const targetId = parseInt(
      searchParams.get('targetId')
    );

    let where = {};

    if (
      type === 'room' &&
      targetId
    ) {
      where.roomId = targetId;
    }

    if (
      type === 'food' &&
      targetId
    ) {
      where.foodId = targetId;
    }

    if (
      type === 'adventure' &&
      targetId
    ) {
      where.adventureId = targetId;
    }

    const comments =
      await prisma.comment.findMany({
        where,

        orderBy: {
          createdAt: 'desc',
        },
      });

    return NextResponse.json(
      comments,
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'GET COMMENTS ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch comments',
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
CREATE COMMENT
========================================
*/

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      type,
      targetId,
      userName,
      content,
      rating,
    } = body;

    let payload = {
      userName:
        userName || 'Anonymous',

      content: content || '',

      rating:
        parseInt(rating) || 5,
    };

    /*
    ========================================
    ATTACH RELATION
    ========================================
    */

    if (type === 'room') {
      payload.roomId =
        parseInt(targetId);
    }

    if (type === 'food') {
      payload.foodId =
        parseInt(targetId);
    }

    if (type === 'adventure') {
      payload.adventureId =
        parseInt(targetId);
    }

    const comment =
      await prisma.comment.create({
        data: payload,
      });

    return NextResponse.json(
      comment,
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(
      'COMMENT POST ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to save comment',

        details: error.message,
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}