// services/gamesApi.js
const  config  = require('../config');

const fetchGamesFromApi = async ({ date, teamIds, cursor, perPage }) => {
  const params = new URLSearchParams();
  if (date) params.append('dates[]', date);
  if (teamIds) teamIds.forEach((id) => params.append('team_ids[]', id));
  if (cursor) params.set('cursor', cursor);
  params.set('per_page', perPage);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.balldontlie.io/v1/games?${params}`, {
      headers: { Authorization: config.BALLDONTLIE_API_KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`balldontlie responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
};

const mapExternalGame = (g) => ({
  id: g.id,
  date: g.date,
  homeTeam: g.home_team.abbreviation,
  awayTeam: g.visitor_team.abbreviation,
  homeScore: g.home_team_score,
  awayScore: g.visitor_team_score,
  status: g.status,
  isLive: g.period > 0 && g.status !== 'Final', // period 0 = not started yet
});

module.exports = { fetchGamesFromApi, mapExternalGame };