const cron = require("node-cron");
const contestQueries = require("../data/queries/contest.queries");

// Cron job: runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await contestQueries.getContestForPrizeDistribution();

    console.log("Contests that ended in the last 5 minutes:", result);
    // Further processing can go here
    await contestQueries.distributePrizes(result);
  } catch (err) {
    throw err;
  }
});
