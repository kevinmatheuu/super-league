const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/standings
router.get('/', async (req, res) => {
  try {
    // 1. Fetch the live data from new Supabase View
    const { data, error } = await supabase
      .from('league_standings')
      .select('*')
      .order('rank', { ascending: true });

    // 2. Handle any database errors
    if (error) throw error;

    // 3. Format it perfectly to match JSON Contract
    const response = {
      success: true,
      message: "League standings retrieved successfully",
      data: {
        seasonId: "season-2026", 
        seasonName: "College Football League 2026",
        standings: data 
      }
    };
    
    res.json(response);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch standings" });
  }
});

module.exports = router;