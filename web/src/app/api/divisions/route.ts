import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const divisions = await prisma.division.findMany({
      include: {
        teams: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                isBot: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      divisions,
    });
  } catch (error: any) {
    console.error('Error in /api/divisions:', error);
    return NextResponse.json({ error: 'Eroare la preluarea diviziilor.' }, { status: 500 });
  }
}
