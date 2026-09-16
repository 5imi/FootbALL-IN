import { PrismaClient, PositionType } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ["Alex", "Andrei", "Cristi", "Daniel", "Ionut", "Mihai", "Radu", "Stefan", "Vlad", "Florin", "Gabriel"];
const lastNames = ["Popescu", "Ionescu", "Radu", "Dumitrescu", "Stan", "Marin", "Gheorghe", "Niță", "Ilie", "Dinu"];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName: f, lastName: l };
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting seed...');

  // Create Divisions
  const divisions = [
    { name: 'Divizia A', level: 1 },
    { name: 'Divizia B1', level: 2 },
    { name: 'Divizia B2', level: 2 },
    { name: 'Divizia B3', level: 2 },
  ];

  const createdDivisions = [];
  for (const div of divisions) {
    const created = await prisma.division.create({
      data: div
    });
    createdDivisions.push(created);
    console.log(`Created division: ${created.name}`);
  }

  // Create Bots and Teams
  let botCounter = 1;

  for (const division of createdDivisions) {
    for (let i = 0; i < 16; i++) {
      const username = `Bot_${botCounter}`;
      
      // Create Bot User
      const user = await prisma.user.create({
        data: {
          username: username,
          email: `bot${botCounter}@local.test`,
          passwordHash: 'NOPASSWORD', // Bots don't login
          isBot: true
        }
      });

      // Create Team
      const team = await prisma.team.create({
        data: {
          name: `FC Bot ${botCounter}`,
          stadiumName: `Stadionul Bot ${botCounter}`,
          budget: 500000,
          userId: user.id,
          divisionId: division.id,
        }
      });

      // Create Stadium
      await prisma.stadium.create({
        data: {
          teamId: team.id,
        }
      });

      // Create Players (22 players: 2 GK, 7 DEF, 7 MID, 6 ATT)
      const positions: PositionType[] = [
        'GK', 'GK',
        'CB', 'CB', 'CB', 'LB', 'LB', 'RB', 'RB',
        'CM', 'CM', 'CM', 'LM', 'LM', 'RM', 'RM',
        'CF', 'CF', 'LF', 'LF', 'RF', 'RF'
      ];

      for (const pos of positions) {
        const name = getRandomName();
        await prisma.player.create({
          data: {
            teamId: team.id,
            firstName: name.firstName,
            lastName: name.lastName,
            age: getRandomInt(18, 30),
            position: pos,
            fitness: 100,
            morale: 100,
            wage: getRandomInt(1000, 5000),
            value: getRandomInt(50000, 200000),
            goalkeeping: pos === 'GK' ? getRandomInt(30, 60) : 10,
            defending: ['CB', 'LB', 'RB'].includes(pos) ? getRandomInt(30, 60) : 10,
            passing: ['CM', 'LM', 'RM'].includes(pos) ? getRandomInt(30, 60) : 10,
            scoring: ['CF', 'LF', 'RF'].includes(pos) ? getRandomInt(30, 60) : 10,
          }
        });
      }

      console.log(`Created Team ${team.name} with 22 players in ${division.name}`);
      botCounter++;
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
