import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, teamName, stadiumName } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Te rugăm să completezi numele de manager, email-ul și parola.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă cel puțin 6 caractere.' },
        { status: 400 }
      );
    }

    // Verifică unicitatea email-ului și username-ului
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Acest email este deja înregistrat.' },
        { status: 409 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Acest nume de manager este deja folosit.' },
        { status: 409 }
      );
    }

    // Criptează parola
    const passwordHash = await bcrypt.hash(password, 10);

    // Creează noul Manager
    const newUser = await prisma.user.create({
      data: {
        username,
        name: username,
        email: email.toLowerCase(),
        passwordHash,
        isBot: false,
      },
    });

    // Alocare Echipă: Căutăm o echipă de bot disponibilă (prioritate: Divizia B3, apoi B2, B1, A)
    // Căutăm o echipă deținută de un user bot
    const botTeam = await prisma.team.findFirst({
      where: {
        user: {
          isBot: true,
        },
      },
      include: {
        division: true,
        user: true,
      },
      orderBy: [
        { division: { level: 'desc' } }, // Diviziile inferioare (level 2: B3, B2, B1)
        { id: 'desc' },
      ],
    });

    let assignedTeam = null;

    if (botTeam) {
      // Preluăm echipa botului și o atribuim noului manager
      const oldBotUser = botTeam.user;

      assignedTeam = await prisma.team.update({
        where: { id: botTeam.id },
        data: {
          userId: newUser.id,
          name: teamName?.trim() ? teamName.trim() : botTeam.name,
          stadiumName: stadiumName?.trim() ? stadiumName.trim() : botTeam.stadiumName,
          budget: 5000000.00, // Buget inițial generos de pornire: 5.000.000 €
        },
        include: {
          division: true,
          players: true,
          stadium: true,
        },
      });

      // Actualizăm și numele stadionului în modelul Stadium
      if (assignedTeam.stadium && stadiumName?.trim()) {
        await prisma.stadium.update({
          where: { id: assignedTeam.stadium.id },
          data: {},
        });
      }

      // Ștergem contul vechi de bot orfan dacă nu mai are echipe
      if (oldBotUser) {
        await prisma.user.delete({
          where: { id: oldBotUser.id },
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contul și echipa au fost create cu succes!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      team: assignedTeam
        ? {
            id: assignedTeam.id,
            name: assignedTeam.name,
            stadiumName: assignedTeam.stadiumName,
            division: assignedTeam.division?.name,
            budget: assignedTeam.budget,
            playersCount: assignedTeam.players.length,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'A apărut o eroare la înregistrare. Te rugăm să încerci din nou.' },
      { status: 500 }
    );
  }
}
