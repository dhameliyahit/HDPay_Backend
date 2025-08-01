const { Pool } = require("pg")

const pool = new Pool({
    // host: "localhost",
    // user: "postgres",
    // password:"Dhameliy@hit31",
    // database: "hdpay",
    // port: 5432,
    connectionString: "postgresql://hdpay_user:2aNniPiHixfnDp5x6UNK3MzzPuXbJZIC@dpg-d249o1fdiees73ahqee0-a.oregon-postgres.render.com/hdpay",
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;