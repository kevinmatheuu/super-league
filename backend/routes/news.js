const express = require('express');
const router = express.Router();

// GET /api/news
router.get('/', (req, res) => {
  const mockNews = {
    success: true,
    message: "League news retrieved successfully",
    data: {
      articles: [
        {
          id: "news-1",
          title: "Neon Strikers Secure Top Spot After Thrilling Victory",
          summary: "The Neon Strikers continue their undefeated streak with a stunning 3-1 win over Cyber United.",
          date: "2026-03-01T10:00:00Z",
          author: "Jane Doe",
          imageUrl: "https://yourdomain.com/assets/news-neon-win.jpg"
        },
        {
          id: "news-2",
          title: "Matrix FC Announces New Head Coach",
          summary: "In a shocking mid-season move, Matrix FC has replaced their head coach following a string of tough losses.",
          date: "2026-02-28T14:30:00Z",
          author: "John Smith",
          imageUrl: "https://yourdomain.com/assets/news-matrix-coach.jpg"
        },
        {
          id: "news-3",
          title: "Quantum Dynamo Signs Star Striker",
          summary: "Quantum Dynamo boosts their offensive lineup by acquiring the league's top prospect ahead of the transfer deadline.",
          date: "2026-02-25T09:15:00Z",
          author: "Sarah Jenkins",
          imageUrl: "https://yourdomain.com/assets/news-quantum-transfer.jpg"
        }
      ]
    }
  };
  
  res.json(mockNews);
});

module.exports = router;