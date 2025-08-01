const pool = require("./connectDB");

const transtionTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS transation ( 
    id SERIAL PRIMARY KEY,
    upiid VARCHAR(50),          -- increased length for flexibility
    pn VARCHAR(50),             -- increased length for person name
    am NUMERIC(10, 2),          -- allows decimals like 199.99
    tid TEXT,
    tr TEXT,
    tn VARCHAR(255),            -- increased note/message length
    cu VARCHAR(10) DEFAULT 'INR',
    call_back_url VARCHAR(255),  -- more space for full URLs
    PayURL TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`
    await pool.query(query);
    console.log("✅ transation table created successfully");
}

module.exports = {
    transtionTable
}
