let scoresService = null;
let leaderboardService = null;

// scoreStatisticEnhancer(songScore)
const getStatistic = async (data:any,scoreId: number) => {

	try {
        //fetch score stats
        // stats = 
		// const statistic = leaderboard
		// 	? await leaderboardService.fetchLeaderboardStats(leaderboard.leaderboardId)
		// 	: await scoresService.fetchScoreStats(data.id);
// 
    const statistic = await fetch(`https://cdn.scorestats.beatleader.xyz/${scoreId}.json`).then(res=>res.json())

		const beatSavior = {} as any;

		const stats = statistic.accuracyTracker;

		stats.missedNotes = data?.missedNotes ?? (statistic?.hitTracker?.leftMiss ?? 0) + (statistic?.hitTracker?.leftMiss ?? 0);
		stats.badCuts = data?.badCuts ?? (statistic?.hitTracker?.leftBadCuts ?? 0) + (statistic?.hitTracker?.rightBadCuts ?? 0);
		stats.bombHit = data?.bombCuts ?? (statistic?.hitTracker?.leftBombs ?? 0) + (statistic?.hitTracker?.rightBombs ?? 0);
		stats.wallHit = data?.wallsHit ?? 0;
		stats.miss = stats.missedNotes + stats.badCuts;
		stats.maxCombo = statistic.hitTracker.maxCombo;
		stats.maxStreak = statistic.hitTracker.maxStreak;
		stats.leftMiss = statistic.hitTracker.leftMiss;
		stats.rightMiss = statistic.hitTracker.rightMiss;
		stats.leftBadCuts = statistic.hitTracker.leftBadCuts;
		stats.rightBadCuts = statistic.hitTracker.rightBadCuts;
		stats.leftBombs = statistic.hitTracker.leftBombs;
		stats.rightBombs = statistic.hitTracker.rightBombs;

		stats.won = statistic.winTracker.won;
		stats.pauses = statistic.winTracker.nbOfPause;

		statistic.scoreTracker = {rawRatio: data?.unmodifiedAcc ? data.unmodifiedAcc / 100 : null};

		beatSavior.songJumpDistance = statistic.winTracker.jumpDistance;
		beatSavior.stats = stats;
		beatSavior.trackers = statistic;

		return beatSavior;
	} catch (err) {}

	return null;
};

export default getStatistic