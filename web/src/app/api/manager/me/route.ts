import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ authenticated: false, manager: null }, { status: 200 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ authenticated: false, manager: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teams: {
          include: {
            division: true,
            stadium: true,
            players: {
              orderBy: [
                { position: 'asc' },
                { value: 'desc' },
              ],
            },
          },
        },
      },
    });

    if (!user || user.teams.length === 0) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user?.id,
          username: user?.username,
          email: user?.email,
        },
        team: null,
      });
    }

    const team = user.teams[0];

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isBot: user.isBot,
      },
      team: {
        id: team.id,
        name: team.name,
        stadiumName: team.stadiumName,
        budget: team.budget,
        teamSpirit: team.teamSpirit,
        aggressiveness: team.aggressiveness,
        division: team.division,
        stadium: team.stadium,
        players: team.players,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/manager/me:', error);
    return NextResponse.json({ error: 'Eroare la preluarea profilului managerului.' }, { status: 500 });
  }
}
