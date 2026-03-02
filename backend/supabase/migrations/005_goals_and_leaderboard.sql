-- Create the Goals table to track individual scoring events
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    scored_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create the Top Scorers View for the leaderboard
CREATE OR REPLACE VIEW public.top_scorers AS
SELECT 
    p.id AS "playerId",
    p.first_name || ' ' || p.last_name AS "playerName",
    t.name AS "teamName",
    COUNT(g.id) AS "goalsScored"
FROM public.players p
LEFT JOIN public.goals g ON p.id = g.player_id
LEFT JOIN public.teams t ON p.team_id = t.id
GROUP BY p.id, p.first_name, p.last_name, t.name
ORDER BY "goalsScored" DESC;

COMMENT ON VIEW public.top_scorers IS 'Aggregates goals by player to create a live leaderboard.';
