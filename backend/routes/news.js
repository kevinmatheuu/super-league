const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    // 1. Fetch live articles from Supabase, ordered by newest first
    // Note: use "imageUrl:image_url" to automatically rename the snake_case DB column to the camelCase JSON contract!
    const { data, error } = await supabase
      .from('newsletter')
      .select('id, title, summary, date, author, imageUrl:image_url')
      .order('date', { ascending: false });

    if (error) throw error;

    // 2. Format to match api contract
    const response = {
      success: true,
      message: "League news retrieved successfully",
      data: {
        articles: data 
      }
    };
    
    res.json(response);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch news" });
  }
});

module.exports = router;