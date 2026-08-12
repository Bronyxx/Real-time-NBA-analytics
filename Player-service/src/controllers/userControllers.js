// controllers/user.js — showGames only
const {showGames}=require("../services/user.js")
exports.showGames = async (req, res, next) => {
  try {
    const { date, team, cursor } = req.query;
    const limit = Math.min(Number(req.query.limit) || 25, 100); // 25/100 match balldontlie's own default/max

    const games = await showGames({ date, team, cursor, limit });
    res.json(games);
  } catch (err) {
    next(err);
  }
};

