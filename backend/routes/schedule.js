const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/schedule
router.get('/', async (req, res) => {
  try {
    // 1. Fetch live data 
    const { data, error } = await supabase
      .from('league_schedule')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    // 2. Format it to match the api Contract perfectly
    const response = {
      success: true,
      message: "League schedule retrieved successfully",
      data: {
        seasonId: "season-2026",
        matches: data 
      }
    };
    
    res.json(response);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch schedule" });
  }
});

module.exports = router;