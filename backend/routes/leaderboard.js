const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('top_scorers')
      .select('*')
      .gt('goalsScored', 0); // Only show players who have actually scored

    if (error) throw error;

    res.json({
      success: true,
      message: "Top scorers leaderboard retrieved successfully",
      data: data
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
});

module.exports = router;