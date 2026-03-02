const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware:
const requireAdmin = (req, res, next) => {
  // Look for a custom header called 'x-admin-key'
  const adminKey = req.headers['x-admin-key'];

  // If the key is missing or doesn't match your .env file,restricted
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or missing admin key" });
  }
  
  // If the key matches, allowed
  next();
};

// POST /api/matches/update
router.post('/update', requireAdmin, async (req, res) => {
  const { matchId, homeScore, awayScore, status } = req.body;

  // Basic validation
  if (!matchId || homeScore === undefined || awayScore === undefined || !status) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Tell Supabase to update the specific match
    const { data, error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: status
      })
      .eq('id', matchId) // ONLY update the row where the ID matches
      .select(); // Ask Supabase to return the newly updated row

    if (error) throw error;

    // If Supabase returns an empty array, the ID didn't exist
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "Match not found in database" });
    }

    res.json({
      success: true,
      message: "Match updated successfully",
      data: data[0]
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to update match" });
  }
});

module.exports = router;