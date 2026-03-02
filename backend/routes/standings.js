const express = require('express');
const router = express.Router();

// GET /api/standings
router.get('/', (req, res) => {
  const mockStandings = {
    success: true,
    message: "League standings retrieved successfully",
    data: {
      seasonId: "season-2026",
      seasonName: "College Football League 2026",
      standings: [
        {
          rank: 1,
          teamId: "uuid-team-1",
          teamName: "Neon Strikers",
          logoUrl: "https://yourdomain.com/assets/neon-strikers.png",
          stats: {
            matchesPlayed: 10, won: 8, drawn: 1, lost: 1,
            goalsFor: 24, goalsAgainst: 8, goalDifference: 16, points: 25
          },
          form: ["W", "W", "D", "W", "L"]
        },
        {
          rank: 2,
          teamId: "uuid-team-2",
          teamName: "Cyber United",
          logoUrl: "https://yourdomain.com/assets/cyber-united.png",
          stats: {
            matchesPlayed: 10, won: 7, drawn: 2, lost: 1,
            goalsFor: 19, goalsAgainst: 9, goalDifference: 10, points: 23
          },
          form: ["W", "D", "W", "W", "D"]
        },
        {
          rank: 3,
          teamId: "uuid-team-3",
          teamName: "Matrix FC",
          logoUrl: "https://yourdomain.com/assets/matrix-fc.png",
          stats: {
            matchesPlayed: 10, won: 3, drawn: 0, lost: 7,
            goalsFor: 12, goalsAgainst: 22, goalDifference: -10, points: 9
          },
          form: ["L", "L", "W", "L", "L"]
        },
        {
          rank: 4,
          teamId: "uuid-team-4",
          teamName: "Quantum Dynamo",
          logoUrl: "https://yourdomain.com/assets/quantum-dynamo.png",
          stats: {
            matchesPlayed: 10, won: 2, drawn: 2, lost: 6,
            goalsFor: 10, goalsAgainst: 18, goalDifference: -8, points: 8
          },
          form: ["D", "L", "D", "L", "W"]
        },
        {
          rank: 5,
          teamId: "uuid-team-5",
          teamName: "Byte Brawlers",
          logoUrl: "https://yourdomain.com/assets/byte-brawlers.png",
          stats: {
            matchesPlayed: 10, won: 1, drawn: 2, lost: 7,
            goalsFor: 8, goalsAgainst: 20, goalDifference: -12, points: 5
          },
          form: ["L", "D", "L", "L", "D"]
        },
        {
          rank: 6,
          teamId: "uuid-team-6",
          teamName: "Data Demons",
          logoUrl: "https://yourdomain.com/assets/data-demons.png",
          stats: {
            matchesPlayed: 10, won: 0, drawn: 2, lost: 8,
            goalsFor: 5, goalsAgainst: 21, goalDifference: -16, points: 2
          },
          form: ["L", "L", "L", "D", "L"]
        }
      ]
    }
  };
  
  res.json(mockStandings);
});

module.exports = router;