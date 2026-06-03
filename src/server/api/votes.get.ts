import mysql from 'mysql2/promise';

export default defineEventHandler(async (event) => {
  try {
      const query = getQuery(event);
      const validSorts: Record<string, string> = {
          today: "DailyTotal",
          week: "WeeklyTotal",
          month: "MonthTotal",
          all: "AllTimeTotal",
      };
      const sortParam = (query.order || "all").toString().toLowerCase();
      const sort = validSorts[sortParam] ?? "AllTimeTotal";
      const limit = Math.min(Number(query.limit) || 10, 100);
      const username = (query.username || "").toString().trim();

      const conn = await mysql.createConnection({
          host: process.env.VOTING_DB_HOST,
          port: Number(process.env.VOTING_DB_PORT),
          user: process.env.VOTING_DB_USER,
          password: process.env.VOTING_DB_PASSWORD,
          database: process.env.VOTING_DB_NAME,
      });

      const baseQuery = `
      SELECT uuid, PlayerName, AllTimeTotal, MonthTotal,
             DailyTotal, WeeklyTotal, DayVoteStreak
      FROM ${process.env.VOTING_DB_TABLE}
    `;

      let rows;
      if (username) {
          rows = (
              await conn.query(
                  `${baseQuery} WHERE PlayerName LIKE ? ORDER BY ${sort} DESC LIMIT ?`,
                  [`%${username}%`, limit],
              )
          )[0];
      } else {
          rows = (
              await conn.query(`${baseQuery} ORDER BY ${sort} DESC LIMIT ?`, [
                  limit,
              ])
          )[0];
      }

      await conn.end();
      return rows;
  } catch (err: any) {
      console.error("[votes]", err);
      return { error: true, message: "An internal error occurred." };
  }
});
