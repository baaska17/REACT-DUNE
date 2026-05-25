import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/*
========================================
DEFAULT SETTINGS
Lecture: Object literals, spread operator
========================================
*/
const DEFAULTS = {
  offPeakDays:     '1,2,3,4', // Mon–Thu off-peak
  offPeakDiscount: '10',       // percent
  splitEnabled:    'true',
  splitThreshold:  '50000',    // ₮ — show split from ₮50k
};

/*
========================================
GET /api/settings
Returns parsed settings object
Lecture: async/await, fetch API
========================================
*/
export async function GET() {
  try {
    const rows = await prisma.setting.findMany();

    // reduce() — массиваас объект үүсгэнэ
    // Lecture: "reduce(): accumulate values from an array"
    const stored = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    // Merge defaults with stored values
    const merged = { ...DEFAULTS, ...stored };

    return NextResponse.json({
      offPeakDays:     merged.offPeakDays.split(',').map(Number).filter(Boolean),
      offPeakDiscount: Number(merged.offPeakDiscount),
      splitEnabled:    merged.splitEnabled === 'true',
      splitThreshold:  Number(merged.splitThreshold),
    });
  } catch (error) {
    console.error('GET SETTINGS ERROR:', error);
    return NextResponse.json({
      offPeakDays:     [1, 2, 3],
      offPeakDiscount: 10,
      splitEnabled:    true,
      splitThreshold:  200000,
    });
  }
}

/*
========================================
PUT /api/settings
Saves settings using upsert (create or update)
Lecture: async/await, Promise.all
========================================
*/
export async function PUT(request) {
  try {
    const body = await request.json();

    const updates = [
      { key: 'offPeakDays',     value: (body.offPeakDays || []).join(',') },
      { key: 'offPeakDiscount', value: String(body.offPeakDiscount ?? 10) },
      { key: 'splitEnabled',    value: String(body.splitEnabled ?? true) },
      { key: 'splitThreshold',  value: String(body.splitThreshold ?? 200000) },
    ];

    // Promise.all — бүх upsert-г зэрэг ажиллуулна
    // Lecture: "Promise.all: run async tasks in parallel"
    await Promise.all(
      updates.map(({ key, value }) =>
        prisma.setting.upsert({
          where:  { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT SETTINGS ERROR:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
