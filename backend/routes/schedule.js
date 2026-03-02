const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const mockSchedule = {
    success: true,
    message: "League schedule retrieved successfully",
    data: {
      seasonId: "season-2026",
      matches: [
        {
          matchId: "match-1",
          date: "2026-03-15T18:00:00Z",
          homeTeam: "Neon Strikers",
          awayTeam: "Cyber United",
          venue: "Neon Arena",
          status: "scheduled"
        },
        {
          matchId: "match-2",
          date: "2026-03-16T20:00:00Z",
          homeTeam: "Matrix FC",
          awayTeam: "Quantum Dynamo",
          venue: "Matrix Stadium",
          status: "scheduled"
        },
        {
          matchId: "match-3",
          date: "2026-03-17T19:30:00Z",
          homeTeam: "Byte Brawlers",
          awayTeam: "Data Demons",
          venue: "Silicon Pitch",
          status: "scheduled"
        }
      ]
    }
  };
  
  res.json(mockSchedule);
});

module.exports = router;