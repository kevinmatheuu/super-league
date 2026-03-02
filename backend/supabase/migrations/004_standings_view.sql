-- Drop the view if it already exists so we can safely update it
DROP VIEW IF EXISTS public.league_standings;

-- Create the dynamic standings view
CREATE OR REPLACE VIEW public.league_standings AS
WITH match_data AS (
    -- 1. Grab all Home games and calculate win/draw/loss
    SELECT 
        home_team_id AS team_id,
        home_score AS scored,
        away_score AS conceded,
        CASE WHEN home_score > away_score THEN 1 ELSE 0 END AS win,
        CASE WHEN home_score = away_score THEN 1 ELSE 0 END AS draw,
        CASE WHEN home_score < away_score THEN 1 ELSE 0 END AS loss
    FROM public.matches
    WHERE status = 'completed'
    
    UNION ALL
    
    -- 2. Grab all Away games and calculate win/draw/loss
    SELECT 
        away_team_id AS team_id,
        away_score AS scored,
        home_score AS conceded,
        CASE WHEN away_score > home_score THEN 1 ELSE 0 END AS win,
        CASE WHEN away_score = home_score THEN 1 ELSE 0 END AS draw,
        CASE WHEN away_score < home_score THEN 1 ELSE 0 END AS loss
    FROM public.matches
    WHERE status = 'completed'
),
team_stats AS (
    -- 3. Aggregate all the data for each team
    SELECT 
        team_id,
        COUNT(*) AS matches_played,
        SUM(win) AS won,
        SUM(draw) AS drawn,
        SUM(loss) AS lost,
        SUM(scored) AS goals_for,
        SUM(conceded) AS goals_against,
        (SUM(scored) - SUM(conceded)) AS goal_difference,
        (SUM(win) * 3 + SUM(draw) * 1) AS points
    FROM match_data
    GROUP BY team_id
)
-- 4. Final output mapped EXACTLY to your Sprint 1 JSON Contract
SELECT 
    -- Calculate rank dynamically based on Points -> GD -> GF
    RANK() OVER (ORDER BY COALESCE(ts.points, 0) DESC, COALESCE(ts.goal_difference, 0) DESC, COALESCE(ts.goals_for, 0) DESC) AS rank,
    t.id AS "teamId",
    t.name AS "teamName",
    t.logo_url AS "logoUrl",
    -- Nest the stats into a JSON object just like the Express route expects
    jsonb_build_object(
        'matchesPlayed', COALESCE(ts.matches_played, 0),
        'won', COALESCE(ts.won, 0),
        'drawn', COALESCE(ts.drawn, 0),
        'lost', COALESCE(ts.lost, 0),
        'goalsFor', COALESCE(ts.goals_for, 0),
        'goalsAgainst', COALESCE(ts.goals_against, 0),
        'goalDifference', COALESCE(ts.goal_difference, 0),
        'points', COALESCE(ts.points, 0)
    ) AS stats,
    -- Note: Calculating the last 5 matches form dynamically in SQL is extremely complex. 
    -- Returning an empty array for now. The Node backend can fetch and populate this later.
    ARRAY[]::text[] AS form
FROM public.teams t
LEFT JOIN team_stats ts ON t.id = ts.team_id;

COMMENT ON VIEW public.league_standings IS 'Dynamically calculates league standings, points, and goal differences from the matches table';