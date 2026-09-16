import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/stadium — Returnează datele stadionului pentru echipa managerului autentificat
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID lipsă' }, { status: 400 });
    }

    const team = await prisma.team.findFirst({
      where: { userId },
      include: { stadium: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Nu ai o echipă' }, { status: 404 });
    }

    // Creează stadionul dacă nu există
    let stadium = team.stadium;
    if (!stadium) {
      stadium = await prisma.stadium.create({
        data: {
          teamId: team.id,
          capacity: 5000,
          seats: 5000,
          parking: 1650,
          toilets: 50,
          bars: 10,
          pitchQuality: 100,
          advertisingBoards: 0,
          ticketPrice: 10.0,
        },
      });
    }

    return NextResponse.json({
      stadium: {
        id: stadium.id,
        teamId: stadium.teamId,
        capacity: stadium.capacity,
        seats: stadium.seats,
        parking: stadium.parking,
        toilets: stadium.toilets,
        bars: stadium.bars,
        pitchQuality: stadium.pitchQuality,
        advertisingBoards: stadium.advertisingBoards,
        ticketPrice: stadium.ticketPrice,
      },
      teamName: team.name,
      stadiumName: team.stadiumName,
      budget: team.budget,
    });
  } catch (error: any) {
    console.error('Error in GET /api/stadium:', error);
    return NextResponse.json({ error: 'Eroare la preluarea stadionului.' }, { status: 500 });
  }
}

/**
 * PUT /api/stadium — Procesează un upgrade de infrastructură
 * Body: { category: 'SEATS' | 'PARKING' | 'TOILETS' | 'BARS' | 'PITCH' | 'ADS' }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { category } = body;

    if (!category || !['SEATS', 'PARKING', 'TOILETS', 'BARS', 'PITCH', 'ADS'].includes(category)) {
      return NextResponse.json({ error: 'Categorie invalidă' }, { status: 400 });
    }

    const team = await prisma.team.findFirst({
      where: { userId },
      include: { stadium: true },
    });

    if (!team || !team.stadium) {
      return NextResponse.json({ error: 'Echipa sau stadionul nu există' }, { status: 404 });
    }

    const stadium = team.stadium;

    // Configurația de upgrade
    const upgradeConfig: Record<string, { costPerUnit: number; amount: number; maxValue: number; field: string }> = {
      SEATS:   { costPerUnit: 50,    amount: 1000, maxValue: 80000, field: 'seats' },
      PARKING: { costPerUnit: 60,    amount: 500,  maxValue: 25000, field: 'parking' },
      TOILETS: { costPerUnit: 600,   amount: 25,   maxValue: 500,   field: 'toilets' },
      BARS:    { costPerUnit: 4000,  amount: 5,    maxValue: 100,   field: 'bars' },
      PITCH:   { costPerUnit: 1000,  amount: 10,   maxValue: 100,   field: 'pitchQuality' },
      ADS:     { costPerUnit: 4000,  amount: 10,   maxValue: 200,   field: 'advertisingBoards' },
    };

    const config = upgradeConfig[category];
    const upgradeCost = config.costPerUnit * config.amount;
    const currentValue = (stadium as any)[config.field] as number;
    const newValue = currentValue + config.amount;

    // Verificări
    if (currentValue >= config.maxValue) {
      return NextResponse.json({ error: 'Nivel maxim atins!' }, { status: 400 });
    }

    if (team.budget < upgradeCost) {
      return NextResponse.json({ 
        error: `Fonduri insuficiente! Ai nevoie de €${upgradeCost.toLocaleString()} dar ai doar €${team.budget.toLocaleString()}` 
      }, { status: 400 });
    }

    const clampedNewValue = Math.min(newValue, config.maxValue);

    // Tranzacție atomică: upgrade stadion + scădere buget + log
    const [updatedStadium] = await prisma.$transaction([
      prisma.stadium.update({
        where: { id: stadium.id },
        data: {
          [config.field]: clampedNewValue,
          // Actualizează și capacitatea dacă upgradam locurile
          ...(category === 'SEATS' ? { capacity: clampedNewValue } : {}),
        },
      }),
      prisma.team.update({
        where: { id: team.id },
        data: { budget: { decrement: upgradeCost } },
      }),
      prisma.stadiumUpgradeLog.create({
        data: {
          stadiumId: stadium.id,
          category,
          cost: upgradeCost,
          oldValue: currentValue,
          newValue: clampedNewValue,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stadium: {
        id: updatedStadium.id,
        teamId: updatedStadium.teamId,
        capacity: updatedStadium.capacity,
        seats: updatedStadium.seats,
        parking: updatedStadium.parking,
        toilets: updatedStadium.toilets,
        bars: updatedStadium.bars,
        pitchQuality: updatedStadium.pitchQuality,
        advertisingBoards: updatedStadium.advertisingBoards,
        ticketPrice: updatedStadium.ticketPrice,
      },
      newBudget: team.budget - upgradeCost,
      upgradeCost,
      message: `Upgrade ${category} realizat cu succes! (-€${upgradeCost.toLocaleString()})`,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/stadium:', error);
    return NextResponse.json({ error: 'Eroare la procesarea upgrade-ului.' }, { status: 500 });
  }
}
